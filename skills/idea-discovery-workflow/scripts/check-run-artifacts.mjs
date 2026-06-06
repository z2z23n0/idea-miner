#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const runDir = args.find((arg) => arg !== '--json');

function usage() {
  return [
    'Usage:',
    '  check-run-artifacts.mjs [--json] <run_dir>',
    '',
    'Checks a completed idea-discovery run for Product Shape clarity,',
    'independent reader review, replenish proof, sources, and handoff completeness.',
  ].join('\n');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function readJsonl(file, errors) {
  if (!fs.existsSync(file)) return [];
  const text = readText(file).trim();
  if (!text) return [];
  return text.split(/\r?\n/).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      errors.push(`${file}:${index + 1} is not valid JSON: ${error.message}`);
      return null;
    }
  }).filter(Boolean);
}

function listFiles(dir, suffix) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((entry) => entry.endsWith(suffix))
    .map((entry) => path.join(dir, entry))
    .sort();
}

function section(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^#{1,4}\\s+${escaped}\\s*$`, 'm');
  const match = re.exec(text);
  if (!match) return '';
  const rest = text.slice(match.index + match[0].length);
  const next = rest.search(/^#{1,4}\s+/m);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function wordy(value, min = 12) {
  return typeof value === 'string' && value.trim().length >= min;
}

function nonBlank(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function normalizeId(value) {
  return String(value || '').trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasForbiddenContrast(text) {
  return /不是[^。\n]{0,80}而是/.test(text);
}

function hasStoryTheater(text) {
  return /(?:周[一二三四五六日天]|星期[一二三四五六日天]|早上|下午|晚上)[^。\n]{0,50}(?:发现|打开|点击|收到|准备)/.test(text)
    || /(?:她|他|他们|某个|一位)[^。\n]{0,40}(?:点击|打开|发现)[^。\n]{0,80}(?:系统接管|AI 接管|agent 接管)/i.test(text);
}

function checkProductShapeCoverage(text, label, errors, context = 'text') {
  const checks = [
    ['product/repo form', [/产品形态/, /仓库形态/, /载体/, /Product Shape/i, /Idea Spine/i, /\bSaaS\b/i, /\bCLI\b/i, /\bAPI\b/i, /GitHub OSS/i, /浏览器插件/, /桌面 app/, /工作台/, /approval layer/i, /console/i]],
    ['target user and task', [/给[^。\n]{1,80}用/, /目标用户/, /target user/i, /在[^。\n]{1,60}任务/, /工作流/, /负责人/, /团队/, /founder/i, /creator/i, /researcher/i, /developer/i]],
    ['inputs or permissions', [/输入/, /权限/, /接入/, /连接/, /上传/, /导入/, /\binputs?\b/i, /\bpermissions?\b/i, /\bOAuth\b/i, /\brepo\b/i, /\bissue\b/i, /日志/, /邮件/, /文档/, /网页/, /聊天记录/, /数据/]],
    ['core object', [/核心对象/, /核心物件/, /对象/, /\bAction Proposal\b/i, /\bAction Receipt\b/i, /\bdiff\b/i, /\btrace\b/i, /队列/, /证据包/, /任务/, /报告/, /patch/i, /brief/i]],
    ['outputs or state', [/输出/, /状态/, /返回/, /生成/, /留下/, /写入/, /提醒/, /\boutputs?\b/i, /\bstate\b/i, /报告/, /队列/, /diff/i, /patch/i, /receipt/i, /artifact/i, /可执行/]],
    ['user actions', [/用户.*(?:动作|可以|批准|退回|编辑|运行|安装|打开|上传|连接|输入|执行)/, /\buser actions?\b/i, /批准/, /退回/, /编辑/, /运行/, /安装/, /打开/, /上传/, /连接/, /\brun\b/i, /\bopen\b/i, /\bapprove\b/i, /\breject\b/i, /\bedit\b/i, /\bexport\b/i]],
    ['first-version boundary', [/第一版/, /首版/, /边界/, /只做/, /不做/, /non-goal/i, /does not do/i]],
    ['product/OSS body', [/完整产品/, /high-star OSS/i, /开源项目/, /repo/i, /薄包装/, /prompt/i, /checker/i, /wrapper/i, /dashboard/i, /Action-only/i, /平台 hook/]],
  ];

  for (const [name, patterns] of checks) {
    if (!hasAny(text, patterns)) {
      errors.push(`${label}: ${context} must make ${name} understandable`);
    }
  }
}

function isGenericFeedUrl(url) {
  return /reddit\.com\/r\/[^/]+\/(?:new|top|hot)?\/?$/i.test(url)
    || /news\.ycombinator\.com\/?(?:news|newest|show|ask)?$/i.test(url)
    || /producthunt\.com\/?$/i.test(url)
    || /github\.com\/trending(?:\?.*)?$/i.test(url);
}

const allowedFinalBuckets = new Set([
  'ai_oss',
  'ai_product',
  'ai_prosumer',
]);

const oldFinalBuckets = [
  'dev_oss',
  'vertical_b2b',
  'consumer_prosumer',
];

const allowedAiRelevance = new Set([
  'AI-core',
  'AI-native workflow',
  'AI-leveraged',
  'non-AI exceptional',
  'non-AI reject',
]);

function sourceMatchesIdea(source, idea) {
  const usedFor = Array.isArray(source.used_for) ? source.used_for.map(normalizeId) : [];
  const aliases = [
    idea.id,
    idea.name,
    ...(Array.isArray(idea.aliases) ? idea.aliases : []),
  ].map(normalizeId).filter(Boolean);
  return usedFor.some((entry) => aliases.includes(entry))
    || (Array.isArray(source.claims) && source.claims.length > 0);
}

function readerSectionForIdea(readerReviewText, idea) {
  const keys = [
    idea.name,
    idea.id,
    ...(Array.isArray(idea.aliases) ? idea.aliases : []),
  ].map(normalizeId).filter(Boolean);

  for (const key of keys) {
    const heading = new RegExp(`^#{2,5}\\s+.*${escapeRegExp(key)}.*$`, 'mi');
    const match = heading.exec(readerReviewText);
    if (!match) continue;
    const rest = readerReviewText.slice(match.index + match[0].length);
    const next = rest.search(/^#{2,5}\s+/m);
    return (next >= 0 ? rest.slice(0, next) : rest).trim();
  }

  for (const key of keys) {
    const index = readerReviewText.indexOf(key);
    if (index >= 0) return readerReviewText.slice(index, index + 1600);
  }

  return '';
}

function readerVerdict(reviewSection) {
  const lines = reviewSection.split(/\r?\n/);
  for (const line of lines) {
    const normalized = line
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .trim();
    const match = normalized.match(/(?:verdict|判断|结论)\s*[：:]\s*(pass|rewrite|reject|通过|重写|拒绝|不通过)\b/i);
    if (match) {
      const verdict = match[1].toLowerCase();
      if (verdict === '通过') return 'pass';
      if (verdict === '重写') return 'rewrite';
      if (verdict === '拒绝' || verdict === '不通过') return 'reject';
      return verdict;
    }
  }
  return '';
}

function checkProductShape(idea, md, label, errors) {
  if (Object.prototype.hasOwnProperty.call(idea, 'scenario_run')) {
    errors.push(`${label}: obsolete scenario_run field must be replaced by product_shape`);
  }

  const shape = idea.product_shape || {};
  if (!nonBlank(shape.form)) errors.push(`${label}: missing product_shape.form`);
  if (!wordy(shape.target_user)) errors.push(`${label}: missing or too-short product_shape.target_user`);
  if (!wordy(shape.task)) errors.push(`${label}: missing or too-short product_shape.task`);
  if (!wordy(shape.why_product_or_oss)) errors.push(`${label}: missing or too-short product_shape.why_product_or_oss`);

  const requiredArrays = [
    ['inputs_or_permissions', 'product_shape.inputs_or_permissions'],
    ['core_objects', 'product_shape.core_objects'],
    ['outputs_or_state', 'product_shape.outputs_or_state'],
    ['user_actions', 'product_shape.user_actions'],
    ['first_version', 'product_shape.first_version'],
    ['non_goals', 'product_shape.non_goals'],
  ];

  for (const [field, title] of requiredArrays) {
    if (!nonEmptyArray(shape[field])) errors.push(`${label}: ${title} must name concrete items`);
  }

  checkProductShapeCoverage(md, label, errors, 'dossier prose');

  if (/Scenario Run|scenario_run|场景运行|可运行场景|系统接管/.test(md)) {
    errors.push(`${label}: dossier still uses obsolete Scenario Run wording`);
  }
  if (hasForbiddenContrast(md)) {
    errors.push(`${label}: dossier uses the forbidden core-explanation pattern "不是 X，而是 Y"`);
  }
  if (hasStoryTheater(md)) {
    errors.push(`${label}: dossier reads like a story scene instead of a product-shape memo`);
  }
}

function checkSourceSupport(idea, md, sourceNotes, label, errors) {
  const sourceSection = section(md, 'Source map') || section(md, '信息来源') || section(md, 'Source Map') || section(md, '来源');
  if (!sourceSection) {
    errors.push(`${label}: dossier is missing a source section`);
  } else {
    if (!/https?:\/\//.test(sourceSection)) {
      errors.push(`${label}: source section has no URL`);
    }
    if (!hasAny(sourceSection, [/access/i, /freshness/i, /supports/i, /支持/, /新鲜度/, /observed/i, /fetched|summary-only|blocked|not-covered/i])) {
      errors.push(`${label}: source section must include access/freshness/support details, not only links`);
    }
  }

  const sourceRefs = Array.isArray(idea.sources) ? idea.sources.map(normalizeId).filter(Boolean) : [];
  if (sourceRefs.length === 0) {
    errors.push(`${label}: idea JSON must reference supporting source note ids or URLs in sources[]`);
    return;
  }

  const matched = sourceRefs.flatMap((ref) => sourceNotes.filter((source) => {
    return normalizeId(source.id) === ref || normalizeId(source.url) === ref;
  }));

  if (matched.length === 0) {
    errors.push(`${label}: sources[] do not match any source-notes.jsonl id or URL`);
    return;
  }

  for (const source of matched) {
    if (!nonBlank(source.url) || !nonBlank(source.platform) || !nonBlank(source.freshness) || !wordy(source.summary)) {
      errors.push(`${label}: source note ${source.id || source.url} must include url/platform/freshness/summary`);
    }
    if (!['fetched', 'summary-only', 'blocked', 'not-covered'].includes(source.access_status)) {
      errors.push(`${label}: source note ${source.id || source.url} has invalid access_status`);
    }
    if (!['supports', 'challenges', 'kills', 'sharpens', 'competitor'].includes(source.evidence_role)) {
      errors.push(`${label}: source note ${source.id || source.url} has invalid or missing evidence_role`);
    }
    if (!nonEmptyArray(source.claims)) {
      errors.push(`${label}: source note ${source.id || source.url} must include supported claims`);
    }
    if (!sourceMatchesIdea(source, idea)) {
      errors.push(`${label}: source note ${source.id || source.url} does not map claims to this idea`);
    }
    if (isGenericFeedUrl(source.url) && !wordy(source.title)) {
      errors.push(`${label}: generic feed source ${source.url} needs a specific observed title`);
    }
  }
}

function checkIdea(jsonFile, sourceNotes, readerReviewText, errors) {
  const idea = readJson(jsonFile);
  const label = idea.id || path.basename(jsonFile);
  const mdFile = jsonFile.replace(/\.json$/, '.md');

  if (!fs.existsSync(mdFile)) {
    errors.push(`${label}: missing Markdown dossier ${mdFile}`);
    return null;
  }

  const md = readText(mdFile);
  checkProductShape(idea, md, label, errors);
  checkSourceSupport(idea, md, sourceNotes, label, errors);

  const requiredShortJson = [
    ['name', 'name'],
    ['final_bucket', 'final_bucket'],
    ['history_relation', 'history_relation'],
    ['verdict', 'verdict'],
    ['confidence', 'confidence'],
    ['core_thesis', 'core_thesis'],
    ['ai_relevance', 'ai_relevance'],
    ['target_user', 'target_user'],
  ];

  for (const [field, title] of requiredShortJson) {
    if (!nonBlank(idea[field])) errors.push(`${label}: missing ${title}`);
  }

  if (nonBlank(idea.final_bucket) && !allowedFinalBuckets.has(idea.final_bucket)) {
    errors.push(`${label}: invalid final_bucket ${idea.final_bucket}`);
  }

  if (nonBlank(idea.ai_relevance) && !allowedAiRelevance.has(idea.ai_relevance)) {
    errors.push(`${label}: invalid ai_relevance ${idea.ai_relevance}`);
  }
  if (idea.ai_relevance === 'non-AI reject') {
    errors.push(`${label}: non-AI reject ideas must stay in report notes, not ideas/ dossiers`);
  }

  const promotionGate = idea.promotion_gate || {};
  if (!['pass', 'backlog', 'reject'].includes(promotionGate.decision)) {
    errors.push(`${label}: promotion_gate.decision must be pass/backlog/reject`);
  }
  if (promotionGate.decision === 'reject') {
    errors.push(`${label}: rejected ideas must stay in report notes, not ideas/ dossiers`);
  }
  for (const field of ['product_or_oss_scale', 'why_final_slot', 'demo_moment', 'durable_asset']) {
    if (!wordy(promotionGate[field])) errors.push(`${label}: missing promotion_gate.${field}`);
  }
  if (!['pass', 'fail', 'not-applicable'].includes(promotionGate.complete_ai_product_path)) {
    errors.push(`${label}: promotion_gate.complete_ai_product_path must be pass/fail/not-applicable`);
  }
  if (!['pass', 'fail', 'not-applicable'].includes(promotionGate.high_star_oss_path)) {
    errors.push(`${label}: promotion_gate.high_star_oss_path must be pass/fail/not-applicable`);
  }

  if (!nonEmptyArray(idea.dangerous_assumptions)) {
    errors.push(`${label}: missing dangerous_assumptions`);
  }
  if (!nonEmptyArray(idea.red_team)) {
    errors.push(`${label}: missing red_team objections and CEO rulings`);
  }
  if (!idea.first_version || !nonEmptyArray(idea.first_version.does) || !nonEmptyArray(idea.first_version.does_not_do)) {
    errors.push(`${label}: missing first_version does / does_not_do`);
  }
  if (!nonEmptyArray(idea.product_forms)) {
    errors.push(`${label}: missing product_forms`);
  }
  if (!wordy(idea.why_still_worth_doing)) {
    errors.push(`${label}: missing why_still_worth_doing`);
  }
  if (!wordy(idea.ai_leverage)) {
    errors.push(`${label}: missing ai_leverage`);
  }

  if (!hasAny(md, [/Current alternatives and competitor reasoning/i, /竞品判断/, /替代方案/, /现有替代/])) {
    errors.push(`${label}: dossier must include competitor or alternative reasoning`);
  }
  if (!hasAny(md, [/explicit non-goals/i, /不做/, /首版边界/])) {
    errors.push(`${label}: dossier must include explicit non-goals`);
  }
  if (!hasAny(md, [/core thesis/i, /核心 thesis/i, /核心判断/])) {
    errors.push(`${label}: dossier must include core thesis`);
  }
  if (!hasAny(md, [/AI 相关性/i, /ai relevance/i])) {
    errors.push(`${label}: dossier must include AI relevance`);
  }
  if (!hasAny(md, [/reader-review/i, /Reader Review/i, /读者检查/, /读者复述/])) {
    errors.push(`${label}: dossier must link or summarize independent reader review`);
  }
  if (!hasAny(md, [/分桶/i, /final bucket/i, /final_bucket/i, /ai_oss|ai_product|ai_prosumer/i])) {
    errors.push(`${label}: dossier must include final bucket reasoning`);
  }

  const reviewKey = idea.name || idea.id || '';
  const reviewSlice = readerSectionForIdea(readerReviewText, idea);
  if (!reviewSlice) {
    errors.push(`${label}: reader review must mention this idea by name`);
  } else {
    const verdict = readerVerdict(reviewSlice);
    if (verdict !== 'pass') {
      errors.push(`${label}: reader review must include pass verdict after revision`);
    }
    checkProductShapeCoverage(reviewSlice, label, errors, 'reader review');
    if (/Scenario Run|scenario_run|场景运行|可运行场景|系统接管/.test(reviewSlice)) {
      errors.push(`${label}: reader review still uses obsolete Scenario Run wording`);
    }
  }

  return idea;
}

function readReaderReview(absRunDir, errors) {
  const mdPath = path.join(absRunDir, 'reader-review.md');
  const jsonPath = path.join(absRunDir, 'reader-review.json');
  if (fs.existsSync(mdPath)) return readText(mdPath);
  if (fs.existsSync(jsonPath)) {
    try {
      return JSON.stringify(readJson(jsonPath), null, 2);
    } catch (error) {
      errors.push(`reader-review.json is not valid JSON: ${error.message}`);
      return '';
    }
  }
  errors.push(`missing ${mdPath} or ${jsonPath}`);
  return '';
}

function checkCandidateLedger(rows, bucketCounts, report, errors) {
  const underfilledBuckets = [...allowedFinalBuckets].filter((bucket) => bucketCounts[bucket] < 3);
  const reportClaimsUnderfilled = /本轮不足 3 个|underfilled|不足 3/.test(report);
  if ((underfilledBuckets.length > 0 || reportClaimsUnderfilled) && rows.length === 0) {
    errors.push('candidate-ledger.jsonl is required when any bucket is underfilled');
    return;
  }

  rows.forEach((row, index) => {
    const label = `candidate-ledger.jsonl:${index + 1}`;
    if (!Number.isInteger(row.round) || row.round < 1) errors.push(`${label}: round must be a positive integer`);
    if (!allowedFinalBuckets.has(row.bucket)) errors.push(`${label}: invalid bucket ${row.bucket}`);
    if (!nonEmptyArray(row.changed)) errors.push(`${label}: changed must list what search dimension changed`);
    if (!wordy(row.query_or_source)) errors.push(`${label}: missing query_or_source`);
    if (!wordy(row.candidate)) errors.push(`${label}: missing candidate`);
    if (!wordy(row.product_shape_summary)) errors.push(`${label}: missing product_shape_summary`);
    if (!['new', 'update_existing', 'duplicate_of', 'revives', 'merged_from', 'splits_from', 'adjacent_to'].includes(row.history_relation)) {
      errors.push(`${label}: invalid history_relation`);
    }
    if (!['kill', 'backlog', 'promote', 'reject'].includes(row.decision)) {
      errors.push(`${label}: decision must be kill/backlog/promote/reject`);
    }
    if (!wordy(row.reason)) errors.push(`${label}: missing reason`);
  });
}

if (!runDir) {
  console.error(usage());
  process.exit(2);
}

const errors = [];
const absRunDir = path.resolve(runDir);
const requiredFiles = ['report.md', 'source-notes.jsonl', 'handoff-index.md'];
for (const file of requiredFiles) {
  const target = path.join(absRunDir, file);
  if (!fs.existsSync(target)) errors.push(`missing ${target}`);
}

const ideasDir = path.join(absRunDir, 'ideas');
if (!fs.existsSync(ideasDir)) errors.push(`missing ${ideasDir}`);

let report = '';
let sourceNotes = [];
let readerReviewText = '';
let candidateLedger = [];

if (fs.existsSync(path.join(absRunDir, 'report.md'))) {
  report = readText(path.join(absRunDir, 'report.md'));
  const reportSections = [
    '今天值得看的方向',
    'Discovery Context',
    'Thesis Pool',
    'Candidate Ledger Summary',
    'Evidence Notes',
    '最终 Ideas',
    'Bucket：ai_oss',
    'Bucket：ai_product',
    'Bucket：ai_prosumer',
    '被放弃的方向',
    'Independent Reader Review',
    '来源附录',
    '保存位置',
  ];
  for (const heading of reportSections) {
    if (!report.includes(heading)) errors.push(`report.md missing section: ${heading}`);
  }
  for (const oldBucket of oldFinalBuckets) {
    if (new RegExp(`Bucket：${oldBucket}|final_bucket["': ]+${oldBucket}|\\b${oldBucket}\\b`).test(report)) {
      errors.push(`report.md still references old final bucket ${oldBucket}`);
    }
  }
  if (!/AI-core|AI-native workflow|AI-leveraged|non-AI exceptional/.test(report)) {
    errors.push('report.md must include AI relevance labels');
  }
  if (!/Product Shape|Idea Spine|产品形态|仓库形态|核心对象|输入|权限|输出|状态|第一版|首版/.test(report)) {
    errors.push('report.md must explain selected ideas through Product Shape / Idea Spine');
  }
  if (/Scenario Run|scenario_run|场景运行|可运行场景|系统接管/.test(report)) {
    errors.push('report.md still uses obsolete Scenario Run wording');
  }
  if (!/reader-review\.(md|json)/.test(report)) {
    errors.push('report.md must point to reader-review.md or reader-review.json');
  }
  if (!/candidate-ledger\.jsonl/.test(report)) {
    errors.push('report.md must point to candidate-ledger.jsonl');
  }
  if (hasForbiddenContrast(report)) {
    errors.push('report.md uses the forbidden core-explanation pattern "不是 X，而是 Y"');
  }
}

readerReviewText = readReaderReview(absRunDir, errors);

if (fs.existsSync(path.join(absRunDir, 'source-notes.jsonl'))) {
  sourceNotes = readJsonl(path.join(absRunDir, 'source-notes.jsonl'), errors);
  if (sourceNotes.length === 0) errors.push('source-notes.jsonl must not be empty');
}

const candidateLedgerPath = path.join(absRunDir, 'candidate-ledger.jsonl');
candidateLedger = readJsonl(candidateLedgerPath, errors);

const ideaJsonFiles = listFiles(ideasDir, '.json');
if (ideaJsonFiles.length === 0) {
  errors.push('ideas/ must contain per-idea JSON files');
}
if (ideaJsonFiles.length > 9) {
  errors.push('ideas/ must contain at most 9 final or paused idea JSON files for the 3-bucket report');
}

const bucketCounts = Object.fromEntries([...allowedFinalBuckets].map((bucket) => [bucket, 0]));
const ideas = [];
for (const jsonFile of ideaJsonFiles) {
  try {
    const idea = readJson(jsonFile);
    if (allowedFinalBuckets.has(idea.final_bucket)) {
      bucketCounts[idea.final_bucket] += 1;
    }
  } catch {
    // Detailed parse errors are reported in the full checkIdea pass below.
  }
}
for (const [bucket, count] of Object.entries(bucketCounts)) {
  if (count > 3) errors.push(`${bucket}: contains ${count} ideas; each bucket may contain at most 3`);
}

checkCandidateLedger(candidateLedger, bucketCounts, report, errors);

for (const jsonFile of ideaJsonFiles) {
  try {
    const idea = checkIdea(jsonFile, sourceNotes, readerReviewText, errors);
    if (idea) ideas.push(idea);
  } catch (error) {
    errors.push(`${jsonFile}: ${error.message}`);
  }
}

const result = {
  ok: errors.length === 0,
  run_dir: absRunDir,
  checked: {
    idea_count: ideaJsonFiles.length,
    source_note_count: sourceNotes.length,
    candidate_ledger_count: candidateLedger.length,
    bucket_counts: bucketCounts,
    reader_review: readerReviewText ? 'present' : 'missing',
  },
  errors,
};

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(`OK: ${absRunDir}`);
  console.log(`Checked ${ideaJsonFiles.length} ideas, ${sourceNotes.length} source notes, and ${candidateLedger.length} ledger rows.`);
} else {
  console.error(`Artifact check failed for ${absRunDir}:`);
  for (const error of errors) console.error(`- ${error}`);
}

process.exit(result.ok ? 0 : 1);

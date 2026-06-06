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
    'Checks a completed idea-discovery run for readable reports and handoff completeness.',
  ].join('\n');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function readJsonl(file, errors) {
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

function wordy(value) {
  return typeof value === 'string' && value.trim().length >= 12;
}

function nonBlank(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

const allowedFinalBuckets = new Set([
  'dev_oss',
  'vertical_b2b',
  'consumer_prosumer',
]);

function isGenericFeedUrl(url) {
  return /reddit\.com\/r\/[^/]+\/(?:new|top|hot)?\/?$/i.test(url)
    || /news\.ycombinator\.com\/?(?:news|newest|show|ask)?$/i.test(url)
    || /producthunt\.com\/?$/i.test(url)
    || /github\.com\/trending(?:\?.*)?$/i.test(url);
}

function normalizeId(value) {
  return String(value || '').trim();
}

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

function checkIdeaStory(idea, md, label, errors) {
  const story = idea.idea_story || {};
  const required = [
    ['one_sentence', '一句话'],
    ['user_scene', '具体使用场景'],
    ['product', '产品到底是什么'],
    ['current_workaround', '今天怎么解决'],
    ['key_insight', '关键洞察'],
    ['why_now', '为什么现在值得做'],
    ['alternatives_gap', '现有替代与缺口'],
    ['first_version', '第一个版本怎么切'],
    ['long_term_asset', '如果做成会积累什么'],
    ['risks', '最大风险'],
    ['judgment', '我的判断'],
  ];

  const missingJsonFields = required
    .filter(([field]) => !wordy(story[field]))
    .map(([, title]) => title);

  const hasMarkdownStory = required.every(([, title]) => md.includes(title));
  if (missingJsonFields.length > 0 && !hasMarkdownStory) {
    errors.push(`${label}: missing readable idea story fields: ${missingJsonFields.join(', ')}`);
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

function checkIdea(jsonFile, sourceNotes, errors) {
  const idea = readJson(jsonFile);
  const label = idea.id || path.basename(jsonFile);
  const mdFile = jsonFile.replace(/\.json$/, '.md');

  if (!fs.existsSync(mdFile)) {
    errors.push(`${label}: missing Markdown dossier ${mdFile}`);
    return;
  }

  const md = readText(mdFile);
  checkIdeaStory(idea, md, label, errors);
  checkSourceSupport(idea, md, sourceNotes, label, errors);

  const requiredShortJson = [
    ['name', 'name'],
    ['final_bucket', 'final_bucket'],
    ['bucket_fit', 'bucket_fit'],
    ['history_relation', 'history_relation'],
    ['verdict', 'verdict'],
    ['confidence', 'confidence'],
    ['core_thesis', 'core_thesis'],
    ['ai_relevance', 'ai_relevance'],
  ];

  const requiredLongJson = [
    ['what_it_is', 'what_it_is'],
    ['scale_path', 'scale_path'],
    ['problem', 'problem'],
    ['target_user', 'target_user'],
    ['buyer_or_oss_audience', 'buyer_or_oss_audience'],
    ['why_still_worth_doing', 'why_still_worth_doing'],
  ];

  for (const [field, title] of requiredShortJson) {
    if (!nonBlank(idea[field])) errors.push(`${label}: missing ${title}`);
  }

  if (nonBlank(idea.final_bucket) && !allowedFinalBuckets.has(idea.final_bucket)) {
    errors.push(`${label}: invalid final_bucket ${idea.final_bucket}`);
  }

  for (const [field, title] of requiredLongJson) {
    if (!wordy(idea[field])) errors.push(`${label}: missing or too-short ${title}`);
  }

  const allowedAiRelevance = new Set([
    'AI-core',
    'AI-native workflow',
    'AI-leveraged',
    'non-AI exceptional',
    'non-AI reject',
  ]);
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
  for (const field of ['product_or_oss_scale', 'why_final_slot', 'demo_moment', 'repo_star_asset']) {
    if (!wordy(promotionGate[field])) errors.push(`${label}: missing promotion_gate.${field}`);
  }

  const usage = idea.usage || {};
  for (const field of ['when', 'input', 'does', 'output', 'replaces']) {
    if (!wordy(usage[field])) errors.push(`${label}: missing usage.${field}`);
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
  if (!hasAny(md, [/30 秒 demo/i, /30-second demo/i])) {
    errors.push(`${label}: dossier must include 30-second demo`);
  }
  if (!hasAny(md, [/repo\/star 资产/i, /star asset/i, /长期资产/])) {
    errors.push(`${label}: dossier must include repo/star asset`);
  }
  if (!hasAny(md, [/分桶/i, /final bucket/i, /final_bucket/i, /dev_oss|vertical_b2b|consumer_prosumer/i])) {
    errors.push(`${label}: dossier must include final bucket and bucket-fit reasoning`);
  }
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

if (fs.existsSync(path.join(absRunDir, 'report.md'))) {
  report = readText(path.join(absRunDir, 'report.md'));
  const reportSections = [
    '今天值得看的方向',
    '最终 Ideas',
    'Bucket：dev_oss',
    'Bucket：vertical_b2b',
    'Bucket：consumer_prosumer',
    '被放弃的方向',
    '来源附录',
    '保存位置',
  ];
  for (const heading of reportSections) {
    if (!report.includes(heading)) errors.push(`report.md missing section: ${heading}`);
  }
  if (!/一句话|具体使用场景|产品到底是什么/.test(report)) {
    errors.push('report.md must introduce each idea as a readable story');
  }
  if (!/AI-core|AI-native workflow|AI-leveraged|non-AI exceptional/.test(report)) {
    errors.push('report.md must include AI relevance labels');
  }
  if (!/30 秒 demo/.test(report)) {
    errors.push('report.md must include 30-second demo fields');
  }
  if (!/repo\/star 资产|长期资产/.test(report)) {
    errors.push('report.md must include repo/star asset or long-term asset fields');
  }
  if (!/dev_oss/.test(report) || !/vertical_b2b/.test(report) || !/consumer_prosumer/.test(report)) {
    errors.push('report.md must include the three final buckets: dev_oss, vertical_b2b, consumer_prosumer');
  }
}

if (fs.existsSync(path.join(absRunDir, 'source-notes.jsonl'))) {
  sourceNotes = readJsonl(path.join(absRunDir, 'source-notes.jsonl'), errors);
  if (sourceNotes.length === 0) errors.push('source-notes.jsonl must not be empty');
}

const ideaJsonFiles = listFiles(ideasDir, '.json');
if (ideaJsonFiles.length === 0) {
  errors.push('ideas/ must contain per-idea JSON files');
}
if (ideaJsonFiles.length > 9) {
  errors.push('ideas/ must contain at most 9 final or paused idea JSON files for the 3-bucket report');
}

const bucketCounts = Object.fromEntries([...allowedFinalBuckets].map((bucket) => [bucket, 0]));
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

for (const jsonFile of ideaJsonFiles) {
  try {
    checkIdea(jsonFile, sourceNotes, errors);
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
  },
  errors,
};

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(`OK: ${absRunDir}`);
  console.log(`Checked ${ideaJsonFiles.length} ideas and ${sourceNotes.length} source notes.`);
} else {
  console.error(`Artifact check failed for ${absRunDir}:`);
  for (const error of errors) console.error(`- ${error}`);
}

process.exit(result.ok ? 0 : 1);

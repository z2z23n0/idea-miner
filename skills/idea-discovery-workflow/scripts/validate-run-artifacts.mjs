#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const runDir = args.find((arg) => arg !== '--json');

function usage() {
  return [
    'Usage:',
    '  validate-run-artifacts.mjs [--json] <run_dir>',
    '',
    'Checks a completed idea-discovery run for reader clarity and artifact completeness.',
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

function validateProductCard(idea, md, label, errors) {
  const card = idea.product_card || {};
  const required = [
    ['product_form', '产品形态'],
    ['target_user', '目标用户'],
    ['usage_moment', '使用时刻'],
    ['inputs', '输入'],
    ['system_action', '系统动作'],
    ['outputs', '输出'],
    ['replaced_workaround', '替代的手工动作'],
    ['why_substitutes_fall_short', '为什么现有替代不够'],
    ['shortest_evidence_path', '最短证据路径'],
    ['stop_line', '停止线'],
  ];

  const missingJsonFields = required
    .filter(([field]) => !wordy(card[field]))
    .map(([, title]) => title);

  const hasMarkdownCard = /读者可懂产品卡片|Reader-readable product card/i.test(md)
    && required.every(([, title]) => md.includes(title));

  if (missingJsonFields.length > 0 && !hasMarkdownCard) {
    errors.push(`${label}: missing reader-readable product card fields: ${missingJsonFields.join(', ')}`);
  }
}

function validateSourceSupport(idea, md, sourceNotes, label, errors) {
  const sourceSection = section(md, 'Source map') || section(md, '信息来源') || section(md, 'Source Map');
  if (!sourceSection) {
    errors.push(`${label}: dossier is missing a Source map section`);
  } else {
    if (!/https?:\/\//.test(sourceSection)) {
      errors.push(`${label}: Source map has no URL`);
    }
    if (!hasAny(sourceSection, [/access/i, /freshness/i, /supports/i, /支持/, /新鲜度/, /observed/i, /fetched|summary-only|blocked|not-covered/i])) {
      errors.push(`${label}: Source map must include access/freshness/support details, not only links`);
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

function validateIdea(jsonFile, sourceNotes, errors) {
  const idea = readJson(jsonFile);
  const label = idea.id || path.basename(jsonFile);
  const mdFile = jsonFile.replace(/\.json$/, '.md');

  if (!fs.existsSync(mdFile)) {
    errors.push(`${label}: missing Markdown dossier ${mdFile}`);
    return;
  }

  const md = readText(mdFile);
  validateProductCard(idea, md, label, errors);
  validateSourceSupport(idea, md, sourceNotes, label, errors);

  const requiredShortJson = [
    ['name', 'name'],
    ['history_relation', 'history_relation'],
    ['verdict', 'verdict'],
    ['confidence', 'confidence'],
  ];

  const requiredLongJson = [
    ['what_it_is', 'what_it_is'],
    ['scale_path', 'scale_path'],
    ['problem', 'problem'],
    ['target_user', 'target_user'],
    ['buyer_or_oss_audience', 'buyer_or_oss_audience'],
    ['why_still_worth_doing', 'why_still_worth_doing'],
    ['stop_line', 'stop_line'],
  ];

  for (const [field, title] of requiredShortJson) {
    if (!nonBlank(idea[field])) errors.push(`${label}: missing ${title}`);
  }

  for (const [field, title] of requiredLongJson) {
    if (!wordy(idea[field])) errors.push(`${label}: missing or too-short ${title}`);
  }

  const usage = idea.usage || {};
  for (const field of ['when', 'input', 'does', 'output', 'replaces']) {
    if (!wordy(usage[field])) errors.push(`${label}: missing usage.${field}`);
  }

  if (!nonEmptyArray(idea.shortest_evidence_path)) {
    errors.push(`${label}: missing shortest_evidence_path`);
  }
  if (!nonEmptyArray(idea.dangerous_assumptions)) {
    errors.push(`${label}: missing dangerous_assumptions`);
  }
  if (!nonEmptyArray(idea.red_team)) {
    errors.push(`${label}: missing red_team objections and CEO rulings`);
  }
  if (!idea.mvp || !nonEmptyArray(idea.mvp.does) || !nonEmptyArray(idea.mvp.does_not_do)) {
    errors.push(`${label}: missing MVP does / does_not_do`);
  }
  if (!nonEmptyArray(idea.product_forms)) {
    errors.push(`${label}: missing product_forms`);
  }

  if (!hasAny(md, [/Current alternatives and competitor reasoning/i, /竞品判断/, /替代方案/])) {
    errors.push(`${label}: dossier must include competitor or alternative reasoning`);
  }
  if (!hasAny(md, [/MVP does not do/i, /explicit non-goals/i, /不做/])) {
    errors.push(`${label}: dossier must include explicit non-goals`);
  }
  if (!hasAny(md, [/shortest evidence path/i, /最短证据路径/])) {
    errors.push(`${label}: dossier must include shortest evidence path`);
  }
  if (!hasAny(md, [/stop line/i, /停止线/])) {
    errors.push(`${label}: dossier must include stop line`);
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
    '今日 Verdict',
    'Signal Portfolio',
    '历史关联与新颖性',
    '候选池与迭代',
    '最终过线 Idea',
    'Reader Clarity Gate',
    'Persistence Note',
  ];
  for (const heading of reportSections) {
    if (!report.includes(heading)) errors.push(`report.md missing section: ${heading}`);
  }
  if (!/读者可懂产品卡片/.test(report)) {
    errors.push('report.md must include a reader-readable product card for final ideas');
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

for (const jsonFile of ideaJsonFiles) {
  try {
    validateIdea(jsonFile, sourceNotes, errors);
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
  console.error(`Artifact validation failed for ${absRunDir}:`);
  for (const error of errors) console.error(`- ${error}`);
}

process.exit(result.ok ? 0 : 1);

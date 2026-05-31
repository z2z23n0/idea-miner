#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function hasReadableStore(dir) {
  const ideasFile = path.join(dir, 'ideas.jsonl');
  const runsDir = path.join(dir, 'runs');
  return (fs.existsSync(ideasFile) && fs.statSync(ideasFile).size > 0)
    || (fs.existsSync(runsDir) && walk(runsDir).length > 0);
}

const defaultRoot = path.join(os.homedir(), '.idea-miner');
const legacyRoot = path.join(os.homedir(), '.codex', 'data', 'idea-discovery');
const explicitRoot = process.env.IDEA_MINER_HOME || process.env.CODEX_IDEA_DISCOVERY_HOME;
const root = explicitRoot
  || (hasReadableStore(defaultRoot) ? defaultRoot : null)
  || (hasReadableStore(legacyRoot) ? legacyRoot : null)
  || defaultRoot;

const rawArgs = process.argv.slice(2);
const options = {
  combined: false,
  includePrompt: false,
  startNow: false,
};
const queries = [];
const positional = [];

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];
  if (arg === '--help' || arg === '-h') {
    usage(0);
  } else if (arg === '--session-prompt') {
    options.includePrompt = true;
  } else if (arg === '--start-now') {
    options.startNow = true;
  } else if (arg === '--combined') {
    options.combined = true;
  } else if (arg === '--idea') {
    const value = rawArgs[index + 1];
    if (!value) usage(2, 'Missing value after --idea');
    queries.push(value);
    index += 1;
  } else if (arg.startsWith('--idea=')) {
    queries.push(arg.slice('--idea='.length));
  } else if (arg.startsWith('--')) {
    usage(2, `Unknown option: ${arg}`);
  } else {
    positional.push(arg);
  }
}

if (positional.length > 0) queries.push(positional.join(' ').trim());

if (queries.length === 0) usage(2);

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ')
    .trim();
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function usage(exitCode, message = null) {
  if (message) console.error(message);
  console.error([
    'Usage:',
    '  idea-handoff.mjs [--session-prompt] <idea name or alias>',
    '  idea-handoff.mjs [--session-prompt] --idea "Idea A" --idea "Idea B"',
    '  idea-handoff.mjs --combined --session-prompt --idea "Idea A" --idea "Idea B"',
    '',
    'Options:',
    '  --session-prompt  Also write a prompt suitable for a new Codex session',
    '  --start-now       In the new-session prompt, ask the next session to start work',
    '  --combined        Combine multiple ideas into one handoff and one session prompt',
  ].join('\n'));
  process.exit(exitCode);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function resolvePath(maybeRelative) {
  if (!maybeRelative) return null;
  return path.isAbsolute(maybeRelative)
    ? maybeRelative
    : path.join(root, maybeRelative);
}

function tempMarkdown(prefix) {
  const mktemp = spawnSync('mktemp', ['-t', `${prefix}-XXXXXX.md`], {
    encoding: 'utf8',
  });

  return mktemp.status === 0
    ? mktemp.stdout.trim()
    : path.join(os.tmpdir(), `${prefix}-${Date.now()}.md`);
}

function ideaScore(record, normalizedQuery) {
  const names = [
    record.id,
    record.name,
    ...(Array.isArray(record.aliases) ? record.aliases : []),
  ].map(normalize).filter(Boolean);

  if (names.some((name) => name === normalizedQuery)) return 100;
  if (names.some((name) => name.includes(normalizedQuery))) return 80;
  if (names.some((name) => normalizedQuery.includes(name))) return 70;
  return 0;
}

const ideas = readJsonl(path.join(root, 'ideas.jsonl'));

function resolveIdea(query) {
  const normalizedQuery = normalize(query);
  const matchesByScore = ideas
    .map((idea) => ({ idea, score: ideaScore(idea, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const match = matchesByScore[0]?.idea || null;
  let dossier = resolvePath(match?.dossier_path);

  if (dossier && fs.existsSync(dossier)) {
    return { ok: true, query, matchesByScore, match, dossier };
  }

  const candidates = walk(path.join(root, 'runs'))
    .filter((file) => file.endsWith('.md'))
    .filter((file) => /\/ideas\/[^/]+\.md$/.test(file) || file.endsWith('handoff-index.md'));

  const scored = candidates
    .map((file) => {
      const basename = normalize(path.basename(file, '.md'));
      const rel = normalize(path.relative(root, file));
      let score = 0;
      if (basename === normalizedQuery) score = 95;
      else if (basename.includes(normalizedQuery)) score = 75;
      else if (rel.includes(normalizedQuery)) score = 55;
      else {
        const head = fs.readFileSync(file, 'utf8').slice(0, 12000);
        if (normalize(head).includes(normalizedQuery)) score = 45;
      }
      return { file, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  dossier = scored.find((entry) => /\/ideas\/[^/]+\.md$/.test(entry.file))?.file
    || scored[0]?.file
    || null;

  if (!dossier || !fs.existsSync(dossier)) {
    return {
      ok: false,
      query,
      root,
      reason: 'No handoff-ready dossier found. Reconstruct from JSONL artifacts or run a current refresh if requested.',
      matches: matchesByScore.slice(0, 5).map(({ idea, score }) => ({
        id: idea.id,
        name: idea.name,
        score,
        run_id: idea.run_id,
        dossier_path: idea.dossier_path || null,
      })),
    };
  }

  return { ok: true, query, matchesByScore, match, dossier };
}

function slugify(value) {
  const slug = String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return slug || 'idea-handoff';
}

function itemName(item) {
  return item.idea?.name
    || path.basename(item.dossier, '.md')
    || item.query;
}

function buildSessionPrompt(items, { startNow }) {
  const plural = items.length > 1;
  const mode = startNow
    ? 'Start from the first actions in the dossier after briefly confirming the handoff scope.'
    : 'First confirm that you received the handoff, summarize your understanding in 5-8 bullets, and wait for the user before doing new research or implementation.';

  const sections = items.map((item, index) => [
    `## Handoff Dossier ${index + 1}: ${itemName(item)}`,
    '',
    `- Query: ${item.query}`,
    `- Stored dossier: ${item.dossier}`,
    `- Temporary handoff file: ${item.handoff_path}`,
    item.idea ? `- Idea id: ${item.idea.id}` : null,
    item.idea?.run_id ? `- Run id: ${item.idea.run_id}` : null,
    '',
    item.dossier_content,
  ].filter(Boolean).join('\n'));

  return [
    '# Idea Handoff',
    '',
    'You are a fresh Codex session receiving an idea-miner handoff.',
    '',
    '## Operating Rules',
    '',
    '- Use the dossier below as the source of truth for stored context.',
    '- Do not repeat source discovery, web search, or competitor checks unless the user explicitly asks for a refresh/current status.',
    '- Treat links, claims, Red Team notes, CEO rulings, first-version boundaries, and product reasoning as preserved context.',
    '- If information is missing, say what is missing instead of inventing it.',
    `- ${mode}`,
    plural ? '- This prompt contains multiple ideas; keep them separate unless the user asks to merge them.' : null,
    '',
    ...sections,
  ].filter(Boolean).join('\n');
}

function createHandoffItem(query) {
  const resolved = resolveIdea(query);
  if (!resolved.ok) return resolved;

  const handoffPath = tempMarkdown('handoff');
  const dossierContent = fs.readFileSync(resolved.dossier, 'utf8');
  fs.writeFileSync(handoffPath, dossierContent);

  const idea = resolved.match ? {
    id: resolved.match.id,
    name: resolved.match.name,
    run_id: resolved.match.run_id,
  } : null;

  const name = idea?.name || path.basename(resolved.dossier, '.md') || query;
  const item = {
    ok: true,
    query,
    root,
    idea,
    dossier: resolved.dossier,
    handoff_path: handoffPath,
    suggested_title: `Idea handoff: ${name}`,
    suggested_directory_name: slugify(`idea-handoff-${name}`),
    dossier_content: dossierContent,
  };

  if (options.includePrompt) {
    const sessionPromptPath = tempMarkdown('idea-session-prompt');
    const sessionPrompt = buildSessionPrompt([item], { startNow: options.startNow });
    fs.writeFileSync(sessionPromptPath, sessionPrompt);
    item.session_prompt_path = sessionPromptPath;
  }

  delete item.dossier_content;
  return item;
}

const items = queries.map((query) => createHandoffItem(query));
const failures = items.filter((item) => !item.ok);

if (options.combined && failures.length === 0 && items.length > 1) {
  const hydratedItems = items.map((item) => ({
    ...item,
    dossier_content: fs.readFileSync(item.handoff_path, 'utf8'),
  }));
  const combinedPath = tempMarkdown('handoff-combined');
  const combinedContent = hydratedItems.map((item, index) => [
    `# Handoff ${index + 1}: ${itemName(item)}`,
    '',
    fs.readFileSync(item.handoff_path, 'utf8'),
  ].join('\n')).join('\n\n---\n\n');
  fs.writeFileSync(combinedPath, combinedContent);

  const combined = {
    handoff_path: combinedPath,
    suggested_title: `Idea handoff: ${items.length} ideas`,
    suggested_directory_name: `idea-handoff-${items.length}-ideas`,
  };

  if (options.includePrompt) {
    const sessionPromptPath = tempMarkdown('idea-session-prompt');
    const sessionPrompt = buildSessionPrompt(hydratedItems, { startNow: options.startNow });
    fs.writeFileSync(sessionPromptPath, sessionPrompt);
    combined.session_prompt_path = sessionPromptPath;
  }

  console.log(JSON.stringify({
    ok: true,
    mode: 'combined',
    query: queries,
    root,
    combined,
    items,
  }, null, 2));
  process.exit(0);
}

const response = {
  ok: failures.length === 0,
  mode: items.length > 1 ? 'separate' : 'single',
  query: items.length > 1 ? queries : queries[0],
  root,
  items,
};

if (items.length === 1) {
  Object.assign(response, {
    idea: items[0].idea || null,
    dossier: items[0].dossier || null,
    handoff_path: items[0].handoff_path || null,
    session_prompt_path: items[0].session_prompt_path || null,
    suggested_title: items[0].suggested_title || null,
    suggested_directory_name: items[0].suggested_directory_name || null,
  });
}

console.log(JSON.stringify(response, null, 2));
process.exit(failures.length === 0 ? 0 : 2);

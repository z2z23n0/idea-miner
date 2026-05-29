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

const query = process.argv.slice(2).join(' ').trim();

if (!query || query === '--help' || query === '-h') {
  console.error('Usage: idea-handoff.mjs <idea name or alias>');
  process.exit(query ? 0 : 2);
}

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

const normalizedQuery = normalize(query);
const ideas = readJsonl(path.join(root, 'ideas.jsonl'));
const ranked = ideas
  .map((idea) => ({ idea, score: ideaScore(idea, normalizedQuery) }))
  .filter((entry) => entry.score > 0)
  .sort((a, b) => b.score - a.score);

let match = ranked[0]?.idea || null;
let dossier = resolvePath(match?.dossier_path);

if (!dossier || !fs.existsSync(dossier)) {
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
}

if (!dossier || !fs.existsSync(dossier)) {
  console.log(JSON.stringify({
    ok: false,
    query,
    root,
    reason: 'No handoff-ready dossier found. Reconstruct from JSONL artifacts or run a current refresh if requested.',
    matches: ranked.slice(0, 5).map(({ idea, score }) => ({
      id: idea.id,
      name: idea.name,
      score,
      run_id: idea.run_id,
      dossier_path: idea.dossier_path || null,
    })),
  }, null, 2));
  process.exit(2);
}

const mktemp = spawnSync('mktemp', ['-t', 'handoff-XXXXXX.md'], {
  encoding: 'utf8',
});

const handoffPath = mktemp.status === 0
  ? mktemp.stdout.trim()
  : path.join(os.tmpdir(), `handoff-${Date.now()}.md`);

try {
  fs.readFileSync(handoffPath, 'utf8');
} catch {
  // Some mktemp fallbacks may not create the file first.
}

const dossierContent = fs.readFileSync(dossier, 'utf8');
fs.writeFileSync(handoffPath, dossierContent);

console.log(JSON.stringify({
  ok: true,
  query,
  root,
  idea: match ? {
    id: match.id,
    name: match.name,
    run_id: match.run_id,
  } : null,
  dossier,
  handoff_path: handoffPath,
}, null, 2));

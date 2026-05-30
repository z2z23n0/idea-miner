#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const defaultRoot = path.join(os.homedir(), '.idea-miner');
const legacyRoot = path.join(os.homedir(), '.codex', 'data', 'idea-discovery');
const explicitRoot = process.env.IDEA_MINER_HOME || process.env.CODEX_IDEA_DISCOVERY_HOME;

function hasReadableStore(dir) {
  const ideasFile = path.join(dir, 'ideas.jsonl');
  const runsDir = path.join(dir, 'runs');
  return (fs.existsSync(ideasFile) && fs.statSync(ideasFile).size > 0)
    || (fs.existsSync(runsDir) && walk(runsDir).length > 0);
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

const root = explicitRoot
  || (hasReadableStore(defaultRoot) ? defaultRoot : null)
  || (hasReadableStore(legacyRoot) ? legacyRoot : null)
  || defaultRoot;

const files = [
  'signals.jsonl',
  'ideas.jsonl',
  'claims.jsonl',
  'competitors.jsonl',
  'decisions.jsonl',
  'edges.jsonl',
  'handoff-events.jsonl',
];

fs.mkdirSync(root, { recursive: true });
fs.mkdirSync(path.join(root, 'runs'), { recursive: true });

for (const file of files) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) fs.writeFileSync(target, '', { mode: 0o600 });
}

const meta = {
  root,
  files: files.map((file) => path.join(root, file)),
  runs: path.join(root, 'runs'),
};

console.log(JSON.stringify(meta, null, 2));

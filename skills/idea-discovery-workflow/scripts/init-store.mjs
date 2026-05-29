#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.env.IDEA_MINER_HOME
  || process.env.CODEX_IDEA_DISCOVERY_HOME
  || path.join(os.homedir(), '.idea-miner');

const files = [
  'signals.jsonl',
  'ideas.jsonl',
  'claims.jsonl',
  'competitors.jsonl',
  'decisions.jsonl',
  'edges.jsonl',
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

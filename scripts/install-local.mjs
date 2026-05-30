#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const link = args.has('--link');

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = os.homedir();
const skillsDir = path.resolve(argValue('--skills-dir', path.join(home, '.codex', 'skills')));
const defaultDataDir = path.join(home, '.idea-miner');
const legacyDataDir = path.join(home, '.codex', 'data', 'idea-discovery');
const explicitDataDir = argValue('--data-dir', null)
  || process.env.IDEA_MINER_HOME
  || process.env.CODEX_IDEA_DISCOVERY_HOME;
const dataDir = path.resolve(
  explicitDataDir
    || (hasReadableStore(defaultDataDir) ? defaultDataDir : null)
    || (hasReadableStore(legacyDataDir) ? legacyDataDir : null)
    || defaultDataDir,
);

const skillNames = ['ai-founder-playbook', 'idea-discovery-workflow'];
const jsonlFiles = [
  'signals.jsonl',
  'ideas.jsonl',
  'claims.jsonl',
  'competitors.jsonl',
  'decisions.jsonl',
  'edges.jsonl',
  'handoff-events.jsonl',
];

function log(action, target) {
  console.log(`${dryRun ? '[dry-run] ' : ''}${action}: ${target}`);
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

function hasReadableStore(dir) {
  const ideasFile = path.join(dir, 'ideas.jsonl');
  const runsDir = path.join(dir, 'runs');
  return (fs.existsSync(ideasFile) && fs.statSync(ideasFile).size > 0)
    || (fs.existsSync(runsDir) && walk(runsDir).length > 0);
}

function ensureDir(dir) {
  if (dryRun) {
    log('mkdir -p', dir);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
}

function installSkill(name) {
  const src = path.join(repoRoot, 'skills', name);
  const dest = path.join(skillsDir, name);

  if (!fs.existsSync(src)) {
    throw new Error(`Missing skill source: ${src}`);
  }

  ensureDir(skillsDir);

  if (fs.existsSync(dest)) {
    if (!force) {
      log('skip existing skill', dest);
      return;
    }
    log('remove existing skill', dest);
    if (!dryRun) fs.rmSync(dest, { recursive: true, force: true });
  }

  if (link) {
    log('symlink skill', `${dest} -> ${src}`);
    if (!dryRun) fs.symlinkSync(src, dest, 'dir');
    return;
  }

  log('copy skill', `${src} -> ${dest}`);
  if (!dryRun) fs.cpSync(src, dest, { recursive: true });
}

function initStore() {
  ensureDir(dataDir);
  ensureDir(path.join(dataDir, 'runs'));

  for (const file of jsonlFiles) {
    const target = path.join(dataDir, file);
    if (fs.existsSync(target)) {
      log('keep existing store file', target);
      continue;
    }
    log('create store file', target);
    if (!dryRun) fs.writeFileSync(target, '', { mode: 0o600 });
  }
}

for (const name of skillNames) installSkill(name);
initStore();

console.log('');
console.log('Installed idea-miner skills.');
console.log('');
console.log('Next steps:');
console.log(`1. For scheduled runs, use this prompt: ${path.join(repoRoot, 'prompts', 'codex-automation-default.md')}`);
console.log(`2. Optionally append: ${path.join(repoRoot, 'prompts', 'customization-block.md')}`);
console.log('3. Set the schedule in the host automation UI, not inside the prompt.');
console.log('');
console.log('Options:');
console.log('  --dry-run           Preview changes');
console.log('  --force             Replace existing local skill copies');
console.log('  --link              Symlink skills instead of copying');
console.log('  --skills-dir=PATH   Override target skills directory');
console.log('  --data-dir=PATH     Override local evidence store directory');

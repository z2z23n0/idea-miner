#!/usr/bin/env node

import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_PLATFORMS = [
  "Upwork",
  "Freelancer",
  "PeoplePerHour",
  "电鸭",
  "实现网",
  "猪八戒",
  "chinese-independent-developer",
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const seedFile = resolve(repoRoot, "data", "seen-seed.jsonl");
const storeRoot =
  process.env.AGENT_IDEA_FEED_HOME ||
  resolve(homedir(), ".codex", "data", "agent-idea-feed");
const seenFile = resolve(storeRoot, "seen.jsonl");

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\b(?:ai|agent)\b/giu, "")
    .replace(/智能体/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function normalizeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    parsed.hash = "";
    parsed.search = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.pathname = parsed.pathname.replace(/\/+$/u, "") || "/";
    return parsed.toString();
  } catch {
    return raw.replace(/\/+$/u, "").toLowerCase();
  }
}

function parseJsonLines(text, source) {
  const records = [];
  for (const [index, line] of text.split(/\r?\n/u).entries()) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      throw new Error(`${source}:${index + 1} 不是合法 JSON：${error.message}`);
    }
  }
  return records;
}

async function readJsonLines(path, optional = false) {
  try {
    return parseJsonLines(await readFile(path, "utf8"), path);
  } catch (error) {
    if (optional && error.code === "ENOENT") return [];
    throw error;
  }
}

async function ensureStore() {
  await mkdir(storeRoot, { recursive: true });
  try {
    await access(seenFile);
  } catch {
    await writeFile(seenFile, "", "utf8");
  }
}

async function loadSeen() {
  await ensureStore();
  const [seed, runtime] = await Promise.all([
    readJsonLines(seedFile),
    readJsonLines(seenFile, true),
  ]);
  return [...seed, ...runtime];
}

function duplicateReason(candidate, seen) {
  const url = normalizeUrl(candidate.url);
  const title = normalizeText(candidate.title);
  const description = normalizeText(candidate.description);

  for (const prior of seen) {
    if (url && url === normalizeUrl(prior.url)) {
      return { reason: "url", prior };
    }
    if (title && title === normalizeText(prior.title)) {
      return { reason: "title", prior };
    }
    if (
      candidate.platform === prior.platform &&
      description &&
      description === normalizeText(prior.description)
    ) {
      return { reason: "description", prior };
    }
  }
  return null;
}

function validateFields(idea, index) {
  for (const field of ["platform", "title", "description", "url"]) {
    if (typeof idea[field] !== "string" || !idea[field].trim()) {
      throw new Error(`ideas[${index}].${field} 必须是非空字符串`);
    }
  }
  if (!REQUIRED_PLATFORMS.includes(idea.platform)) {
    throw new Error(`ideas[${index}].platform 不是固定七来源之一：${idea.platform}`);
  }
  try {
    new URL(idea.url);
  } catch {
    throw new Error(`ideas[${index}].url 不是合法 URL：${idea.url}`);
  }
}

function unpackRun(payload) {
  if (Array.isArray(payload)) {
    return { runId: `run_${new Date().toISOString()}`, ideas: payload };
  }
  if (!payload || !Array.isArray(payload.ideas)) {
    throw new Error("run JSON 必须是 idea 数组，或包含 ideas 数组的对象");
  }
  return {
    runId: String(payload.run_id || `run_${new Date().toISOString()}`),
    ideas: payload.ideas,
  };
}

async function validateRun(payload) {
  const { runId, ideas } = unpackRun(payload);
  if (ideas.length !== 21) {
    throw new Error(`每次必须恰好 21 个 idea，当前是 ${ideas.length} 个`);
  }

  const counts = Object.fromEntries(REQUIRED_PLATFORMS.map((name) => [name, 0]));
  ideas.forEach((idea, index) => {
    validateFields(idea, index);
    counts[idea.platform] += 1;
  });

  const wrongCounts = Object.entries(counts).filter(([, count]) => count !== 3);
  if (wrongCounts.length) {
    throw new Error(
      `七个来源必须各 3 个：${wrongCounts
        .map(([platform, count]) => `${platform}=${count}`)
        .join(", ")}`,
    );
  }

  const inRun = [];
  for (const idea of ideas) {
    const duplicate = duplicateReason(idea, inRun);
    if (duplicate) {
      throw new Error(
        `本轮重复（${duplicate.reason}）：${idea.title} / ${duplicate.prior.title}`,
      );
    }
    inRun.push(idea);
  }

  const seen = await loadSeen();
  const historicalDuplicates = ideas
    .map((idea) => ({ idea, match: duplicateReason(idea, seen) }))
    .filter(({ match }) => match);
  if (historicalDuplicates.length) {
    throw new Error(
      `命中历史记录：${historicalDuplicates
        .map(({ idea, match }) => `${idea.title} -> ${match.prior.title}`)
        .join("；")}`,
    );
  }

  return { runId, ideas, counts };
}

function option(args, name, required = false) {
  const index = args.indexOf(`--${name}`);
  const value = index >= 0 ? args[index + 1] : undefined;
  if (required && (!value || value.startsWith("--"))) {
    throw new Error(`缺少 --${name}`);
  }
  return value;
}

async function readPayload(path) {
  if (path !== "-") return JSON.parse(await readFile(path, "utf8"));

  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return JSON.parse(input);
}

async function commandInit() {
  await ensureStore();
  print({ ok: true, storeRoot, seenFile });
}

async function commandList() {
  const items = await loadSeen();
  print({ ok: true, storeRoot, count: items.length, items });
}

async function commandContains(args) {
  const candidate = {
    platform: option(args, "platform") || "",
    title: option(args, "title") || "",
    description: option(args, "description") || "",
    url: option(args, "url") || "",
  };
  if (!candidate.title && !candidate.url && !candidate.description) {
    throw new Error("contains 至少需要 --title、--url 或 --description");
  }
  const match = duplicateReason(candidate, await loadSeen());
  print({ seen: Boolean(match), match });
}

async function commandAdd(args) {
  const candidate = {
    platform: option(args, "platform", true),
    title: option(args, "title", true),
    description: option(args, "description", true),
    url: option(args, "url", true),
  };
  validateFields(candidate, 0);
  const match = duplicateReason(candidate, await loadSeen());
  if (match) {
    throw new Error(`命中历史记录（${match.reason}）：${match.prior.title}`);
  }

  const record = {
    ...candidate,
    seen_at: new Date().toISOString(),
    run_id: option(args, "run-id") || null,
  };
  await appendFile(seenFile, `${JSON.stringify(record)}\n`, "utf8");
  print({ ok: true, record });
}

async function commandCheck(path) {
  if (!path) throw new Error("check 需要 run.json 路径，或使用 - 从 stdin 读取");
  const result = await validateRun(await readPayload(path));
  print({ ok: true, run_id: result.runId, count: result.ideas.length, counts: result.counts });
}

async function commandRecord(path) {
  if (!path) throw new Error("record 需要 run.json 路径，或使用 - 从 stdin 读取");
  const result = await validateRun(await readPayload(path));
  const seenAt = new Date().toISOString();
  const lines = result.ideas.map((idea) =>
    JSON.stringify({ ...idea, seen_at: seenAt, run_id: result.runId }),
  );
  await appendFile(seenFile, `${lines.join("\n")}\n`, "utf8");
  print({ ok: true, run_id: result.runId, recorded: lines.length, seenFile });
}

function usage() {
  process.stdout.write(`Usage:
  node scripts/seen-store.mjs init
  node scripts/seen-store.mjs list
  node scripts/seen-store.mjs contains [--title ...] [--url ...] [--description ...]
  node scripts/seen-store.mjs add --platform ... --title ... --description ... --url ... [--run-id ...]
  node scripts/seen-store.mjs check <run.json|->
  node scripts/seen-store.mjs record <run.json|->
`);
}

async function main() {
  const [command = "help", ...args] = process.argv.slice(2);
  if (command === "init") return commandInit();
  if (command === "list") return commandList();
  if (command === "contains") return commandContains(args);
  if (command === "add") return commandAdd(args);
  if (command === "check") return commandCheck(args[0]);
  if (command === "record") return commandRecord(args[0]);
  usage();
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

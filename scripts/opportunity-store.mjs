#!/usr/bin/env node

import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_STATUSES = new Set(["proprietary"]);
const REJECTION_CODES = new Set([
  "direct_open_source",
  "mature_china_competitor",
  "enterprise_only",
  "translation_only",
  "weak_validation",
  "not_ai_core",
  "unbounded_mvp",
  "duplicate_or_adjacent",
]);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const seedFile = resolve(repoRoot, "data", "opportunity-seed.jsonl");
const storeRoot =
  process.env.PERSONAL_OPPORTUNITY_HOME ||
  resolve(homedir(), ".codex", "data", "personal-opportunity-scan");
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

function assertUrl(value, label) {
  try {
    const parsed = new URL(value);
    if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
      throw new Error("只接受 http(s) 链接");
    }
  } catch {
    throw new Error(`${label} 不是合法 URL：${value}`);
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
  const title = normalizeText(candidate.title || candidate.candidate);
  const product = normalizeText(candidate.overseas_product);
  const url = normalizeUrl(candidate.overseas_url || candidate.url);

  for (const prior of seen) {
    if (url && url === normalizeUrl(prior.overseas_url || prior.url)) {
      return { reason: "overseas_url", prior };
    }
    if (title && title === normalizeText(prior.title || prior.candidate)) {
      return { reason: "title", prior };
    }
    if (product && product === normalizeText(prior.overseas_product)) {
      return { reason: "overseas_product", prior };
    }
  }
  return null;
}

function requireString(item, field, label) {
  if (typeof item[field] !== "string" || !item[field].trim()) {
    throw new Error(`${label}.${field} 必须是非空字符串`);
  }
}

function validateOpportunity(item, index) {
  const label = `opportunities[${index}]`;
  for (const field of [
    "title",
    "personal_task",
    "ai_role",
    "overseas_product",
    "overseas_url",
    "validation_signal",
    "validation_url",
    "source_status",
    "source_status_url",
    "china_gap",
    "local_wedge",
    "mvp_boundary",
  ]) {
    requireString(item, field, label);
  }

  for (const field of ["overseas_url", "validation_url", "source_status_url"]) {
    assertUrl(item[field], `${label}.${field}`);
  }

  if (!SOURCE_STATUSES.has(item.source_status)) {
    throw new Error(`${label}.source_status 只接受 proprietary；可直接使用的开源项目不能进入 final`);
  }

  if (!Array.isArray(item.china_check_urls) || item.china_check_urls.length < 2) {
    throw new Error(`${label}.china_check_urls 至少需要两个中国侧核验链接`);
  }
  const normalized = new Set();
  const hosts = new Set();
  item.china_check_urls.forEach((url, urlIndex) => {
    assertUrl(url, `${label}.china_check_urls[${urlIndex}]`);
    normalized.add(normalizeUrl(url));
    hosts.add(new URL(url).hostname.toLowerCase());
  });
  if (normalized.size < 2) {
    throw new Error(`${label}.china_check_urls 必须包含两个不同链接`);
  }
  if (hosts.size < 2) {
    throw new Error(`${label}.china_check_urls 必须来自两个不同站点`);
  }
}

function validateRejection(item, index) {
  const label = `rejections[${index}]`;
  for (const field of ["candidate", "reason_code", "reason", "url"]) {
    requireString(item, field, label);
  }
  if (!REJECTION_CODES.has(item.reason_code)) {
    throw new Error(`${label}.reason_code 不是允许的淘汰原因：${item.reason_code}`);
  }
  assertUrl(item.url, `${label}.url`);
}

function unpackRun(payload) {
  if (!payload || !Array.isArray(payload.opportunities)) {
    throw new Error("run JSON 必须包含 opportunities 数组");
  }
  return {
    runId: String(payload.run_id || `run_${new Date().toISOString()}`),
    opportunities: payload.opportunities,
    rejections: Array.isArray(payload.rejections) ? payload.rejections : [],
  };
}

async function validateRun(payload) {
  const run = unpackRun(payload);
  if (run.opportunities.length > 5) {
    throw new Error(`个人效率机会最多 5 个，当前是 ${run.opportunities.length} 个`);
  }

  run.opportunities.forEach(validateOpportunity);
  run.rejections.forEach(validateRejection);

  const missingTarget = Math.max(0, 3 - run.opportunities.length);
  if (run.rejections.length < missingTarget) {
    throw new Error(
      `final 少于 3 个时必须用 rejections 证明主动 underfilled：至少 ${missingTarget} 条，当前 ${run.rejections.length} 条`,
    );
  }

  const inRun = [];
  for (const item of [...run.opportunities, ...run.rejections]) {
    const duplicate = duplicateReason(item, inRun);
    if (duplicate) {
      throw new Error(
        `本轮重复（${duplicate.reason}）：${item.title || item.candidate} / ${duplicate.prior.title || duplicate.prior.candidate}`,
      );
    }
    inRun.push(item);
  }

  const seen = await loadSeen();
  const historicalDuplicates = [...run.opportunities, ...run.rejections]
    .map((item) => ({ item, match: duplicateReason(item, seen) }))
    .filter(({ match }) => match);
  if (historicalDuplicates.length) {
    throw new Error(
      `命中历史记录：${historicalDuplicates
        .map(({ item, match }) => `${item.title || item.candidate} -> ${match.prior.title || match.prior.candidate}`)
        .join("；")}`,
    );
  }

  return run;
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

async function commandCheck(path) {
  if (!path) throw new Error("check 需要 opportunities.json 路径，或使用 - 从 stdin 读取");
  const run = await validateRun(await readPayload(path));
  print({
    ok: true,
    run_id: run.runId,
    opportunities: run.opportunities.length,
    rejections: run.rejections.length,
  });
}

async function commandRecord(path) {
  if (!path) throw new Error("record 需要 opportunities.json 路径，或使用 - 从 stdin 读取");
  const run = await validateRun(await readPayload(path));
  const seenAt = new Date().toISOString();
  const records = [
    ...run.opportunities.map((item) => ({
      ...item,
      status: "selected",
      seen_at: seenAt,
      run_id: run.runId,
    })),
    ...run.rejections.map((item) => ({
      ...item,
      title: item.candidate,
      status: "rejected",
      seen_at: seenAt,
      run_id: run.runId,
    })),
  ];
  if (records.length) {
    await appendFile(seenFile, `${records.map((item) => JSON.stringify(item)).join("\n")}\n`, "utf8");
  }
  print({
    ok: true,
    run_id: run.runId,
    opportunities: run.opportunities.length,
    rejections: run.rejections.length,
    recorded: records.length,
    seenFile,
  });
}

function usage() {
  process.stdout.write(`Usage:
  node scripts/opportunity-store.mjs init
  node scripts/opportunity-store.mjs list
  node scripts/opportunity-store.mjs check <opportunities.json|->
  node scripts/opportunity-store.mjs record <opportunities.json|->
`);
}

async function main() {
  const [command = "help", ...args] = process.argv.slice(2);
  if (command === "init") return commandInit();
  if (command === "list") return commandList();
  if (command === "check") return commandCheck(args[0]);
  if (command === "record") return commandRecord(args[0]);
  usage();
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});

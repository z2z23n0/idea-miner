import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = resolve(import.meta.dirname, "opportunity-store.mjs");

function opportunity(index, overrides = {}) {
  return {
    title: `未出现的个人效率工具 ${index}`,
    personal_task: "用户导入资料，AI 判断并执行连续步骤，最后交付可确认的结果。",
    ai_role: "AI 负责识别输入、选择动作并跟踪结果。",
    overseas_product: `Overseas Product ${index}`,
    overseas_url: `https://example.com/products/${index}`,
    validation_signal: "持续付费运营并有公开用户反馈。",
    validation_url: `https://example.com/validation/${index}`,
    source_status: "proprietary",
    source_status_url: `https://example.com/pricing/${index}`,
    china_gap: "已检查两类中国入口，没有发现覆盖同一完整任务的成熟产品。",
    china_check_urls: [
      `https://china.example.com/search/${index}`,
      `https://apps.example.cn/item/${index}`,
    ],
    local_wedge: "接入中国本地订单、通知和售后规则。",
    mvp_boundary: "第一版只处理用户主动导入的资料并生成可执行结果。",
    ...overrides,
  };
}

function rejection(index) {
  return {
    candidate: `淘汰候选 ${index}`,
    reason_code: "direct_open_source",
    reason: "已有可直接安装使用的开源实现。",
    url: `https://github.com/example/rejected-${index}`,
  };
}

async function runCli(t, payload, command = "check") {
  const root = await mkdtemp(resolve(tmpdir(), "opportunity-store-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = resolve(root, "run.json");
  await writeFile(input, JSON.stringify(payload), "utf8");
  return spawnSync(process.execPath, [script, command, input], {
    encoding: "utf8",
    env: { ...process.env, PERSONAL_OPPORTUNITY_HOME: root },
  });
}

test("accepts a defensible underfilled run", async (t) => {
  const result = await runCli(t, {
    run_id: "run_test_underfilled",
    opportunities: [opportunity(1), opportunity(2)],
    rejections: [rejection(1)],
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).opportunities, 2);
});

test("rejects a directly usable open-source final", async (t) => {
  const result = await runCli(t, {
    run_id: "run_test_open_source",
    opportunities: [
      opportunity(1, { source_status: "open_source" }),
      opportunity(2),
      opportunity(3),
    ],
    rejections: [],
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /只接受 proprietary/u);
});

test("requires China checks from two different sites", async (t) => {
  const result = await runCli(t, {
    run_id: "run_test_china_checks",
    opportunities: [
      opportunity(1, {
        china_check_urls: [
          "https://same.example.cn/search/1",
          "https://same.example.cn/apps/1",
        ],
      }),
      opportunity(2),
      opportunity(3),
    ],
    rejections: [],
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /两个不同站点/u);
});

test("recorded opportunities cannot be selected again", async (t) => {
  const root = await mkdtemp(resolve(tmpdir(), "opportunity-store-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = resolve(root, "run.json");
  const payload = {
    run_id: "run_test_duplicate",
    opportunities: [opportunity(11), opportunity(12), opportunity(13)],
    rejections: [],
  };
  await writeFile(input, JSON.stringify(payload), "utf8");
  const env = { ...process.env, PERSONAL_OPPORTUNITY_HOME: root };

  const first = spawnSync(process.execPath, [script, "record", input], {
    encoding: "utf8",
    env,
  });
  assert.equal(first.status, 0, first.stderr);

  const second = spawnSync(process.execPath, [script, "check", input], {
    encoding: "utf8",
    env,
  });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /命中历史记录/u);
});

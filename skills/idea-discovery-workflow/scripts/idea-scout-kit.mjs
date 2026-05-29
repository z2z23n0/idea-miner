#!/usr/bin/env node

const topics = process.argv.slice(2).filter(Boolean);
const seeds = topics.length ? topics : [
  'AI coding agents',
  'developer tools',
  'MCP',
  'open source devtools',
];

const buckets = [
  {
    name: '痛点/抱怨',
    purpose: '找明确问题、当前替代方案、重复抱怨和愿付费/愿安装信号。',
    templates: [
      '"I wish there was" "{topic}"',
      '"frustrated with" "{topic}"',
      '"looking for a tool" "{topic}"',
      '"too expensive" "{topic}"',
      'site:reddit.com "{topic}" "alternative"',
      'site:news.ycombinator.com "{topic}" "Ask HN"',
    ],
  },
  {
    name: '产品/平台新闻',
    purpose: '找新功能、release/changelog、跨平台复刻、迁移、兼容、安全、调试机会。',
    templates: [
      '"{topic}" "release notes"',
      '"{topic}" "changelog"',
      'site:news.ycombinator.com "Show HN" "{topic}"',
      'site:producthunt.com "{topic}"',
      '"{topic}" "new feature"',
      '"{topic}" "migration"',
    ],
  },
  {
    name: '竞品缺陷',
    purpose: '找价格、闭源、不可自托管、安装复杂、文档差、停更和体验缺口。',
    templates: [
      '"alternative to" "{topic}" "open source"',
      '"{topic}" "self-hosted"',
      '"{topic}" "privacy"',
      '"{topic}" "pricing" "too expensive"',
      '"{topic}" "documentation" "confusing"',
      '"{topic}" "issue" "stale"',
    ],
  },
  {
    name: '开源生态',
    purpose: '找 GitHub topics/releases/issues/PR、依赖、fork、教程和维护接手机会。',
    templates: [
      'site:github.com "{topic}" "issues"',
      'site:github.com "{topic}" "pull requests"',
      'site:github.com "{topic}" "release"',
      'site:github.com "{topic}" "awesome"',
      '"{topic}" "GitHub Action"',
      '"{topic}" "MCP server"',
    ],
  },
  {
    name: '评论/评测',
    purpose: '从 review 和用户评测里提取 voice-of-customer、真实满意点和缺口。',
    templates: [
      '"{topic}" "review" "pros cons"',
      '"{topic}" "G2"',
      '"{topic}" "Capterra"',
      '"{topic}" "Chrome Web Store"',
      '"{topic}" "Product Hunt" "comments"',
      '"{topic}" "why I switched"',
    ],
  },
  {
    name: '趋势/参与度',
    purpose: '确认近 7-30 天是否多社区重复出现，而不是单点噪音。',
    templates: [
      '"{topic}" "last week"',
      '"{topic}" "2026"',
      'site:reddit.com "{topic}" "2026"',
      'site:news.ycombinator.com "{topic}" "2026"',
      'site:github.com "{topic}" "2026"',
      '"{topic}" "launch"',
    ],
  },
];

const sourceModules = [
  ['HN', 'Ask HN、Show HN、长评论、反对意见'],
  ['Reddit', '细分 subreddit、workaround、愿付费/已付费、多人附和'],
  ['GitHub', 'topics、trending、issues、discussions、PR、release、stars/forks'],
  ['Product Hunt', '新产品、maker 反馈、评论、定位、启动策略'],
  ['Reviews', 'G2/Capterra/Chrome Web Store/App Store/博客评测/视频 demo'],
  ['Official', '官方 blog、release notes、changelog、docs、pricing'],
  ['Search', '搜索引擎交叉验证、替代方案、教程、比较文章'],
];

function fill(template, topic) {
  return template.replaceAll('{topic}', topic.replaceAll('"', '\\"'));
}

console.log('# Idea Scout Query Pack');
console.log();
console.log(`生成时间：${new Date().toISOString()}`);
console.log(`主题：${seeds.join(', ')}`);
console.log();

console.log('## Source Modules');
console.log();
console.log('| 模块 | 要看什么 | 覆盖状态 |');
console.log('|---|---|---|');
for (const [name, desc] of sourceModules) {
  console.log(`| ${name} | ${desc} | 待填 |`);
}
console.log();

console.log('## Signal Bucket Queries');
for (const bucket of buckets) {
  console.log();
  console.log(`### ${bucket.name}`);
  console.log();
  console.log(bucket.purpose);
  console.log();
  for (const topic of seeds) {
    console.log(`- ${topic}`);
    for (const q of bucket.templates) {
      console.log(`  - \`${fill(q, topic)}\``);
    }
  }
}

console.log();
console.log('## Signal Portfolio Template');
console.log();
console.log('| # | 信号桶 | 来源链接 | 日期/新鲜度 | 证据类型/原话摘要 | 当前替代方案 | 可触发方向 | 证据等级 |');
console.log('|---:|---|---|---|---|---|---|---|');
for (let i = 1; i <= 12; i += 1) {
  console.log(`| ${i} |  |  |  |  |  |  |  |`);
}

console.log();
console.log('## Candidate Scoring Template');
console.log();
console.log('| Idea | 来源类型 | 相关信号 | use case 清晰度 0-15 | 痛点/触发证据 0-20 | 替代方案不满 0-15 | 可快速验证 0-15 | 可触达分发 0-15 | 目标匹配 0-10 | 竞争风险可控 0-10 | 总分 |');
console.log('|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|');

console.log();
console.log('## Red Team Questions');
console.log();
[
  '这是不是只是单个帖子/单个新闻带来的错觉？',
  '用户现在的替代方案是否已经足够好？',
  '成熟竞品是否高采用、高满意、强分发，并覆盖核心痛点？',
  '这个 idea 是否只是一个 feature，而不是可独立传播的小工具/项目？',
  '如果是开源项目，5 分钟内能否跑出 aha moment？',
  '如果是商业产品，谁付钱、为什么今年要买？',
  '7-14 天内能否找到 10 个真实用户/maintainer/issue 参与者验证？',
].forEach((q, i) => console.log(`${i + 1}. ${q}`));

#!/usr/bin/env node

const topics = process.argv.slice(2).filter(Boolean);
const hasExplicitTopics = topics.length > 0;

const sourceModules = [
  {
    name: 'HN',
    nativeFeeds: [
      'front page / newest',
      'Show HN',
      'Ask HN',
      'long comment threads with objections',
    ],
    rawSignalHints: [
      'new tools getting sustained discussion',
      'repeated complaints in comments',
      'people comparing current substitutes',
      'launches with clear "why now"',
    ],
  },
  {
    name: 'Reddit',
    nativeFeeds: [
      'new and high-interaction posts in relevant software/building communities',
      'niche subreddits for builders, devtools, automation, AI, startups, plugins, extensions',
    ],
    rawSignalHints: [
      'workarounds and scripts users already wrote',
      'requests for alternatives',
      'pricing or setup backlash',
      'multiple agreeing replies',
    ],
  },
  {
    name: 'GitHub',
    nativeFeeds: [
      'trending and new repositories',
      'recent issues and discussions',
      'recent releases',
      'topics and awesome lists only after a signal points there',
    ],
    rawSignalHints: [
      'fast star/fork growth',
      'recurring issues in active projects',
      'stale but demanded projects',
      'ecosystem gaps exposed by new releases',
    ],
  },
  {
    name: 'Product Hunt',
    nativeFeeds: [
      'today launches',
      'recent launches',
      'maker comments',
      'positioning and pricing pages',
    ],
    rawSignalHints: [
      'new product category forming',
      'launch with strong attention but narrow missing workflow',
      'comments asking for integrations or open-source alternatives',
      'good idea with weak UX or trust gap',
    ],
  },
  {
    name: 'Reviews',
    nativeFeeds: [
      'G2/Capterra/software review pages',
      'Chrome Web Store / App Store extension reviews',
      'blog/video reviews',
      'comparison posts',
    ],
    rawSignalHints: [
      'low-star repeated complaints',
      'pricing complaints',
      'missing integrations',
      'users switching away',
    ],
  },
  {
    name: 'Official',
    nativeFeeds: [
      'official blogs',
      'release notes',
      'changelogs',
      'docs and pricing changes',
    ],
    rawSignalHints: [
      'new platform capability that enables replicas/extensions',
      'breaking changes or migration pressure',
      'new API surface needing tooling',
      'policy or pricing change creating gaps',
    ],
  },
  {
    name: 'Search',
    nativeFeeds: [
      'broad web/news search after raw signals',
      'alternative/comparison/tutorial pages',
      'cached pages when primary source is restricted',
    ],
    rawSignalHints: [
      'repeatability across sources',
      'direct competitors and substitutes',
      'evidence that the pain is not isolated',
      'market/category language',
    ],
  },
];

const signalBuckets = [
  ['痛点/抱怨', '明确问题、当前替代方案、重复抱怨、用户已写 workaround 或已付费。'],
  ['产品/平台新闻', '新功能、release/changelog、迁移、兼容、安全、调试或复刻机会。'],
  ['竞品缺陷', '闭源、贵、不可自托管、安装复杂、文档差、维护停滞、体验不佳。'],
  ['开源生态', 'GitHub trending/new repos/issues/releases、依赖、fork、教程、维护接手机会。'],
  ['趋势窗口', '近 7-30 天跨社区重复出现，而不是单个 viral 点。'],
  ['评论/评测', 'review、插件市场、Product Hunt 评论、博客/视频评测里的 voice-of-customer。'],
  ['原创假设', '由新信号联想到但尚未被明确表达的机会；必须用更强 Red Team 拷打。'],
];

const fitGate = [
  ['保留', '软件、SaaS、app、web app、CLI、GitHub OSS、library、SDK、MCP server、Skill、browser extension、template、GitHub Action、automation script、data product、agent workflow。'],
  ['保留', '非软件痛点，但可以清楚转译成软件/开源/自动化机会。例：不是卖袜子，而是独立站尺码退货原因分析。'],
  ['过滤', '纯线下履约、库存、供应链、硬件制造、消费品牌、门店服务、纯运营套利。'],
  ['过滤', '泛内容/SEO/流量套利，除非有明确软件 workflow 和可防守分发。'],
];

const enrichmentTemplates = [
  '"{signal}" alternative',
  '"{signal}" open source',
  '"{signal}" pricing',
  '"{signal}" complaint',
  '"{signal}" issue',
  '"{signal}" GitHub',
  '"{signal}" Product Hunt',
  '"{signal}" review',
  'site:reddit.com "{signal}"',
  'site:news.ycombinator.com "{signal}"',
  'site:github.com "{signal}" issues',
];

const explicitTopicTemplates = [
  '"{topic}" "release notes"',
  '"{topic}" "changelog"',
  '"{topic}" "Show HN"',
  'site:producthunt.com "{topic}"',
  'site:github.com "{topic}" issues',
  'site:reddit.com "{topic}" alternative',
  '"alternative to" "{topic}" "open source"',
  '"{topic}" "pricing" "too expensive"',
  '"{topic}" "documentation" "confusing"',
];

function fill(template, value, placeholder) {
  return template.replaceAll(`{${placeholder}}`, value.replaceAll('"', '\\"'));
}

console.log('# Idea Scout Kit');
console.log();
console.log(`生成时间：${new Date().toISOString()}`);
console.log(`模式：${hasExplicitTopics ? 'explicit-topic enrichment' : 'source-first discovery'}`);
if (hasExplicitTopics) {
  console.log(`用户指定主题：${topics.join(', ')}`);
} else {
  console.log('用户未指定主题：不使用默认关键词；先从 source-native current feeds 收集原始信号。');
}
console.log();

console.log('## Source-First Modules');
console.log();
console.log('| 模块 | 先看哪些 source-native feeds | 原始信号线索 | 覆盖状态 |');
console.log('|---|---|---|---|');
for (const module of sourceModules) {
  console.log(`| ${module.name} | ${module.nativeFeeds.join('<br>')} | ${module.rawSignalHints.join('<br>')} | 待填 |`);
}
console.log();

console.log('## Signal Buckets');
console.log();
console.log('| 信号桶 | 判定要点 |');
console.log('|---|---|');
for (const [bucket, note] of signalBuckets) {
  console.log(`| ${bucket} | ${note} |`);
}
console.log();

console.log('## Fit Gate');
console.log();
console.log('| 处理 | 规则 |');
console.log('|---|---|');
for (const [action, rule] of fitGate) {
  console.log(`| ${action} | ${rule} |`);
}
console.log();

console.log('## Signal-Derived Enrichment Queries');
console.log();
console.log('先填 Signal Portfolio，再从每条 promising raw signal 提取 product name、用户原话、错误信息、竞品类别、workflow 或 pricing complaint，替换 `{signal}`。');
console.log();
for (const q of enrichmentTemplates) {
  console.log(`- \`${q}\``);
}
console.log();

if (hasExplicitTopics) {
  console.log('## Explicit Topic Enrichment Queries');
  console.log();
  console.log('仅因为用户显式指定了主题，才使用下面这些 topic-guided 查询。');
  console.log();
  for (const topic of topics) {
    console.log(`- ${topic}`);
    for (const q of explicitTopicTemplates) {
      console.log(`  - \`${fill(q, topic, 'topic')}\``);
    }
  }
  console.log();
}

console.log('## Signal Portfolio Template');
console.log();
console.log('| # | 信号桶 | 来源链接 | 日期/新鲜度 | 证据类型/原话摘要 | 当前替代方案 | 初始 fit gate | 可触发方向 | 证据等级 |');
console.log('|---:|---|---|---|---|---|---|---|---|');
for (let i = 1; i <= 12; i += 1) {
  console.log(`| ${i} |  |  |  |  |  |  |  |  |`);
}
console.log();

console.log('## History Relation Template');
console.log();
console.log('| 候选 | 历史关系 | 关联旧 idea | 新增信息是否改变判断 | 处理 |');
console.log('|---|---|---|---|---|');
console.log('|  | new / update_existing / duplicate_of / revives / merged_from / splits_from / adjacent_to |  |  | final / backlog update / reject duplicate |');
console.log();

console.log('## Candidate Scoring Template');
console.log();
console.log('| Idea | 来源类型 | 历史关系 | 相关信号 | use case 清晰度 0-15 | 痛点/触发证据 0-20 | 替代方案不满 0-15 | 可快速验证 0-15 | 可触达分发 0-15 | 目标匹配 0-10 | 竞争风险可控 0-10 | 新颖性/关系处理 0-10 | 总分 |');
console.log('|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
console.log();

console.log('## Red Team Questions');
console.log();
[
  '这个候选来自 source-native raw signal，还是来自旧关键词 bias？',
  '这是不是旧 idea 换名？如果是，新增信息是否改变 verdict、priority、MVP、竞品判断或 stop line？',
  '这是不是只是单个帖子/单个新闻带来的错觉？',
  '用户现在的替代方案是否已经足够好？',
  '成熟竞品是否高采用、高满意、强分发，并覆盖核心痛点？',
  '这个 idea 是否只是一个 feature，而不是可独立传播的小工具/项目？',
  '如果是非软件市场，它能否转译成软件/开源/自动化机会？不能就过滤。',
  '如果是开源项目，5 分钟内能否跑出 aha moment？',
  '如果是商业产品，谁付钱、为什么今年要买？',
  '当前最短证据路径是什么？它能否直接改变推进/停止判断，而不是泛化验证作业？',
  '如果这个候选被 veto，下一轮应该换哪个 source-native feed、社区、ICP、产品形态或证据类型？',
].forEach((q, i) => console.log(`${i + 1}. ${q}`));

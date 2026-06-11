#!/usr/bin/env node

const topics = process.argv.slice(2).filter(Boolean);
const hasExplicitTopics = topics.length > 0;

const thesisSeeds = [
  [
    'Agent-readable software',
    '哪些人类 UI、状态、权限、配置或审计流程会因为 agent 参与而需要变成协议、状态文件、测试或 policy？',
  ],
  [
    'AI coding aftershocks',
    'AI 写代码后，测试、review、debug、deploy、rollback、ownership、cost 哪个边界会重新分裂？',
  ],
  [
    'Repo as product demo',
    '哪个开源 repo 可以用 30 秒 demo 展示一个智能行为，让开发者愿意 star、fork 或依赖？',
  ],
  [
    'Context and memory infrastructure',
    '当 agent 长期参与项目，哪些 memory、identity、permission、provenance、reputation 层会变成基础设施？',
  ],
  [
    'Eval and conformance',
    '哪个 AI/agent 工作流缺少事实标准、benchmark、fixture、replay、simulator 或 compatibility suite？',
  ],
  [
    'AI cost and reliability',
    '哪个原本不可见的推理成本、质量、漂移、权限或安全问题会变成团队每天需要监控的对象？',
  ],
  [
    'AI workflow productization',
    '哪个现在靠 prompt、文档、Slack、截图和人工 review 拼起来的 AI 工作流，可以变成完整产品？',
  ],
  [
    'Platform capability shift',
    '哪个新平台 API / changelog / pricing / policy 变化会催生新的开源标准、迁移层或开发者心智？',
  ],
  [
    'AI prosumer loop',
    '哪个 founder、creator、researcher、student 或 independent developer 的反复任务，可以从一次性 AI chat 变成有留存的 workflow？',
  ],
  [
    'Small-team AI leverage',
    '以前只有大公司能做的哪类 AI 产品，因为模型/agent 降低构建和运营成本，现在能被小团队做成完整产品或 OSS？',
  ],
];

const finalBuckets = [
  {
    id: 'ai_oss',
    label: 'AI OSS / Agent / Developer Infrastructure',
    target: '最多 3 个',
    passPath: 'high-star OSS or complete AI product',
    mustProve: 'repo asset, 30 秒 demo, developer ecosystem, install/share/contribute reason',
  },
  {
    id: 'ai_product',
    label: 'Complete AI Workflow Product',
    target: '最多 3 个',
    passPath: 'complete AI product',
    mustProve: 'AI-native workflow, current substitute, product surface, distribution or buyer path, expansion path',
  },
  {
    id: 'ai_prosumer',
    label: 'AI Prosumer Product',
    target: '最多 3 个',
    passPath: 'complete AI product',
    mustProve: 'repeat usage moment, visible workaround, concrete UX, retention loop, reachable audience',
  },
];

const productArchetypes = [
  ['ai_oss', 'GitHub OSS with 30-second demo'],
  ['ai_oss', 'CLI + durable repo asset'],
  ['ai_oss', 'SDK / protocol / standard'],
  ['ai_oss', 'benchmark / eval corpus / conformance suite'],
  ['ai_product', 'complete AI workflow SaaS'],
  ['ai_product', 'AI agent ops / reliability product'],
  ['ai_product', 'AI context / memory / evaluation workspace'],
  ['ai_product', 'AI platform migration / governance product'],
  ['ai_prosumer', 'AI app with repeat personal/professional loop'],
  ['ai_prosumer', 'founder / creator / researcher workflow assistant'],
  ['ai_prosumer', 'browser extension or personal workspace with visible state'],
  ['ai_prosumer', 'AI learning / research / creation workflow product'],
];

const sourceModules = [
  {
    bucket: 'ai_oss',
    name: 'HN',
    nativeFeeds: ['front page / newest', 'Show HN', 'Ask HN', 'long comment threads with objections'],
    use: ['new mental models', 'developer objections', 'launches with clear why-now', 'evidence that a thesis is too obvious or already solved'],
  },
  {
    bucket: 'ai_oss',
    name: 'GitHub',
    nativeFeeds: ['trending and new repositories', 'recent issues/discussions', 'recent releases', 'topics after a thesis points there'],
    use: ['star mindshare', 'repo asset patterns', 'maintained/abandoned gaps', 'benchmark or protocol opportunities'],
  },
  {
    bucket: 'ai_oss',
    name: 'Package ecosystems',
    nativeFeeds: ['npm/PyPI/Homebrew/Docker packages', 'awesome lists', 'docs examples', 'download or dependency signals'],
    use: ['install mindshare', 'ecosystem gaps', 'contribution or dependency paths'],
  },
  {
    bucket: 'ai_product',
    name: 'AI product launches',
    nativeFeeds: ['Product Hunt', 'official launch pages', 'pricing pages', 'docs and changelogs', 'comparison pages'],
    use: ['category formation', 'pricing and trust gaps', 'product surfaces', 'platform absorption risks'],
  },
  {
    bucket: 'ai_product',
    name: 'AI workflow reviews',
    nativeFeeds: ['G2/Capterra when relevant', 'blog/video reviews', 'customer stories', 'help centers', 'user communities'],
    use: ['current substitutes', 'workflow friction', 'buyer/user language', 'retention or switching evidence'],
  },
  {
    bucket: 'ai_product',
    name: 'Platform shifts',
    nativeFeeds: ['OpenAI/Anthropic/GitHub/Google/Microsoft docs', 'release notes', 'pricing and policy changes'],
    use: ['why-now timing', 'new integration surfaces', 'new reliability/security/eval needs'],
  },
  {
    bucket: 'ai_prosumer',
    name: 'Prosumer apps and extensions',
    nativeFeeds: ['App Store', 'Google Play', 'Chrome Web Store', 'extension stores', 'low-star reviews'],
    use: ['UX gaps', 'retention complaints', 'feature delight', 'substitute behavior'],
  },
  {
    bucket: 'ai_prosumer',
    name: 'Visible workflows',
    nativeFeeds: ['YouTube demos and comments', 'creator/founder/researcher/student communities', 'HN/Reddit discussions'],
    use: ['visible workarounds', 'audience language', 'repeat use moments', 'what the user already understands'],
  },
  {
    bucket: 'cross_bucket',
    name: 'Competitor search',
    nativeFeeds: ['alternatives/tutorial/comparison pages', 'GitHub topics', 'pricing pages', 'support docs'],
    use: ['kill checks', 'repeatability', 'market/category language'],
  },
  {
    bucket: 'cross_bucket',
    name: 'Trend radar',
    nativeFeeds: [
      'AI news sites',
      'AI/builder newsletters',
      'analyst newsletters',
      'curated lab/platform, builder/devtool, and market/reporter X/Twitter lists',
    ],
    use: [
      'new vocabulary',
      'launch clusters',
      'platform or pricing shifts',
      'thesis refresh and query generation, not final proof',
    ],
  },
];

const aiLabels = [
  ['AI-core', 'AI/agent/LLM 是核心行为；去掉 AI 产品基本不成立。'],
  ['AI-native workflow', '机会来自 agent/AI 改变工作流、接口、审计、测试、上下文或信任。'],
  ['AI-leveraged', 'AI 明显增强价值，但确定性系统承担主要价值；final 需要更强产品/OSS 论证。'],
  ['non-AI exceptional', '非 AI；默认不进 final，除非用户明确扩大范围或强到明显超过 AI 候选。'],
  ['non-AI reject', '普通软件/工具机会；进 backlog 或 reject，不占 final。'],
];

const promotionRules = [
  ['final 可过', 'ai_oss：AI-core / AI-native workflow / AI-leveraged 强理由，且 high-star OSS 或完整 AI 产品路径成立。'],
  ['final 可过', 'ai_product：AI-core / AI-native workflow 优先，必须是完整 AI 产品路径，能讲清 AI workflow、替代方案、产品表面和扩张路径。'],
  ['final 可过', 'ai_prosumer：AI-core / AI-native workflow 优先，必须有反复使用场景、可见 UX、替代行为和足够广的可触达用户。'],
  ['final 不过', 'GitHub Action、CI gate、PR comment、template、hook、checklist、thin wrapper 是 idea 本体。'],
  ['final 不过', '一个抱怨直接对应一个小 checker，没有新 thesis、Product Shape 或 repo/product 心智。'],
  ['final 不过', '核心解释只能写成“不是 X，而是 Y”，没有正面产品/仓库说明。'],
  ['final 不过', '陌生 vertical SaaS 需要大量行业黑话才能懂，且用户没有显式要求这个领域。'],
];

const evidenceQueries = [
  '"{bet}" alternative',
  '"{bet}" open source',
  '"{bet}" GitHub',
  '"{bet}" benchmark',
  '"{bet}" conformance',
  '"{bet}" eval',
  '"{bet}" pricing',
  '"{bet}" issue',
  '"{bet}" review',
  '"{bet}" Product Hunt',
  '"{bet}" Chrome extension',
  '"{bet}" App Store review',
  '"{bet}" YouTube demo',
  '"{bet}" newsletter',
  '"{bet}" "AI news"',
  'site:news.ycombinator.com "{bet}"',
  'site:reddit.com "{bet}"',
  'site:github.com "{bet}" issues',
];

const explicitTopicTemplates = [
  '"{topic}" "release notes"',
  '"{topic}" "changelog"',
  '"{topic}" "Show HN"',
  'site:producthunt.com "{topic}"',
  'site:github.com "{topic}" issues',
  'site:reddit.com "{topic}" alternative',
  '"alternative to" "{topic}" "open source"',
  '"{topic}" benchmark OR conformance OR eval',
  '"{topic}" newsletter',
  '"{topic}" "AI news"',
];

function fill(template, value, placeholder) {
  return template.replaceAll(`{${placeholder}}`, value.replaceAll('"', '\\"'));
}

console.log('# Idea Scout Kit');
console.log();
console.log(`生成时间：${new Date().toISOString()}`);
console.log(`模式：${hasExplicitTopics ? 'explicit-topic constrained thesis-first' : 'thesis-first discovery'}`);
if (hasExplicitTopics) {
  console.log(`用户指定主题：${topics.join(', ')}`);
  console.log('这些主题是 thesis constraints，不替代想象力生成。');
} else {
  console.log('用户未指定主题：先生成 thesis portfolio，再用 sources/evidence 做刹车和补强。');
}
console.log();

console.log('## Thesis Seeds');
console.log();
console.log('| Seed | Generator Question |');
console.log('|---|---|');
for (const [seed, question] of thesisSeeds) {
  console.log(`| ${seed} | ${question} |`);
}
console.log();

console.log('## Final Bucket Targets');
console.log();
console.log('| Bucket | Label | Target | Normal pass path | Must prove |');
console.log('|---|---|---|---|---|');
for (const bucket of finalBuckets) {
  console.log(`| ${bucket.id} | ${bucket.label} | ${bucket.target} | ${bucket.passPath} | ${bucket.mustProve} |`);
}
console.log();

console.log('## Discovery Thesis Template');
console.log();
console.log('| # | Bucket | Thesis | AI 相关性假设 | 为什么现在可能成立 | 可形成的产品/OSS 方向 | 想象力评分 |');
console.log('|---:|---|---|---|---|---|---:|');
for (let i = 1; i <= 21; i += 1) {
  const bucket = finalBuckets[(i - 1) % finalBuckets.length].id;
  console.log(`| ${i} | ${bucket} |  |  |  |  |  |`);
}
console.log();

console.log('## Product Shape Bet Sketch Template');
console.log();
console.log('| Bet | Bucket | 来源 thesis | 产品/OSS 载体 | 目标用户/任务 | 输入或权限 | 核心对象 | 输出或状态 | 第一版边界 | 为什么是产品/OSS | 初始处理 |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (let i = 1; i <= 12; i += 1) {
  const [bucket, archetype] = productArchetypes[(i - 1) % productArchetypes.length];
  console.log(`|  | ${bucket} |  | ${archetype} |  |  |  |  |  |  | draft / reject |`);
}
console.log();

console.log('## Source Modules For Evidence Sweep');
console.log();
console.log('| Bucket | 模块 | source-native feeds | 用途 | 覆盖状态 |');
console.log('|---|---|---|---|---|');
for (const module of sourceModules) {
  console.log(`| ${module.bucket} | ${module.name} | ${module.nativeFeeds.join('<br>')} | ${module.use.join('<br>')} | 待填 |`);
}
console.log();

console.log('## AI Relevance Gate');
console.log();
console.log('| Label | Meaning |');
console.log('|---|---|');
for (const [label, meaning] of aiLabels) {
  console.log(`| ${label} | ${meaning} |`);
}
console.log();

console.log('## Product Shape Gate');
console.log();
console.log('一个 idea 必须能让读者说清：这是什么产品/仓库载体，谁在什么任务里用，输入或权限是什么，核心对象是什么，输出或状态是什么，用户能做什么，第一版边界是什么，为什么不是 prompt/checker/Action/wrapper/dashboard。写不出就 rewrite / reject。');
console.log();
console.log('| Bet | Product Shape 是否能说清 | 缺口 | 处理 |');
console.log('|---|---|---|---|');
console.log('|  | pass / rewrite / reject |  | promote / revise / reject |');
console.log();

console.log('## Product / OSS Promotion Gate');
console.log();
console.log('| 处理 | 规则 |');
console.log('|---|---|');
for (const [action, rule] of promotionRules) {
  console.log(`| ${action} | ${rule} |`);
}
console.log();

console.log('## Promotion Gate Table');
console.log();
console.log('| Bet | Bucket | AI 相关性 | complete-AI-product path | high-star-OSS path | 是否 Action/CI/PR-only | Product Shape 是否清楚 | durable asset | 最大 veto 风险 | CEO 处理 |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
console.log('|  | ai_oss / ai_product / ai_prosumer | AI-core / AI-native workflow / AI-leveraged / non-AI exceptional / non-AI reject | pass/fail/not-applicable | pass/fail/not-applicable | yes/no | pass/rewrite/reject |  |  | final / backlog / reject |');
console.log();

console.log('## Candidate Ledger Template');
console.log();
console.log('underfilled bucket 必须保存 `candidate-ledger.jsonl`；每行说明这一轮到底换了什么、找到了什么、为什么 kill/backlog/promote。');
console.log();
console.log('| round | bucket | changed | query_or_source | candidate | product_shape_summary | history_relation | decision | reason |');
console.log('|---:|---|---|---|---|---|---|---|---|');
console.log('| 1 | ai_oss / ai_product / ai_prosumer | thesis_seed, source_module |  |  |  | new / duplicate_of / adjacent_to | kill / backlog / promote |  |');
console.log();

console.log('## Independent Reader Review Prompt');
console.log();
console.log('Report Reader 只能读最终 report，不能读 source notes、dossiers、chat history 或 scratchpad。逐个 selected idea 输出：');
console.log();
console.log('- 我理解这个 idea 在做什么');
console.log('- 载体和目标用户');
console.log('- 核心对象');
console.log('- 输入或权限');
console.log('- 输出或状态');
console.log('- 用户动作');
console.log('- 第一版边界');
console.log('- 为什么不是 prompt / checker / Action / wrapper / dashboard');
console.log('- 还没懂的地方');
console.log('- 是否依赖黑话、字段填空、故事小剧场、或“不是 X，而是 Y”');
console.log('- verdict: pass / rewrite / reject');
console.log();

console.log('## Evidence Sweep Queries');
console.log();
console.log('先有 bet sketch，再把 `{bet}` 替换成产品名、category、protocol、demo asset、核心 workflow 或竞品类别。');
console.log();
for (const q of evidenceQueries) {
  console.log(`- \`${q}\``);
}
console.log();

if (hasExplicitTopics) {
  console.log('## Explicit Topic Evidence Queries');
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

console.log('## Evidence Sweep Template');
console.log();
console.log('| # | 证据角色 | 来源链接 | 日期/新鲜度 | 摘要 | 支持/挑战的 bet | 影响 |');
console.log('|---:|---|---|---|---|---|---|');
for (let i = 1; i <= 12; i += 1) {
  console.log(`| ${i} | supports / challenges / kills / sharpens / competitor |  |  |  |  |  |`);
}
console.log();

console.log('## History Relation Template');
console.log();
console.log('| 候选 | 历史关系 | 关联旧 idea | 新 thesis 或新增信息是否改变判断 | 处理 |');
console.log('|---|---|---|---|---|');
console.log('|  | new / update_existing / duplicate_of / revives / merged_from / splits_from / adjacent_to |  |  | final / backlog update / reject duplicate |');
console.log();

console.log('## Red Team Questions');
console.log();
[
  '这个 bet 的核心 thesis 是什么？如果没有 thesis，只是 complaint-to-tool，直接降级。',
  '这个 bet 属于哪个 final bucket：ai_oss、ai_product、ai_prosumer？bucket 是否实质成立，还是只是贴标签？',
  'AI 是核心、AI-native workflow、辅助杠杆，还是只是写总结/PR comment/config conversion？',
  '读者能不能说清产品/仓库载体、目标用户、输入、核心对象、输出、用户动作和第一版边界？',
  '这个解释是不是主要靠“不是 X，而是 Y”？如果是，正面产品/仓库说明是否还没讲清楚？',
  '这个解释是不是变成了人物故事小剧场？如果是，产品形态是否反而没讲清楚？',
  '这个 bet 是完整 AI 产品或 high-star OSS 吗？两条 gate 分别怎么判？',
  '如果是 ai_oss：30 秒 demo 是什么？陌生开发者为什么会 star、试用、fork、安装、贡献或分享？',
  '如果是 ai_product：AI-native workflow、当前替代、产品表面、分发/买方路径和扩张路径分别是什么？',
  '如果是 ai_prosumer：反复使用场景、可见 UX、替代行为、留存 loop 和可触达用户面分别是什么？',
  'durable asset 是什么：规则、数据集、benchmark、协议、playground、examples、插件生态、workflow memory、community，还是别的可积累资产？',
  '现有替代是否已经足够好？平台是否会一周内吸收？',
  '这个 idea 是否只是一个 feature、wrapper、template、hook、checklist 或小 checker？',
  '如果某个 bucket 不足 3 个，下一轮应该换哪个 thesis seed、产品 archetype、product form、core object、repo/product asset、target user 或 source module？',
].forEach((q, i) => console.log(`${i + 1}. ${q}`));

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
    'Solo builder leverage',
    '以前只有大公司能做的哪类产品，因为 AI 降低构建/运营成本，现在能被小团队开源或产品化？分别想 dev_oss、vertical_b2b、consumer_prosumer。',
  ],
  [
    'Platform capability shift',
    '哪个新平台 API / changelog / pricing / policy 变化会催生新的开源标准、迁移层或开发者心智？',
  ],
  [
    'Vertical workflow compression',
    '哪个专业服务、运营、合规、客服、销售、招聘、教育、医疗行政、电商或本地服务流程，因为 AI 变得能被小产品承载？',
  ],
  [
    'Consumer delegation loop',
    '哪个普通用户或 prosumer 的反复任务，可以从一次性 AI chat 变成有留存的 app/workflow？',
  ],
  [
    'Neglected niche expansion',
    '哪个过去市场太小、服务太人工、软件太难用的用户群，现在因为 AI 成本结构变化值得重新想？',
  ],
];

const finalBuckets = [
  {
    id: 'dev_oss',
    label: 'Developer / OSS',
    target: '最多 3 个',
    passPath: 'high-star OSS or complete product',
    mustProve: 'repo asset, 30 秒 demo, developer ecosystem, install/share/contribute reason',
  },
  {
    id: 'vertical_b2b',
    label: 'Vertical B2B workflow product',
    target: '最多 3 个',
    passPath: 'complete product',
    mustProve: 'buyer/user, recurring workflow, budget or operational pressure, substitute, product surface, expansion path',
  },
  {
    id: 'consumer_prosumer',
    label: 'Consumer / prosumer app product',
    target: '最多 3 个',
    passPath: 'complete product',
    mustProve: 'recurring personal use, retention loop, substitute, product surface, broad-enough audience, emotional/utility value',
  },
];

const productArchetypes = [
  ['dev_oss', 'GitHub OSS with 30-second demo'],
  ['dev_oss', 'CLI + durable repo asset'],
  ['dev_oss', 'SDK / protocol / standard'],
  ['dev_oss', 'benchmark / eval corpus / conformance suite'],
  ['vertical_b2b', 'complete SaaS / workflow app'],
  ['vertical_b2b', 'vertical inbox / command center'],
  ['vertical_b2b', 'compliance / audit / operations workspace'],
  ['vertical_b2b', 'vertical data room / evidence workspace'],
  ['consumer_prosumer', 'mobile or web app with recurring user loop'],
  ['consumer_prosumer', 'creator / student / parent / freelancer assistant'],
  ['consumer_prosumer', 'browser extension or personal workspace with clear retention loop'],
  ['consumer_prosumer', 'personal planning / coaching / comparison app'],
];

const sourceModules = [
  {
    bucket: 'dev_oss',
    name: 'HN',
    nativeFeeds: ['front page / newest', 'Show HN', 'Ask HN', 'long comment threads with objections'],
    use: ['new mental models', 'developer objections', 'launches with clear why-now', 'evidence that a thesis is too obvious or already solved'],
  },
  {
    bucket: 'dev_oss',
    name: 'Developer Reddit / forums',
    nativeFeeds: ['niche software/building/AI/devtool/startup subreddits', 'new and high-interaction posts'],
    use: ['workflow reality', 'workarounds', 'repeated pain', 'language users use for substitutes'],
  },
  {
    bucket: 'dev_oss',
    name: 'GitHub',
    nativeFeeds: ['trending and new repositories', 'recent issues/discussions', 'recent releases', 'topics after a thesis points there'],
    use: ['star mindshare', 'repo asset patterns', 'maintained/abandoned gaps', 'benchmark or protocol opportunities'],
  },
  {
    bucket: 'dev_oss',
    name: 'Package ecosystems',
    nativeFeeds: ['npm/PyPI/Homebrew/Docker packages', 'awesome lists', 'docs examples', 'download or dependency signals'],
    use: ['install mindshare', 'ecosystem gaps', 'contribution or dependency paths'],
  },
  {
    bucket: 'vertical_b2b',
    name: 'B2B review sites',
    nativeFeeds: ['G2', 'Capterra', 'TrustRadius', 'Trustpilot', 'vendor review pages'],
    use: ['buyer complaints', 'pricing backlash', 'missing workflows', 'switching reasons'],
  },
  {
    bucket: 'vertical_b2b',
    name: 'Vertical communities',
    nativeFeeds: ['industry forums', 'professional subreddits', 'trade publications', 'Slack/Discord/forum search'],
    use: ['workflow vocabulary', 'manual substitutes', 'budget pressure', 'operational risk'],
  },
  {
    bucket: 'vertical_b2b',
    name: 'Workflow artifacts',
    nativeFeeds: ['job descriptions', 'templates', 'help centers', 'case studies', 'compliance/news changes', 'agency/manual-service offerings'],
    use: ['who owns the work', 'what gets outsourced', 'where software is missing', 'first-version boundary'],
  },
  {
    bucket: 'consumer_prosumer',
    name: 'App and extension reviews',
    nativeFeeds: ['App Store', 'Google Play', 'Chrome Web Store', 'extension stores', 'low-star reviews'],
    use: ['UX gaps', 'retention complaints', 'feature delight', 'substitute behavior'],
  },
  {
    bucket: 'consumer_prosumer',
    name: 'Creator and social demos',
    nativeFeeds: ['YouTube/TikTok demos and comments', 'creator forums', 'student/parent/freelancer communities'],
    use: ['visible workarounds', 'audience language', 'emotional/utility value', 'repeat use moments'],
  },
  {
    bucket: 'consumer_prosumer',
    name: 'Product Hunt',
    nativeFeeds: ['today/recent launches', 'maker comments', 'positioning and pricing pages'],
    use: ['category formation', 'weak products with good thesis', 'AI-era product surfaces'],
  },
  {
    bucket: 'cross_bucket',
    name: 'Reviews',
    nativeFeeds: ['G2/Capterra/app stores/extension stores/blog/video reviews'],
    use: ['substitute satisfaction', 'switching reasons', 'pricing or UX backlash'],
  },
  {
    bucket: 'cross_bucket',
    name: 'Official',
    nativeFeeds: ['official blogs', 'release notes', 'changelogs', 'docs/pricing changes'],
    use: ['platform shifts', 'new APIs', 'breaking changes', 'policy changes'],
  },
  {
    bucket: 'cross_bucket',
    name: 'Search',
    nativeFeeds: ['competitor lookup after bet sketches', 'alternatives/tutorial/comparison pages', 'cached pages'],
    use: ['kill checks', 'repeatability', 'market/category language'],
  },
];

const aiLabels = [
  ['AI-core', 'AI/agent/LLM 是核心行为；去掉 AI 产品基本不成立。'],
  ['AI-native workflow', '机会来自 agent/AI 改变工作流、接口、审计、测试、上下文或信任。'],
  ['AI-leveraged', 'AI 明显增强价值，但确定性系统承担主要价值；final 需要更强产品/OSS 论证。'],
  ['non-AI exceptional', '非 AI，但完整产品或 high-star OSS 潜力强到可破例。'],
  ['non-AI reject', '普通软件/工具机会；进 backlog 或 reject，不占 final。'],
];

const promotionRules = [
  ['final 可过', 'dev_oss：AI-core / AI-native workflow / AI-leveraged 强理由，且 high-star OSS 或完整产品路径成立。'],
  ['final 可过', 'vertical_b2b：AI-core / AI-native workflow 优先，必须是完整产品路径，证明 buyer/user、预算或运营压力、替代方案和扩张路径。'],
  ['final 可过', 'consumer_prosumer：AI-core / AI-native workflow 优先，必须是完整产品路径，证明反复使用场景、留存 loop、替代行为和足够广的用户面。'],
  ['final 破例', 'non-AI exceptional，必须有完整产品面或清晰 high-star repo 资产，并说明为什么强到可破例。'],
  ['final 不过', 'GitHub Action、CI gate、PR comment、template、hook、checklist、thin wrapper 是 idea 本体。'],
  ['final 不过', '一个抱怨直接对应一个小 checker，没有新 thesis、demo moment 或 repo/star 心智。'],
  ['final 不过', 'bucket label 只是装饰：比如 devtool 假装 vertical/consumer，或 broad market label 没有产品表面。'],
];

const evidenceQueries = [
  '"{bet}" alternative',
  '"{bet}" open source',
  '"{bet}" GitHub',
  '"{bet}" benchmark',
  '"{bet}" conformance',
  '"{bet}" pricing',
  '"{bet}" issue',
  '"{bet}" review',
  '"{bet}" G2',
  '"{bet}" Capterra',
  '"{bet}" App Store review',
  '"{bet}" Google Play review',
  '"{bet}" YouTube demo',
  '"{bet}" TikTok',
  '"{bet}" template workflow',
  '"{bet}" job description',
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

console.log('## Product / OSS Bet Sketch Template');
console.log();
console.log('| Bet | Bucket | 来源 thesis | 产品/OSS 形态 | 30 秒 demo / product moment | repo/star 资产或产品长期资产 | 为什么可能值得想 | 初始处理 |');
console.log('|---|---|---|---|---|---|---|---|');
for (let i = 1; i <= 12; i += 1) {
  const [bucket, archetype] = productArchetypes[(i - 1) % productArchetypes.length];
  console.log(`|  | ${bucket} |  | ${archetype} |  |  |  | draft / reject |`);
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

console.log('## Product / OSS Promotion Gate');
console.log();
console.log('| 处理 | 规则 |');
console.log('|---|---|');
for (const [action, rule] of promotionRules) {
  console.log(`| ${action} | ${rule} |`);
}
console.log();

console.log('## Bucket Fit Gate');
console.log();
console.log('| Bet | Bucket | Bucket 是否实质成立 | 缺口 | 处理 |');
console.log('|---|---|---|---|---|');
console.log('|  | dev_oss / vertical_b2b / consumer_prosumer | yes/no |  | promote / revise / reject |');
console.log();

console.log('## Promotion Gate Table');
console.log();
console.log('| Bet | Bucket | AI 相关性 | complete-product path | high-star-OSS path | 是否 Action/CI/PR-only | high-star 或产品化理由 | 最大 veto 风险 | CEO 处理 |');
console.log('|---|---|---|---|---|---|---|---|---|');
console.log('|  | dev_oss / vertical_b2b / consumer_prosumer | AI-core / AI-native workflow / AI-leveraged / non-AI exceptional / non-AI reject | pass/fail/not-applicable | pass/fail/not-applicable | yes/no |  |  | final / backlog / reject |');
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
  '这个 bet 属于哪个 final bucket？bucket 是否实质成立，还是只是给 devtool / broad market label 贴标签？',
  'AI 是核心、AI-native workflow、辅助杠杆，还是只是写总结/PR comment/config conversion？',
  '这个 bet 是完整产品或 high-star OSS 吗？两条 gate 分别怎么判？如果只是 GitHub Action/CI gate/PR comment，为什么不应 reject？',
  '如果是 dev_oss：30 秒 demo 是什么？陌生开发者为什么会 star、试用、fork、安装、贡献或分享？',
  '如果是 vertical_b2b：buyer/user、预算或运营压力、当前替代、产品表面和扩张路径分别是什么？',
  '如果是 consumer_prosumer：反复使用场景、留存 loop、替代行为、情绪/实用价值和足够广的用户面分别是什么？',
  'repo/star 资产或产品长期资产是什么：规则、数据集、benchmark、协议、playground、examples、插件生态、workflow memory、community，还是别的可积累资产？',
  '现有替代是否已经足够好？平台是否会一周内吸收？',
  '这个 idea 是否只是一个 feature、wrapper、template、hook、checklist 或小 checker？',
  '如果是非 AI，为什么强到可以破例占 final 名额？',
  '这个 bet 的产品画面是否足够具体？用户第一次打开、运行或安装时会看到什么？',
  '如果某个 bucket 不足 3 个，下一轮应该换哪个 thesis seed、产品 archetype、demo/product moment、repo/product asset、ICP 或 source module？',
].forEach((q, i) => console.log(`${i + 1}. ${q}`));

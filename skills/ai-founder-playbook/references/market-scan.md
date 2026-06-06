# Market Scan

用于三类任务：

- **评估一个已有 idea**：查 Twitter/X、Hacker News、GitHub、Reddit、Product Hunt、评论站和 web，看竞品/替代品/开源项目是否存在，用户是否真的痛。
- **反向挖 idea**：从社区讨论、issue、评论、趋势和抱怨里找可形成商业产品或 GitHub 开源项目的需求。
- **产品/平台新闻触发 idea**：从近期产品发布、模型/agent/开发者工具新功能、release notes、changelog、Show HN/Product Hunt、GitHub trending/releases、官方 blog 和社区评测里，找复刻、改窄、开源替代、兼容层、安全/调试/迁移工具、模板或 workflow 机会。

## 必须联网的场景

当用户要求“找找有没有”“现在有没有竞品”“最近大家在讨论什么”“Twitter/HN/GitHub/Reddit 上有没有信号”时，必须联网或使用可用研究工具。不要凭印象回答。

如果某个平台无法直接访问：

- X/Twitter：用 web search、帖子聚合页、搜索引擎缓存或可用浏览器登录态；无法访问时明确说明。
- Reddit：先用 `site:reddit.com/r/<subreddit> <关键词>` 搜索；直接 API/页面失败时换搜索引擎。
- HN：用 Algolia/HN search、`site:news.ycombinator.com`、Show HN/Ask HN 查询。
- GitHub：用 GitHub search、topics、stars、recent commits、issues/discussions、README、release notes。

## 信号组合，而不是单一路径

成熟的 idea discovery 工作流通常不是只搜“抱怨”，也不是把每个抱怨机械转成一个小工具。一次性市场扫描可以从信号进入；但定时 idea discovery 应先有 thesis 和产品/OSS bet，再用证据来杀掉、收窄或增强判断。

| 信号桶 | 看什么 | 可能产出的 idea |
|---|---|---|
| **痛点/抱怨** | Reddit/HN 长讨论、GitHub issue、review 低分、`I wish there was`、`too expensive`、`bloated` | painkiller、开源替代、轻量版、自动化脚本 |
| **产品/平台新闻** | 官方 blog、release notes、changelog、Show HN、Product Hunt、launch thread、模型/agent 新功能 | 跨平台复刻、Codex/Claude/Cursor 互补工具、兼容层、模板、migration helper |
| **竞品缺陷** | pricing backlash、复杂安装、文档差、停更、issue 积压、企业化过重、闭源/不可自托管 | developer-first 开源版、CLI-first 小工具、self-hosted 版本、UX repair |
| **开源生态** | GitHub trending/topics/releases、stars/forks、recent commits、issue/PR 活跃度、依赖和教程 | 维护接手、插件、adapter、测试工具、conformance suite |
| **趋势/参与度** | 近 7-30 天跨 Reddit/X/HN/GitHub/web 的重复讨论、搜索热度、多个社区同时出现 | 时机判断、细分 ICP、产品边界 |
| **评论/评测** | G2/Capterra/Chrome Web Store/App Store/Product Hunt 评论、博客评测、YouTube/TikTok demo 反馈 | 体验缺口、价格切口、缺失工作流、用户真正珍惜的价值 |

内置扫描流程：

1. **Trend Window**：先看近 7-30 天跨平台重复信号和参与度，不急着生成 idea。
2. **Source Modules**：把 HN、Product Hunt、Reddit、GitHub、review site、official blog/release notes 当作可替换来源模块；每个模块都要记录覆盖/未覆盖边界。若是 `idea-discovery-workflow` 的 recurring run，source modules 要按 final bucket 覆盖，不要只用开发者来源。
3. **Review Mining**：从低分评论、pricing backlash、复杂安装、停更、issue 积压、文档差里找体验缺口。
4. **Product Feed**：把新产品、平台新功能、release/changelog、早期 traction 作为触发器，但不要把“有人发布了产品”直接当成需求证据。
5. **Opportunity Scoring**：把痛点、替代方案、可付费/可安装信号、开源传播路径、可触达渠道和竞争风险放进同一张表。
6. **Adversarial Pass**：每个候选必须找反证：是否只是 feature、是否已有好方案、是否没人愿意换、是否只是新闻热度。

如果这是定时或多轮 discovery，而不是一次性市场扫描，使用 `idea-discovery-workflow` 来生成 thesis portfolio、product/OSS bet sketches、Promotion Gate、证据记忆和报告。不要用本文件的抱怨/搜索模式替代 thesis-first 生成。

## Bucketed Source Modules

`idea-discovery-workflow` 默认会把 final ideas 分成 `ai_oss`、
`ai_product`、`ai_prosumer`。做市场扫描或竞品核验时，按 bucket 选择来源：

| Bucket | 优先来源 | 主要判断 |
|---|---|---|
| `ai_oss` | HN、GitHub、developer Reddit、issue/discussion、release notes、docs、npm/PyPI/Homebrew/Docker、awesome lists、benchmarks/evals/protocols | repo/star 心智、安装依赖、开发者传播、开源维护、30 秒 demo 和平台吸收 |
| `ai_product` | AI 产品 launch、Product Hunt、定价页、help center、official docs/changelog、review site、comparison page、用户社区、平台公告 | AI-native workflow、当前替代、产品表面、付费/分发路径、竞品吸收风险 |
| `ai_prosumer` | App Store、Google Play、Chrome Web Store、Product Hunt 评论、YouTube demo 和评论、creator/founder/researcher/student/indie developer 社区、niche Reddit/HN、comparison pages | 反复使用场景、可见 workaround、留存 loop、具体 UX、足够广的可触达用户面 |

如果某个 bucket 的来源不可访问，明确标注 `未覆盖/受限`。不要用更多
GitHub/HN 结果替代 `ai_product` 或 `ai_prosumer` 证据，除非用户明确把任务
限定为 developer tool / OSS。默认不要漂到陌生垂直行业；只有用户显式要求
才把 healthcare、insurance、construction、compliance-heavy vertical 等当作
final 领域。

## 评估已有 idea 的扫描顺序

1. **关键词展开**：从 idea 提炼 5-10 个关键词，包括用户语言、替代方案、竞品类别、英文同义词。
2. **直接竞品**：搜索 `"<problem>" startup`, `"<category>" tool`, `alternative to <known tool>`, Product Hunt、GitHub topics。
3. **真实替代品**：搜索 Excel/Notion/Slack bot/Chrome extension/open-source script/agency/manual workflow 等替代行为。
4. **用户声音**：搜 `frustrated with`, `looking for a tool`, `is there a tool`, `I wish there was`, `alternative to`, `too expensive`, `bloated`, `manual`, `spreadsheet`。
5. **开发者信号**：GitHub issues/discussions、HN comments、Reddit threads，重点看重复抱怨、workaround、star 增速、recent commits。
6. **评论和定价**：G2/Capterra/Trustpilot/App Store/Chrome Web Store/Product Hunt 评论、pricing pages、docs、changelog。
7. **产品/平台变化**：查官方 blog、release notes、changelog、Show HN/Product Hunt 发布、GitHub releases/trending，看新能力是否触发复刻、迁移、兼容、安全、调试、测试或模板机会。
8. **开源机会判断**：如果目标是 GitHub stars/用户，额外查 GitHub topics、相邻 repo、npm/PyPI/Homebrew/Docker downloads、awesome lists、HN Show HN、Reddit 推荐帖。
9. **竞争强度判断**：不要把“存在竞品”当成 kill signal；按下面的竞争判断矩阵找切入缝隙。
10. **结论分层**：已有成熟竞品且满意度高、已有竞品但体验/价格/定位有明显缺口、有弱竞品或低知名度项目、有开源替代但停滞、有付费竞品可做开源版、产品新闻触发但缺口未证实、只有讨论没产品、没人讨论。

## 竞争判断矩阵

对每个竞品或替代品，不只记录“有/没有”，要判断它对当前 idea 的真实威胁和机会：

| 维度 | 看什么 | 对你的含义 |
|---|---|---|
| **采用度** | stars、downloads、MAU、客户 logo、HN/Reddit/X 提及、review 数 | 高采用度说明需求存在；低采用度可能是弱竞品，也可能是需求弱 |
| **满意度** | 1-3 星评论、GitHub issues、抱怨帖、churn/switching 讨论 | 竞品多但用户不满，反而说明有切入机会 |
| **活跃度** | recent commits、release cadence、issue 响应、团队招聘、changelog | 停更/响应慢的开源项目可被替代；高活跃项目更难正面打 |
| **定位差异** | 面向谁、解决哪个 use case、复杂度、部署方式、开源/闭源 | 侧重点不同则未必是强竞品，可能可以错位切入 |
| **价格/许可** | 免费、付费、enterprise、open-core、license 限制 | 付费且用户抱怨价格时，可考虑开源版/轻量版/自托管版 |
| **体验缺口** | 安装难、文档差、UI 糟、慢、不稳定、集成少、学习曲线陡 | 体验差是可打的楔子，尤其适合开源项目用好 README/demo 抢心智 |
| **分发/生态** | 是否被 awesome list、框架、云市场、插件生态、平台默认推荐 | 强分发比功能更难打；无分发但功能强的项目仍可被超过 |
| **防守性** | 数据、网络效应、合规、品牌、工作流锁定、社区忠诚度 | 没有防守性的竞品存在，不一定阻止新项目进入 |

## 竞品存在时的结论规则

- **强阻断**：竞品采用度高、满意度高、分发强、切换成本高，且你没有明确新用户段/体验/价格/开源/分发楔子。
- **可错位切入**：竞品解决相邻问题、面向不同用户、太重/太贵/太企业化，或忽略一个具体小场景。
- **开源机会**：主流竞品付费、闭源、难自托管、开发者不信任、价格被抱怨，且你能做一个清晰、可维护、5 分钟跑起来的开源版。
- **体验机会**：竞品功能有但安装、文档、速度、默认配置、UI、错误信息、集成体验差。
- **低知名度机会**：已有项目 star 少、讨论少、release 弱，但少量用户强烈表达需求。可用更强定位、分发和文档抢占关键词。
- **维护接手机会**：开源项目停更、issue 积压、PR 无人合并，但仍有人依赖或抱怨。
- **需求弱警告**：竞品少且社区也不讨论，不能直接解读为空白市场；先判断是否没人痛。

## 反向挖 idea 的搜索模式

先找“明确痛点 + 当前替代 + 多人共鸣 + 可形成产品边界”的帖子。可用这些查询：

```text
"I wish there was" + tool
"why isn't there" + app
"would pay for" + software
"someone should build" + SaaS
"looking for a tool" + workflow
"need a simple" + software
"frustrated with" + tool
"paying too much for" + software
"is there a tool" + Reddit
"any tool that" + Hacker News
"alternative to" + expensive
site:news.ycombinator.com "Ask HN" "tool"
site:news.ycombinator.com "Show HN" "<category>"
site:reddit.com/r/SaaS "looking for a tool"
site:reddit.com/r/startups "I wish there was"
site:reddit.com/r/webdev "frustrated with"
site:github.com "<problem>" "issue"
```

## 产品/平台新闻触发的搜索模式

适合发现“新功能很好但只在某个平台有”“新产品方向对但体验差”“新平台能力带来下游工具机会”。先看发布本身，再看社区反馈和替代方案：

```text
"release notes" "<platform or product>" "<workflow>"
"changelog" "<developer tool>" "breaking" OR "migration"
site:news.ycombinator.com "Show HN" "<category>"
site:producthunt.com "<category>" "AI" "developer"
site:github.com "<tool>" "issues" "feature request"
"alternative to <new product>" "open source"
"<new feature>" "too expensive" OR "privacy" OR "self-hosted"
"<new feature>" "Codex" OR "Claude Code" OR "Cursor" OR "MCP"
```

新闻触发型 idea 必须回答：

- 新能力解决了什么旧痛点？它是 toy、feature，还是工作流变化？
- 为什么不直接用原产品？是平台锁定、价格、闭源、隐私、权限、调试、可观测性、速度、文档、工作流不合，还是目标用户不同？
- 可以做成多小？是 CLI、MCP server、Skill、GitHub Action、SDK、浏览器插件、模板，还是开源库？
- 哪些证据只是“发布很热”，哪些证据说明用户真的想切换、复刻、补洞或自托管？
- 如果大厂下周补齐这个缺口，项目还剩下什么开源/分发/工作流优势？

## 来源分工

- **HN**：技术/开发者市场。重点看高质量长评论、反对意见、Show HN 反馈。
- **GitHub**：开源和开发者需求。重点看 issue 重复度、PR 活跃度、maintainer 响应、fork/star 质量、release 节奏、停更项目、awesome lists 和 topic 位置。
- **Reddit**：真实抱怨和替代方案。重点看评论深度、多个用户附和、是否有人说愿意付费或已经付费。
- **X/Twitter**：趋势、专家观点、早期产品发布、抱怨扩散。注意噪音高，单条 viral 不等于需求。
- **Product Hunt / Indie Hackers**：看新产品、定位、启动策略和 maker 反馈；注意 upvote 可被运营放大。
- **评论站/应用商店**：看竞品缺口和 voice-of-customer。1-3 星找痛点，4-5 星找用户真正珍惜的价值。

## idea 评分（0-100）

- **明确单一 use case（0-15）**：一句话能说清“把 X 变成 Y / 帮 Z 跟踪 W / 让 A 少做 B”。
- **痛点或触发证据（0-20）**：有真实帖子、issue、评论、访谈、付费/安装行为，或可信的产品/平台变化 + 社区反馈链；不能只有“新功能很火”。
- **现有方案不满（0-15）**：用户明确说现有工具贵、臃肿、复杂、缺功能、停更或工作流不顺。
- **产品边界清楚（0-15）**：能做出 concierge、fake door、脚本、插件或很窄的首版产品表面积。
- **可触达分发（0-15）**：能列出具体社区、关键词、用户列表、issue 参与者、HN/Reddit 讨论者。
- **目标匹配（0-10）**：商业产品看付费/预算路径；开源项目看 star/安装/fork/贡献/生态引用路径。
- **竞争风险可控（0-10）**：没有明显大厂/强开源/垄断分发一键压死；或有明确细分楔子，如低知名度、体验差、付费闭源、停更、过度复杂、用户段错位。

判读：

- **70+**：值得继续想，但仍要先跑外部扫描，确认不是竞品或分发直接阻断。
- **50-69**：有苗头，先缩窄 ICP 或换切入点。
- **30-49**：多半是讨论热闹但需求弱，或竞品/分发/预算缺口大。
- **<30**：不建议做，除非出现新的强证据。

## 输出模板：竞品/替代品扫描

```markdown
外部扫描结论：强竞品阻断 / 可错位切入 / 付费竞品可开源替代 / 体验差可重做 / 低知名度弱竞品 / 开源项目停滞可接手 / 开源生态位空缺 / 只有讨论没产品 / 信号弱
目标类型：商业产品 / 开源影响力项目 / 混合型

搜索范围：
- 平台：
- 关键词：
- 时间范围：

发现：
| 类型 | 名称/链接 | 采用度 | 满意度/抱怨 | 活跃度 | 对你的影响 |
|---|---|---|---|---|---|

用户痛点：
- 高频抱怨：
- 现有 workaround：
- 愿付费/已付费信号：
- 开源 adoption 信号：stars/forks/downloads/issues/PR/教程/生态引用：

竞争判断：
- 直接竞品：
- 间接替代：
- 最大敌人：
- 可切入缝隙：低知名度 / 体验差 / 付费闭源 / 停更 / 过度复杂 / 用户段错位 / 分发弱
- 差异化楔子：

产品边界：
- 第一版是什么：
- 不做什么：
- 最容易被误判的地方：
```

## 输出模板：从社区挖 idea

```markdown
候选 idea：
| Idea | 来源类型 | 来源信号 | 分数 | 为什么可能成立 | 最大风险 |
|---|---|---|---:|---|---|

代表性方向：
- 目标类型：
- 用户：
- 痛点：
- 当前替代：
- 最小产品/开源项目：
- 产品边界：
- 最大风险：
```

## 证据纪律

- 引用具体链接和平台，不要只说“有人讨论”。
- 区分“有人点赞”“有人抱怨”“有人付费”“有人切换工具”。
- 对开源项目，区分“有人 star”“有人安装”“有人 fork”“有人提 issue/PR”“有人在生产或真实项目中依赖”。
- 没有找到竞品不等于机会大，也可能是没人痛。
- 有很多竞品不等于不能做，关键看是否有重复未解痛点和可防守楔子。
- 竞品 star 少不等于没价值；要看 issue、fork、依赖、下载、最近讨论和是否只是分发没做好。
- 竞品付费不等于不可做；如果用户抱怨价格、闭源、不能自托管或扩展性差，开源版可能是有效楔子。
- 如果搜索范围有限，明确写“未覆盖 X/Twitter 登录内容”等边界。

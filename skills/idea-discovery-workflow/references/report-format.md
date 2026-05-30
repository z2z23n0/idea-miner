# Report Format

Final output must be Chinese Markdown and use this structure.

# 今日 Verdict

- 运行日期与时区
- 使用的角色：真实 sub-agent / 模拟角色
- 使用的内置发现流程：Thesis Portfolio / Product-OSS Bet Sketches /
  Evidence Sweep / AI Relevance Gate / Product-OSS Promotion Gate / Red Team /
  Competitor Check；若有步骤未做，说明原因
- 发现方式：默认 thesis-first、imagination-led；如果本次使用了用户指定主题或
  旧 idea 关键词，说明它只是 thesis constraint 或 backlog refresh，不是默认边界
- 覆盖的信息源与信号桶
- 未覆盖或受限的信息源
- CEO 总判断：今天是否有最多 3 个值得作为 final 的 product/OSS bets；如果没有，
  说明已跑哪些 thesis replenish 轮次以及为什么仍 underfilled。不要为了凑数降低标准。

# Discovery Thesis

Start with thesis, not evidence. Include 8-12 best theses from the larger
20-30 thesis pool:

| # | Thesis | AI 相关性假设 | 为什么现在可能成立 | 可形成的产品/OSS 方向 | 想象力评分 |
|---:|---|---|---|---|---:|

# Product / OSS Bet Sketches

List the serious bet sketches before evidence:

| Bet | 来源 thesis | 产品/OSS 形态 | 30 秒 demo | repo/star 资产 | 为什么可能值得想 | 初始处理 |
|---|---|---|---|---|---|---|

# Evidence Sweep

Use evidence after thesis generation. Do not let this section become the idea
generator.

| # | 证据角色 | 来源链接 | 日期/新鲜度 | 摘要 | 支持/挑战的 bet | 影响 |
|---:|---|---|---|---|---|---|

Evidence roles: `supports`, `challenges`, `kills`, `sharpens`, `competitor`.

# 历史关联与新颖性

Use this table before final ideas:

| 候选 | 历史关系 | 关联旧 idea | 新 thesis 或新增信息是否改变判断 | 处理 |
|---|---|---|---|---|

Allowed history relations: `new`, `update_existing`, `duplicate_of`, `revives`,
`merged_from`, `splits_from`, `adjacent_to`.

If a candidate is a duplicate or only a minor update, do not present it as a new
final idea.

# Promotion Gate

Every serious candidate must go through this table:

| Bet | AI 相关性 | 产品/OSS 尺度 | 是否 Action/CI/PR-only | high-star 或产品化理由 | 最大 veto 风险 | CEO 处理 |
|---|---|---|---|---|---|---|

AI relevance values: `AI-core`, `AI-native workflow`, `AI-leveraged`,
`non-AI exceptional`, `non-AI reject`.

Promotion rules:

- Final slots prefer `AI-core` and `AI-native workflow`.
- `AI-leveraged` must show AI is not just summaries, PR comments, or config
  conversion.
- `non-AI exceptional` must be a complete product or unusually strong high-star
  OSS bet.
- `GitHub Action`, `CI gate`, `PR comment`, `template`, `hook`, `checklist`, or
  `thin wrapper` cannot be the body of a final idea. They may only be integration
  surfaces for a broader product/OSS project.

# 候选池与迭代

| 轮次 | Bet | 改变了什么 thesis / 产品原型 / repo asset | AI 相关性 | Promotion Gate | 主要反对意见 | 竞品结论 | CEO 处理 |
|---|---|---|---|---|---|---|---|

If there are multiple rounds, explain why the previous round failed and what
thesis seed, AI-era capability shift, product archetype, demo moment, repo
asset, ICP, competitor category, or source module changed. If fewer than 3 ideas
pass, this section must show thesis replenish attempts.

# 今日新发现 / 旧 Idea 更新

Briefly separate:

- 今日新发现：new, splits_from, adjacent_to, or merged_from bets that changed
  the opportunity space.
- 旧 idea 更新：update_existing or revives ideas with decision-changing new
  thesis or evidence.
- 重复驳回：duplicate_of ideas without decision-changing evidence.

# 最终 Product / OSS Bets（最多 3 个）

Only include ideas with verdict `推进` or strong `先验证` that match the user's
goal and are either new or materially changed. Do not include `暂缓`,
`不建议做`, internal-only tools, thin wrappers, pure duplicates, minor backlog
updates, or Action/CI/PR-only integrations as final ideas.

Each final idea must start with a reader-readable product/OSS card before
evidence and debate.

## Bet N：名称

### 读者可懂产品 / OSS 卡片

| 字段 | 内容 |
|---|---|
| 核心 thesis | 这个 bet 押的 AI/产品/OSS 变化是什么 |
| AI 相关性 | AI-core / AI-native workflow / AI-leveraged / non-AI exceptional |
| 产品形态 | complete product / SaaS / web app / GitHub OSS / CLI+OSS / SDK / MCP server / Skill / browser extension / platform module / other |
| 为什么配占 final 名额 | 为什么这不是普通小工具 |
| 为什么不是 Action/小工具 | 如果有 Action/CI/PR comment，它只是哪个更大项目的集成面 |
| 目标用户 | 具体到角色、团队或开源受众 |
| 使用时刻 | 用户在什么触发场景下打开或运行它 |
| 输入 | 用户提供什么文件、链接、事件、数据、配置、账号或上下文 |
| 系统动作 | 系统具体分析、执行、生成、监控或校验什么 |
| 输出 | 用户拿到什么结果、diff、报告、演示、文件、决策证据或可运行 artifact |
| 替代的手工动作 | 今天不用它时用户怎么做，痛在哪里 |
| 为什么现有替代不够 | 现有工具、平台功能、开源库或手工流程缺哪一块 |
| 30 秒 demo | 一个陌生开发者 30 秒内为什么会觉得想 star 或试用 |
| repo/star 资产 | 规则、数据集、benchmark、协议、playground、examples、插件生态或其他可积累资产 |
| 最短证据路径 | 当前最低成本、最能改变推进/停止判断的一步 |
| 停止线 | 看到什么证据就停止或降级 |

- 一句话结论：推进 / 先验证 / 转向 / 暂缓 / 不建议做；置信度：低/中/高
- 历史关系：new / update_existing / duplicate_of / revives / merged_from /
  splits_from / adjacent_to；如果不是 new，说明关联的旧 idea 和判断变化
- idea 来源类型：thesis / direct pain / inference / product news / replica /
  competitor gap / ecosystem derivative / analogy / original hypothesis，用中文说明
- 产品尺度判断 / 演化路径：说明当前最合理的产品尺度是完整产品、高 star OSS、
  SaaS、平台模块、大产品方向还是混合型；如果建议从小切口验证，要说明这
  只是验证路径而不是长期上限
- 信息来源：3-6 条关键链接，含平台、日期/新鲜度、证据角色和摘要
- 当前替代方案
- 如何解决：首版只做什么，不做什么；如果包含 GitHub Action/CI/PR comment，
  说明它只是集成面
- 竞品判断：表格列直接竞品、间接替代、开源替代、平台内置能力；含采用度、价格/开源状态、体验缺口、是否充分解决核心痛点、差异化楔子
- AI 杠杆：说明 AI 是核心、AI-native workflow、还是只是辅助；辅助型不能伪装成 AI-core
- Red Team 拷打记录
- 最危险假设
- 最短证据路径：只写当前最短、最低成本、能改变推进/停止判断的动作；不要机械写找 N 个用户/issue/maintainer
- 读者复述检查：用 3-5 句复述这个产品/OSS bet 是什么、谁何时使用、输入输出、demo moment、repo/star 资产、为什么不是小工具；如果复述不清，必须重写产品卡片和正文
- 今日优先级：P0 / P1 / P2

# Reader Clarity Gate

After drafting the final ideas and before persistence, add a short gate result:

| Bet | 能否被未参与发现的读者复述 | 是否通过 Promotion Gate | 缺口 | 处理 |
|---|---|---|---|---|

Pass only if every final idea can be restated from the report without reading
the original chat or doing new searches. The gate should reject reports where:

- the product form is an abstract theme instead of a usable artifact;
- the usage moment, input, system action, output, demo moment, or repo/star
  asset is missing;
- the idea is just a GitHub Action, CI gate, PR comment, checklist, template,
  wrapper, or platform patch;
- source links are only generic feed URLs without source-note support;
- competitor reasoning says "there are competitors" but not why they do or do
  not solve the core workflow;
- shortest evidence path is generic homework rather than a decision-changing
  next action.

# 被拒绝或暂缓的候选

List killed or paused candidates with specific reasons. For each, say whether it
failed by weak thesis, weak AI relevance, target mismatch, thin wrapper/platform
absorption, Action-only/CI-only shape, weak pain, weak distribution, mature
substitutes, no repo asset, no demo moment, no product surface, no short
evidence path, or personal/internal-only value. Do not attach generic validation
plans.

# 角色冲突与 CEO 裁决

Record the main disagreements, evidence, and CEO decision.

# Skill Optimizer 观察

Only high-confidence actionable suggestions. If none, say so.

# Source Appendix

Deduplicate links and group by source.

# Persistence Note

End each scheduled or recurring run with a short note stating where the run
artifacts were saved:

- `report.md`
- `handoff-index.md`
- per-idea dossiers under `ideas/<idea_id>.md`
- artifact validator status: passed / failed / not run

If persistence failed or the environment was read-only, state that explicitly.
If the artifact validator failed, include the failure summary and do not present
the run as a normal success. Do not leave the only detailed copy inside the chat
transcript.

# Report Format

Final output must be Chinese Markdown and use this structure.

# 今日 Verdict

- 运行日期与时区
- 使用的角色：真实 sub-agent / 模拟角色
- 使用的内置发现流程：Trend Window / Source Modules / Review Mining /
  Product Feed / Opportunity Scoring / Adversarial Pass；若有步骤未做，说明原因
- 发现方式：默认 source-first；如果本次使用了用户指定关键词或旧 idea 关键词，
  说明关键词来源和用途
- 覆盖的信息源与信号桶
- 未覆盖或受限的信息源
- CEO 总判断：今天是否有最多 3 个过线的新 idea 或重大旧 idea 更新；如果没有，
  说明已跑哪些补源轮次以及为什么仍 underfilled。不要为了凑数降低标准。

# Signal Portfolio

Use a table with at least 12 rows when possible:

| # | 信号桶 | 来源链接 | 日期/新鲜度 | 证据类型或用户原话摘要 | 当前替代方案 | 可触发的候选方向 |
|---:|---|---|---|---|---|---|

# 历史关联与新颖性

Use this table before final ideas:

| 候选 | 历史关系 | 关联旧 idea | 新增信息是否改变判断 | 处理 |
|---|---|---|---|---|

Allowed history relations: `new`, `update_existing`, `duplicate_of`, `revives`,
`merged_from`, `splits_from`, `adjacent_to`.

If a candidate is a duplicate or only a minor update, do not present it as a new
final idea.

# 候选池与迭代

| 轮次 | Idea | idea 来源类型 | 历史关系 | 来源信号数量 | 证据等级 | 主要反对意见 | 竞品结论 | CEO 处理 |
|---|---|---|---|---:|---|---|---|---|

If there are multiple rounds, explain why the previous round failed and what
sources, keywords, shapes, ICPs, competitor categories, or assumptions changed.
If fewer than 3 ideas pass, this section must show the replenish attempts.

# 今日新发现 / 旧 Idea 更新

Briefly separate:

- 今日新发现：new, splits_from, adjacent_to, or merged_from ideas that changed
  the opportunity space.
- 旧 idea 更新：update_existing or revives ideas with decision-changing new
  evidence.
- 重复驳回：duplicate_of ideas without decision-changing evidence.

# 最终过线 Idea（最多 3 个）

Only include ideas with verdict `推进` or strong `先验证` that match the user's
goal and are either new or materially changed. Do not include `暂缓`,
`不建议做`, internal-only tools, thin wrappers, pure duplicates, or minor backlog
updates as final ideas. Each final idea must use the same sections:

## Idea N：名称

- 一句话结论：推进 / 先验证 / 转向 / 暂缓 / 不建议做；置信度：低/中/高
- 历史关系：new / update_existing / duplicate_of / revives / merged_from /
  splits_from / adjacent_to；如果不是 new，说明关联的旧 idea 和判断变化
- idea 来源类型：direct pain / inference / product news / replica /
  competitor gap / ecosystem derivative / analogy / original hypothesis，用中文说明
- 这到底是什么：用 2-4 句把 idea 说成一个可理解的产品、工具、开源项目、
  SaaS、平台模块或工作流，不要只写抽象方向、研究主题或技术名词
- 具体使用方式：说明用户在什么场景/时刻使用它，输入什么，系统分析或执行
  什么，最后输出什么，以及它替代了用户现在的哪段手工动作
- 产品尺度判断 / 演化路径：说明当前最合理的产品尺度是小工具、开源项目、
  SaaS、平台模块、大产品方向还是混合型；如果建议从小切口验证，要说明这
  只是验证路径而不是长期上限；如果它本来应该按大产品思考，要写出大产品
  成立需要哪些额外假设
- 解决什么问题
- 目标用户 / 买方 / 开源受众
- 信息来源：3-6 条关键链接，含平台、日期/新鲜度、证据类型或原话摘要
- 当前替代方案
- 如何解决：MVP/小工具/开源组件工作流；首版只做什么，不做什么
- 产品形式：app / web app / GitHub OSS / CLI / MCP server / Skill / SDK /
  browser extension / GitHub Action / other
- 竞品判断：表格列直接竞品、间接替代、开源替代、平台内置能力；含采用度、价格/开源状态、体验缺口、是否充分解决核心痛点、差异化楔子
- 为什么仍值得做或为什么只适合改窄
- AI 杠杆
- Red Team 拷打记录
- 最危险假设
- 最短证据路径：只写当前最短、最低成本、能改变推进/停止判断的动作；不要机械写找 N 个用户/issue/maintainer
- 今日优先级：P0 / P1 / P2

# 被拒绝或暂缓的候选

List killed or paused candidates with specific reasons. For each, say whether it
failed by target mismatch, thin wrapper/platform absorption, weak pain, weak
distribution, mature substitutes, no repo asset, no short evidence path, or
personal/internal-only value. Do not attach generic validation plans.

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

If persistence failed or the environment was read-only, state that explicitly.
Do not leave the only detailed copy inside the chat transcript.

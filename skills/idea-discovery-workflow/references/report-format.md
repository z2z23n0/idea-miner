# Report Format

Final output must be Chinese Markdown and use this structure.

# 今日 Verdict

- 运行日期与时区
- 使用的角色：真实 sub-agent / 模拟角色
- 使用的内置发现流程：Trend Window / Source Modules / Review Mining /
  Product Feed / Opportunity Scoring / Adversarial Pass；若有步骤未做，说明原因
- 覆盖的信息源与信号桶
- 未覆盖或受限的信息源
- CEO 总判断：今天是否有 3 个能过线的 idea；不要为了凑数降低标准

# Signal Portfolio

Use a table with at least 12 rows when possible:

| # | 信号桶 | 来源链接 | 日期/新鲜度 | 证据类型或用户原话摘要 | 当前替代方案 | 可触发的候选方向 |
|---:|---|---|---|---|---|---|

# 候选池与迭代

| 轮次 | Idea | idea 来源类型 | 来源信号数量 | 证据等级 | 主要反对意见 | 竞品结论 | CEO 处理 |
|---|---|---|---:|---|---|---|---|

If there are multiple rounds, explain why the previous round failed and what
sources, keywords, shapes, or assumptions changed.

# 最终 3 个 Idea

Each final idea must use the same sections:

## Idea N：名称

- 一句话结论：推进 / 先验证 / 转向 / 暂缓 / 不建议做；置信度：低/中/高
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
- 7-14 天验证计划
- 今日优先级：P0 / P1 / P2

# 被拒绝或暂缓的候选

List at least 3 and give specific reasons.

# 角色冲突与 CEO 裁决

Record the main disagreements, evidence, and CEO decision.

# Skill Optimizer 观察

Only high-confidence actionable suggestions. If none, say so.

# Source Appendix

Deduplicate links and group by source.

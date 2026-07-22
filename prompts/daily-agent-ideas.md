使用 `daily-idea-miner` skill 运行今天的双轨 idea 日报。完整读取并遵守 `agent-idea-feed` 与 `personal-opportunity-scan` 两个子 skill；不要把两条线的筛选规则混用。

硬要求：

- 先读取 `node scripts/seen-store.mjs list` 和 `node scripts/opportunity-store.mjs list`，同时避开两类历史。
- 第一部分是 PR #13 定义的任务灵感线：
- 固定扫描 Upwork、Freelancer、PeoplePerHour、电鸭、实现网、猪八戒、chinese-independent-developer 七个来源。
- 每个来源恰好输出 3 个，共 21 个；不能把某个来源的名额挪到其他来源。
- 在合格任务里优先选择能做成单人直接使用的工作效率、信息处理、沟通、文档、创作和生活事务工具；需要企业采购、管理员部署、多席位协同或重行业实施的任务直接跳过。
- 第一层检索词只用 `agent`、`AI workflow`、`AI automation` / `AI 自动化`、`workflow` / `工作流`、`智能体`；中英文平台都尝试中英文词。
- 只把原始任务改写成“一眼能懂的完整任务型 Agent”，不照抄招聘标题。
- 这部分不做市场验证、可行性、竞品、技术方案、商业判断、bucket、评分、读者检查或 artifact 报告。
- 不得输出试炼场、夹具、回归、评测、观测、编排、治理、benchmark、checker、debugger 等 builder tooling。
- 第二部分是个人效率机会线：目标 3 个、最多 5 个；不够强可以少给，不能凑数。
- 只考虑个人日常或每周会直接使用、边界清楚、AI 参与核心任务闭环的工具。不要偏企业采购、团队治理、开发者基础设施，也不要把微信当成默认约束。
- 每个候选必须实时核验：海外真实验证信号、原产品为闭源或商业产品、国内没有成熟直接竞品、本地平台/数据/规则/习惯形成独立价值。简单汉化直接淘汰。
- 已有可直接使用的开源项目是硬淘汰项；国内已有成熟直接产品也是硬淘汰项。搜索失败或空结果不能当成“国内没有”。
- 先分别运行 `node scripts/seen-store.mjs check <feed.json>` 与 `node scripts/opportunity-store.mjs check <opportunities.json>`；两者都通过后再分别执行 `record`。
- 最终按 `daily-idea-miner` 模板给一份中文 Markdown 日报：先 21 个任务灵感，再给通过严格核验的个人效率机会，最后从两部分选个人最想玩的 5 个。不要汇报搜索流水账。

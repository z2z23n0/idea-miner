使用 `agent-idea-feed` skill 运行今天的 Agent idea feed。

硬要求：

- 固定扫描 Upwork、Freelancer、PeoplePerHour、电鸭、实现网、猪八戒、chinese-independent-developer 七个来源。
- 每个来源恰好输出 3 个，共 21 个；不能把某个来源的名额挪到其他来源。
- 先读取 `node scripts/seen-store.mjs list`，不得与指定历史任务最后输出或任何后续运行重复。
- 不读取或使用旧 Mainline idea intent、`~/.codex/data/idea-discovery`、旧 run artifact 或旧 automation memory；唯一历史来源是新的 seen-store。
- 第一层检索词只用 `agent`、`AI workflow`、`AI automation` / `AI 自动化`、`workflow` / `工作流`、`智能体`；中英文平台都尝试中英文词。
- 只把原始任务改写成“一眼能懂的完整任务型 Agent”，不照抄招聘标题。
- 不做市场验证、可行性、竞品、技术方案、商业判断、bucket、评分、读者检查或 artifact 报告。
- 不得输出试炼场、夹具、回归、评测、观测、编排、治理、benchmark、checker、debugger 等 builder tooling。
- 选定结果后用 `node scripts/seen-store.mjs record <run.json>` 记录全部 21 个，成功后再输出。
- 最终只给与 skill 模板一致的中文 Markdown 结果，并在末尾选出个人最想玩的五个；不要汇报搜索过程。

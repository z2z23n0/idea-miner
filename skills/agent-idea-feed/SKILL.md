---
name: agent-idea-feed
description: Turns concrete tasks from seven fixed public sources into a one-off or daily feed of interesting complete-task Agent ideas. Use when the user wants Agent ideas from Upwork-style marketplaces or chinese-independent-developer, especially when every source must contribute three concise, unseen ideas without validation or tooling-heavy reframing.
---

# Agent Idea Feed

这个 skill 只做一件事：从七个固定来源找到具体任务，把它们改写成有意思、能一句话讲清楚的完整任务型 Agent idea。

不要调用或复刻旧的 `idea-discovery-workflow`、`ai-founder-playbook`、thesis、bucket、Red Team、Competitor、CEO、Report Reader、candidate ledger、dossier 或 artifact checker。

不要读取或使用旧 Mainline idea intent、`~/.codex/data/idea-discovery`、旧 run artifact 或旧 automation memory。唯一历史来源是 `node scripts/seen-store.mjs list` 返回的种子和新运行记录。

## Quick start

1. 运行 `node scripts/seen-store.mjs list`，读取种子历史和以后所有运行。
2. 按固定来源和核心词检索，直到每个来源都有三个未出现过的具体任务。
3. 将任务改写成完整任务型 Agent，做任务级语义去重。
4. 用 `node scripts/seen-store.mjs record <run.json>` 检查并记录 21 个结果。
5. 只按固定 Markdown 模板返回结果。

详细检索、筛选、去重和格式要求见 [references/run-contract.md](references/run-contract.md)。

## 固定来源

按以下顺序输出，每个来源恰好 3 个：

1. Upwork
2. Freelancer
3. PeoplePerHour
4. 电鸭
5. 实现网
6. 猪八戒
7. chinese-independent-developer

名额不能跨来源移动。不要输出“最多三个”、不足说明、覆盖报告或补位解释；继续检索该来源，直到找到三个未出现过的具体任务。

## 固定检索词

国际和中文来源都要尝试中英文，第一层只使用：

- `agent`
- `AI workflow`
- `AI automation` / `AI 自动化`
- `workflow` / `工作流`
- `智能体`

`n8n`、`Dify`、`RPA`、`客服`、`外呼`、`审核` 等技术或场景词只能用于理解已有结果，不能作为第一层检索入口。

## 完整任务标准

合格 idea 必须能说清楚：用户给 Agent 什么，Agent 连续观察、判断和执行什么，用户最后得到什么结果。

优先选择真的替用户办事、有清晰输入和可见结果、一句话能想象出 demo、个人可能想做着玩的方向。

直接排除：泛招聘、开发服务、课程、导航站、模板、万能助手，以及试炼场、夹具库、回归室、评测台、观测平台、编排框架、治理系统、benchmark、checker、debugger 等 builder tooling。不要把原始业务需求擅自改写成可靠性、评测、审计或基础设施产品。

## 禁止展开

默认不做也不写市场验证、可行性、竞品、技术栈、架构、MVP、商业模式、定价、GTM、bucket、评分、排名、来源覆盖或搜索过程。

来源只是 idea 原材料。外包平台不等于需求验证，产品目录也不等于竞品库。

## 完成条件

- 恰好 21 个，七个来源各 3 个；
- 与种子历史和任何后续运行都不重复；
- 每个只有名字、完整任务描述和具体来源链接；
- 最后选五个个人最想玩的方向，不补充分析；
- `seen-store.mjs record` 已成功。

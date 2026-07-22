# idea-miner

[English](README.md)

`idea-miner` 是一个刻意保持简单的 Codex skill：每天从七个公开来源提取具体任务，再把它们改写成有意思、能一句话讲清楚的完整任务型 Agent idea。

每次固定输出 21 个：Upwork、Freelancer、PeoplePerHour、电鸭、实现网、猪八戒和 [chinese-independent-developer](https://github.com/1c7/chinese-independent-developer) 各 3 个。

每个 idea 只包含：

- 一个容易记住的 Agent 名字；
- 一到两句中文，说明它替用户完成什么完整任务；
- 原始来源链接。

默认运行不做市场验证、可行性分析、竞品研究、架构设计、评分和创业判断，也不把原始需求改写成评测实验室、夹具、回归室、观测平台、编排框架、治理系统、benchmark 或 checker。

## 运行契约

- 国际和中文来源统一使用核心词：`agent`、`AI workflow`、`AI automation` / `AI 自动化`、`workflow` / `工作流`、`智能体`。
- 每个来源继续检索到拿出恰好 3 个未出现过的 idea。
- 入选前必须与种子历史和后续所有运行做任务级去重。
- 报告最后选出个人最想玩的 5 个。

完整规则见 [skills/agent-idea-feed/SKILL.md](skills/agent-idea-feed/SKILL.md)。

## 去重记录

指定 Codex 任务最后一次输出的 21 个 idea 已写入 `data/seen-seed.jsonl`。后续运行的记录放在仓库外：

```text
~/.codex/data/agent-idea-feed/seen.jsonl
```

读取种子和后续记录：

```bash
node scripts/seen-store.mjs list
```

检查并记录一次完整运行：

```bash
node scripts/seen-store.mjs check /path/to/run.json
node scripts/seen-store.mjs record /path/to/run.json
```

可以用 `AGENT_IDEA_FEED_HOME` 修改运行数据目录。

## 定时运行

Codex 自动化使用 [prompts/daily-agent-ideas.md](prompts/daily-agent-ideas.md)，每天北京时间 10:15 执行。

## License

[MIT](LICENSE)

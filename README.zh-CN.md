# idea-miner

[English](README.md)

`idea-miner` 每天并行跑两条互补的 idea 发现线：

- **任务灵感线**：从七个公开来源提取具体任务，再把它们改写成有意思、能一句话讲清楚的完整任务型 Agent idea；
- **个人效率机会线**：寻找海外已经验证、国内还没有成熟直接替代的个人 AI 工具，判断它是否值得做成中国产品或开源替代。

任务灵感线每次固定输出 21 个：Upwork、Freelancer、PeoplePerHour、电鸭、实现网、猪八戒和 [chinese-independent-developer](https://github.com/1c7/chinese-independent-developer) 各 3 个。个人效率机会线目标输出 3 个，最多 5 个；没有足够强的候选时可以少于 3 个，不能凑数。

任务灵感线的每个 idea 只包含：

- 一个容易记住的 Agent 名字；
- 一到两句中文，说明它替用户完成什么完整任务；
- 原始来源链接。

两条线分工明确：任务灵感线不做市场验证和竞品研究；个人效率机会线必须核验海外验证、开源可替代性、国内直接竞品和真实本地化抓手。两条线都排除企业级平台、泛助手、builder tooling 和只有语言翻译价值的项目。

## 运行契约

- 国际和中文来源统一使用核心词：`agent`、`AI workflow`、`AI automation` / `AI 自动化`、`workflow` / `工作流`、`智能体`。
- 每个来源继续检索到拿出恰好 3 个未出现过的 idea。
- 入选前必须与种子历史和后续所有运行做任务级去重。
- 报告最后选出个人最想玩的 5 个。

完整规则分别见 [skills/agent-idea-feed/SKILL.md](skills/agent-idea-feed/SKILL.md)、[skills/personal-opportunity-scan/SKILL.md](skills/personal-opportunity-scan/SKILL.md) 和组合入口 [skills/daily-idea-miner/SKILL.md](skills/daily-idea-miner/SKILL.md)。

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

个人效率机会的历史种子在 `data/opportunity-seed.jsonl`，后续记录放在：

```text
~/.codex/data/personal-opportunity-scan/seen.jsonl
```

读取、检查和记录个人效率机会：

```bash
node scripts/opportunity-store.mjs list
node scripts/opportunity-store.mjs check /path/to/opportunities.json
node scripts/opportunity-store.mjs record /path/to/opportunities.json
```

可以用 `PERSONAL_OPPORTUNITY_HOME` 修改这部分运行数据目录。

## 定时运行

Codex 自动化使用 [prompts/daily-agent-ideas.md](prompts/daily-agent-ideas.md)，每天北京时间 10:15 执行两条发现线，并合并成一份日报。

## License

[MIT](LICENSE)

# idea-miner

[简体中文](README.zh-CN.md)

`idea-miner` is a deliberately small Codex skill that turns concrete tasks from seven public sources into a daily feed of interesting, complete-task Agent ideas.

Every run returns exactly 21 ideas: three each from Upwork, Freelancer, PeoplePerHour, 电鸭, 实现网, 猪八戒, and [chinese-independent-developer](https://github.com/1c7/chinese-independent-developer).

Each item contains only:

- a memorable Agent name;
- one or two Chinese sentences explaining the complete task it performs;
- the original source link.

The default run does not perform market validation, feasibility analysis, competitor research, architecture design, scoring, or startup advice. It also rejects builder-tooling reframes such as eval labs, fixtures, regression rooms, observability platforms, orchestrators, governance systems, benchmarks, and checkers.

## Run contract

- Search both international and Chinese sources with the same core vocabulary: `agent`, `AI workflow`, `AI automation` / `AI 自动化`, `workflow` / `工作流`, and `智能体`.
- Keep searching each source until it contributes exactly three unseen ideas.
- Compare candidates with the seed history and every later run before selection.
- End each report with five personal favorites.

The full contract lives in [skills/agent-idea-feed/SKILL.md](skills/agent-idea-feed/SKILL.md).

## Seen store

The 21 ideas from the reference Codex task are seeded in `data/seen-seed.jsonl`. New runs are recorded outside the repository under:

```text
~/.codex/data/agent-idea-feed/seen.jsonl
```

Inspect the combined history with:

```bash
node scripts/seen-store.mjs list
```

Validate and record a complete run with:

```bash
node scripts/seen-store.mjs check /path/to/run.json
node scripts/seen-store.mjs record /path/to/run.json
```

Set `AGENT_IDEA_FEED_HOME` to use another runtime data directory.

## Automation

The Codex automation uses [prompts/daily-agent-ideas.md](prompts/daily-agent-ideas.md) and runs every day at 10:15 Asia/Shanghai.

## License

[MIT](LICENSE)

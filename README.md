# idea-miner

[简体中文](README.zh-CN.md)

`idea-miner` runs two complementary daily discovery tracks:

- a **task feed** that turns concrete work from seven public sources into memorable, complete-task Agent ideas;
- a **personal-productivity opportunity scan** for overseas AI products that are validated abroad but still lack a mature direct substitute in China.

The task feed returns exactly 21 ideas: three each from Upwork, Freelancer, PeoplePerHour, 电鸭, 实现网, 猪八戒, and [chinese-independent-developer](https://github.com/1c7/chinese-independent-developer). The opportunity scan targets three and allows at most five; it may stay underfilled rather than lower the bar.

Each task-feed item contains only:

- a memorable Agent name;
- one or two Chinese sentences explaining the complete task it performs;
- the original source link.

The two tracks intentionally use different gates. The task feed does not perform market validation or competitor research. The opportunity scan must verify overseas adoption, source availability, direct Chinese competitors, and a localization wedge beyond translation. Both tracks reject enterprise platforms, generic assistants, and builder-tooling reframes.

## Run contract

- Search both international and Chinese sources with the same core vocabulary: `agent`, `AI workflow`, `AI automation` / `AI 自动化`, `workflow` / `工作流`, and `智能体`.
- Keep searching each source until it contributes exactly three unseen ideas.
- Compare candidates with the seed history and every later run before selection.
- End each report with five personal favorites.

The contracts live in [skills/agent-idea-feed/SKILL.md](skills/agent-idea-feed/SKILL.md), [skills/personal-opportunity-scan/SKILL.md](skills/personal-opportunity-scan/SKILL.md), and the combined entry point [skills/daily-idea-miner/SKILL.md](skills/daily-idea-miner/SKILL.md).

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

Personal-productivity opportunities use `data/opportunity-seed.jsonl` plus a runtime store at:

```text
~/.codex/data/personal-opportunity-scan/seen.jsonl
```

Inspect, validate, and record this track with:

```bash
node scripts/opportunity-store.mjs list
node scripts/opportunity-store.mjs check /path/to/opportunities.json
node scripts/opportunity-store.mjs record /path/to/opportunities.json
```

Set `PERSONAL_OPPORTUNITY_HOME` to use another runtime data directory.

## Automation

The Codex automation uses [prompts/daily-agent-ideas.md](prompts/daily-agent-ideas.md), runs both tracks, and returns one report every day at 10:15 Asia/Shanghai.

## License

[MIT](LICENSE)

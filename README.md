# idea-miner

Automatic startup and open-source idea mining for agents.

`idea-miner` helps an agent turn fresh public signals into startup and
open-source project candidates. It scans places like Hacker News, Reddit,
GitHub issues, Product Hunt, release notes, developer forums, review sites, and
product news, then organizes the evidence into a small set of ideas with
competitor context, risk notes, shortest evidence paths, and stop lines.

The repo contains two agent skills plus a few helper scripts. The skills define
the research workflow, source policy, role contracts, pressure-test rubrics,
report format, and local evidence memory format.

## What It Produces

- A **Signal Portfolio** grouped by pain points, product news, competitor gaps,
  open-source ecosystem changes, reviews, and short-term trend windows.
- Candidate startup and open-source ideas with target users, usage moments,
  expected inputs and outputs, MVP shape, AI leverage, and shortest evidence
  paths.
- Competitor and substitute checks for serious candidates.
- Red Team objections, dangerous assumptions, and CEO-style decisions:
  advance, narrow, pause, or reject.
- A Chinese report that can be read as a daily or weekly research memo.
- Optional local JSONL memory for signals, ideas, competitors, claims,
  decisions, and evidence edges.
- Handoff-ready idea dossiers so a later one-line handoff request can package
  the stored context without repeating source discovery.

## How It Works

```text
prepare_run
  -> load_history
  -> collect_signals
  -> normalize_signals
  -> draft_candidates
  -> fit_gate
  -> history_relation_gate
  -> hard_gate
  -> critic_review
  -> competitor_check
  -> ceo_decision
  -> replenish_if_underfilled
  -> persist_memory
  -> render_report
  -> persist_run_artifacts
```

The default run is rigorous and source-first. Unless the user explicitly gives
topics, the scout starts from current source-native feeds instead of fixed
standing keywords. Keywords are derived later from promising raw signals to
enrich evidence, search competitors, and test repeatability. Weak candidates are
killed before long write-ups, and fewer than three passing ideas triggers
replenish rounds with new source-native feeds, communities, ICPs, product
shapes, or evidence types. If the runtime provides real sub-agent or multi-agent
tools, the same role contracts can be dispatched. If it does not, one agent can
simulate the roles and label the report accordingly.

The useful output is the evidence-to-decision chain: where a signal came from,
which idea it supports, whether it is new or related to prior ideas, what
alternatives already exist, why the idea survived or failed review, and what
shortest evidence path would actually change the decision.

Recurring runs also save per-idea dossiers. Handoff should be a packaging step:
read the stored dossier, write a temporary handoff file, and avoid web refreshes
unless the user explicitly asks for current status.

## Skills

| Skill | Role |
|---|---|
| `idea-discovery-workflow` | Runs the research workflow: source plan, roles, Signal Portfolio, evidence memory, and report format |
| `ai-founder-playbook` | Judges the ideas: pressure tests, competitor reasoning, commercial/open-source split, shortest evidence paths, and launch support |

The split keeps orchestration and judgment separate. A scheduled run can use
`idea-discovery-workflow` to gather and normalize evidence, then call on
`ai-founder-playbook` when ideas need pressure testing, competitor checks, or a
decision-changing next action.

## Signal Sources

| Bucket | Examples |
|---|---|
| Pain / complaints | Reddit and HN threads, GitHub issues, low reviews, workarounds, "I wish there was..." |
| Product / platform news | Official blogs, release notes, changelogs, Show HN, Product Hunt, new agent/devtool features |
| Competitor gaps | Closed source, no self-hosting, expensive pricing, poor docs, complex setup, slow issue response |
| Open-source ecosystem | GitHub topics, trending projects, releases, stars/forks, PRs, tutorials, dependencies |
| Trend windows | Repeated signals across multiple communities in the last 7-30 days |
| Reviews / evaluations | G2, Capterra, Chrome Web Store, App Store, Product Hunt comments, blog/video reviews |

Default discovery should not begin with standing topic keywords. It should first
sample current source feeds, then use a fit gate to keep software, OSS,
automation, CLI, MCP, Skill, SDK, browser extension, SaaS, data-product, and
agent-workflow opportunities. Physical goods, local services, inventory,
hardware manufacturing, offline logistics, and pure operations plays are
filtered unless they can be clearly reframed as software.

## Report Format

The default report includes:

- Today's verdict.
- Covered and uncovered sources.
- Signal Portfolio.
- Candidate pool and iteration history.
- History relation and novelty handling: new, update_existing, duplicate_of,
  revives, merged_from, splits_from, adjacent_to.
- Final ideas with problem, target user, sources, current alternatives, MVP
  shape, competitor table, AI leverage, objections, assumptions, priority, and
  shortest evidence path.
- Rejected or paused candidates.
- Role conflicts and CEO decisions.
- Source appendix.

## Quick Start

Install the skills into an agent-readable skills directory and initialize the
local evidence store.

For Codex:

```bash
git clone git@github.com:z2z23n0/idea-miner.git
cd idea-miner
node scripts/install-local.mjs
```

For another agent runtime:

```bash
node scripts/install-local.mjs \
  --skills-dir=/path/to/skills \
  --data-dir=/path/to/idea-miner-data
```

Preview actions without changing files:

```bash
node scripts/install-local.mjs --dry-run
```

Overwrite existing local skill copies:

```bash
node scripts/install-local.mjs --force
```

Symlink instead of copying, useful while editing the repo:

```bash
node scripts/install-local.mjs --link --force
```

## Scheduled Runs

Use `prompts/codex-automation-default.md` as a ready-made scheduled-run prompt
for Codex, or adapt the same instructions for another agent runtime.

The schedule belongs to the host environment. Keep the prompt focused on the
run objective, source preferences, exclusions, and output expectations.

Optional customization can be appended from:

```text
prompts/customization-block.md
```

Customization examples:

```text
主要关注主题：AI coding agents, MCP, developer tools
排除方向：consumer apps, crypto, generic SEO
偏好形态：CLI / GitHub OSS / MCP server / Skill / browser extension
成功标准：GitHub stars / real installs / paid SaaS / mixed OSS-commercial
```

## Helper Scripts

`scripts/install-local.mjs`

Installs both skills into a target skills directory and initializes local
runtime data.

```bash
node scripts/install-local.mjs --dry-run
node scripts/install-local.mjs --force
node scripts/install-local.mjs --link --force
node scripts/install-local.mjs --skills-dir=/path/to/skills --data-dir=/path/to/data
```

`skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs`

Generates a source-first scouting plan, fit gate, Signal Portfolio template,
history-relation table, candidate scoring table, and Red Team questions. With
explicit topics it also generates topic-guided enrichment queries. It creates a
structured search plan; it does not browse the web.

```bash
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs "AI coding agents" "MCP"
```

`skills/idea-discovery-workflow/scripts/init-store.mjs`

Creates the local JSONL evidence store.

```bash
node skills/idea-discovery-workflow/scripts/init-store.mjs
```

`skills/idea-discovery-workflow/scripts/idea-handoff.mjs`

Resolves a stored idea by name or alias and copies its handoff-ready dossier to
a temporary handoff file. It does not browse the web.

```bash
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs "Tool-Call Compatibility"
```

## Runtime Data and Privacy

Runtime data lives outside this repository. Set `IDEA_MINER_HOME` to choose a
store location. The scripts also honor the legacy `CODEX_IDEA_DISCOVERY_HOME`
variable for existing installs. Helper scripts prefer an explicit root, then
reuse an existing readable store under `~/.idea-miner` or
`~/.codex/data/idea-discovery` before creating a new empty store. If no existing
store is found, the default store is:

```text
~/.idea-miner/
```

The store is graph-shaped but starts as JSONL:

```text
signals.jsonl
ideas.jsonl
claims.jsonl
competitors.jsonl
decisions.jsonl
edges.jsonl
runs/<run_id>/
  run-manifest.json
  report.md
  source-notes.jsonl
  signal-portfolio.jsonl
  ideas/<idea_id>.json
  ideas/<idea_id>.md
  handoff-index.md
```

The top-level JSONL files are indexes. The detailed context for each final or
resumable paused idea belongs in `runs/<run_id>/ideas/<idea_id>.md`, with source
links, source-to-claim mapping, competitor reasoning, Red Team records, CEO
decisions, MVP boundaries, shortest evidence paths, and stop lines.

Keep runtime data, automation configs, API keys, edit tokens, private source
lists, private idea priorities, and private contact targets out of the
repository.

## Repository Layout

```text
prompts/
  codex-automation-default.md
  customization-block.md
scripts/
  install-local.mjs
skills/
  ai-founder-playbook/
  idea-discovery-workflow/
```

## Notes

This repo stores reusable skill instructions, workflow references, and helper
scripts. Private automation configuration, historical idea runs, edit tokens,
API keys, and personal signal/backlog data belong in the local runtime store.

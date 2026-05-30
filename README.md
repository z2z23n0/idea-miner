# idea-miner

Automatic startup and open-source idea mining for agents.

`idea-miner` helps an agent turn high-imagination AI-era theses into startup and
open-source product bets. It starts from thesis generation, sketches product/OSS
bets, then scans places like Hacker News, Reddit, GitHub issues, Product Hunt,
release notes, developer forums, review sites, and product news to kill,
sharpen, or de-risk those bets.

The repo contains two agent skills plus a few helper scripts. The skills define
the research workflow, source policy, role contracts, pressure-test rubrics,
report format, and local evidence memory format.

## What It Produces

- A **Discovery Thesis** portfolio for AI-native products, agent workflows, AI
  coding, AI infra, and high-star OSS opportunities.
- Product/OSS bet sketches with target users, usage moments, 30-second demo
  moments, repo/star assets, AI relevance, MVP shape, and shortest evidence
  paths.
- Competitor and substitute checks for serious candidates.
- Red Team objections, dangerous assumptions, and CEO-style decisions:
  advance, narrow, pause, or reject.
- A Chinese report that can be read as a daily or weekly research memo.
- Optional local JSONL memory for signals, ideas, competitors, claims,
  decisions, and evidence edges.
- Handoff-ready idea dossiers so a later one-line handoff request can package
  the stored context without repeating source discovery.
- Optional new-session handoffs in Codex: one idea can be sent to a fresh
  session, and multiple ideas default to separate fresh sessions.

## How It Works

```text
prepare_run
  -> load_history
  -> generate_thesis_portfolio
  -> sketch_product_oss_bets
  -> collect_evidence
  -> normalize_signals
  -> ai_relevance_gate
  -> product_oss_promotion_gate
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

The default run is rigorous and thesis-first. Unless the user explicitly asks
for a narrow scan, the scout starts by generating AI-era theses and product/OSS
bet sketches. Evidence comes later as a brake: it supports, challenges, kills,
or sharpens bets; it is not the primary imagination source. Weak candidates are
killed before long write-ups, and fewer than three passing bets triggers
replenish rounds with new thesis seeds, product archetypes, demo moments,
repo/star assets, ICPs, or source modules. If the runtime provides real
sub-agent or multi-agent tools, the same role contracts can be dispatched. If it
does not, one agent can simulate the roles and label the report accordingly.

The useful output is the thesis-to-decision chain: what bet the run is making,
why now, how it could become a product or high-star OSS project, what evidence
supports or kills it, why it survived review, and what shortest evidence path
would actually change the decision.

Recurring runs also save per-idea dossiers. Handoff should be a packaging step:
read the stored dossier, write a temporary handoff file, and avoid web refreshes
unless the user explicitly asks for current status.

When the host runtime exposes Codex thread/session tools, a handoff can also be
delivered directly into new sessions. By default, multiple ideas are handed off
to separate sessions; use an explicit "same session" or "combined" instruction
when one shared session is desired. Plain new-session handoffs should only make
the receiving session confirm the context and wait. They should not start
research or implementation unless requested.

## Skills

| Skill | Role |
|---|---|
| `idea-discovery-workflow` | Runs the research workflow: thesis portfolio, product/OSS bets, source plan, roles, evidence memory, and report format |
| `ai-founder-playbook` | Judges the ideas: pressure tests, competitor reasoning, commercial/open-source split, shortest evidence paths, and launch support |

The split keeps orchestration and judgment separate. A scheduled run can use
`idea-discovery-workflow` to gather and normalize evidence, then call on
`ai-founder-playbook` when ideas need pressure testing, competitor checks, or a
decision-changing next action.

## Signal Sources

| Bucket | Examples |
|---|---|
| AI / platform shifts | Model, agent, API, pricing, policy, protocol, and devtool changes |
| OSS mindshare | GitHub trending/new repos, demos, benchmarks, standards, playgrounds, stars/forks |
| Pain / complaints | Reddit and HN threads, GitHub issues, low reviews, workarounds, "I wish there was..." |
| Product / platform news | Official blogs, release notes, changelogs, Show HN, Product Hunt, new agent/devtool features |
| Competitor gaps | Closed source, no self-hosting, expensive pricing, poor docs, complex setup, slow issue response |
| Open-source ecosystem | GitHub topics, trending projects, releases, stars/forks, PRs, tutorials, dependencies |
| Trend windows | Repeated signals across multiple communities in the last 7-30 days |
| Reviews / evaluations | G2, Capterra, Chrome Web Store, App Store, Product Hunt comments, blog/video reviews |

Default discovery should not begin with standing topic keywords or complaint
mining. It should first generate thesis seeds and product/OSS bet sketches, then
use sources to support, challenge, kill, or sharpen those bets. Final ideas
should be AI-core, AI-native workflow, or exceptional non-AI product/OSS bets.
GitHub Actions, CI gates, PR comments, templates, hooks, checklists, and thin
wrappers can be integration surfaces, but not the final idea body.

## Report Format

The default report includes:

- Today's verdict.
- Discovery Thesis.
- Product / OSS Bet Sketches.
- Evidence Sweep.
- Covered and uncovered sources.
- Candidate pool and iteration history.
- Promotion Gate: AI relevance, product/OSS scale, and Action/CI/PR-only veto.
- History relation and novelty handling: new, update_existing, duplicate_of,
  revives, merged_from, splits_from, adjacent_to.
- Final product/OSS bets with core thesis, AI relevance, 30-second demo,
  repo/star asset, target user, sources, alternatives, MVP shape, competitor
  table, AI leverage, objections, assumptions, priority, and shortest evidence
  path.
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
主要关注 thesis：agent-readable software, AI coding aftershocks, high-star AI OSS
排除方向：consumer apps, crypto, generic SEO
偏好形态：complete product / high-star GitHub OSS / MCP server / Skill / SDK
成功标准：AI-core product / AI-native workflow / GitHub stars / real installs / paid SaaS
不算 final：GitHub Action-only / CI gate / PR comment / thin wrapper
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

Generates a thesis-first scouting plan, thesis seeds, product/OSS bet sketch
template, AI relevance and promotion gates, evidence sweep template,
history-relation table, and Red Team questions. With explicit topics it treats
them as thesis constraints and adds topic-guided evidence queries. It creates a
structured plan; it does not browse the web.

```bash
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs "AI coding agents" "MCP"
```

`skills/idea-discovery-workflow/scripts/init-store.mjs`

Creates the local JSONL evidence store.

```bash
node skills/idea-discovery-workflow/scripts/init-store.mjs
```

`skills/idea-discovery-workflow/scripts/validate-run-artifacts.mjs`

Checks a completed run for reader clarity and artifact completeness: report
sections, per-idea dossiers, product/OSS cards, AI relevance, promotion gates,
30-second demo, repo/star asset, source notes, source-backed claims, competitor
reasoning, MVP/non-goals, shortest evidence path, and stop lines.

```bash
node skills/idea-discovery-workflow/scripts/validate-run-artifacts.mjs ~/.idea-miner/runs/<run_id>
```

`skills/idea-discovery-workflow/scripts/idea-handoff.mjs`

Resolves a stored idea by name or alias and copies its handoff-ready dossier to
a temporary handoff file. With `--session-prompt`, it also writes a prompt that
can be passed to a fresh Codex session. It does not browse the web or create
sessions by itself.

```bash
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs "Tool-Call Compatibility"
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs --session-prompt --idea "Tool-Call Compatibility"
node skills/idea-discovery-workflow/scripts/idea-handoff.mjs --session-prompt --idea "Idea A" --idea "Idea B"
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
handoff-events.jsonl
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
decisions, core thesis, AI relevance, promotion-gate result, demo moment,
repo/star assets, MVP boundaries, shortest evidence paths, and stop lines.

`handoff-events.jsonl` records delivery events such as "idea X was handed off
to Codex thread Y", so later follow-up questions do not have to depend on chat
history.

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

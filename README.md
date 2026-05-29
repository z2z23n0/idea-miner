# idea-miner

Codex skills for evidence-based product and open-source idea discovery.

`idea-miner` is not an "automatic startup idea generator." It is a repeatable
research workflow for turning messy external signals into a small number of
ideas that can be pressure-tested, compared against competitors, and validated
in 7-14 days.

It is built for people who want to mine opportunities from places like Hacker
News, Reddit, GitHub issues, Product Hunt, release notes, developer forums,
review sites, and product/platform news without lowering the bar to generic
brainstorming.

## What It Does

- Builds a **Signal Portfolio** from pain points, product news, competitor
  gaps, open-source ecosystem signals, reviews, and short-term trend windows.
- Drafts candidate ideas across multiple shapes: commercial products,
  open-source projects, CLI tools, MCP servers, Codex/ChatGPT Skills, browser
  extensions, SDKs, GitHub Actions, templates, scripts, and agent workflows.
- Separates **commercial product success** from **open-source project success**:
  revenue/budget/buyer path vs installs, stars, forks, issues, PRs, tutorials,
  ecosystem references, and real workflow dependency.
- Uses role-based review: Signal Scout, Idea Drafter, Red Team, Competitor
  Investigator, CEO/Orchestrator, and Skill Optimizer.
- Treats competitors carefully: the existence of a competitor is not automatic
  rejection; adoption, satisfaction, price, openness, UX, distribution, and
  "good enough" substitutes all matter.
- Produces a fixed Chinese report with final ideas, rejected candidates,
  conflicts, CEO decisions, source appendix, and validation plans.
- Optionally stores graph-shaped evidence locally as JSONL so future runs can
  remember signals, ideas, competitors, claims, and decisions.

## Architecture

This repo contains two skills that are meant to work together.

| Skill | Role |
|---|---|
| `idea-discovery-workflow` | Orchestration layer: workflow DAG, role contracts, source policy, Signal Portfolio, evidence memory, and report format |
| `ai-founder-playbook` | Judgment layer: idea pressure testing, competitor analysis, commercial/open-source split, validation plans, launch/distribution support |

The split is intentional:

- `idea-discovery-workflow` answers: "How do we run the daily research process?"
- `ai-founder-playbook` answers: "Is this idea actually worth validating?"

## Implementation Model

The system is intentionally simple:

- **Skills hold the reusable method.** The two `SKILL.md` files and their
  references define the process, roles, rubrics, source policy, output format,
  and pressure-test rules.
- **The automation prompt stays thin.** A Codex automation should say what kind
  of recurring run to perform, what topics or exclusions to prefer, and which
  skills to use. It should not duplicate the full workflow.
- **Helper scripts provide scaffolding, not magic.** They initialize local
  storage and generate search/query templates. They do not replace real web
  verification or judgment.
- **Runtime memory is external.** Signals, ideas, competitors, claims,
  decisions, and edges live in local JSONL files outside the repo. This keeps
  reusable methodology separate from private research history.
- **The workflow can be simulated or agentic.** If Codex has real sub-agent or
  workflow tooling, the roles can be dispatched. If not, the same role contract
  is executed in one run and clearly labeled as simulated.

In practice, `idea-miner` behaves like a lightweight research operating system:
Codex gathers current evidence, normalizes it into a Signal Portfolio, drafts
ideas, attacks them, checks competitors, records decisions, and renders a
stable report. The important part is not "more agents"; it is preserving the
evidence-to-decision chain so the output is auditable instead of vibes.

## How a Run Works

```text
prepare_run
  -> collect_signals
  -> normalize_signals
  -> draft_candidates
  -> critic_review
  -> competitor_check
  -> ceo_decision
  -> persist_memory
  -> render_report
```

The workflow is cheap by default. It should use real sub-agents or multi-agent
tools only when the environment provides them and the candidate is worth the
extra cost. Otherwise it simulates the roles in one run and says so in the
report.

Parallelism is useful for independent source modules and critic perspectives.
It is not useful for unconstrained brainstorming by many agents.

## Signal Sources

The workflow does not only search for explicit complaints. It combines several
signal buckets:

| Bucket | Examples |
|---|---|
| Pain / complaints | Reddit/HN threads, GitHub issues, low reviews, workarounds, "I wish there was..." |
| Product / platform news | official blogs, release notes, changelogs, Show HN, Product Hunt, new agent/devtool features |
| Competitor gaps | closed source, no self-hosting, expensive pricing, poor docs, complex setup, slow issues |
| Open-source ecosystem | GitHub topics/trending/releases, stars/forks, PRs, tutorials, dependencies |
| Trend window | repeated signals across multiple communities in the last 7-30 days |
| Reviews / evaluations | G2, Capterra, Chrome Web Store, App Store, Product Hunt comments, blog/video reviews |

The goal is not to chase hype. A single viral post or product launch is only a
trigger. Final ideas still need evidence, competitor checks, Red Team review,
and a falsifiable validation plan.

## Output

The default report includes:

- Today's verdict
- Covered and uncovered sources
- Signal Portfolio
- Candidate pool and iteration history
- Final ideas, each with the same sections:
  - problem
  - target user / buyer / open-source audience
  - sources
  - current alternatives
  - MVP / small-tool workflow
  - product shape
  - competitor table
  - why it is still worth doing or should be narrowed
  - AI leverage
  - Red Team objections
  - dangerous assumptions
  - 7-14 day validation plan
  - priority
- Rejected or paused candidates
- Role conflicts and CEO decisions
- Skill Optimizer observations
- Source appendix

## Quick Start

Clone the repo and install the skills locally:

```bash
git clone git@github.com:z2z23n0/idea-miner.git
cd idea-miner
node scripts/install-local.mjs
```

This copies both skills into `~/.codex/skills/` and initializes the local
evidence store under:

```text
~/.codex/data/idea-discovery/
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

## Codex Automation

Create a Codex automation and paste the default prompt from:

```text
prompts/codex-automation-default.md
```

Set the schedule in Codex itself. Do not put the schedule inside the prompt.

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

Installs both skills into a Codex skills directory and initializes local runtime
data.

```bash
node scripts/install-local.mjs --dry-run
node scripts/install-local.mjs --force
node scripts/install-local.mjs --link --force
node scripts/install-local.mjs --skills-dir=/path/to/skills --data-dir=/path/to/data
```

`skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs`

Generates a query pack, source-module checklist, Signal Portfolio template,
candidate scoring table, and Red Team questions. It does not browse the web;
it creates a structured search plan.

```bash
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs "AI coding agents" "MCP"
```

`skills/idea-discovery-workflow/scripts/init-store.mjs`

Creates the local JSONL evidence store.

```bash
node skills/idea-discovery-workflow/scripts/init-store.mjs
```

## Runtime Data and Privacy

Runtime data is intentionally not stored in this repository. Idea signals,
decisions, backlog items, and outreach targets should live outside the repo,
for example under:

```text
~/.codex/data/idea-discovery/
```

The store is graph-shaped but starts as JSONL:

```text
signals.jsonl
ideas.jsonl
claims.jsonl
competitors.jsonl
decisions.jsonl
edges.jsonl
runs/
```

Do not commit runtime data, automation configs, API keys, edit tokens, private
source lists, private idea priorities, or outreach targets.

## When to Use It

Use it when you want:

- recurring product/open-source idea discovery;
- a daily or weekly idea research automation;
- structured competitor and substitute checks;
- multi-role debate around high-uncertainty ideas;
- a local evidence trail for why an idea was advanced, narrowed, paused, or
  rejected.

Do not use it when you only need a quick one-off brainstorm, a generic trend
summary, or a simple list of startup ideas without verification.

## Layout

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
scripts. It should not contain private automation configuration, historical
idea runs, edit tokens, API keys, or personal signal/backlog data.

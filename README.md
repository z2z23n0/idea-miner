# idea-miner

Codex skills for evidence-based product and open-source idea discovery.

This repository currently contains two skills:

- `ai-founder-playbook`: judgment layer for pressure testing ideas, scanning
  competitors, distinguishing commercial vs open-source success criteria, and
  planning validation.
- `idea-discovery-workflow`: orchestration layer for recurring idea discovery,
  Signal Portfolio collection, role-based review, evidence memory, and report
  generation.

The skills are designed to work together: `idea-discovery-workflow` runs the
discovery pipeline, and `ai-founder-playbook` supplies the founder/open-source
judgment.

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

To preview actions without changing files:

```bash
node scripts/install-local.mjs --dry-run
```

To overwrite existing local copies:

```bash
node scripts/install-local.mjs --force
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

Runtime data is intentionally not stored in this repository. Idea signals,
decisions, backlog items, and outreach targets should live outside the repo,
for example under:

```text
~/.codex/data/idea-discovery/
```

## Notes

This repo stores reusable skill instructions, workflow references, and helper
scripts. It should not contain private automation configuration, historical
idea runs, edit tokens, API keys, or personal signal/backlog data.

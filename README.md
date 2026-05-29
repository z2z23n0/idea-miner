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

## Layout

```text
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

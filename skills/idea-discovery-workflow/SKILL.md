---
name: idea-discovery-workflow
description: Use when running or designing recurring product/open-source idea discovery, daily or scheduled idea mining, Signal Portfolio workflows, multi-role Scout/Critic/Competitor/CEO evaluation, evidence-to-decision pipelines, idea backlog memory, or automation prompts for finding product, open-source, CLI, MCP, Skill, agent workflow, and developer-tool ideas. This skill orchestrates discovery and uses ai-founder-playbook for judgment, pressure testing, competitor analysis, and validation plans.
---

# Idea Discovery Workflow

Use this skill as the orchestration layer for recurring idea discovery. It turns
community signals, product/platform news, competitor gaps, and open-source
ecosystem changes into a small number of rigorously reviewed ideas.

This skill is intentionally separate from `ai-founder-playbook`:

- `idea-discovery-workflow` owns workflow, roles, evidence memory, run artifacts,
  report shape, and automation integration.
- `ai-founder-playbook` owns founder/open-source judgment: pressure tests,
  market scans, competitor reasoning, scoring, validation plans, and launch
  advice.

## Core Run

For a normal run, load only the references needed for the task:

1. Read [source-policy.md](references/source-policy.md) to build the signal plan.
2. Read [workflow.md](references/workflow.md) for the DAG and iteration gates.
3. Read [role-contracts.md](references/role-contracts.md) when assigning real or
   simulated roles.
4. Read [report-format.md](references/report-format.md) before rendering the final
   report.
5. Read [memory-schema.md](references/memory-schema.md) when persisting or reading
   historical signals, ideas, competitors, decisions, or graph edges.

Use `ai-founder-playbook` during Candidate Draft, Critic Review, Competitor
Check, CEO Decision, and Validation Plan. Do not duplicate its rubrics here.

## Built-In Scripts

- `scripts/idea-scout-kit.mjs <topic...>` generates query packs, source-module
  checklists, Signal Portfolio templates, candidate scoring tables, and Red Team
  questions. It does not fetch the web; use it to plan and normalize searches.
- `scripts/init-store.mjs` creates the local JSONL evidence store under
  `${CODEX_IDEA_DISCOVERY_HOME:-$HOME/.codex/data/idea-discovery}`.

## Execution Rules

- Always use current web/realtime tools for current claims, competitors,
  adoption, pricing, releases, and source freshness.
- If a source cannot be accessed, mark it `未覆盖/受限`; do not infer content.
- Default to a cheap sequential workflow. Use real sub-agents or multi-agent
  tools only when available and useful; otherwise simulate roles and state that.
- Use expensive debate only for high-disagreement or high-value candidates.
- Do not lower the bar to produce exactly 3 ideas. Output the actual number that
  passes.
- Keep full reports as normal Markdown before heartbeat XML.

## Automation Prompt Boundary

Automations should stay thin: schedule, destination, language, display rule, and
the instruction to run this skill using `ai-founder-playbook`. The detailed
workflow should live in this skill, not inside the automation prompt.

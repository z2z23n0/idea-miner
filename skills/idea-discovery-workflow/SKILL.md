---
name: idea-discovery-workflow
description: Use when running or designing recurring product/open-source idea discovery, daily or scheduled idea mining, Signal Portfolio workflows, multi-role Scout/Critic/Competitor/CEO evaluation, evidence-to-decision pipelines, idea backlog memory, idea handoffs, handoff-ready idea dossiers, or automation prompts for finding product, open-source, CLI, MCP, Skill, agent workflow, and developer-tool ideas. This skill orchestrates discovery and uses ai-founder-playbook for judgment, pressure testing, competitor analysis, and shortest evidence paths.
---

# Idea Discovery Workflow

Use this skill as the orchestration layer for recurring idea discovery. It turns
community signals, product/platform news, competitor gaps, and open-source
ecosystem changes into a small number of rigorously reviewed ideas.

This skill is intentionally separate from `ai-founder-playbook`:

- `idea-discovery-workflow` owns workflow, roles, evidence memory, run artifacts,
  report shape, and automation integration.
- `ai-founder-playbook` owns founder/open-source judgment: pressure tests,
  market scans, competitor reasoning, scoring, shortest evidence paths, and
  launch advice.

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
6. Read [handoff-mode.md](references/handoff-mode.md) when the user asks to
   hand off one or more stored ideas.

Use `ai-founder-playbook` during Candidate Draft, Critic Review, Competitor
Check, CEO Decision, and Validation Plan. Do not duplicate its rubrics here.

## Built-In Scripts

- `scripts/idea-scout-kit.mjs <topic...>` generates query packs, source-module
  checklists, Signal Portfolio templates, candidate scoring tables, and Red Team
  questions. It does not fetch the web; use it to plan and normalize searches.
- `scripts/init-store.mjs` creates the local JSONL evidence store under
  `${IDEA_MINER_HOME:-$HOME/.idea-miner}`. It also honors the legacy
  `CODEX_IDEA_DISCOVERY_HOME` variable for existing installs.
- `scripts/idea-handoff.mjs <idea name...>` resolves a stored idea dossier and
  copies it into a temporary handoff file. It does not browse the web.

## Execution Rules

- Always use current web/realtime tools for current claims, competitors,
  adoption, pricing, releases, and source freshness.
- If a source cannot be accessed, mark it `未覆盖/受限`; do not infer content.
- Default to a rigorous replenish workflow. Use real sub-agents or multi-agent
  tools when they help cover more sources, run independent critique, or refill
  the candidate pool after vetoes; otherwise simulate roles and state that.
- Use expensive debate only for high-disagreement or high-value candidates.
- Aim to return 3 ideas that pass the current standard. Do not lower the bar to
  fill three slots; if fewer than 3 pass, treat it as an underfilled run and
  show the replenishment rounds and why coverage was exhausted.
- Keep full reports as normal Markdown before any host-specific control block.
- For every final idea, persist a handoff-ready dossier. Persist a paused dossier
  only for a strong idea that narrowly missed a known evidence gap; do not save
  vetoed, weak, internal-only, or "could be a small tool" ideas as handoff work.
  Later handoff requests should read the stored dossier first and should not
  repeat source discovery unless the user explicitly asks for a current refresh.

## Automation Prompt Boundary

Automations should stay thin: schedule, destination, language, display rule, and
the instruction to run this skill using `ai-founder-playbook`. The detailed
workflow should live in this skill, not inside the automation prompt.

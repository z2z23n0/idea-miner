---
name: idea-discovery-workflow
description: Use when running or designing recurring product/open-source idea discovery, daily or scheduled idea mining, thesis-first product/OSS bet discovery, 3-bucket final selection across developer/OSS, vertical B2B workflow products, and consumer/prosumer apps, Promotion Gate workflows, multi-role Thesis Scout/Signal Scout/Critic/Competitor/CEO evaluation, evidence-to-decision pipelines, idea backlog memory, idea handoffs, handoff-ready idea dossiers, or automation prompts for finding AI-native products, high-star open-source projects, complete SaaS/app directions, CLI, MCP, Skill, agent workflow, and developer-tool ideas. This skill orchestrates discovery and uses ai-founder-playbook for judgment, pressure testing, competitor analysis, and market reasoning.
---

# Idea Discovery Workflow

Use this skill as the orchestration layer for recurring idea discovery. It turns
AI-era theses, product/OSS bet sketches, community signals, product/platform
news, competitor gaps, and open-source ecosystem changes into a small number of
rigorously reviewed product/OSS bets.

This skill is intentionally separate from `ai-founder-playbook`:

- `idea-discovery-workflow` owns workflow, roles, evidence memory, run artifacts,
  report shape, and automation integration.
- `ai-founder-playbook` owns founder/open-source judgment: pressure tests,
  market scans, competitor reasoning, scoring, and launch advice.

## Core Run

For a normal run, load only the references needed for the task:

1. Read [source-policy.md](references/source-policy.md) to build the
   thesis-first discovery plan, evidence sweep, AI relevance gate, and
   product/OSS promotion gate.
2. Read [workflow.md](references/workflow.md) for the DAG, thesis generation,
   promotion gates, history relation gate, and iteration gates.
3. Read [role-contracts.md](references/role-contracts.md) when assigning real or
   simulated roles.
4. Read [report-format.md](references/report-format.md) before rendering the final
   report.
5. Read [memory-schema.md](references/memory-schema.md) when persisting or reading
   historical signals, ideas, competitors, decisions, or graph edges.
6. Read [handoff-mode.md](references/handoff-mode.md) when the user asks to
   hand off one or more stored ideas.

Use `ai-founder-playbook` during Candidate Draft, Critic Review, Competitor
Check, and CEO Decision. Do not duplicate its rubrics here.

## Built-In Scripts

- `scripts/idea-scout-kit.mjs [topic...]` generates a thesis-first discovery
  plan, thesis seeds, product/OSS bet templates, AI relevance and promotion
  gates, source modules for evidence sweep, history-relation tables, and Red
  Team questions. When topics are provided explicitly, it treats them as thesis
  constraints and also generates topic-guided evidence queries. It does not
  fetch the web; use it to plan and normalize searches.
- `scripts/init-store.mjs` creates the local JSONL evidence store under
  `${IDEA_MINER_HOME:-$HOME/.idea-miner}`. It also honors the legacy
  `CODEX_IDEA_DISCOVERY_HOME` variable for existing installs.
- `scripts/idea-handoff.mjs [--session-prompt] <idea name...>` resolves one or
  more stored idea dossiers, copies them into temporary handoff files, and can
  write prompt files suitable for new Codex sessions. It does not browse the
  web or create sessions by itself; the skill should call host session tools
  when available.
- `scripts/check-run-artifacts.mjs <run_dir>` checks that a completed run has
  a report, source notes, handoff index, per-idea JSON/Markdown dossiers, a
  reader-readable idea story, and source-backed claims. Run it after writing
  artifacts whenever shell is available.

## Execution Rules

- Always use current web/realtime tools for current claims, competitors,
  adoption, pricing, releases, and source freshness.
- If a source cannot be accessed, mark it `未覆盖/受限`; do not infer content.
- Default discovery is thesis-first and imagination-led, not evidence-first or
  complaint-mining-first. Unless the user asks for a narrow market scan, generate
  a thesis portfolio and product/OSS bet sketches before collecting evidence.
- Treat evidence as a brake and sharpening tool: use current sources to support,
  challenge, kill, or refine bets after they exist. Do not reward "one complaint
  -> one small checker" as a final idea.
- Use fit gates to exclude unrelated raw opportunities such as physical goods,
  local services, inventory, hardware manufacturing, or pure operations plays
  unless they can be reframed as a complete product or high-star OSS opportunity.
- Default final selection is bucketed: up to 3 `dev_oss`, up to 3
  `vertical_b2b`, and up to 3 `consumer_prosumer`. Each final idea should still
  be AI-core or AI-native workflow by default; AI-leveraged and non-AI ideas can
  enter final only when they pass the bucket-specific product/OSS promotion gate
  strongly.
- GitHub Actions, CI gates, PR comments, templates, hooks, checklists, and thin
  wrappers are integration surfaces only. They cannot be the body of a final
  idea unless attached to a broader complete product or high-star OSS project.
- Before final selection, compare every candidate with stored ideas and label it
  as new, update_existing, duplicate_of, revives, merged_from, splits_from, or
  adjacent_to.
- Default to a rigorous replenish workflow. Use real sub-agents or multi-agent
  tools when they help cover more sources, run independent critique, or refill
  the candidate pool after vetoes; otherwise simulate roles and state that.
- Use expensive debate only for high-disagreement or high-value candidates.
- Aim to return up to 9 product/OSS bets that pass the current standard: at
  most 3 per final bucket. Do not lower the bar to fill any bucket. Existing
  ideas with only incremental evidence should be reported as backlog updates,
  not counted as new final ideas. If a bucket has fewer than 3 new or
  meaningfully changed bets, treat that bucket as underfilled and show the
  thesis/source replenish rounds and why coverage was exhausted.
- Keep full reports as normal Markdown before any host-specific control block.
- Before saving final artifacts, run the Reader Clarity Gate: a reader who did
  not participate in discovery must be able to restate each final idea as a
  concrete product/OSS bet with core thesis, AI relevance, demo moment, and
  repo/star asset. Rewrite or reject ideas that remain abstract or integration-only.
- For every final idea, persist a handoff-ready dossier. Persist a paused dossier
  only for a strong idea with one clearly named unresolved issue; do not save
  vetoed, weak, internal-only, or "could be a small tool" ideas as handoff work.
  Later handoff requests should read the stored dossier first and should not
  repeat source discovery unless the user explicitly asks for a current refresh.
- After persistence, run the artifact checker when shell is available. If it
  fails, fix the files and rerun it; do not present a failed artifact check as a
  normal success.

## Automation Prompt Boundary

Automations should stay thin: schedule, destination, language, display rule,
final bucket target, and the instruction to run this skill using
`ai-founder-playbook`. The detailed workflow should live in this skill, not
inside the automation prompt.

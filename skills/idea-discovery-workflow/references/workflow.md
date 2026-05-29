# Workflow

Default DAG:

```text
prepare_run
  -> collect_signals
  -> normalize_signals
  -> draft_candidates
  -> hard_gate
  -> critic_review
  -> competitor_check
  -> ceo_decision
  -> replenish_if_underfilled
  -> persist_memory
  -> render_report
  -> persist_run_artifacts
```

## Nodes

| Node | Owner | Input | Output |
|---|---|---|---|
| prepare_run | Orchestrator | date, prior runs, topic scope | source plan, run id, coverage target |
| collect_signals | Signal Scout | source plan | raw signals with links and freshness |
| normalize_signals | Signal Scout | raw signals | Signal Portfolio with buckets and evidence grades |
| draft_candidates | Idea Drafter | Signal Portfolio | at least 5 candidates with source type, evidence level, usage semantics, and product-scale hypothesis |
| hard_gate | CEO + Red Team | candidates, user goal, source evidence | keep/kill decisions before detailed write-up |
| critic_review | Red Team | candidates | objections, rejection/revision requests, falsification tests |
| competitor_check | Competitor Investigator | candidates | direct/indirect/open-source/platform competitors and gaps |
| ceo_decision | CEO | revised candidates, objections, competitors | final decisions, priorities, product-scale judgment, and rationale |
| replenish_if_underfilled | Orchestrator + Signal Scout + Drafter | final count, killed reasons, source coverage | new source plan, new candidates, or underfilled reason |
| persist_memory | Orchestrator | signals, ideas, claims, decisions | JSONL records and graph-like edges |
| render_report | Orchestrator | run artifacts | final Chinese Markdown report |
| persist_run_artifacts | Orchestrator | report, source notes, final/paused ideas | `runs/<run_id>/report.md`, `source-notes.jsonl`, per-idea JSON, per-idea Markdown dossiers, `handoff-index.md` |

`persist_run_artifacts` is required, not best effort. If the runtime cannot
write files, the final report must explicitly say that handoff artifacts were
not saved.

## Iteration Rules

- Every candidate must pass at least one loop:
  `hard_gate -> critic_review -> drafter_response -> competitor_check -> ceo_decision`.
- Hard gate happens before long write-ups. Kill candidates that are only thin
  wrappers, hook recipes, CI glue, internal dogfood, platform-feature aliases,
  generic workflow/eval meta-tools, or ideas that cannot plausibly reach the
  user's stated goal. Do not rescue them by changing the goal.
- Before a candidate can become final, the CEO must be able to describe what
  the product is, when it is used, what it takes as input, what it returns as
  output, what manual workaround it replaces, and what product scale it
  currently deserves.
- Target exactly 3 final ideas, but only if all 3 clear the bar. If fewer than 3
  survive, run replenish rounds instead of lowering standards.
- A replenish round must use the kill reasons to change at least two of: source
  module, keyword set, community, ICP, product shape, competitor category,
  platform/news trigger, or evidence type. Rewording the same candidate is not
  a replenish round.
- Default to at least 3 total rounds when fewer than 3 ideas pass. Continue up
  to 5 rounds when sources are still producing new evidence. Scheduled runs may
  spend more time/token on extra source modules when quality remains promising.
- Stop underfilled only when the run can show source exhaustion, repeated
  duplicate candidates, or a clear reason additional rounds would lower the bar.
  Treat underfilled output as a failed-to-fill run, not as a normal success.

## Validation Wording Rules

- Do not use generic validation homework such as "find 10 users",
  "ask 5 maintainers", or "collect N issues" unless that exact count follows
  from the current channel, known audience, or concrete launch plan.
- For weak ideas, write the direct kill reason and the evidence that would have
  been needed. Do not attach a generic 7-14 day validation plan to make the idea
  feel actionable.
- For final ideas, the next action must be the shortest decision-changing
  evidence path, not a validation template. If there is no short evidence path,
  the idea should not be final.

## Parallelism Rules

Use parallelism where it reduces wall-clock time without multiplying noise:

- Good: source modules in parallel, competitor searches in parallel, independent
  critic perspectives in parallel.
- Weak: parallel brainstorming without source modules, hypotheses, or review
  gates.

Use debate only when:

- support and opposition are both strong;
- the candidate is likely P0/P1;
- a decision would affect real build time or distribution effort;
- CEO cannot resolve the dispute from first-pass evidence.

Debate output must be summarized into claims, counterclaims, evidence, and CEO
decision. Do not paste long transcripts unless explicitly requested.

## Handoff-Ready Artifact Rule

Every final idea must be saved as a standalone dossier before the run is
considered complete. A paused idea gets a dossier only when it is strong but
blocked on one specific evidence gap; weak/vetoed ideas get only concise death
notes in the report. The dossier should contain enough context for a future
agent to continue the idea without browsing again:

- original signal links and source summaries;
- what the idea is, how it is used, what it replaces, and product scale;
- competitor and alternative reasoning;
- Red Team objections and CEO rulings;
- dangerous assumptions, shortest evidence path, and stop line.

Future handoff requests should read these dossiers first and should not repeat
source discovery unless the user asks for a current refresh.

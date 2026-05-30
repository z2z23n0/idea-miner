# Workflow

Default DAG:

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
  -> reader_clarity_gate
  -> persist_run_artifacts
  -> artifact_quality_gate
```

## Nodes

| Node | Owner | Input | Output |
|---|---|---|---|
| prepare_run | Orchestrator | date, user-provided topic scope, exclusions | run id, source-first plan, coverage target |
| load_history | Orchestrator | evidence store | backlog snapshot, aliases, prior final/paused/rejected ideas, recent source URLs |
| collect_signals | Signal Scout | source-first plan | raw source-native signals with links and freshness |
| normalize_signals | Signal Scout | raw signals | Signal Portfolio with buckets and evidence grades |
| draft_candidates | Idea Drafter | Signal Portfolio | at least 5 candidates with source type, evidence level, usage semantics, and product-scale hypothesis |
| fit_gate | CEO + Drafter | raw candidates, user goal, fit policy | keep/quarantine decisions for off-target markets and non-software opportunities |
| history_relation_gate | CEO + Orchestrator | candidates, backlog snapshot | new/update_existing/duplicate_of/revives/merged_from/splits_from/adjacent_to labels |
| hard_gate | CEO + Red Team | candidates, user goal, source evidence | keep/kill decisions before detailed write-up |
| critic_review | Red Team | candidates | objections, rejection/revision requests, falsification tests |
| competitor_check | Competitor Investigator | candidates | direct/indirect/open-source/platform competitors and gaps |
| ceo_decision | CEO | revised candidates, objections, competitors | final decisions, priorities, product-scale judgment, and rationale |
| replenish_if_underfilled | Orchestrator + Signal Scout + Drafter | final count, killed reasons, source coverage | new source plan, new candidates, or underfilled reason |
| persist_memory | Orchestrator | signals, ideas, claims, decisions | JSONL records and graph-like edges |
| render_report | Orchestrator | run artifacts | final Chinese Markdown report |
| reader_clarity_gate | Report Reader + Orchestrator | rendered report, final ideas, dossiers | pass/rewrite decision based on reader comprehension |
| persist_run_artifacts | Orchestrator | report, source notes, final/paused ideas | `runs/<run_id>/report.md`, `source-notes.jsonl`, per-idea JSON, per-idea Markdown dossiers, `handoff-index.md` |
| artifact_quality_gate | Orchestrator | run artifact directory | validation result; explicit failure note or corrected artifacts |

`persist_run_artifacts` is required, not best effort. If the runtime cannot
write files, the final report must explicitly say that handoff artifacts were
not saved.

`artifact_quality_gate` should run after files are written whenever shell is
available:

```bash
node skills/idea-discovery-workflow/scripts/validate-run-artifacts.mjs <run_dir>
```

If validation fails, fix the report, source notes, or dossiers and rerun the
validator. If the runtime cannot run the validator, the final report must say
that the artifact quality gate was not executed.

## Iteration Rules

- Every candidate must pass at least one loop:
  `fit_gate -> history_relation_gate -> hard_gate -> critic_review -> drafter_response -> competitor_check -> ceo_decision`.
- Source collection starts from current source feeds unless the user explicitly
  gave topics. Do not seed normal daily discovery with standing keywords from
  prior runs.
- Topic keywords are enrichment tools, not the default discovery boundary. Once
  a raw signal is found, derive follow-up queries from that signal to verify
  repeatability, competitors, and adjacent pain.
- The history relation gate is mandatory. A candidate cannot enter final
  selection until it is labelled as one of: `new`, `update_existing`,
  `duplicate_of`, `revives`, `merged_from`, `splits_from`, or `adjacent_to`.
- A pure duplicate with no new evidence, changed ICP, changed workflow, or
  changed decision is rejected as `duplicate_of` and written as a backlog note,
  not a final idea.
- `update_existing` candidates belong in the backlog-update section unless the
  new evidence materially changes verdict, priority, MVP boundary, competitor
  judgment, or stop line.
- Hard gate happens before long write-ups. Kill candidates that are only thin
  wrappers, hook recipes, CI glue, internal dogfood, platform-feature aliases,
  generic workflow/eval meta-tools, or ideas that cannot plausibly reach the
  user's stated goal. Do not rescue them by changing the goal.
- Before a candidate can become final, the CEO must be able to describe what
  the product is, when it is used, what it takes as input, what it returns as
  output, what manual workaround it replaces, and what product scale it
  currently deserves.
- Before artifacts are considered complete, the report must pass the reader
  clarity gate. A reader who did not participate in discovery must be able to
  restate each final idea as a concrete product card: product form, target user,
  trigger moment, inputs, work performed, outputs, replaced workaround, why
  existing substitutes are not enough, shortest evidence path, and stop line. If
  any answer is missing or only abstract, rewrite the idea before saving final
  artifacts.
- Prefer a real sub-agent for the Report Reader when available. If no sub-agent
  is available, simulate the role explicitly. The reader does not invent new
  ideas or browse by default; it only checks whether the written report is
  understandable from the stored evidence.
- Target up to 3 final ideas, but prioritize genuinely new or meaningfully
  changed ideas. If fewer than 3 survive, run replenish rounds instead of
  lowering standards or filling slots with old winners.
- A replenish round must use the kill reasons to change at least two of: source
  module, source-native feed, community, ICP, product shape, competitor
  category, platform/news trigger, evidence type, or fit hypothesis. Rewording
  the same candidate or searching the same old keywords is not a replenish
  round.
- Default to at least 3 total rounds when fewer than 3 ideas pass. Continue up
  to 5 rounds when sources are still producing new evidence. Scheduled runs may
  spend more time/token on extra source modules when quality remains promising.
- Stop underfilled only when the run can show source exhaustion, repeated
  duplicate candidates, or a clear reason additional rounds would lower the bar.
  Treat underfilled output as a failed-to-fill run, not as a normal success.

## History Relation Rules

Build a compact backlog snapshot before drafting final candidates:

- names, aliases, statuses, priorities, and dossier/detail paths from
  `ideas.jsonl`;
- prior final/paused/rejected summaries from recent `handoff-index.md` and
  `report.md` files;
- known source URLs from top-level signals and run `source-notes.jsonl`;
- prior `duplicates`, `revives`, `merged_from`, `updates_existing`, and
  `adjacent_to` edges.

For each candidate, decide the strongest relationship:

- `new`: new problem/workflow/ICP/product form with no close stored idea.
- `update_existing`: same idea, but new evidence changes priority, verdict,
  MVP, competitor judgment, or stop line.
- `duplicate_of`: same idea with no decision-changing new information.
- `revives`: previously paused/rejected idea now has a new reason to reconsider.
- `merged_from`: combines two or more prior ideas into a clearer direction.
- `splits_from`: extracts a narrower, independently useful slice from a prior
  broad idea.
- `adjacent_to`: overlaps with a prior idea but targets a different user,
  trigger, or workflow.

Persist this relationship in `edges.jsonl` and in the per-idea dossier. The
report must not present a duplicate as a new idea.

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

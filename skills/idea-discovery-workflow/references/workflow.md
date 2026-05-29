# Workflow

Default DAG:

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

## Nodes

| Node | Owner | Input | Output |
|---|---|---|---|
| prepare_run | Orchestrator | date, prior runs, topic scope | source plan, run id, coverage target |
| collect_signals | Signal Scout | source plan | raw signals with links and freshness |
| normalize_signals | Signal Scout | raw signals | Signal Portfolio with buckets and evidence grades |
| draft_candidates | Idea Drafter | Signal Portfolio | at least 5 candidates with source type, evidence level, usage semantics, and product-scale hypothesis |
| critic_review | Red Team | candidates | objections, rejection/revision requests, falsification tests |
| competitor_check | Competitor Investigator | candidates | direct/indirect/open-source/platform competitors and gaps |
| ceo_decision | CEO | revised candidates, objections, competitors | final decisions, priorities, product-scale judgment, and rationale |
| persist_memory | Orchestrator | signals, ideas, claims, decisions | JSONL records and graph-like edges |
| render_report | Orchestrator | run artifacts | final Chinese Markdown report |

## Iteration Rules

- Every candidate must pass at least one loop:
  `critic_review -> drafter_response -> competitor_check -> ceo_decision`.
- Before a candidate can become final, the CEO must be able to describe what
  the product is, when it is used, what it takes as input, what it returns as
  output, what manual workaround it replaces, and what product scale it
  currently deserves.
- If all candidates are rejected or fewer than 3 are strong enough, run up to 2
  additional search/draft/review rounds.
- Each extra round must state what changed: new source module, keyword set,
  target shape, ICP, or hypothesis.
- Stop after 3 rounds. Do not lower standards to fill three slots.

## Parallelism Rules

Use parallelism where it reduces wall-clock time without multiplying noise:

- Good: source modules in parallel, competitor searches in parallel, independent
  critic perspectives in parallel.
- Weak: parallel brainstorming without source modules, hypotheses, or review
  gates.

Use debate only when:

- support and opposition are both strong;
- the candidate is likely P0/P1;
- a decision would affect real build time or outreach;
- CEO cannot resolve the dispute from first-pass evidence.

Debate output must be summarized into claims, counterclaims, evidence, and CEO
decision. Do not paste long transcripts unless explicitly requested.

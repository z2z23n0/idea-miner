# Workflow

Default DAG:

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
  -> reader_clarity_gate
  -> persist_run_artifacts
  -> artifact_quality_gate
```

## Nodes

| Node | Owner | Input | Output |
|---|---|---|---|
| prepare_run | Orchestrator | date, user topic scope, exclusions | run id, thesis-first plan, coverage target |
| load_history | Orchestrator | evidence store | backlog snapshot, aliases, prior final/paused/rejected ideas, recent source URLs |
| generate_thesis_portfolio | Thesis Scout + Orchestrator | user goal, AI/product/OSS thesis seeds, history | 20-30 high-imagination theses |
| sketch_product_oss_bets | Idea Drafter | thesis portfolio | 8-12 product/OSS bet sketches with demo moment and repo/star asset |
| collect_evidence | Signal Scout | bet sketches and source modules | current signals, competitors, kill evidence, supporting links |
| normalize_signals | Signal Scout | raw signals | Signal Portfolio with buckets and evidence role |
| ai_relevance_gate | CEO + Red Team | bet sketches, user goal | AI-core / AI-native workflow / AI-leveraged / non-AI exceptional / non-AI reject labels |
| product_oss_promotion_gate | CEO + Report Reader | serious bets | pass/fail on complete-product or high-star-OSS criteria |
| history_relation_gate | CEO + Orchestrator | candidates, backlog snapshot | new/update_existing/duplicate_of/revives/merged_from/splits_from/adjacent_to labels |
| hard_gate | CEO + Red Team | candidates, user goal, evidence | keep/kill decisions before detailed write-up |
| critic_review | Red Team | promoted candidates | objections, rejection/revision requests, kill reasons |
| competitor_check | Competitor Investigator | promoted candidates | direct/indirect/open-source/platform competitors and absorption risks |
| ceo_decision | CEO | revised candidates, objections, competitors | final product/OSS bets, priorities, rationale |
| replenish_if_underfilled | Orchestrator + Thesis Scout + Drafter | final count, kill reasons | new theses, new bet sketches, or underfilled reason |
| persist_memory | Orchestrator | theses, signals, ideas, claims, decisions | JSONL records and graph-like edges |
| render_report | Orchestrator | run artifacts | final Chinese Markdown report |
| reader_clarity_gate | Report Reader + Orchestrator | rendered report, final ideas, dossiers | pass/rewrite decision |
| persist_run_artifacts | Orchestrator | report, source notes, final/paused ideas | `runs/<run_id>/report.md`, `source-notes.jsonl`, per-idea JSON/Markdown dossiers, `handoff-index.md` |
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

- The run begins with thesis generation, not complaint mining. Generate
  high-imagination theses before browsing or evidence collection unless the user
  explicitly asks for a narrow market scan.
- Evidence is used after bet sketches exist. It can sharpen, support, or kill a
  bet, but it should not reduce the run to "one complaint -> one small tool".
- Every final candidate must pass:
  `ai_relevance_gate -> product_oss_promotion_gate -> history_relation_gate -> hard_gate -> critic_review -> competitor_check -> ceo_decision`.
- Default final preference is `AI-core` or `AI-native workflow`. `AI-leveraged`
  candidates need strong product/OSS completeness. `non-AI exceptional`
  candidates need exceptional product or high-star OSS potential. `non-AI
  reject` never enters final.
- AI is not core when it only summarizes release notes, writes PR comments,
  explains diffs, or converts text/CSV into config.
- The product/OSS promotion gate is mandatory. A final idea must be either a
  complete product direction or a GitHub OSS project with a clear 30-second demo
  moment, repo/star mindshare, and accumulation asset.
- GitHub Action, CI gate, PR comment, checklist automation, template, config
  package, hook recipe, or thin wrapper is an integration surface only. If that
  is the idea body, reject or backlog it.
- The history relation gate is mandatory. A candidate cannot enter final until
  it is labelled as one of: `new`, `update_existing`, `duplicate_of`,
  `revives`, `merged_from`, `splits_from`, or `adjacent_to`.
- A pure duplicate with no changed thesis, ICP, product scale, competitor
  judgment, or stop line is rejected as `duplicate_of` and written as a backlog
  note, not a final idea.
- `update_existing` candidates belong in the backlog-update section unless new
  evidence or a new thesis materially changes verdict, priority, MVP boundary,
  competitor judgment, or stop line.
- Hard gate happens before long write-ups. Kill candidates that are only thin
  wrappers, hook recipes, CI glue, internal dogfood, platform-feature aliases,
  generic workflow/eval meta-tools, Action-only integrations, or ideas that
  cannot plausibly reach the user's stated product/OSS goal.
- Reader Clarity Gate remains required, but clarity is not enough. A candidate
  can be clear and still fail because it is not imaginative, AI-relevant, or
  product/OSS-complete.
- Target up to 3 final product/OSS bets. If fewer than 3 survive, replenish with
  new theses or product archetypes, not just new complaint sources.
- A replenish round must change at least two of: thesis seed, AI-era capability
  shift, product archetype, demo moment, repo asset, ICP, platform shift,
  competitor category, or source module.
- Default to at least 3 total rounds when fewer than 3 ideas pass. Continue up
  to 5 rounds when new theses are still producing promising bets. Stop
  underfilled only when additional rounds would lower the bar.

## Promotion Gates

### AI Relevance Gate

Classify each serious bet:

- `AI-core`
- `AI-native workflow`
- `AI-leveraged`
- `non-AI exceptional`
- `non-AI reject`

Final slots prefer `AI-core` and `AI-native workflow`. `AI-leveraged` and
`non-AI exceptional` must explicitly justify why they deserve a final slot.

### Product / OSS Promotion Gate

A final idea must pass at least one:

- **Complete product**: clear user, recurring usage moment, core workflow,
  product surface, commercial or distribution path, and expansion path.
- **High-star OSS**: 30-second demo, memorable repo asset, clear GitHub topic or
  ecosystem, contribution/extension path, and reason developers would star,
  install, recommend, or depend on it.

Reject candidates that cannot answer:

- Why does this deserve a final slot?
- Why is this not just a GitHub Action, CI gate, PR comment, wrapper, checklist,
  platform patch, or one-off script?
- What is the demo moment?
- What accumulates over time: rules, dataset, benchmark, protocol, examples,
  integrations, community plugins, eval corpus, or workflow memory?

## History Relation Rules

Build a compact backlog snapshot before final selection:

- names, aliases, statuses, priorities, and dossier/detail paths from
  `ideas.jsonl`;
- prior final/paused/rejected summaries from recent `handoff-index.md` and
  `report.md` files;
- known source URLs from top-level signals and run `source-notes.jsonl`;
- prior `duplicates`, `revives`, `merged_from`, `updates_existing`, and
  `adjacent_to` edges.

For each candidate, decide the strongest relationship:

- `new`: new thesis/workflow/ICP/product form with no close stored idea.
- `update_existing`: same idea, but a new thesis or evidence changes priority,
  verdict, MVP, competitor judgment, or stop line.
- `duplicate_of`: same idea with no decision-changing new information.
- `revives`: previously paused/rejected idea now has a new reason to reconsider.
- `merged_from`: combines two or more prior ideas into a clearer direction.
- `splits_from`: extracts a narrower, independently useful slice from a prior
  broad idea.
- `adjacent_to`: overlaps with a prior idea but targets a different user,
  trigger, workflow, or thesis.

Persist this relationship in `edges.jsonl` and in the per-idea dossier. The
report must not present a duplicate as a new idea.

## Evidence Wording Rules

- Do not use generic validation homework such as "find 10 users",
  "ask 5 maintainers", or "collect N issues" unless that exact count follows
  from the current channel, known audience, or concrete launch plan.
- For weak ideas, write the direct kill reason and the evidence that would have
  been needed. Do not attach a generic 7-14 day validation plan to make the idea
  feel actionable.
- For final bets, the next action must be the shortest decision-changing
  evidence path, not a validation template. If there is no short evidence path,
  the bet should not be final.
- Evidence should kill boring or false bets; it should not be used as the main
  imagination source.

## Parallelism Rules

Use parallelism where it improves breadth:

- Good: independent thesis generation, source modules in parallel, competitor
  searches in parallel, independent critic perspectives in parallel.
- Weak: parallel complaint scraping without thesis seeds, product archetypes, or
  promotion gates.

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

- core thesis and why-now logic;
- AI relevance and promotion-gate result;
- original signal links and source summaries used to support or kill the bet;
- what the product/OSS is, how it is used, what it replaces, and product scale;
- demo moment, repo/star asset, competitor and alternative reasoning;
- Red Team objections and CEO rulings;
- dangerous assumptions, shortest evidence path, and stop line.

Future handoff requests should read these dossiers first and should not repeat
source discovery unless the user asks for a current refresh.

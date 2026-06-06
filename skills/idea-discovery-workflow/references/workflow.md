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
  -> product_shape_gate
  -> product_oss_promotion_gate
  -> history_relation_gate
  -> hard_gate
  -> critic_review
  -> competitor_check
  -> ceo_decision
  -> replenish_if_underfilled
  -> persist_memory
  -> render_report
  -> independent_reader_review
  -> revise_or_reject_unclear_ideas
  -> persist_run_artifacts
  -> artifact_quality_check
```

## Nodes

| Node | Owner | Input | Output |
|---|---|---|---|
| prepare_run | Orchestrator | date, user topic scope, exclusions | run id, thesis-first plan, coverage target |
| load_history | Orchestrator | evidence store | backlog snapshot, aliases, prior final/paused/rejected ideas, recent source URLs |
| generate_thesis_portfolio | Thesis Scout + Orchestrator | user goal, AI/product/OSS thesis seeds, history | 20-30 high-imagination theses |
| sketch_product_oss_bets | Idea Drafter | thesis portfolio | 8-12 product/OSS bet sketches with draft product shapes |
| collect_evidence | Signal Scout | bet sketches and source modules | current signals, competitors, kill evidence, supporting links |
| normalize_signals | Signal Scout | raw signals | Signal Portfolio with buckets and evidence role |
| ai_relevance_gate | CEO + Red Team | bet sketches, user goal | AI-core / AI-native workflow / AI-leveraged / non-AI exceptional / non-AI reject labels |
| product_shape_gate | CEO + Report Reader | serious bets | pass/rewrite/reject based on whether the reader can explain what product or repo would exist |
| product_oss_promotion_gate | CEO + Red Team | serious bets | separate pass/fail on complete AI product and high-star OSS criteria |
| history_relation_gate | CEO + Orchestrator | candidates, backlog snapshot | new/update_existing/duplicate_of/revives/merged_from/splits_from/adjacent_to labels |
| hard_gate | CEO + Red Team | candidates, user goal, evidence | keep/kill decisions before detailed write-up |
| critic_review | Red Team | promoted candidates | objections, rejection/revision requests, kill reasons |
| competitor_check | Competitor Investigator | promoted candidates | direct/indirect/open-source/platform competitors and absorption risks |
| ceo_decision | CEO | revised candidates, objections, competitors | final product/OSS bets and rationale |
| replenish_if_underfilled | Orchestrator + Thesis Scout + Drafter | final count, kill reasons | `candidate-ledger.jsonl` rows, new theses, new bet sketches, or underfilled proof |
| persist_memory | Orchestrator | theses, signals, ideas, claims, decisions | JSONL records and graph-like edges |
| render_report | Orchestrator | run artifacts | final Chinese Markdown report |
| independent_reader_review | Report Reader | rendered report only | `reader-review.md` or `reader-review.json` with per-idea restatement and blockers |
| revise_or_reject_unclear_ideas | CEO + Orchestrator | reader review | revised report or rejected unclear ideas |
| persist_run_artifacts | Orchestrator | report, source notes, reader review, candidate ledger, final/paused ideas | `runs/<run_id>/...` artifacts |
| artifact_quality_check | Orchestrator | run artifact directory | check result; explicit failure note or corrected artifacts |

`persist_run_artifacts` is required, not best effort. If the runtime cannot
write files, the final report must explicitly say that handoff artifacts were
not saved.

`artifact_quality_check` should run after files are written whenever shell is
available:

```bash
node skills/idea-discovery-workflow/scripts/check-run-artifacts.mjs <run_dir>
```

If the check fails, fix the report, reader review, candidate ledger, source
notes, or dossiers and rerun the checker. If the runtime cannot run the
checker, the final report must say that the artifact quality check was not
executed.

## Iteration Rules

- The run begins with thesis generation, not complaint mining. Generate
  high-imagination theses before browsing or evidence collection unless the user
  explicitly asks for a narrow market scan.
- Evidence is used after bet sketches exist. It can sharpen, support, or kill a
  bet, but it should not reduce the run to "one complaint -> one small tool".
- Every final candidate must pass:
  `ai_relevance_gate -> product_shape_gate -> product_oss_promotion_gate -> history_relation_gate -> hard_gate -> critic_review -> competitor_check -> ceo_decision`.
- Default final preference is `AI-core` or `AI-native workflow`. `AI-leveraged`
  candidates need strong product/OSS completeness. `non-AI exceptional`
  candidates need explicit user scope expansion or exceptional strength.
  `non-AI reject` never enters final.
- AI is not core when it only summarizes release notes, writes PR comments,
  explains diffs, or converts text/CSV into config.
- The final bucket gate is mandatory. Every final idea must declare one of
  `ai_oss`, `ai_product`, or `ai_prosumer`, and the report must keep the final
  set grouped by bucket.
- The Product Shape gate is mandatory. A candidate must be explainable as a
  concrete product or repo: product/repo form, target user and task, inputs or
  permissions, core objects, outputs or state, user actions, first-version
  boundary, explicit non-goals, and why it is a complete product or high-star
  OSS rather than a prompt, checker, Action, wrapper, dashboard, or platform
  hook recipe. If this cannot be written in short natural prose, reject or
  rewrite before final selection.
- The phrase pattern "不是 X，而是 Y" must not be the main explanation. Boundary
  clarification is allowed only after the positive product/repo shape is clear.
  Do not replace clarity with a story scene about a named or implied user
  clicking through a day.
- The product/OSS promotion gate is mandatory and split into two independent
  paths. A final idea must pass the complete AI product path or the high-star
  OSS path. `ai_oss` can pass through high-star OSS; `ai_product` and
  `ai_prosumer` normally need complete-product proof.
- GitHub Action, CI gate, PR comment, checklist automation, template, config
  package, hook recipe, or thin wrapper is an integration surface only. If that
  is the idea body, reject or backlog it.
- The history relation gate is mandatory. A candidate cannot enter final until
  it is labelled as one of: `new`, `update_existing`, `duplicate_of`,
  `revives`, `merged_from`, `splits_from`, or `adjacent_to`.
- A pure duplicate with no changed thesis, target user, product scale, product
  shape, or competitor judgment is rejected as `duplicate_of` and written as a
  backlog note, not a final idea.
- `update_existing` candidates belong in the backlog-update section unless new
  evidence or a new thesis materially changes the verdict, product boundary, or
  competitor judgment.
- Hard gate happens before long write-ups. Kill candidates that are only thin
  wrappers, hook recipes, CI glue, internal dogfood, platform-feature aliases,
  generic workflow/eval meta-tools, Action-only integrations, or ideas that
  cannot plausibly reach the user's stated product/OSS goal.
- Target up to 9 final product/OSS bets: up to 3 `ai_oss`, up to 3
  `ai_product`, and up to 3 `ai_prosumer`. If any bucket has fewer than 3
  survivors, replenish for that bucket with new theses or product archetypes,
  not just new complaint sources.
- A replenish round must change at least two of: thesis seed, AI-era capability
  shift, product archetype, product/repo form, core object, repo asset, target
  user, platform shift, competitor category, or source module.
- Default to at least 3 total rounds when any requested bucket is underfilled.
  Continue up to 5 rounds when new theses are still producing promising bets.
  Stop underfilled only when additional rounds would lower the bar or source
  coverage is genuinely exhausted.
- Every replenish attempt must be recorded in `candidate-ledger.jsonl`. A report
  may say a bucket is underfilled only when the ledger shows what was tried,
  what changed, what candidates were found, and why each was killed or parked.

## Product Shape Gate

Product Shape is the comprehension gate. It is not a form to fill and not a
story scene. It is the minimum standard for whether the idea can be understood
as something that could be built, installed, opened, bought, starred, or used.

For each serious bet, write a compact product/repo explanation that makes these
parts obvious:

```text
This is a <product/repo form> for <target user> doing <task>.
The user gives it <inputs or permissions>.
Its core objects are <named objects/artifacts/states>.
It returns or maintains <outputs/state>.
The user can <concrete actions>.
The first version only handles <narrow workflow> and explicitly does not do <non-goals>.
It is a complete product or high-star OSS because <body beyond prompt/checker/wrapper>.
```

Good product shapes contain concrete nouns and actions: command names, repos,
issues, traces, eval suites, browser sessions, workspaces, logs, prompts,
documents, datasets, queues, approval screens, reports, patches, receipts,
protocols, benchmarks, plugins, or generated artifacts.

Reject or rewrite when the explanation contains mostly words like workspace,
evidence, workflow, desk, intelligence, orchestration, system of record,
assistant, agent, copilot, or dashboard without naming the product form, core
objects, inputs, outputs, user actions, and first-version boundary.

Also reject or rewrite story-theater explanations such as "someone wakes up,
opens a dashboard, clicks a button, and the system takes over." Usage context is
useful only when it helps the reader understand the product/repo shape.

## Promotion Gates

### AI Relevance Gate

Classify each serious bet:

- `AI-core`
- `AI-native workflow`
- `AI-leveraged`
- `non-AI exceptional`
- `non-AI reject`

Final selections prefer `AI-core` and `AI-native workflow`. `AI-leveraged` and
`non-AI exceptional` must explicitly justify why they belong in the selected
set.

### Product / OSS Promotion Gate

A final idea must pass at least one path, and the chosen path must match its
bucket:

- **Complete AI product**: clear product shape, recurring usage moment, product
  surface, commercial or distribution path, expansion path, and a reason AI is
  central rather than garnish.
- **High-star OSS**: 30-second demo, memorable repo asset, clear GitHub topic or
  ecosystem, contribution/extension path, and reason developers would star,
  install, share, or depend on it.

Use this split explicitly:

| Bucket | Normal required path | What must be proven |
|---|---|---|
| `ai_oss` | High-star OSS or complete AI product | repo asset, 30-second demo, developer ecosystem, install/share/contribute reason |
| `ai_product` | Complete AI product | AI-native workflow, current substitute, product surface, distribution or buyer path, expansion path |
| `ai_prosumer` | Complete AI product | repeated personal/professional use, visible substitute, retention loop, concrete UX, broad-enough reachable audience |

Reject candidates that cannot answer in prose:

- What is the product/repo form?
- Who uses it, for what task?
- What input or permission does the user give it?
- What concrete core object does it create or maintain?
- What output or state appears?
- What actions can the user take?
- What is the first-version boundary and what is explicitly out of scope?
- What durable asset accumulates: rules, dataset, benchmark, protocol,
  examples, integrations, community plugins, eval corpus, or workflow memory?
- Why is this a complete product or high-star OSS instead of a prompt, checker,
  Action, wrapper, dashboard, or platform hook recipe?
- Which final bucket owns it, and why it belongs there instead of being a
  developer tool in disguise or a broad market label with no product surface?

## Candidate Ledger

`candidate-ledger.jsonl` is required whenever any bucket is underfilled, and
recommended for every recurring run. Each row should be compact JSON:

```json
{"round":1,"bucket":"ai_oss","changed":["thesis_seed","source_module"],"query_or_source":"HN Show HN + GitHub topics","candidate":"...","product_shape_summary":"...","history_relation":"new","decision":"kill|backlog|promote","reason":"..."}
```

The ledger is not a dumping ground for every search result. It is proof that the
run widened the search space before accepting an underfilled bucket.

## Independent Reader Review

The Report Reader must read only the rendered report, not source notes,
dossiers, or chat history. The reader review must be saved as
`reader-review.md` or `reader-review.json`.

For each selected idea, the reader must record:

- what they think the idea is doing;
- product/repo form and target user;
- core object;
- inputs or permissions;
- outputs or state;
- user actions;
- first-version boundary;
- why it is not merely a prompt, checker, Action, wrapper, dashboard, or
  platform hook recipe;
- what they still do not understand;
- whether the explanation relies on forbidden vague phrasing, jargon, field
  filling, story theater, or "not X, but Y" as the main explanation;
- `pass`, `rewrite`, or `reject`.

The CEO / Orchestrator must revise or reject any idea marked `rewrite` or
`reject`. The final artifact checker fails if reader review is missing, if any
selected idea lacks a passing reader verdict, or if the review merely says
"yes" without restating the product shape.

## History Relation Rules

Build a compact backlog snapshot before final selection:

- names, aliases, statuses, and dossier/detail paths from `ideas.jsonl`;
- prior final/paused/rejected summaries from recent `handoff-index.md` and
  `report.md` files;
- known source URLs from top-level signals and run `source-notes.jsonl`;
- prior `duplicates`, `revives`, `merged_from`, `updates_existing`, and
  `adjacent_to` edges.

For each candidate, decide the strongest relationship:

- `new`: new thesis/workflow/target user/product form with no close stored idea.
- `update_existing`: same idea, but a new thesis or evidence changes verdict,
  product boundary, or competitor judgment.
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

- For weak ideas, write the direct kill reason and the evidence that changed the
  decision. Do not attach homework to make the idea feel actionable.
- Evidence should kill boring or false bets; it should not be used as the main
  imagination source.
- Source notes should explain what a source changed in the judgment, not merely
  list links.
- Report prose should prefer concrete runs over abstractions. Do not hide behind
  market nouns, invented category labels, or "AI can do X" language.

## Parallelism Rules

Use parallelism where it improves breadth:

- Good: independent thesis generation, source modules in parallel, competitor
  searches in parallel, independent critic perspectives, independent Report
  Reader review.
- Weak: parallel complaint scraping without thesis seeds, product archetypes, or
  promotion gates.

Use debate only when:

- support and opposition are both strong;
- a decision would affect real build time or distribution effort;
- CEO cannot resolve the dispute from first-pass evidence.

Debate output must be summarized into claims, counterclaims, evidence, and CEO
decision. Do not paste long transcripts unless explicitly requested.

## Handoff-Ready Artifact Rule

Every final idea must be saved as a standalone dossier before the run is
considered complete. A paused idea gets a dossier only when it is strong but has
one specific unresolved issue; weak/vetoed ideas get only concise death notes in
the report. The dossier should contain enough context for a future agent to
continue the idea without browsing again:

- core thesis and why-now logic;
- AI relevance and promotion-gate result;
- original signal links and source summaries used to support or kill the bet;
- product shape, how the product/OSS is used, what it replaces, and product scale;
- demo moment, repo/star asset, competitor and alternative reasoning;
- Red Team objections and CEO rulings;
- dangerous assumptions and first-version boundary.

Future handoff requests should read these dossiers first and should not repeat
source discovery unless the user asks for a current refresh.

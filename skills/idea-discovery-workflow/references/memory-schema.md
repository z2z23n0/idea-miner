# Memory Schema

Store run artifacts outside the skill directory:

```text
${IDEA_MINER_HOME:-$HOME/.idea-miner}/
  signals.jsonl
  ideas.jsonl
  claims.jsonl
  competitors.jsonl
  decisions.jsonl
  edges.jsonl
  handoff-events.jsonl
  runs/<run_id>/
    run-manifest.json
    report.md
    reader-review.md
    candidate-ledger.jsonl
    signal-portfolio.jsonl
    source-notes.jsonl
    ideas/<idea_id>.json
    ideas/<idea_id>.md
    handoff-index.md
```

Existing installs can keep using `CODEX_IDEA_DISCOVERY_HOME`. Helper scripts
should prefer an explicitly configured root, then reuse an existing readable
store under `$HOME/.idea-miner` or `$HOME/.codex/data/idea-discovery` before
creating a new empty store. Do not fork history just because defaults changed.

The top-level JSONL files are indexes for search and cross-run memory. They are
not enough for handoff by themselves. Each run must also save full run artifacts
under `runs/<run_id>/`, including one handoff-ready dossier per final or paused
idea that may be resumed.

The storage model is graph-shaped but starts as JSONL plus Markdown artifacts.
Do not introduce a graph database until relationship queries or volume justify
it.

## Record Types

`signals.jsonl`

```json
{"id":"sig_...","run_id":"...","bucket":"ai_platform_shift|oss_mindshare|ai_product_category|ai_prosumer_behavior|pain|competitor|...","final_bucket":"ai_oss|ai_product|ai_prosumer|cross_bucket","evidence_role":"supports|challenges|kills|sharpens|competitor","source_url":"...","source":"HN","observed_at":"...","freshness":"...","summary":"...","quote_summary":"...","current_alternative":"...","evidence_grade":"low|medium|high"}
```

`ideas.jsonl`

```json
{"id":"idea_...","run_id":"...","name":"...","aliases":["..."],"final_bucket":"ai_oss|ai_product|ai_prosumer","core_thesis":"...","ai_relevance":"AI-core|AI-native workflow|AI-leveraged|non-AI exceptional|non-AI reject","promotion_gate":"pass|backlog|reject","shape":"complete_ai_product|high_star_oss|SaaS|GitHub OSS|CLI|MCP|Skill|...","target_user":"...","status":"candidate|final|rejected|paused|revived|updated|duplicate","history_relation":"new|update_existing|duplicate_of|revives|merged_from|splits_from|adjacent_to","related_ideas":["idea_..."],"product_shape_summary":"...","dossier_path":"runs/<run_id>/ideas/<idea_id>.md","detail_path":"runs/<run_id>/ideas/<idea_id>.json"}
```

Keep `ideas.jsonl` compact, but always include `aliases`, `history_relation`,
`related_ideas`, `product_shape_summary`, `dossier_path`, and `detail_path` when
known. Put the full human-readable and machine-readable idea context into the
run artifact paths referenced by `dossier_path` and `detail_path`.

`claims.jsonl`

```json
{"id":"claim_...","run_id":"...","idea_id":"...","role":"critic|drafter|competitor|ceo|reader","stance":"supports|challenges|revises","claim":"...","evidence_urls":["..."],"confidence":"low|medium|high"}
```

`competitors.jsonl`

```json
{"id":"comp_...","run_id":"...","idea_id":"...","name":"...","url":"...","type":"direct|indirect|oss|platform|manual","adoption":"...","status":"paid|oss|closed|platform","gap":"...","blocks_opportunity":false}
```

`decisions.jsonl`

```json
{"id":"dec_...","run_id":"...","idea_id":"...","decision":"keep|narrow|pause|reject|rewrite","reason":"...","dangerous_assumptions":["..."],"decided_at":"..."}
```

`edges.jsonl`

```json
{"from":"sig_...","to":"idea_...","type":"supports|challenges|inspires|updates_existing|duplicate_of|revives|merged_from|splits_from|adjacent_to|handed_off_to_session","run_id":"...","note":"..."}
```

For new-session handoffs, use the idea id as `from`, the Codex thread/session id
as `to`, and `type = "handed_off_to_session"`.

`handoff-events.jsonl`

```json
{"id":"handoff_...","idea_id":"idea_...","idea_name":"...","run_id":"...","thread_id":"019...","thread_title":"Idea handoff: ...","handoff_path":"/tmp/handoff-...md","session_prompt_path":"/tmp/idea-session-prompt-...md","delivery":"new_session|file_only","created_at":"...","source_thread_id":"...","status":"created|failed","error":null}
```

This file records handoff delivery events, not idea evidence. Append one record
per destination session. When multiple ideas are handed off separately, write
one event per idea/session pair. When multiple ideas are intentionally combined
into one session, write one event per idea with the same `thread_id`, or one
combined event with an `idea_ids` array if the runtime cannot identify a single
primary idea.

`runs/<run_id>/candidate-ledger.jsonl`

```json
{"round":1,"bucket":"ai_oss","changed":["thesis_seed","source_module"],"query_or_source":"HN Show HN + GitHub topics","candidate":"...","product_shape_summary":"...","history_relation":"new","decision":"kill|backlog|promote","reason":"..."}
```

The ledger is required when any bucket is underfilled. It is proof of replenish
work, not a raw search dump.

`runs/<run_id>/reader-review.md`

This file is written by the Report Reader after reading only `report.md`.
Markdown is preferred because it is easy to inspect. JSON is allowed if the host
needs structured output. Each selected idea must have a verdict and an actual
reader restatement, not just `yes`.

Required per-idea content:

- reader's understanding of what the idea does;
- product/repo form and target user;
- core object;
- inputs or permissions;
- outputs or state;
- user actions;
- first-version boundary;
- why it is not merely a prompt, checker, Action, wrapper, dashboard, or
  platform hook recipe;
- unclear parts, if any;
- whether the explanation relies on jargon, field-filling, story theater, or
  "not X, but Y";
- verdict: `pass`, `rewrite`, or `reject`.

`runs/<run_id>/source-notes.jsonl`

```json
{"id":"src_...","run_id":"...","url":"...","platform":"GitHub","title":"...","final_bucket":"ai_oss|ai_product|ai_prosumer|cross_bucket","access_status":"fetched|summary-only|blocked|not-covered","observed_at":"...","freshness":"...","evidence_type":"issue|comment|docs|product_news|competitor","evidence_role":"supports|challenges|kills|sharpens|competitor","summary":"...","used_for":["idea_..."],"claims":["..."]}
```

This file is the source-level cache for later handoffs. It should contain
summaries, evidence roles, and claim mappings, not raw copyrighted articles or
private content.

`runs/<run_id>/ideas/<idea_id>.json`

```json
{
  "id": "idea_...",
  "run_id": "...",
  "name": "...",
  "aliases": ["..."],
  "final_bucket": "ai_oss|ai_product|ai_prosumer",
  "history_relation": "new|update_existing|duplicate_of|revives|merged_from|splits_from|adjacent_to",
  "related_ideas": [{"id": "idea_...", "name": "...", "relationship": "merged_from", "note": "..."}],
  "verdict": "keep|narrow|pause|reject",
  "confidence": "low|medium|high",
  "core_thesis": "...",
  "ai_relevance": "AI-core|AI-native workflow|AI-leveraged|non-AI exceptional|non-AI reject",
  "promotion_gate": {
    "decision": "pass|backlog|reject",
    "complete_ai_product_path": "pass|fail|not-applicable",
    "high_star_oss_path": "pass|fail|not-applicable",
    "product_or_oss_scale": "complete AI product|high-star OSS|backlog-only small tool",
    "why_final_slot": "...",
    "demo_moment": "...",
    "durable_asset": "..."
  },
  "product_shape": {
    "form": "SaaS|GitHub OSS|CLI|browser extension|desktop app|API|workflow surface",
    "target_user": "...",
    "task": "...",
    "inputs_or_permissions": ["..."],
    "core_objects": ["..."],
    "outputs_or_state": ["..."],
    "user_actions": ["..."],
    "first_version": ["..."],
    "non_goals": ["..."],
    "why_product_or_oss": "..."
  },
  "source_type": "...",
  "target_user": "...",
  "sources": ["src_..."],
  "alternatives": ["..."],
  "first_version": {"does": ["..."], "does_not_do": ["..."]},
  "product_forms": ["GitHub OSS", "CLI"],
  "competitors": ["comp_..."],
  "why_still_worth_doing": "...",
  "ai_leverage": "...",
  "red_team": [{"objection": "...", "response": "...", "ceo_ruling": "..."}],
  "reader_review": {"verdict": "pass|rewrite|reject", "path": "runs/<run_id>/reader-review.md"},
  "dangerous_assumptions": ["..."],
  "long_term_asset": "..."
}
```

Only include contact targets when the user explicitly asks for distribution or
outreach prep.

`runs/<run_id>/ideas/<idea_id>.md`

This Markdown file is the handoff-ready dossier. It must be detailed enough that
a later handoff request can be answered by reading the dossier and relevant run
artifacts, without repeating source discovery or competitor searches.

Required sections:

- Handoff purpose and current verdict.
- Core thesis, final bucket, AI relevance, and promotion-gate result.
- Product Shape / Idea Spine: product/repo form, target user and task, inputs or
  permissions, core objects, outputs or state, user actions, first-version
  boundary, explicit non-goals, and why this has product/OSS body.
- Origin in this workflow, including merged/duplicated prior ideas.
- History relation: whether this is new, an update, a duplicate, a revival, a
  merge, a split, or adjacent to stored ideas.
- Source map: original URLs, access status, observed freshness, and what each
  source supports.
- Current alternatives and competitor reasoning.
- Product form, first-version scope, explicit non-goals, and product-scale path.
- Red Team objections, responses, and CEO rulings.
- Reader review verdict and link to `reader-review.md`.
- Dangerous assumptions.
- Distribution or contact targets only when explicitly requested for the run.

Do not include generic skill suggestions.

`runs/<run_id>/handoff-index.md`

The index lists every final, paused, rejected, or merged idea and links to its
dossier. It should also call out aliases, duplicates, and renamed/merged
directions so one-line handoff requests can resolve the right dossier.

## When to Persist

- Persist all final ideas, rejected ideas, duplicate/update decisions, key
  signals, competitor findings, CEO decisions, and high-confidence claims.
- Persist the full report as `runs/<run_id>/report.md`.
- Persist independent reader review as `runs/<run_id>/reader-review.md` or
  `reader-review.json`.
- Persist `runs/<run_id>/candidate-ledger.jsonl` when any bucket is underfilled,
  and preferably for every recurring run.
- Persist a handoff-ready dossier for every final idea and every paused idea
  that may plausibly be resumed.
- Persist a `handoff-index.md` before the run completes. If persistence fails,
  say so in the user-facing report instead of silently relying on chat history.
- If a candidate is related to a prior idea, persist both the compact
  `history_relation` fields in `ideas.jsonl` and explicit relationship edges in
  `edges.jsonl`.
- If a stored idea is handed off to a new session, persist the session id in
  `handoff-events.jsonl` and add a `handed_off_to_session` edge when possible.
- Do not persist raw secrets, private user data, edit tokens, or unavailable
  page content.
- Mark links as inaccessible instead of fabricating summaries.
- Run `scripts/check-run-artifacts.mjs <run_dir>` when shell is available.
  If the check fails, fix the artifacts before considering the run complete; if
  the runtime cannot run the checker, state that in the report.

## Handoff Reads

When the user asks for a handoff of an idea from a prior run:

1. Search `ideas.jsonl` and `runs/*/handoff-index.md` for the idea name and
   known aliases.
2. Read the matching `runs/<run_id>/ideas/<idea_id>.md` dossier and adjacent
   `report.md`, `reader-review.md`, `source-notes.jsonl`, and JSON detail only
   if needed.
3. Do not repeat web searches or competitor scans by default. The handoff should
   be a packaging task, not a new research run.
4. Only refresh current facts when the user explicitly asks for latest/current
   status, or when the handoff will be used for immediate outreach and stale
   claims could mislead. Label refreshed facts separately from stored context.
5. If no dossier exists, reconstruct from available JSONL/report/chat artifacts
   and mark the output as `reconstructed; source detail may be incomplete`.

When the user asks where an idea was handed off, read `handoff-events.jsonl`
first, then follow any `handed_off_to_session` edges. Do not rely on chat
history as the only session mapping.

## When to Upgrade to a Graph Database

Stay with JSONL/SQLite until one of these is true:

- 200-500 ideas or 2000+ signals are accumulated.
- The workflow frequently asks "which old idea is this similar to?"
- Competitor state needs temporal tracking.
- Relationship queries become painful in JSONL.

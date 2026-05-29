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
  runs/<run_id>/
```

Existing installs can keep using `CODEX_IDEA_DISCOVERY_HOME`; the helper
scripts still honor it as a fallback.

The storage model is graph-shaped but starts as JSONL. Do not introduce a graph
database until relationship queries or volume justify it.

## Record Types

`signals.jsonl`

```json
{"id":"sig_...","run_id":"...","bucket":"pain","source_url":"...","source":"HN","observed_at":"...","freshness":"...","summary":"...","quote_summary":"...","current_alternative":"...","evidence_grade":"low|medium|high"}
```

`ideas.jsonl`

```json
{"id":"idea_...","run_id":"...","name":"...","source_type":"...","shape":"CLI|MCP|Skill|OSS|...","target_user":"...","status":"candidate|final|rejected|paused|revived","priority":"P0|P1|P2|null"}
```

`claims.jsonl`

```json
{"id":"claim_...","run_id":"...","idea_id":"...","role":"critic|drafter|competitor|ceo","stance":"supports|challenges|revises","claim":"...","evidence_urls":["..."],"confidence":"low|medium|high"}
```

`competitors.jsonl`

```json
{"id":"comp_...","run_id":"...","idea_id":"...","name":"...","url":"...","type":"direct|indirect|oss|platform|manual","adoption":"...","status":"paid|oss|closed|platform","gap":"...","blocks_opportunity":false}
```

`decisions.jsonl`

```json
{"id":"dec_...","run_id":"...","idea_id":"...","decision":"advance|validate|narrow|pause|reject","reason":"...","dangerous_assumptions":["..."],"stop_line":"...","decided_at":"..."}
```

`edges.jsonl`

```json
{"from":"sig_...","to":"idea_...","type":"supports|challenges|inspires|duplicates|revives","run_id":"...","note":"..."}
```

## When to Persist

- Persist all final ideas, rejected ideas, key signals, competitor findings, CEO
  decisions, and high-confidence claims.
- Do not persist raw secrets, private user data, edit tokens, or unavailable
  page content.
- Mark links as inaccessible instead of fabricating summaries.

## When to Upgrade to a Graph Database

Stay with JSONL/SQLite until one of these is true:

- 200-500 ideas or 2000+ signals are accumulated.
- The workflow frequently asks "which old idea is this similar to?"
- Competitor state needs temporal tracking.
- Relationship queries become painful in JSONL.

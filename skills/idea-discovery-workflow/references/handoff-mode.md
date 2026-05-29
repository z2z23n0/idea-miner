# Handoff Mode

Use this mode when the user asks to hand off a stored idea, for example:

- `handoff Tool-Call Compatibility & Replay Testkit`
- `交接 Agent Done Gate 的全部上下文`
- `把 Workflow Cost & Quality Testkit 的 idea 详细交接一下`

The goal is to package already-stored context. Handoff mode is not a new
research run.

## Default Behavior

1. Resolve the idea by name, id, alias, merged name, or dossier filename.
2. Read the stored dossier under
   `${IDEA_MINER_HOME:-$HOME/.idea-miner}/runs/<run_id>/ideas/<idea_id>.md`.
3. Read adjacent artifacts only when useful:
   `handoff-index.md`, `report.md`, `source-notes.jsonl`, and
   `ideas/<idea_id>.json`.
4. Render the handoff to a file produced by `mktemp -t handoff-XXXXXX.md`.
5. Return the file path and a short note.

Do not browse, search, or re-run competitor checks by default. If the user asks
for "最新", "刷新", "current", distribution prep, or similar current-state work,
refresh only the facts that need freshness and label them separately from the
stored dossier context.

## Missing Dossier Behavior

If no dossier exists:

1. Reconstruct from `ideas.jsonl`, `claims.jsonl`, `competitors.jsonl`,
   `decisions.jsonl`, `edges.jsonl`, `signals.jsonl`, and any saved `report.md`
   or `handoff-index.md`.
2. Mark the output as `reconstructed; source detail may be incomplete`.
3. Do not silently fill gaps by inventing source detail.
4. Ask before doing a fresh web research pass unless the user already requested
   a refresh.

## Handoff Output Contract

The handoff must be detailed enough for a fresh agent to continue work without
reading the original chat. Include:

- current verdict and confidence;
- what the idea is and how it is used;
- origin and merged/renamed prior ideas;
- source map with original URLs, access status, freshness, and supported claims;
- current alternatives and competitor reasoning;
- MVP scope, explicit non-goals, product form, and product-scale path;
- Red Team objections, responses, and CEO rulings;
- dangerous assumptions, shortest evidence path, and stop line;
- concrete first actions for the next thread.

Do not include generic skill recommendations. Different users have different
skill sets, so keep the handoff focused on idea context and executable next
steps.

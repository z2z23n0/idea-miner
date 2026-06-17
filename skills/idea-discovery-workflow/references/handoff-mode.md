# Handoff Mode

Use this mode when the user asks to hand off a stored idea, for example:

- `handoff Tool-Call Compatibility & Replay Testkit`
- `交接 Agent Done Gate 的全部上下文`
- `把 Workflow Cost & Quality Testkit 的 idea 详细交接一下`
- `handoff Tool-Call Compatibility 到新 session`
- `分别把这 3 个 idea handoff 到新 session`

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
stored dossier context. For those refreshes, first try Grok search MCP
(prefer `mcp__grok_search.grok_web_search`; older runtimes may expose
`grok_search.grok_ask` / `mcp__grok_search.grok_ask` with `search: "web"`),
then fall back to Codex web/search/browser/GitHub tools if Grok is unavailable,
fails, or cannot cover the needed source.

## New Session Delivery

When the user asks to hand off an idea "to a new session", "到新 session",
"开新 session", or similar, keep handoff mode as a packaging task first, then
deliver the package to a new Codex thread if the runtime exposes thread/session
tools.

Default routing:

- One idea -> create one new session.
- Multiple ideas -> create one new session per idea by default.
- Multiple ideas with an explicit "same session", "一个新 session", or "合并"
  instruction -> create one combined new session.

Do not start implementation, browsing, outreach, or new research inside the new
session unless the user explicitly asks for that. A plain handoff should make
the new session confirm receipt, summarize the context, and wait for the next
instruction.

Recommended execution in Codex:

1. Run `scripts/idea-handoff.mjs --session-prompt --idea "<idea name>"` for each
   separate target idea. Use `--combined --session-prompt` only when the user
   explicitly asks for one combined destination session.
2. Read the returned `session_prompt_path`.
3. If `codex_app.create_thread` or the host's equivalent session tool is
   available, call it with:
   - `target.type = "projectless"` unless the user specified a workspace;
   - `target.directoryName = suggested_directory_name`;
   - `prompt = <contents of session_prompt_path>`;
   - low or medium thinking, unless the user asked the child session to begin
     substantive work.
4. Set the thread title to `suggested_title`.
5. Read the thread once to confirm it reached `idle` or a completed first turn.
6. Report the thread id(s), title(s), and handoff file path(s).

If the session tool is not available, do not fake the handoff. Return the
`handoff_path` and `session_prompt_path`, and say that the current runtime did
not expose new-session creation.

After a successful new-session handoff, append a compact event to
`handoff-events.jsonl` when the store is writable, and add an `edges.jsonl`
relationship of type `handed_off_to_session` from the idea id to the thread id.
This makes later questions such as "那个 idea 交到哪个 session 了" answerable
from local memory.

## Missing Dossier Behavior

If no dossier exists:

1. Reconstruct from `ideas.jsonl`, `claims.jsonl`, `competitors.jsonl`,
   `decisions.jsonl`, `edges.jsonl`, `signals.jsonl`, and any saved `report.md`
   or `handoff-index.md`.
2. Mark the output as `reconstructed; source detail may be incomplete`.
3. Do not silently fill gaps by inventing source detail.
4. Ask before doing a fresh web research pass unless the user already requested
   a refresh. If a refresh is requested, use Grok search MCP first and fall
   back to Codex search tools when needed.

## Handoff Output Contract

The handoff must be detailed enough for a fresh agent to continue work without
reading the original chat. Include:

- current verdict and confidence;
- what the idea is and how it is used;
- origin and merged/renamed prior ideas;
- source map with original URLs, access status, freshness, and supported claims;
- current alternatives and competitor reasoning;
- first-version scope, explicit non-goals, product form, and product-scale path;
- Red Team objections, responses, and CEO rulings;
- dangerous assumptions.

Do not include generic skill suggestions. Different users have different
skill sets, so keep the handoff focused on idea context.

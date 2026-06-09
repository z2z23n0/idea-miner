# Report Format

Final output must be Chinese Markdown. The report is a product memo for a
reader, not an internal checklist and not a story scene. It should let a reader
explain what concrete AI product or OSS project would exist.

Necessary proper nouns, product names, repo names, and common technical
abbreviations may stay in English. Uncommon English terms, invented protocol or
object names, and non-obvious domain phrases must get a Chinese parenthetical
gloss or an explanatory Chinese sentence the first time they carry the
explanation. If the reader needs to understand a sentence full of English object
names before they can understand the idea, rewrite it in Chinese first and keep
the English only as labels.

The report should not become a table of fields. Use normal paragraphs. A good
idea section makes the reader understand:

```text
what product/repo form this is
who uses it and for which task
what input or permission the user gives it
what core object it creates or maintains
what output or state the user gets
what the first version does and does not do
why it is a complete product or high-star OSS, not a prompt/checker/wrapper
```

Avoid using "不是 X，而是 Y" as the main explanation. If boundary clarification
is needed, write the positive product/repo explanation first, then add one short
boundary note.

# 今天值得看的方向

Open with selected ideas only, grouped by final bucket. Do not order ideas
against each other inside a bucket. Do not assign P-labels or any other
ordering badge.

Use these buckets by default:

- `ai_oss`：AI agent / devtool / infra / eval / security / OSS.
- `ai_product`：complete AI workflow products for teams or professional users.
- `ai_prosumer`：AI products for founders, creators, researchers, students,
  independent developers, or other understandable prosumer users.

Each bucket may contain up to 3 ideas. If a bucket is underfilled, say
`本轮不足 3 个，不降标补位` for that bucket and summarize that bucket's
replenish proof from `candidate-ledger.jsonl`.

For each selected idea, write 3-6 plain Chinese sentences. The opening should
already be understandable; do not make the reader wait for a later checklist.

# Discovery Context

Keep this short. Explain the run boundary, topic, major source buckets, real
sub-agent usage, and any uncovered source class. Do not make this the main
body.

# Thesis Pool

Summarize the strongest thesis directions that shaped the run:

| Bucket | Thesis | Why now | Possible product / OSS shape | Fate |
|---|---|---|---|---|

`Fate` can be `selected`, `merged`, `rejected`, or `backlog`.

# Candidate Ledger Summary

Summarize replenish attempts. Do not claim a bucket was exhausted unless
`candidate-ledger.jsonl` records the rounds, changed search dimensions,
candidates, and kill reasons.

| Round | Bucket | What changed | Candidate | Decision | Reason |
|---:|---|---|---|---|---|

# Evidence Notes

Evidence is supporting context, not the idea itself. Include only evidence that
changes how a reader understands the selected ideas or rejected directions.

| Source | Role | What it changed |
|---|---|---|

Roles: `supports`, `challenges`, `kills`, `sharpens`, `competitor`.

# 最终 Ideas

Include up to 9 selected ideas, grouped as up to 3 `ai_oss`, up to 3
`ai_product`, and up to 3 `ai_prosumer`. Keep ideas as bucketed sets, not a
global ranked list.

## Bucket：ai_oss

Use this bucket for AI agent/developer infrastructure, high-star OSS, protocol,
benchmark, dataset, SDK, CLI, MCP, Skill, workflow, security, or tooling ideas.

## Bucket：ai_product

Use this bucket for complete AI workflow products aimed at teams or
professional users. The workflow itself must be AI-native or agentic; do not
default to unfamiliar vertical SaaS.

## Bucket：ai_prosumer

Use this bucket for AI products that a founder, creator, researcher, student,
independent developer, or similar prosumer can understand and reuse.

## Idea：名称

Start with a compact product-shape memo in natural Chinese. A useful shape is:

- first paragraph: what product/repo form it is, who uses it, and for which
  task;
- second paragraph: what input or permission it receives, what core object it
  creates or maintains, and what output/state appears;
- third paragraph: what the first version only does, what it explicitly does
  not do, and why it has product/OSS body beyond a thin wrapper.

Then add concise judgment context:

- why now / source-backed timing;
- current alternatives and the gap;
- first-version boundary and durable asset;
- biggest risk;
- verdict: `值得继续想`, `作为备选`, `暂缓`, or `不建议做`.

Do not repeat the same section titles for every idea if the prose already makes
the idea clear. The reader should understand the thing before seeing any
judgment label.

# 被放弃的方向

List rejected or paused candidates briefly. Say why each did not become one of
today's selected ideas. Do not expand them into full ideas. Group rejections by
bucket when that helps explain underfilled categories.

# Independent Reader Review

The report must point to the independent reader review artifact:

- `reader-review.md` or `reader-review.json`

The reader review is not an author-written yes/no table. It must be written by a
Report Reader that only saw the rendered report, not the internal source notes
or chat. For every selected idea it must include:

- what the reader thinks the idea is doing;
- product/repo form and target user;
- core object;
- inputs or permissions;
- outputs or state;
- user actions;
- first-version boundary;
- why it is not merely a prompt, checker, Action, wrapper, dashboard, or
  platform hook recipe;
- what remains unclear, if anything;
- whether the idea relies on vague jargon, field filling, story theater, or
  "not X, but Y";
- whether uncommon English terms or invented object names are explained in
  Chinese well enough for a Chinese reader;
- verdict: `pass`, `rewrite`, or `reject`.

Any selected idea with `rewrite` or `reject` must be revised or removed before
the final artifacts are considered complete.

# 来源附录

Deduplicate links and group them by source bucket.

# 保存位置

End scheduled or recurring runs with artifact paths:

- `report.md`
- `reader-review.md` or `reader-review.json`
- `candidate-ledger.jsonl`
- `source-notes.jsonl`
- `handoff-index.md`
- per-idea dossiers under `ideas/<idea_id>.md`
- artifact check status: passed / failed / not run

If persistence failed or the environment was read-only, say so explicitly. If
the artifact check failed, include the failure summary and do not present the
run as a normal success.

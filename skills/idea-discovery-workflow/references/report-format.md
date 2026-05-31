# Report Format

Final output must be Chinese Markdown. The report is a product memo for a
reader, not an internal checklist. It should help the reader understand each
idea as a real product or OSS project: who it is for, when it appears, what the
user sees, why it might matter now, and why existing substitutes leave room.

# 今天值得看的方向

Open with the selected ideas only. Do not order them against each other. Do not
assign P-labels or any other ordering badge.

For each selected idea, write 2-4 plain Chinese sentences:

- what it is;
- who would care;
- what concrete moment makes it useful;
- why it belongs in today's selected set.

# Discovery Context

Keep this short. Explain the run boundary, topic, major source buckets, and any
uncovered source class. Do not make this the main body.

# Thesis Pool

Summarize the strongest thesis directions that shaped the run:

| Thesis | Why now | Possible product / OSS shape | Fate |
|---|---|---|---|

`Fate` can be `selected`, `merged`, `rejected`, or `backlog`.

# Evidence Notes

Evidence is supporting context, not the idea itself. Include only evidence that
changes how a reader understands the selected ideas or rejected directions.

| Source | Role | What it changed |
|---|---|---|

Roles: `supports`, `challenges`, `kills`, `sharpens`, `competitor`.

# 最终 Ideas

Include up to 3 selected ideas. Keep them as a set. Each idea should use this
shape.

## Idea：名称

### 一句话

One plain Chinese sentence. It should mention the audience, the moment, and the
thing being built.

### 具体使用场景

Tell the reader what is happening before the product appears. Name the user,
their current task, what goes wrong today, and why they care.

### 产品到底是什么

Describe the product surface. What does the user open, run, install, or visit?
What is the first interaction? What does the system return? Avoid abstract
labels unless immediately grounded in what the user sees.

### 今天怎么解决

Describe the current workaround as a short narrative. Explain why it is painful
or incomplete.

### 关键洞察

Explain the new product or OSS insight. This is the reason the idea is not just
a feature list.

### 为什么现在值得做

Use the smallest useful amount of source-backed reasoning. Connect each source
or trend to the idea's timing.

### 现有替代与缺口

Discuss the most important substitutes. For each, explain what it solves and
what gap remains.

### 第一个版本怎么切

Describe a credible first version: the narrow user, the narrow workflow, what it
does, and what it intentionally does not do. This section is about product
shape, not homework for the reader.

### 如果做成会积累什么

Name the durable asset: dataset, benchmark, protocol, examples, plugin
ecosystem, workflow memory, community, or distribution surface.

### 最大风险

List the 2-3 facts that would most likely make the idea unattractive.

### 我的判断

Use a short verdict such as `值得继续想`, `作为备选`, `暂缓`, or `不建议做`.
Explain the judgment in 1-2 sentences. Do not order selected ideas against each
other.

# 被放弃的方向

List rejected or paused candidates briefly. Say why each did not become one of
today's selected ideas. Do not expand them into full ideas.

# Reader Check

Before saving artifacts, check whether a reader can retell every selected idea
without reading the original chat:

| Idea | Can a reader retell it? | If not, what was rewritten? |
|---|---|---|

Reject or rewrite idea sections where:

- the reader cannot tell what product or repo would exist;
- the report explains an internal gate instead of the idea;
- the first interaction is missing;
- the idea is mostly a market label, technology name, wrapper, template, or
  platform patch;
- sources are dumped without explaining what they changed.

# 来源附录

Deduplicate links and group them by source bucket.

# 保存位置

End scheduled or recurring runs with artifact paths:

- `report.md`
- `handoff-index.md`
- per-idea dossiers under `ideas/<idea_id>.md`
- artifact check status: passed / failed / not run

If persistence failed or the environment was read-only, say so explicitly. If
the artifact check failed, include the failure summary and do not present the
run as a normal success.

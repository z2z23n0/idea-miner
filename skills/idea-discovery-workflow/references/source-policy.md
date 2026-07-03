# Thesis & Source Policy

The discovery run is thesis-first and imagination-led. Evidence is useful, but
it is not the idea generator. Use evidence to kill, sharpen, or de-risk bold
AI-era product bets after the run has generated a thesis portfolio.

Default scope:

- Stay inside the AI / agent / AI-workflow world unless the user explicitly
  asks to widen the search. Do not make unfamiliar vertical SaaS the default.
- Generate across three final buckets:
  - `ai_oss`: AI agent, developer, infrastructure, eval, security, protocol,
    SDK, CLI, MCP, Skill, benchmark, dataset, or high-star OSS opportunities.
  - `ai_product`: complete AI products for teams or professional users where
    the main workflow is AI-native, agentic, evaluative, context-heavy,
    reliability-heavy, or model/platform-shift-driven.
  - `ai_prosumer`: AI products for founders, creators, researchers, students,
    independent developers, operators, or other users the report reader can
    plausibly understand without a domain primer.
- Aim for up to 9 final ideas: at most 3 per bucket. If a bucket has fewer than
  3 strong ideas, leave it underfilled and prove the replenish attempts in
  `candidate-ledger.jsonl`. Do not lower standards or cross-fill with weak bets.
- Final ideas should be `AI-core` or `AI-native workflow` by default.
  `AI-leveraged` needs unusually strong product/OSS completeness. Non-AI ideas
  belong in backlog unless the user explicitly asks to widen scope.
- GitHub Actions, CI gates, PR comments, templates, hook recipes, checklist
  automation, wrappers, and platform-changelog patches can be integration
  surfaces, but they are not final idea bodies by themselves.

## Discovery Order

Do not begin a normal recurring run by mining complaints and turning each one
into a small tool. Use this order instead:

1. **Discovery Thesis**: generate 20-30 high-imagination theses about what AI,
   agents, open-source distribution, platform shifts, developer behavior,
   context, memory, evaluation, reliability, and AI-native work make newly
   possible.
2. **Bet Sketches**: turn the strongest theses into product/OSS bets with a
   product shape, why-now logic, and a durable asset.
3. **Evidence Sweep**: inspect current sources to find supporting or killing
   signals, competitors, substitutes, and platform absorption risks.
4. **Product Shape Gate**: reject or rewrite bets that cannot be explained by
   a reader as a concrete product or repo.
5. **Promotion Gate**: promote only bets that pass AI relevance and product/OSS
   completeness gates. Everything else becomes backlog or death notes.
6. **Independent Reader Review**: a Report Reader who did not participate in
   discovery reads only the rendered report and records whether each idea can be
   understood.

## Product Shape Standard

An idea is understandable only when a reader can explain what product or repo
would exist:

```text
This is a product/repo with a clear form.
It is for a specific user doing a specific task.
The user gives it specific inputs or permissions.
It creates or maintains named core objects.
It returns outputs or state the user can inspect or act on.
The first version has a narrow boundary and explicit non-goals.
It has product/OSS body beyond a prompt, checker, Action, wrapper, dashboard,
or platform hook recipe.
```

This is not a field checklist for the report. It is the standard for whether
the idea exists clearly enough to be selected. The report should use natural
Chinese prose and concrete product/repo objects rather than headings that make
the idea look filled-in but still vague. Usage context is welcome, but do not
turn the explanation into a story scene where someone clicks through a day.

Reject or rewrite candidates where:

- the explanation is mostly a product name, market label, or abstract noun;
- the reader cannot say what product/repo form exists;
- the reader cannot name the target user, input, output/state, and core object;
- it depends on unfamiliar vertical jargon without a short, concrete primer;
- the idea can only be explained as "not X, but Y";
- the idea is really a prompt, checker, dashboard, GitHub Action, wrapper,
  script, or platform patch with no larger product/OSS body;
- the shape contains no concrete object such as a command, repo, issue,
  workspace, file, page, queue, trace, browser session, dataset, benchmark, or
  user-visible result.

The phrase pattern "不是 X，而是 Y" should not be used as the core explanation.
If boundary clarification is needed, first explain the positive product/repo
shape, then add a short boundary note only when it prevents a likely
misunderstanding.

## Thesis Seeds

Use these as generators, not as fixed keywords:

- Which AI agent workflows now need a protocol, fixture, policy, benchmark,
  state file, replay log, permission layer, or compatibility surface?
- Which AI coding aftershocks create new pain around review, debugging, tests,
  deployment, rollback, ownership, context, cost, or trust?
- Which repo could show a memorable intelligent behavior in 30 seconds and earn
  stars because the demo is obvious?
- Which context, memory, provenance, permission, identity, eval, or reputation
  layer becomes infrastructure when agents participate in long-running work?
- Which team AI workflow is currently a pile of prompts, docs, Slack threads,
  spreadsheets, screenshots, and manual review that can become a repeatable
  product?
- Which AI product category has a strong thesis but bad current UX, pricing,
  trust, observability, self-hosting, or workflow fit?
- Which creator, researcher, founder, student, or independent developer task can
  become a repeated AI workflow rather than a one-off chat?
- Which platform capability shift creates a new open-source standard, migration
  layer, conformance suite, playground, dataset, or interoperability layer?
- Which old product category becomes small-team-buildable because AI changed
  the cost of operations, data interpretation, follow-through, or support?
- Which existing tool will feel wrong when the primary worker is an AI agent
  rather than a human clicking a UI?

## Evidence Role

Evidence is the brake and sharpening tool:

- Use it to discover competitors, substitutes, platform absorption, adoption,
  pricing, source freshness, and obvious kill reasons.
- Use it to test whether a thesis has a real vocabulary, community, and
  distribution path.
- Do not require direct complaint evidence before a thesis can be considered.
- Do not reward a candidate merely because one user complained and a small
  checker can be built.
- Do not let evidence wording replace product shape. A source can support a bet,
  but the report still has to explain what product or repo would exist.

Evidence weight should be low during generation and higher during Red Team:
roughly 40% imagination/new thesis, 20% AI relevance, 20% product/OSS clarity,
10% feasibility, 10% evidence.

## Search Tool Preference

All web, realtime, competitor, trend, community, product, and source freshness
searches should first try the Grok search MCP. Prefer
`mcp__grok_search.grok_web_search` for web search; older runtimes may expose
`grok_search.grok_ask` or `mcp__grok_search.grok_ask` with `search: "web"`. If
the MCP is not available in the current session, fails to start, times out,
returns an access/tool error, or does not cover the source class needed, fall
back to Codex's built-in web/search/browser/GitHub tools.

Record the search tool used in `source-notes.jsonl` when it affected coverage,
freshness, or a fallback decision. For X/Twitter, do not assume native X search
is available through the CLI-backed Grok MCP; use
`mcp__grok_search.grok_x_search` only when it is exposed, otherwise try web
queries such as `site:x.com ...`, use another available current-source tool if
present, or mark the X-only source as `未覆盖/受限`.

## Source Modules

After thesis generation, use source modules as independent lenses. Record
coverage and limitations. Default modules:

- `ai_oss`: HN, GitHub, developer Reddit, Discord/forum search, npm/PyPI/
  Homebrew/Docker package surfaces, changelogs, release notes, docs, issues,
  discussions, benchmarks, standards, examples, and abandoned-but-loved repos.
- `ai_product`: Product Hunt, official product launches, pricing pages, help
  centers, changelogs, docs, user communities, G2/Capterra when relevant,
  review posts, comparison pages, customer stories, platform announcements, and
  AI workflow category pages.
- `ai_prosumer`: App Store, Google Play, Chrome Web Store, Product Hunt,
  YouTube demos, creator/founder/researcher/student/indie-developer communities,
  niche Reddit/HN threads, social-search discussions, review posts, visible
  workaround content, and comparison pages.
- Cross-bucket search: direct competitors, indirect substitutes, "alternative
  to", pricing, review backlash, support docs, tutorials, comparison pages,
  forum complaints, and current platform changes.
- Trend radar: AI news sites, builder newsletters, analyst newsletters, and
  curated X/Twitter lists. Use them to notice new platform shifts, vocabulary,
  launch clusters, and unusually active conversations. Do not treat them as
  proof that a final idea is valuable.

Trend radar sources are allowed early in evidence sweep and replenish rounds,
but they have a narrow job: generate or refresh thesis candidates, timing
questions, and platform-change checks. A radar signal can promote a search
query, not a final idea. Before a radar-triggered candidate enters final, confirm
it with at least one bucket-native or primary source such as official docs,
pricing/changelog pages, GitHub repos/issues, HN/Reddit discussion, Product
Hunt, app/extension reviews, customer stories, package/download evidence, or
direct competitor pages.

Default radar set:

- AI news and product radar: The Decoder, VentureBeat AI, Axios AI+, MIT
  Technology Review's AI coverage, and other current AI news/category pages.
- Builder newsletters and blogs: TLDR AI, The Batch, Latent Space / AI
  Engineer, Simon Willison, Import AI, and similar AI builder or research feeds.
- Analyst and market newsletters: SemiAnalysis, Stratechery, The Information's
  AI Agenda, and other sources that explain platform economics, distribution,
  infra cost, or company strategy.
- X/Twitter lists: separate lab/platform accounts, builder/devtool accounts,
  and market/reporter/investor accounts. Do not use generic trending topics as
  proof; record the specific account/list context and confirm elsewhere.
- Optional X/Twitter review: when the runtime already has Xquik or OpenClaw,
  [TweetClaw](https://github.com/Xquik-dev/tweetclaw) can review search
  exports, account lists, or monitor outputs before they become evidence notes.
  Use it to make the source packet easier to audit, not to promote a radar
  signal into a final idea without independent confirmation.

If a source class cannot be accessed, mark it as `未覆盖/受限`. Do not replace
AI product or AI prosumer coverage with more developer sources unless the run is
explicitly scoped to developer tooling.

## Source Buckets

| Bucket | What to Look For | How to Use It |
|---|---|---|
| AI/platform shift | new agent/model/devtool capability, API, protocol, pricing, limits | create or sharpen theses |
| OSS mindshare | fast-star repos, demos, benchmarks, standards, playgrounds | judge high-star potential |
| AI product category | launches, pricing, docs, positioning, comments | find category formation, gaps, and product surfaces |
| AI prosumer behavior | repeated creator/founder/researcher/student/indie workflows | find repeated usage moments and product wedges |
| Pain/complaints | repeated workflow pain, current workaround, switching language | support or kill a bet |
| Competitor gaps | closed source, expensive, hard to self-host, weak docs, poor UX | locate wedge or reject crowded ideas |
| Reviews/evals | low-star complaints, praise patterns, why people switch | test substitutes and distribution |
| Trend radar | AI news sites, newsletters, analyst notes, curated X/Twitter lists | notice shifts and generate queries, not final proof |
| Trend window | repeated signals across 7-30 days | timing check, not proof by itself |

## Promotion Fit

Raw signals may surface any market. A candidate can enter serious review only if
it can plausibly become one of:

- an AI-core or AI-native workflow product;
- a complete AI SaaS/app/platform direction;
- a GitHub OSS project with a clear demo, repo asset, star mindshare, and
  contribution/extension path;
- an AI prosumer workflow with repeat use and visible user value.

Every promoted candidate must declare a `final_bucket`: `ai_oss`, `ai_product`,
or `ai_prosumer`. Bucket fit is not cosmetic:

- `ai_oss` must explain the repo asset, demo, ecosystem, and why developers
  would star, install, contribute, or depend on it.
- `ai_product` must explain the AI-native workflow, team/professional user,
  current substitute, product surface, and expansion path without drifting into
  unfamiliar vertical jargon.
- `ai_prosumer` must explain the repeated personal/professional use moment,
  visible substitute behavior, retention loop, product surface, and why the
  target user can understand and keep using it.

Quarantine or reject candidates that are only:

- GitHub Action, CI gate, PR comment, checklist automation, template, config
  package, hook recipe, or thin wrapper;
- a platform changelog patch likely to be absorbed quickly;
- a complaint-to-small-tool response with no new thesis or product shape;
- a one-off script that cannot become a memorable product or repo;
- unfamiliar vertical SaaS that requires domain taste the user has not asked to
  develop;
- physical products, inventory, local services, hardware manufacturing, offline
  logistics, consumer brands, or pure operations arbitrage;
- generic content/SEO plays without a defensible workflow.

## AI Relevance Labels

Label every serious candidate:

- `AI-core`: AI/agent/LLM is the core product behavior; without it the product
  collapses.
- `AI-native workflow`: the opportunity exists because AI agents change how work
  is done, audited, tested, distributed, or trusted.
- `AI-leveraged`: AI meaningfully improves the product, but deterministic
  systems still carry the main value.
- `non-AI exceptional`: not AI, but only allowed when the user explicitly widens
  scope or the bet is clearly stronger than the AI candidates.
- `non-AI reject`: ordinary software/tooling opportunity; backlog or reject.

AI that only summarizes release notes, writes PR comments, explains diffs, or
converts CSV/text into config is not enough for `AI-core` or
`AI-native workflow`.

## Query Planning

Run `scripts/idea-scout-kit.mjs` when useful. With no arguments, it creates a
thesis-first plan, bet sketch templates, source modules, Product Shape gate,
replenish ledger template, independent reader review instructions, and
promotion gates. With explicit topics, it treats them as thesis constraints,
not as a replacement for imagination. It does not browse or verify realtime
facts.

# Source Policy

The discovery run uses a Signal Portfolio, not a single search path. The default
is source-first discovery: inspect current source feeds first, then derive
keywords from promising raw signals. Cover at least 4 signal buckets and collect
at least 12 candidate signals when access allows it.

Do not start a normal recurring run with fixed topic keywords such as `MCP`,
`Codex`, `AI coding agents`, or `developer tools` unless the user explicitly
asks for that topic. Fixed seed keywords collapse the search space and cause
daily runs to rediscover the same ideas. Use keywords after a raw signal has
been found, to enrich evidence, search competitors, and test repeatability.

## Signal Buckets

| Bucket | What to Look For | Typical Ideas |
|---|---|---|
| Pain / complaints | Reddit/HN long threads, GitHub issues, low reviews, workarounds, `I wish there was`, pricing complaints | painkillers, open-source alternatives, scripts, CLI tools |
| Product / platform news | official blogs, release notes, changelogs, Show HN, Product Hunt, new model/agent/devtool features | cross-platform replicas, compatibility tools, templates, migration helpers |
| Competitor gaps | closed source, expensive, no self-hosting, complex install, poor docs, slow issues, enterprise-heavy positioning | developer-first OSS, CLI-first tools, repair layers |
| Open-source ecosystem | GitHub topics/trending/releases, stars/forks, recent commits, issues/PRs, tutorials, downstream dependencies | maintainership takeovers, plugins, adapters, test/conformance suites |
| Trend window | repeated signals across communities within 7-30 days | timing judgment, ICP refinement, shortest evidence path |
| Reviews / evaluations | G2, Capterra, Chrome Web Store, App Store, Product Hunt comments, blog/video reviews | UX gaps, price gaps, missing workflows |

## Source Modules

Use source modules as independent lenses. Record coverage or limitations for
each module.

- HN: front page, newest, Ask HN, Show HN, long comments, objections.
- Reddit: niche subreddits, new/high-interaction posts, workarounds,
  willingness to pay, multiple agreeing users.
- GitHub: trending, new repos, topics, recent issues, discussions, PRs,
  releases, stars/forks.
- Product Hunt: today/recent launches, new products, maker comments,
  positioning, launch strategy.
- Reviews: review sites, app stores, extension stores, blog/video reviews,
  low-star complaints.
- Official: recent docs, pricing pages, release notes, changelogs, official
  blogs.
- Search: cross-check alternatives, tutorials, comparison pages, cached pages.

## Keyword Policy

- If the user provides explicit topics, use them as scoped enrichment lenses.
- If the user does not provide topics, do not invent default topic seeds.
- First gather source-native signals such as today's launches, newest threads,
  trending repos, fresh issues, recent changelog entries, low reviews, or new
  competitor pages.
- For each promising signal, derive 3-8 follow-up search phrases from the
  signal itself: product name, user phrase, error message, competitor category,
  workflow, pricing complaint, or platform feature.
- Mark every follow-up query as `signal-derived`. This makes it clear that the
  keyword came from fresh evidence, not from a standing bias.
- Reusing a prior idea's name as a keyword is allowed only for backlog update,
  competitor refresh, or handoff refresh; it should not seed new discovery.

## Fit Gate

Raw sources may surface any market. Filter by opportunity fit after collection,
not by pre-search keywords.

Keep a raw signal only when it can plausibly become one of:

- software, SaaS, app, web app, CLI, GitHub OSS, library, SDK, MCP server, Skill,
  browser extension, template, GitHub Action, automation script, data product, or
  agent workflow;
- an open-source project with plausible users/stars/forks/issues;
- a commercial product with reachable users, buyer, budget, or distribution;
- a non-software pain that can be reframed into a software/tooling opportunity.

Reject or quarantine signals that are only:

- physical products, inventory, local services, hardware manufacturing, offline
  logistics, consumer brands, or pure operations arbitrage;
- generic content/SEO plays without a defensible workflow;
- topics outside the user's stated exclusions or reachable distribution.

Example: `sell socks` is rejected. `Shopify apparel sellers cannot understand
return reasons and size complaints from reviews/support tickets` may pass as a
software analytics idea.

## Idea Source Types

Label every candidate:

- Direct pain signal
- Signal inference
- Product/platform news trigger
- Feature replica
- Competitor-gap extension
- Ecosystem-change derivative
- Cross-domain analogy
- Original hypothesis

Original, analogy, news-triggered, and replica ideas require stricter Red Team
review and a concrete shortest evidence path that can falsify the opportunity.

## Query Planning

Run `scripts/idea-scout-kit.mjs` when useful. With no arguments, it creates a
source-first plan and empty tables. With explicit topics, it adds topic-guided
enrichment queries. It does not replace browsing or realtime verification.

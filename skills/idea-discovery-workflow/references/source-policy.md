# Source Policy

The discovery run uses a Signal Portfolio, not a single search path. Cover at
least 4 signal buckets and collect at least 12 candidate signals when access
allows it.

## Signal Buckets

| Bucket | What to Look For | Typical Ideas |
|---|---|---|
| Pain / complaints | Reddit/HN long threads, GitHub issues, low reviews, workarounds, `I wish there was`, pricing complaints | painkillers, open-source alternatives, scripts, CLI tools |
| Product / platform news | official blogs, release notes, changelogs, Show HN, Product Hunt, new model/agent/devtool features | cross-platform replicas, compatibility tools, templates, migration helpers |
| Competitor gaps | closed source, expensive, no self-hosting, complex install, poor docs, slow issues, enterprise-heavy positioning | developer-first OSS, CLI-first tools, repair layers |
| Open-source ecosystem | GitHub topics/trending/releases, stars/forks, recent commits, issues/PRs, tutorials, downstream dependencies | maintainership takeovers, plugins, adapters, test/conformance suites |
| Trend window | repeated signals across communities within 7-30 days | timing judgment, ICP refinement, outreach list |
| Reviews / evaluations | G2, Capterra, Chrome Web Store, App Store, Product Hunt comments, blog/video reviews | UX gaps, price gaps, missing workflows |

## Source Modules

Use source modules as independent lenses. Record coverage or limitations for
each module.

- HN: Ask HN, Show HN, long comments, objections.
- Reddit: niche subreddits, workarounds, willingness to pay, multiple agreeing users.
- GitHub: topics, trending, issues, discussions, PRs, releases, stars/forks.
- Product Hunt: new products, maker comments, positioning, launch strategy.
- Reviews: review sites, app stores, extension stores, blog/video reviews.
- Official: docs, pricing pages, release notes, changelogs, official blogs.
- Search: cross-check alternatives, tutorials, comparison pages, cached pages.

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
review and a concrete 7-14 day falsification plan.

## Query Planning

Run `scripts/idea-scout-kit.mjs <topic...>` when useful. It creates search
queries and empty tables; it does not replace browsing or realtime verification.

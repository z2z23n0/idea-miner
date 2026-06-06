# Thesis & Source Policy

The discovery run is thesis-first and imagination-led. Evidence is useful, but
it is not the idea generator. Use evidence to kill, sharpen, or de-risk bold
product bets after the run has generated a thesis portfolio.

Default thesis:

- Generate across three final buckets by default, not only AI coding or
  developer tooling:
  - `dev_oss`: developer/agent infrastructure, high-star OSS, protocol,
    benchmark, SDK, CLI, MCP, Skill, or workflow projects.
  - `vertical_b2b`: complete workflow products for specific professional,
    operational, back-office, compliance, support, sales, finance, legal,
    healthcare admin, education admin, ecommerce, recruiting, real-estate, or
    local-service teams.
  - `consumer_prosumer`: consumer, prosumer, creator, student, parent,
    freelancer, personal productivity, wellness, learning, travel, home,
    finance, or lifestyle apps where AI changes a recurring user workflow.
- Aim for up to 9 final ideas: at most 3 per bucket. If a bucket has fewer than
  3 strong ideas, leave it underfilled and explain why. Do not let `dev_oss`
  fill empty `vertical_b2b` or `consumer_prosumer` slots.
- Final ideas must be either complete product directions or GitHub OSS projects
  with plausible high-star mindshare. `dev_oss` may satisfy the high-star OSS
  path; `vertical_b2b` and `consumer_prosumer` should normally satisfy the
  complete-product path.
- Non-AI ideas may enter final only as exceptional product/OSS bets. A
  reasonable small tool is not enough.
- GitHub Actions, CI gates, PR comments, templates, hook recipes, and checklist
  automation can be integration surfaces, but they are not final idea bodies by
  themselves.

## Discovery Order

Do not begin a normal recurring run by mining complaints and turning each one
into a small tool. Use this order instead:

1. **Discovery Thesis**: generate 20-30 high-imagination theses about what AI,
   agents, open-source distribution, platform shifts, developer behavior,
   professional work, and everyday user behavior will make newly possible.
2. **Bet Sketches**: turn the strongest theses into product/OSS bets with a
   product form, target user, 30-second demo moment, repo/star asset, and why-now
   logic.
3. **Evidence Sweep**: inspect current sources to find supporting or killing
   signals, competitors, substitutes, and platform absorption risks.
4. **Promotion Gate**: promote only bets that pass AI relevance and
   product/OSS-completeness gates. Everything else becomes backlog or death
   notes.

## Thesis Seeds

Use these as generators, not as fixed keywords:

- Which old workflows become newly cheap, reliable, or autonomous because of
  agents?
- Which human-facing UI should become an agent-readable protocol, state file,
  test, policy, memory, or benchmark?
- Which repos would get stars because they demonstrate an intelligent behavior
  in 30 seconds?
- Which data, eval, context, permission, cost, or identity layer becomes more
  important when agents write or operate software?
- Which product category was previously too expensive for a solo builder but is
  now plausible because AI changed the cost structure?
- Which platform change creates a new open-source standard, conformance suite,
  playground, dataset, or interoperability layer?
- Which existing tool will feel wrong when the primary user is an AI agent
  rather than a human clicking a UI?
- Which professional service, admin, compliance, support, sales, recruiting,
  education, healthcare, ecommerce, or local-service workflow was too bespoke or
  labor-heavy before AI?
- Which consumer or prosumer activity changes when the user can delegate
  interpretation, memory, planning, coaching, comparison, drafting, or
  follow-through to AI?
- Which neglected user group has painful software because the market was too
  small for traditional SaaS but plausible for a small AI-native product now?

## Evidence Role

Evidence is the brake and sharpening tool:

- Use it to discover competitors, substitutes, platform absorption, adoption,
  pricing, source freshness, and obvious kill reasons.
- Use it to test whether a thesis has a real vocabulary, community, and
  distribution path.
- Do not require direct complaint evidence before a thesis can be considered.
- Do not reward a candidate merely because one user complained and a small
  checker can be built.

Evidence weight should be low during generation and higher during Red Team:
roughly 40% imagination/new thesis, 20% AI relevance, 20% product/OSS
completeness, 10% feasibility, 10% evidence.

## Source Modules

After thesis generation, use source modules as independent lenses. Record
coverage and limitations.

Use the source plan by bucket:

- `dev_oss`: HN, GitHub, developer Reddit, Discord/forum search, npm/PyPI/
  Homebrew/Docker package surfaces, changelogs, release notes, docs, issues,
  discussions, benchmarks, standards, examples, and abandoned-but-loved repos.
- `vertical_b2b`: G2, Capterra, TrustRadius, vendor reviews, pricing pages,
  industry forums, trade publications, vertical subreddits, professional Slack/
  Discord/forum posts, job descriptions, workflow templates, help centers,
  case studies, compliance/news changes, and manual-service substitutes.
- `consumer_prosumer`: App Store, Google Play, Chrome Web Store, Product Hunt,
  TikTok/YouTube demos and comments, creator communities, student/parent/
  freelancer forums, niche Reddit, comparison pages, low-star reviews,
  social-search discussions, and visible workaround content.
- Cross-bucket search: direct competitors, indirect substitutes, "alternative
  to", pricing, review backlash, support docs, tutorials, comparison pages,
  forum complaints, and current platform changes.

If a source class cannot be accessed, mark it as `未覆盖/受限`. Do not replace
consumer or vertical coverage with more developer sources unless the run is
explicitly scoped to developer tooling.

## Source Buckets

| Bucket | What to Look For | How to Use It |
|---|---|---|
| AI/platform shift | new agent/model/devtool capability, API, protocol, pricing, limits | create or sharpen theses |
| OSS mindshare | fast-star repos, demos, benchmarks, standards, playgrounds | judge high-star potential |
| Product category | new launches, pricing pages, positioning, comments | find category formation or gaps |
| Pain/complaints | repeated workflow pain, current workaround, switching language | support or kill a bet |
| Competitor gaps | closed source, expensive, hard to self-host, weak docs, poor UX | locate wedge or reject crowded ideas |
| Reviews/evals | low-star complaints, praise patterns, why people switch | test substitutes and distribution |
| Trend window | repeated signals across 7-30 days | timing check, not proof by itself |
| Vertical workflow | professional forums, review sites, job posts, templates, help centers | identify buyer, workflow, budget, and manual substitute |
| Consumer/prosumer behavior | app reviews, creator demos, social comments, forum workarounds | identify recurring personal workflow and UX gaps |

## Promotion Fit

Raw signals may surface any market. A candidate can enter serious review only if
it can plausibly become one of:

- an AI-core or AI-native workflow product;
- a complete SaaS/app/platform direction;
- a GitHub OSS project with a clear demo, repo asset, star mindshare, and
  contribution/extension path;
- a non-AI exceptional product/OSS bet that is stronger than typical AI
  candidates.

Every promoted candidate must declare a `final_bucket`: `dev_oss`,
`vertical_b2b`, or `consumer_prosumer`. Bucket fit is not cosmetic:

- `dev_oss` must explain the repo asset, demo, ecosystem, and why developers
  would star, install, contribute, or depend on it.
- `vertical_b2b` must explain the buyer/user, recurring workflow, budget or
  operational pressure, current manual/software substitute, product surface,
  and expansion path.
- `consumer_prosumer` must explain the recurring personal use moment, retention
  loop, emotional/utility value, current app/manual substitute, product surface,
  and why a broad-enough audience would keep using it.

Quarantine or reject candidates that are only:

- GitHub Action, CI gate, PR comment, checklist automation, template, config
  package, hook recipe, or thin wrapper;
- a platform changelog patch likely to be absorbed quickly;
- a complaint-to-small-tool response with no new thesis or product shape;
- a one-off script that cannot become a memorable product or repo;
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
- `non-AI exceptional`: not AI, but strong enough as a complete product or
  high-star OSS project to be considered.
- `non-AI reject`: ordinary software/tooling opportunity; backlog or reject.

AI that only summarizes release notes, writes PR comments, explains diffs, or
converts CSV/text into config is not enough for `AI-core` or
`AI-native workflow`.

## Query Planning

Run `scripts/idea-scout-kit.mjs` when useful. With no arguments, it creates a
thesis-first plan, bet sketch templates, source modules, and promotion gates.
With explicit topics, it treats them as thesis constraints, not as a replacement
for imagination. It does not browse or verify realtime facts.

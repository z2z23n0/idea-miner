# Role Contracts

Use real sub-agents if available and useful. The Report Reader is different
from the discovery roles: when the runtime supports a separate agent/session,
use it for reader review. If a real reader agent is unavailable, simulate it
only as a fallback and state that in the report and `reader-review` artifact.

## CEO / Orchestrator

- Owns the run thesis, iteration limit, conflicts, and final decisions.
- Keeps the workflow imagination-led: evidence can kill or sharpen bets, but it
  must not reduce discovery to complaint-to-tool generation.
- Loads the backlog snapshot before final selection and forces every candidate
  through the history relation gate.
- Rejects weak ideas instead of filling quota.
- Owns the AI-focused 3-bucket final shape: up to 3 `ai_oss`, up to 3
  `ai_product`, and up to 3 `ai_prosumer`.
- Does not make unfamiliar vertical SaaS a default bucket. A domain-heavy idea
  can enter only when the user explicitly asks to widen scope or the report
  makes the domain concrete enough for the reader.
- Owns the replenish loop. When any requested bucket has fewer than 3 passing
  ideas, sends Thesis Scout and Drafter back for bucket-specific theses,
  product archetypes, product/repo forms, core objects, repo/product assets, target users,
  source modules, or AI-era capability shifts instead of lowering standards.
- Records replenish attempts in `candidate-ledger.jsonl`; without that ledger,
  the report must not claim the search was broadened.
- Forces every serious candidate through the Product Shape Gate before final
  selection.
- Forces every final idea to pass AI relevance and product/OSS promotion gates.
- Applies complete AI product and high-star OSS gates separately. `ai_oss` can
  pass through high-star OSS; `ai_product` and `ai_prosumer` normally need
  complete-product proof.
- Rejects ideas whose main explanation is "not X, but Y", generic market
  labels, invented SaaS nouns, dashboards, wrappers, checkers, PR comments,
  GitHub Actions, templates, or hook recipes without a larger product/OSS body.
- Runs independent reader review after rendering the report and before treating
  artifacts as complete. If the Report Reader cannot explain the idea's
  product/repo form, target user, core object, inputs, outputs, first-version
  boundary, and product/OSS body, the CEO must rewrite or reject it.
- Does not let old ideas occupy final slots unless a new thesis or evidence
  materially changes verdict, product boundary, product shape, or competitor
  judgment.
- Ensures the report is normal Markdown before any host-specific control block.

## Thesis Scout

- Generates 20-30 high-imagination theses before source collection unless the
  user explicitly asks for a narrow market scan.
- Generates across `ai_oss`, `ai_product`, and `ai_prosumer` by default.
- Uses AI-native products, agent workflows, AI coding, AI infra, eval,
  reliability, context, memory, permission, provenance, security, and high-star
  OSS as thesis territory.
- Does not drift into healthcare, insurance, construction, local services,
  compliance-heavy verticals, or other unfamiliar vertical SaaS unless the user
  explicitly asks for that domain.
- Produces why-now logic and the shift that makes each thesis newly plausible.
- Avoids safe restatements of user complaints as small tools.
- When underfilled, changes the thesis seed, capability shift, product
  archetype, product/repo form, core object, repo/product asset, or source
  module instead of merely searching another complaint source.

## Signal Scout

- Builds the source plan and Signal Portfolio after thesis/bet sketches exist.
- Builds a bucketed source plan for `ai_oss`, `ai_product`, and `ai_prosumer`.
  Do not replace missing AI product/prosumer coverage with extra developer
  sources unless the user explicitly scopes the run to developer tooling.
- Collects links, dates/freshness, evidence type, user quote summary, current
  alternative, competitor signals, and kill signals.
- Covers source classes relevant to the three AI buckets: GitHub, HN,
  developer forums, package ecosystems, official docs/blogs/changelogs,
  Product Hunt, pricing pages, help centers, app/extension stores, review
  sites, comparison pages, creator/founder/researcher/student communities,
  Reddit/HN discussions, demos, and visible workaround content.
- Derives enrichment keywords from thesis/bet sketches and raw signals after
  collection.
- Marks uncovered or restricted sources.
- Avoids treating one viral post, one complaint, or one product release as a
  complete opportunity.
- Separates evidence roles: `supports`, `challenges`, `kills`, `sharpens`, or
  `competitor`.

## Idea Drafter

- Turns thesis seeds into at least 8-12 product/OSS bet sketches before CEO
  selection.
- Labels AI relevance: `AI-core`, `AI-native workflow`, `AI-leveraged`,
  `non-AI exceptional`, or `non-AI reject`.
- Labels final bucket: `ai_oss`, `ai_product`, or `ai_prosumer`.
- Writes a draft product shape for every serious candidate: product/repo form,
  target user and task, inputs or permissions, core objects, outputs or state,
  user actions, first-version boundary, explicit non-goals, and why it is a
  complete product or high-star OSS rather than a prompt/checker/wrapper.
- Labels source type and evidence level, but does not over-weight evidence
  during ideation.
- Labels each candidate's history relation before it can become final: `new`,
  `update_existing`, `duplicate_of`, `revives`, `merged_from`, `splits_from`, or
  `adjacent_to`.
- States product scale: complete AI product, high-star OSS, platform module,
  large product direction, mixed path, or backlog-only small tool.
- Adds a 30-second demo moment and repo/star asset for every OSS-shaped bet.
- Treats GitHub Action, CI gate, PR comment, template, hook, script, checker,
  dashboard, or checklist as integration surfaces. They cannot be the idea body
  unless attached to a broader complete product or high-star OSS project.
- Replaces killed candidates with genuinely new bets. Do not keep a weak idea
  alive by renaming it from Action to CLI, hook, internal dogfood, template, or
  small tool unless the user's goal changes.
- Treats duplicate candidates as backlog updates or death notes unless they
  have decision-changing new evidence or a new thesis.

## Red Team / Critic

- Tries to kill candidates with the strongest plausible objections.
- Checks for weak thesis, lack of AI relevance, lack of audience, no high-star
  OSS mindshare, mature competitors, distribution failure, maintenance burden,
  platform absorption, and "just a feature/integration" risk.
- Checks whether the idea can be understood as a product or repo. If the
  candidate only says workflow, evidence, desk, dashboard, assistant, platform,
  intelligence, or orchestration without product form, inputs, outputs, core
  objects, user actions, and first-version boundary, push it back or kill it.
- Checks bucket drift: developer tools disguised as broader products, broad
  market labels without a product surface, one-off AI chat wrappers, and
  prosumer ideas without repeat use.
- Flags forbidden explanation patterns where the main definition relies on
  "not X, but Y" rather than a positive product/repo explanation, or where the
  report turns clarity into a story scene.
- Applies stricter burden to original, analogy, replica, news-triggered, and
  non-AI exceptional ideas.
- Has veto power on hard-kill conditions: target mismatch, Action-only/CI-only
  shape, thin wrapper, platform absorption, internal-only value, no credible
  open-source/project asset, no product shape, no demo moment, or no product
  surface. A vetoed candidate leaves the final pool.

## Competitor Investigator

- Searches direct competitors, indirect substitutes, OSS, SaaS, browser
  extensions, CLIs, templates, internal manual workflows, platform features, and
  platform-native absorption paths.
- For `ai_oss`, checks GitHub topics, related repos, package ecosystems,
  issues/discussions, HN/Reddit mentions, docs, releases, and abandoned-but-loved
  projects.
- For `ai_product`, checks launches, pricing pages, docs, help centers,
  comparison pages, review sites, product communities, official platform
  changes, and workflow substitutes.
- For `ai_prosumer`, checks app stores, extension stores, Product Hunt, demos,
  creator/founder/researcher/student communities, forums, and visible
  workarounds.
- Evaluates competitor scope, adoption, satisfaction, price/open-source gap,
  UX, distribution, whether the substitute is good enough, and whether a new
  product/OSS bet has a memorable wedge.

## Report Reader

- Reads only the rendered report. Do not read source notes, dossiers, chat
  history, prompts, or internal scratchpads before writing the reader review.
- Acts like someone who did not participate in discovery and is trying to
  understand what the selected ideas would actually do.
- For each selected idea, writes:
  - what they think the idea is doing;
  - product/repo form and target user;
  - core object;
  - inputs or permissions;
  - outputs or state;
  - user actions;
  - first-version boundary;
  - why it is not merely a prompt, checker, Action, wrapper, dashboard, or
    platform hook recipe;
  - what remains unclear, if anything;
  - whether the explanation relies on jargon, field-filling, story theater, or
    "not X, but Y";
  - verdict: `pass`, `rewrite`, or `reject`.
- Fails ideas when it can only repeat the title or abstract nouns.
- Fails ideas whose product shape requires specialized domain knowledge not
  provided in the report.
- Does not introduce new ideas, broaden the scope, or do fresh web research by
  default. Its job is reader comprehension and artifact quality.
- Saves the result as `reader-review.md` or `reader-review.json`.

## Skill Optimizer

- Reports only high-confidence, actionable improvements to this workflow or
  `ai-founder-playbook`.
- Does not edit skill files during an automated run unless explicitly asked.

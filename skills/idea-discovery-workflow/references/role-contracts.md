# Role Contracts

Use real sub-agents if available and useful. If not, simulate the roles in one
run and say so in the report.

## CEO / Orchestrator

- Owns the run thesis, iteration limit, conflicts, and final decisions.
- Keeps the workflow imagination-led: evidence can kill or sharpen bets, but it
  must not reduce discovery to complaint-to-tool generation.
- Loads the backlog snapshot before final selection and forces every candidate
  through the history relation gate.
- Rejects weak ideas instead of filling quota.
- Owns the replenish loop: when fewer than 3 ideas pass, sends Thesis Scout and
  Drafter back for new theses, product archetypes, demo moments, repo assets, or
  AI-era capability shifts instead of lowering standards.
- Forces every final idea to pass AI relevance and product/OSS promotion gates.
- Forces every final idea to read like a real product or OSS project, not an
  internal gate checklist.
- Forces every final idea to be understandable as an actual complete product
  direction or high-star OSS project, not just a small integration surface.
- Runs the Reader Clarity Gate before saving final artifacts. If the Report
  Reader cannot restate an idea as a concrete product/OSS bet, the CEO must
  rewrite or reject it instead of shipping a vague report.
- Does not let old ideas occupy final slots unless a new thesis or evidence
  materially changes verdict, product boundary, or competitor judgment.
- Ensures the report is normal Markdown before any host-specific control block.

## Thesis Scout

- Generates 20-30 high-imagination theses before source collection unless the
  user explicitly asks for a narrow market scan.
- Focuses on AI-native products, agent workflows, AI coding, AI infra, developer
  tools for the AI era, and high-star OSS opportunities.
- Uses source feeds and history as stimulus, not as the only idea generator.
- Produces "why now" logic and the shift that makes each thesis newly plausible.
- Avoids safe restatements of user complaints as small tools.
- When underfilled, changes the thesis seed, capability shift, product
  archetype, demo moment, or repo asset instead of merely searching another
  complaint source.

## Signal Scout

- Builds the source plan and Signal Portfolio after thesis/bet sketches exist.
- Collects links, dates/freshness, evidence type, user quote summary, current
  alternative, competitor signals, and kill signals.
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
- Labels source type and evidence level, but does not over-weight evidence during
  ideation.
- Labels each candidate's history relation before it can become final: `new`,
  `update_existing`, `duplicate_of`, `revives`, `merged_from`, `splits_from`, or
  `adjacent_to`.
- States product scale: complete product, high-star OSS, platform module, large
  product direction, mixed path, or backlog-only small tool.
- Adds usage semantics for each serious candidate: when the user uses it, what
  input it takes, what it does, what it outputs, and what current manual
  workaround it replaces.
- Adds a 30-second demo moment and repo/star asset for every OSS-shaped bet.
- Treats GitHub Action, CI gate, PR comment, template, hook, script, or checklist
  as integration surfaces. They cannot be the idea body unless attached to a
  broader complete product or high-star OSS project.
- Replaces killed candidates with genuinely new bets. Do not keep a weak idea
  alive by renaming it from Action to CLI, hook, internal dogfood, template, or
  small tool unless the user's goal changes.
- Treats duplicate candidates as backlog updates or death notes unless they have
  decision-changing new evidence or a new thesis.

## Red Team / Critic

- Tries to kill candidates with the strongest plausible objections.
- Checks for weak thesis, lack of AI relevance, lack of buyer/audience, no
  high-star OSS mindshare, mature competitors, distribution failure, maintenance
  burden, platform absorption, and "just a feature/integration" risk.
- Applies stricter burden to original, analogy, replica, news-triggered, and
  non-AI exceptional ideas.
- Has veto power on hard-kill conditions: target mismatch, Action-only/CI-only
  shape, thin wrapper, platform absorption, internal-only value, no credible
  open-source/project asset, no demo moment, or no product surface. A vetoed
  candidate leaves the final pool.

## Competitor Investigator

- Searches direct competitors, indirect substitutes, OSS, SaaS, browser
  extensions, CLIs, templates, internal manual workflows, platform features, and
  platform-native absorption paths.
- Evaluates competitor scope, adoption, satisfaction, price/open-source gap,
  UX, distribution, whether the substitute is good enough, and whether a new
  product/OSS bet has a memorable wedge.

## Report Reader

- Reads the final report as someone who did not participate in discovery.
- For each final idea, tries to restate the product/OSS bet in plain language:
  who it is for, when it appears, what the user sees, what current workaround it
  replaces, what key insight makes it interesting, why now, what substitutes
  miss, the first-version boundary, durable asset, and major risks.
- Flags any idea that is only a theme, market label, technology name, generic
  "AI can do X" direction, evidence dump, GitHub Action, CI gate, PR comment,
  checklist, template, or wrapper without a larger product/OSS body.
- Checks whether source links and dossiers support the claims made in the
  product card. Generic feed URLs are not enough unless `source-notes.jsonl`
  records the specific observed signal and claim mapping.
- Does not introduce new ideas, broaden the scope, or do fresh web research by
  default. Its job is reader comprehension and artifact quality.
- Can be a real sub-agent when the runtime supports one; otherwise the
  Orchestrator must simulate this role and say so in the report.

## Skill Optimizer

- Reports only high-confidence, actionable improvements to this workflow or
  `ai-founder-playbook`.
- Does not edit skill files during an automated run unless explicitly asked.

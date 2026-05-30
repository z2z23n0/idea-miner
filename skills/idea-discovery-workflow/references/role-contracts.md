# Role Contracts

Use real sub-agents if available and useful. If not, simulate the roles in one
run and say so in the report.

## CEO / Orchestrator

- Owns the run scope, iteration limit, conflicts, and final decisions.
- Loads the backlog snapshot before candidate selection and forces every
  candidate through the history relation gate.
- Rejects weak ideas instead of filling quota.
- Owns the replenish loop: when fewer than 3 ideas pass, sends Scout/Drafter
  back for new source modules, keywords, ICPs, shapes, or competitor categories
  instead of lowering standards.
- Forces every final idea to include the shortest decision-changing evidence
  path and stop line; does not allow generic validation homework.
- Forces every final idea to be understandable as an actual product, tool,
  open-source project, SaaS, platform module, or workflow, including how it is
  used and what product scale it currently deserves.
- Does not let old ideas occupy final slots unless new evidence materially
  changes priority, verdict, MVP boundary, competitor judgment, or stop line.
- Ensures the report is normal Markdown before any host-specific control block.

## Signal Scout

- Builds the source plan and Signal Portfolio.
- Starts from source-native current feeds by default. Do not use standing topic
  keywords unless the user explicitly supplied them.
- Derives enrichment keywords from raw signals after collection.
- Collects links, dates/freshness, evidence type, user quote summary, and current
  alternative.
- Marks uncovered or restricted sources.
- Avoids turning one viral post or one product release into an opportunity.
- When the candidate pool is underfilled, expands into new communities,
  competitor classes, platform changes, review sources, source-native feeds, or
  adjacent workflows based on the last round's kill reasons.

## Idea Drafter

- Drafts at least 5 candidates before CEO selection.
- Labels source type and evidence level.
- Labels each candidate's history relation before it can become final: new,
  update_existing, duplicate_of, revives, merged_from, splits_from, or
  adjacent_to.
- Keeps shapes small when possible: CLI, GitHub Action, MCP server, Skill,
  browser extension, SDK, template, workflow, script, or narrow OSS library.
- Does not assume small is always better. For each candidate, state the current
  product scale: small tool, open-source project, SaaS, platform module, large
  product direction, or mixed path.
- Adds usage semantics for each serious candidate: when the user uses it, what
  input it takes, what it does, what it outputs, and what current manual
  workaround it replaces.
- Revises or replaces candidates after Critic and Competitor review.
- Replaces killed candidates with genuinely new hypotheses. Do not keep a weak
  idea alive by renaming it from Action to CLI, hook, internal dogfood, or small
  tool unless the user's goal changes.
- Treats duplicate candidates as backlog updates or death notes unless they have
  decision-changing new evidence.

## Red Team / Critic

- Tries to kill candidates with the strongest plausible objections.
- Checks for weak pain, lack of buyer/audience, mature competitors, distribution
  failure, maintenance burden, and "just a feature" risk.
- Applies stricter burden to original, analogy, replica, and news-triggered ideas.
- Has veto power on hard-kill conditions: target mismatch, thin wrapper, platform
  absorption, internal-only value, no credible open-source/project asset, or no
  short evidence path. A vetoed candidate leaves the final pool.

## Competitor Investigator

- Searches direct competitors, indirect substitutes, OSS, SaaS, browser
  extensions, CLIs, templates, internal manual workflows, and platform features.
- Evaluates competitor scope, adoption, satisfaction, price/open-source gap,
  UX, distribution, and whether the substitute is good enough.

## Skill Optimizer

- Reports only high-confidence, actionable improvements to this workflow or
  `ai-founder-playbook`.
- Does not edit skill files during an automated run unless explicitly asked.

# Role Contracts

Use real sub-agents if available and useful. If not, simulate the roles in one
run and say so in the report.

## CEO / Orchestrator

- Owns the run scope, iteration limit, conflicts, and final decisions.
- Rejects weak ideas instead of filling quota.
- Forces every final idea to include a validation plan and stop line.
- Forces every final idea to be understandable as an actual product, tool,
  open-source project, SaaS, platform module, or workflow, including how it is
  used and what product scale it currently deserves.
- Ensures the report is normal Markdown before any host-specific control block.

## Signal Scout

- Builds the source plan and Signal Portfolio.
- Collects links, dates/freshness, evidence type, user quote summary, and current
  alternative.
- Marks uncovered or restricted sources.
- Avoids turning one viral post or one product release into an opportunity.

## Idea Drafter

- Drafts at least 5 candidates before CEO selection.
- Labels source type and evidence level.
- Keeps shapes small when possible: CLI, GitHub Action, MCP server, Skill,
  browser extension, SDK, template, workflow, script, or narrow OSS library.
- Does not assume small is always better. For each candidate, state the current
  product scale: small tool, open-source project, SaaS, platform module, large
  product direction, or mixed path.
- Adds usage semantics for each serious candidate: when the user uses it, what
  input it takes, what it does, what it outputs, and what current manual
  workaround it replaces.
- Revises or replaces candidates after Critic and Competitor review.

## Red Team / Critic

- Tries to kill candidates with the strongest plausible objections.
- Checks for weak pain, lack of buyer/audience, mature competitors, distribution
  failure, maintenance burden, and "just a feature" risk.
- Applies stricter burden to original, analogy, replica, and news-triggered ideas.

## Competitor Investigator

- Searches direct competitors, indirect substitutes, OSS, SaaS, browser
  extensions, CLIs, templates, internal manual workflows, and platform features.
- Evaluates competitor scope, adoption, satisfaction, price/open-source gap,
  UX, distribution, and whether the substitute is good enough.

## Skill Optimizer

- Reports only high-confidence, actionable improvements to this workflow or
  `ai-founder-playbook`.
- Does not edit skill files during an automated run unless explicitly asked.

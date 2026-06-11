# Contributing

Thanks for helping improve idea-miner.

## Before Opening A PR

- Keep changes focused on the skills, prompts, scripts, or documentation in this repository.
- Do not commit runtime data, local automation configs, API keys, private source lists, personal idea notes, or generated run artifacts.
- If you change workflow behavior, update the relevant skill/reference docs and any helper script that enforces the same contract.
- If you change a helper script, include a short command or output snippet in the PR description showing how you checked it.

## Development

This repository has no package install step for normal documentation or skill edits.
For script changes, use Node.js and run the affected helper directly, for example:

```bash
node scripts/install-local.mjs --dry-run
node skills/idea-discovery-workflow/scripts/idea-scout-kit.mjs
```

## Pull Request Notes

Describe what changed, why it changed, and whether the change affects private local stores or scheduled runs.
If the change is about launch, licensing, or public positioning, call that out explicitly.

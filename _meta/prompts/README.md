# Reusable prompt fragments

> Snippets you can paste into a Cursor / Claude Code session to kick off a common Lumen workflow. Each file is a complete prompt — copy from the start of the H1 to the end of the file.

## Index

- [new-component.md](./new-component.md) — Scaffold a new component (md + json + example + registry entry + changelog).
- [token-update.md](./token-update.md) — Add or modify a semantic token, with impact analysis.
- [platform-port.md](./platform-port.md) — Port an existing component to a new platform.
- [audit-dashboard-tab.md](./audit-dashboard-tab.md) — Add a new tab to the audit dashboard.
- [accessibility-pass.md](./accessibility-pass.md) — Run an accessibility pass on a page or component.

## Convention

Each prompt fragment:
- Starts with `Goal:` — what the user wants to achieve.
- Lists `Inputs:` — what the user must supply.
- Provides `Steps:` — the canonical sequence the agent should follow.
- Lists `Verify:` — what the agent must check before claiming done.

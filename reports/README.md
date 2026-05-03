# reports/

Generated artifacts from validation, lint, and audit runs. Land here so they can be opened, diffed, and archived without polluting the source tree.

Conventions:

- **`reports/contrast/{date}.json`** — `pnpm validate:contrast` output (per-pair pass/fail, light + dark).
- **`reports/lint/{date}.txt`** — `pnpm lint` violation snapshots (one file per release).
- **`reports/cls/{date}.json`** — `pnpm cls` Lighthouse output.
- **`reports/audit-dashboard/{tab}.png`** — visual snapshots from the audit dashboard at release time.

Files older than the last two releases get pruned by `scripts/release.mjs`.

# ADR 0009 — Single semver for the whole system, not per-component

- **Date:** 2026-05-02
- **Status:** Accepted

## Context

Versioning options for a design system:
- **Per-component** (Sparkbox / Lerna pattern, ~2018-2022) — each component gets its own version.
- **Single system version** (Material 3, Carbon, Primer in 2026).
- **Calendar version** (CalVer, e.g. 2026.04).

## Decision

**Single semver for the whole system** (`MAJOR.MINOR.PATCH`).

Bump rules:
- **MAJOR** — token removed, prop removed, component removed, breaking schema change.
- **MINOR** — new token, new prop, new component, deprecation announced.
- **PATCH** — bug fix, doc fix, accessibility fix that doesn't change API.

Keep-a-Changelog format in `CHANGELOG.md`. `[Unreleased]` heading promotes to a tagged version on release.

Deprecations live ≥ 1 minor release before removal. Removal happens in the next major.

## Consequences

**Positive:**
- Communicates breakage clearly to consumers.
- Tightly-coupled tokens make per-component versioning misleading (changing `color.accent.500` affects every component).
- Single number to track in changelogs, ADRs, and CI.

**Negative:**
- A small bug fix in one component bumps the system version. Acceptable — clearer than the alternative.
- Calver's "you always know the date" benefit is lost. Acceptable — we have CHANGELOG entries with dates.

## Cadence (for a small in-house team)

- MINOR every 4-6 weeks.
- MAJOR once a year.
- PATCH as needed.

The discipline that matters is the deprecation grace period — never break consumers without warning.

## References

- [semver.org](https://semver.org)
- [Keep a Changelog](https://keepachangelog.com)
- Nathan Curtis (EightShapes) — [Versioning Design Systems](https://medium.com/eightshapes-llc/versioning-design-systems-48cceb5ace4d)
- `/research/system-architecture.md` § "Versioning, changelog, deprecation"

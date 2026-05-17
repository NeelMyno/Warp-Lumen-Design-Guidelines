# LUMEN v0.13 — Kick-Off (fire-and-forget)

Paste this once as your first message to Claude Code. It activates the master doc as your operating contract and puts you into the right execution mode. After this, you wait for the operator to paste each phase prompt one at a time.

---

## Your operating contract

The master refactor briefing lives at `design-system/AGENTS.md` on the `v0.13.0` branch of the `Warp-Lumen-Design-Guidelines` repo. Read it end to end before you do anything else. That file is the **single source of truth** for this refactor. Every constraint, every hard rule, every folder-structure decision, every paste-ready template, every verification gate, every phase summary — all of it is in there.

Treat the master doc as canonical. When this kick-off or any phase prompt says something that appears to contradict the master doc, the master doc wins. When the master doc says something that appears to contradict reality (a token name that's not on `/foundations`, a library version that no longer exists), surface the contradiction in the phase report and proceed with your best resolution.

## Cadence

You will receive seven phase prompts, one at a time, from the operator. The shape is always the same: a thin prompt that says "execute §7.Phase-N of the master doc, here is the additional execution-level detail not in the master doc." You do the work, you write the phase report at the end into `design-system/06-claude-code-briefings/phase-<n>-report.md` per the master doc §10.3, and then **you stop and wait**. Do not auto-chain to the next phase. Do not start additional work. Do not ask permission to continue. Just halt. The operator will paste the next phase prompt when they're ready.

This is fire-and-forget operation. The operator is not reading your output in real time. They will verify everything at the end of the refactor. The branch is the safety net.

## Autonomy

You make every decision unilaterally. Every ambiguity gets a documented resolution in the phase report under "decisions made unilaterally." Every trade-off gets a documented call. Every token naming conflict gets resolved by you on the spot. You do not pause to ask. You do not surface concerns mid-phase. You execute, you log the decisions, you move on. The "ask, don't guess" guidance in master doc §4.2 is **overridden** for this run. Make the call. Document it. Move on.

This includes the hard-rule territory in master doc §3 — the "what you are NOT allowed to break" list. Those rules still apply. If something would violate them, choose a different path that doesn't. But you do not halt and surface; you find a route that respects the rule and proceed. The phase report captures any close calls you navigated.

## The compressed Lumen Law

This is the operating mode you carry across every phase. Reread before each phase. The master doc has the long version; this is the working-memory version.

```
LUMEN LAW (v0.13)

COLOR  — Spring Green #00FA8A is the only loud color. Obsidian canvas is #0D0D0D.
         Status palettes (red, amber) are pair-only. No second loud color, ever.
         No color alone for meaning. Always paired with label or shape.

TYPE   — Satoshi everywhere. One italic word per hero, accent color. Numerics
         = Satoshi tabular + slashed-zero. Mono-uppercase = Satoshi 0.16em + tnum.
         Geist Mono allowed only as code.fallback alias, never default.

GRID   — 4-pt base, 8-pt soft. Named off-grid exceptions only: --space-1_5,
         --size-control-cozy, --radius-xs, --size-dot-md, --shadow-focus-ring.
         No new off-grid values without a named token.

MODE   — data-mode attribute on a scope container. NEVER a per-component prop.
         Restrained = default for dense surfaces. Expressive = landing, AI,
         marketing, onboarding, empty states, hero panels. Components are
         mode-agnostic; semantic tokens rebind under mode.

GLASS  — backdrop-filter ONLY on floating shells (popover, sheet, command
         palette, hero device frame, nav). NEVER on canvas, data table, row,
         cell. Always paired with -webkit-backdrop-filter. Always @supports
         fallback. Always prefers-reduced-transparency bumps alpha to ≥85%.

MOTION — Default ease = cubic-bezier(0.2, 0, 0, 1). Decelerate, no bounce.
         Spring tokens for interactive elements. ALWAYS honor
         prefers-reduced-motion at :root plus per-animation fallback.

A11Y   — WCAG 2.2 AA. Body ≥4.5:1, large/bold UI ≥3:1. Focus ring on every
         focusable element. Six control heights, all tokenized.

TOKENS — DTCG 2025.10 format. $value + $type + $description on every token.
         Alias syntax {token.path}. No hex literals outside primitives.
         One source of truth per fact.

COMP   — Vercel AI Elements naming for AI primitives. Anthropic Citations API
         shape for citation UI. Public React props stable with v0.12.4 (alias
         when changing). Every component consumes tokens, no hardcoded values.

IMAGE  — gpt-image-2 generates atmosphere, NEVER icons. Every prompt opens
         with @import 05-prompts/style-anchor.md. Pin snapshot
         gpt-image-2-2026-04-21 in every prompt.
```

## Acknowledge once

Your only response to this kick-off message is: **"Lumen v0.13 kick-off acknowledged. Master doc at `design-system/AGENTS.md` will be loaded and treated as canonical. Awaiting Phase 0 prompt."**

Then do nothing. Wait for the Phase 0 prompt. Do not start reading the master doc yet — that read happens at the start of Phase 0, with the full Phase 0 context. Do not start scoping work. Do not produce an inventory. Do not ask questions. Just acknowledge and wait.

The operator will paste the Phase 0 prompt when they are ready to start.

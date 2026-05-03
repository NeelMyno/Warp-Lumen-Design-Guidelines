# Prompt: Accessibility pass on a Lumen page or component

**Goal:** Verify a page or component meets the Lumen accessibility floor (WCAG 2.2 AA) and the in-house additions in `00-foundations/accessibility.md`.

**Inputs:**
- Path to the file (component spec, page, or audit dashboard route).

**Steps:**

1. **Read the floor:**
   - `design-system/00-foundations/accessibility.md`

2. **Run automated checks:**
   - `pnpm validate:contrast` — WCAG contrast on documented token pairs.
   - `pnpm dlx axe-cli http://localhost:3000/{route}` — axe-core against rendered page (run dev server briefly, then stop).
   - `pnpm dlx pa11y http://localhost:3000/{route}` — pa11y for additional checks.

3. **Manual screen-reader pass** (pick one per release):
   - macOS: VoiceOver (`Cmd-F5`).
   - Windows: NVDA or JAWS.
   - iOS: VoiceOver (Settings → Accessibility).
   - Android: TalkBack.

4. **Manual keyboard pass:**
   - Tab through every interactive element.
   - Verify focus order matches visual order.
   - Verify focus ring is visible at every stop.
   - Verify Enter / Space activate buttons; Escape closes overlays.
   - Verify no keyboard traps.

5. **Manual reduced motion pass:**
   - Enable Reduce Motion in OS settings.
   - Reload the page.
   - Verify no animation runs (LiveDot stops pulsing, RateTicker stops scrolling, transitions snap).
   - Verify no broken layout.

6. **Component-level checks** (per component touched):
   - `<th scope="col">` on tables.
   - `aria-current="page"` on active nav items.
   - `aria-selected` on selected list items.
   - `aria-disabled` on disabled controls inside forms.
   - `aria-busy` on loading buttons.
   - `aria-live` on real-time regions.
   - `aria-modal` + focus trap on dialogs.

7. **Color-blind / low-vision check:**
   - Toggle the dashboard's high-contrast mode (if shipped) — ensure all critical info still readable.
   - Use a deuteranopia simulator on screenshots — ensure status meaning is preserved (label / shape carries it, not color alone).

8. **Document findings:**
   - Open issues for failures, tagged `accessibility`.
   - Update CHANGELOG under `[Unreleased] -> ### Fixed` or `### Security`.

**Verify:**

- [ ] axe-core passes with zero violations.
- [ ] pa11y passes.
- [ ] Manual keyboard tab traversal hits every interactive element in logical order.
- [ ] Visible focus ring on every interactive element.
- [ ] Manual screen-reader announces every meaningful element.
- [ ] Reduced motion does not break layout.
- [ ] No status meaning is conveyed by color alone.
- [ ] Lighthouse a11y score ≥ 95.

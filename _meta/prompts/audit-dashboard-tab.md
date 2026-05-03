# Prompt: Add a new tab to the audit dashboard

**Goal:** Add a new tab (project type) to `/audit-dashboard/` showing how Lumen renders on that surface.

**Inputs:**
- Tab name + slug (e.g. "Email" / `email`).
- One-paragraph description of the surface and what it should demonstrate.

**Steps:**

1. **Read the existing tab config:**
   - `audit-dashboard/src/lib/tabs.ts`

2. **Read an existing tab page** for stylistic alignment:
   - `audit-dashboard/src/app/saas/page.tsx` (most complex)
   - `audit-dashboard/src/app/landing/page.tsx` (marketing)

3. **Add the tab to the config:**
   - Edit `audit-dashboard/src/lib/tabs.ts`:
     ```ts
     {
       slug: "email",
       href: "/email",
       label: "Email",
       shortLabel: "Email",
       description: "...",
       group: "platform",
     }
     ```

4. **Create the page** at `audit-dashboard/src/app/{slug}/page.tsx`:
   - Server component by default.
   - Use `<PageHeader eyebrow="Tab N of M" title="..." description="..." />`.
   - Compose using existing primitives in `audit-dashboard/src/components/primitives/`.
   - Show the dominant component patterns for that surface (e.g. for Email: header logo, headline, body, CTA, footer).
   - Render at multiple states (default, with content, empty if applicable).
   - Annotate sections with `<SubSection title="...">` for the user's audit.

5. **No new tokens.** If the surface needs something not in semantic tokens, that's a token PR, not a tab PR.

6. **Update the foundations page if needed:**
   - If you used a new component primitive that isn't yet shown in `/foundations`, add it.

7. **Update LLM contract:**
   - Add the tab to `llms.txt` and `llms-full.txt` Index sections (if it represents a new platform Lumen now covers).

**Verify:**

- [ ] Tab appears in the horizontal nav.
- [ ] Page returns a 200 in `pnpm dev` (run yourself; do NOT spawn a long-running server in batch tool runs).
- [ ] All four moods render correctly (use mood switcher).
- [ ] Light AND dark theme render correctly.
- [ ] No raw hex / px in the page.
- [ ] No console errors / hydration warnings.
- [ ] CHANGELOG updated.

**Note:** When iterating on the dashboard, do NOT keep `pnpm dev` running while making heavy file edits in the same session — Turbopack memory pressure can cascade. Run dev only when actively viewing.

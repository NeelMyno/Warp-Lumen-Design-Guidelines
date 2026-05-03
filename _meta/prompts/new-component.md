# Prompt: Scaffold a new Lumen component

**Goal:** Add a new component to Lumen with full spec, contract, example code, registry entry, and CHANGELOG.

**Inputs:**
- Component name (PascalCase, e.g. `Combobox`).
- One-sentence summary.
- Closest existing Lumen component (for stylistic alignment).

**Steps:**

1. **Read the closest existing component** to mirror conventions:
   - `design-system/02-components/{closest}/component.md`
   - `design-system/02-components/{closest}/component.json`
   - `design-system/02-components/{closest}/examples/primary.tsx`

2. **Read the schema:**
   - `design-system/02-components/_schema/component.schema.json`

3. **Read the rules:**
   - `AGENTS.md` (hard rules)
   - `design-system/00-foundations/principles.md` (operating principles)
   - `design-system/00-foundations/accessibility.md` (a11y floor)

4. **Create the folder structure:**
   ```
   design-system/02-components/{kebab-name}/
     component.md
     component.json
     examples/primary.tsx
   ```

5. **Write `component.md`** with the canonical section order:
   - Frontmatter (name, type, status, version, since, deprecated, platforms, a11y_level, related, spec, last_updated).
   - Title (h1) + summary.
   - When to use.
   - When NOT to use.
   - Anatomy.
   - Variants (table of props).
   - States.
   - Accessibility (WCAG criteria, keyboard map).
   - Do.
   - Don't.
   - Code (links to examples).
   - Changelog.

6. **Write `component.json`** matching the schema:
   - Required: name, version, status, summary, props, tokens.consumed, a11y, rules, examples.
   - List EVERY token consumed in `tokens.consumed` (used by impact analysis).
   - Use only semantic tokens. NEVER primitives.

7. **Write `examples/primary.tsx`**:
   - TypeScript strict.
   - Tailwind v4 utilities mapped to Lumen tokens via CSS variables (`var(--color-...)`).
   - No raw hex, no raw px.
   - Forward `aria-*` props.
   - Honor `prefers-reduced-motion` if animated.

8. **Add registry sidecar** at `_registry/{kebab-name}.json`:
   - Follow shadcn registry-item.json schema.
   - Reference the example file.
   - Include `meta.specPath` and `meta.docsPath`.

9. **Update `_registry/registry.json`** to include the new sidecar in `items[]`.

10. **Update `design-system/02-components/README.md`** components table.

11. **Update `CHANGELOG.md`** under `## [Unreleased] -> ### Added`:
    ```
    - **{Name}** component. {One-sentence summary}.
    ```

12. **Add to `audit-dashboard/`** if it would be useful for visual audit:
    - Create a primitive in `audit-dashboard/src/components/primitives/{kebab-name}.tsx`.
    - Use it in the most relevant template page.

**Verify:**

- [ ] `pnpm validate:components` passes (schema validates).
- [ ] No raw hex / px in the example.
- [ ] All tokens listed in `tokens.consumed` exist in `01-tokens/semantic/` or `01-tokens/components/`.
- [ ] Component has visible focus state.
- [ ] Component meets touch target minimums (44x44 web, 48dp Android).
- [ ] If animated, honors `prefers-reduced-motion`.
- [ ] Both `component.md` and `component.json` agree on `name`, `version`, `deprecated`.

**Done when:** all checks pass and the component appears in `_registry/registry.json`.

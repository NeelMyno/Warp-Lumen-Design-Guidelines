# Prompt: Add or modify a Lumen token

**Goal:** Add a new semantic token, modify an existing one, or deprecate one — with full impact analysis.

**Inputs:**
- Token path (e.g. `color.surface.elevated-2`, `space.section.xxl`).
- Action (add / modify / deprecate / remove).
- Justification (why is this needed?).

**Hard rule recap:**
- Engineers and LLMs only consume SEMANTIC tokens. Primitives stay hand-edited.
- Every semantic token MUST exist in every mode file (`color.light` AND `color.dark` AND `color.hc-light` AND `color.hc-dark`).
- A new semantic token requires an ADR if it changes the contract surface.

**Steps:**

1. **Read the taxonomy:**
   - `design-system/01-tokens/README.md`
   - `_meta/decisions/0001-dtcg-format.md`

2. **Search for existing equivalents:**
   - Does a semantic token already cover this need? Use `grep -r "color\." design-system/01-tokens/semantic/`.
   - If yes, no new token needed. Document why the existing one is the right choice.

3. **Add or modify the token:**
   - Edit the relevant `.tokens.json` file in `01-tokens/semantic/` or `01-tokens/components/`.
   - Use DTCG format: `$value`, `$type`, `$description`, optional `$deprecated`.
   - Reference primitives via `{color.brand.500}` syntax.

4. **Mode parity:**
   - If you added `color.foo` to `color.light.tokens.json`, also add it to `color.dark.tokens.json` (and `hc-light`, `hc-dark` if the system maintains those).
   - Mode files MUST have the same key paths.

5. **For modifications:**
   - If changing a value, run impact analysis: `grep -r "{token-path}" design-system/02-components/` to find consumers.
   - If the change is breaking, mark old value as `$deprecated` and add the new token alongside.

6. **For deprecations:**
   - Add `$deprecated: "Replaced by {new.token.path} in v0.X.0. Will be removed in v1.0.0."` to the old token.
   - Keep the old token in place for ≥ 1 minor release before removing.

7. **Update accessibility doc** if the change affects a documented contrast pair:
   - Edit `design-system/00-foundations/accessibility.md` "Token contracts" table.
   - Update `scripts/check-contrast.mjs` PAIRS array.

8. **Run validation:**
   - `pnpm build` — Style Dictionary rebuilds outputs.
   - `pnpm validate` — JSON schema + DTCG lint + WCAG contrast check.

9. **Update CHANGELOG.md:**
   - Under `[Unreleased] -> ### Added` for new tokens.
   - Under `[Unreleased] -> ### Changed` for value changes.
   - Under `[Unreleased] -> ### Deprecated` for deprecations.

10. **Open ADR if appropriate:**
    - New semantic family (e.g. adding `color.brand.tertiary.*`)? ADR.
    - Removing a token? ADR.
    - Changing the contract surface? ADR.
    - Pure addition that follows existing patterns? No ADR needed.

**Verify:**

- [ ] Token exists in all required mode files.
- [ ] Style Dictionary builds without error.
- [ ] Validation passes.
- [ ] If changing a documented contrast pair, the new pair still meets AA.
- [ ] CHANGELOG entry added.
- [ ] If breaking, ADR opened.

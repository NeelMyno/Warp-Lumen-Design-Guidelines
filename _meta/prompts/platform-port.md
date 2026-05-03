# Prompt: Port an existing Lumen component to a new platform

**Goal:** Add a new platform implementation (e.g. SwiftUI, Compose, Liquid) for a component that already exists for web.

**Inputs:**
- Component name.
- Target platform (one of: `react-native`, `ios-native`, `android-native`, `desktop-mac`, `desktop-windows`, `shopify-liquid`, `bigcommerce-stencil`, `woo-wordpress`).

**Steps:**

1. **Read the canonical web example:**
   - `design-system/02-components/{name}/examples/primary.tsx`
   - `design-system/02-components/{name}/component.json` — props, tokens consumed, a11y rules.

2. **Read the platform guide:**
   - `design-system/03-platforms/{platform}/README.md`
   - Note the platform's token API (CSS var, Swift constant, Kotlin object, Liquid var).

3. **Read the equivalent existing port** if any other component has shipped on this platform:
   - Look for sibling files in `design-system/02-components/*/examples/` matching the platform extension.

4. **Implement the port:**
   - File: `design-system/02-components/{name}/examples/primary.{ext}` where `ext` matches platform conventions (e.g. `swift`, `kt`, `liquid`).
   - Match the props from `component.json`.
   - Use the platform's token API — never hardcode values.
   - Honor platform a11y conventions:
     - iOS: VoiceOver labels, Dynamic Type, `accessibilityReduceMotion`.
     - Android: TalkBack, Material 3 type roles, animator-duration-scale.
     - Desktop: keyboard shortcuts, vibrancy / Mica per platform.
     - Liquid / Stencil / Woo: semantic HTML, ARIA, autofill hints.
   - Match the visual spec (anatomy, states, motion).

5. **Update `component.json`:**
   - Add the new path under `examples` (e.g. `"ios-native": "./examples/primary.swift"`).
   - Add the platform to the frontmatter `platforms` array in `component.md`.

6. **Update the registry sidecar** at `_registry/{name}.json` with the new platform.

7. **Cross-check with the platform guide's specs:**
   - Touch targets, motion, type scale mappings.

8. **Test on the actual platform:**
   - iOS: build the example in a SwiftUI preview.
   - Android: build the example in Compose preview.
   - Web/RN: render in a Storybook story.
   - Liquid: drop into a Shopify dev theme.

9. **Update CHANGELOG.md:**
   - Under `[Unreleased] -> ### Added`:
     ```
     - {Name} component now available for {platform}.
     ```

**Verify:**

- [ ] Same prop names as the canonical web spec.
- [ ] Token API used everywhere (no raw values).
- [ ] Platform a11y conventions honored.
- [ ] Visual matches spec at default state.
- [ ] Hover / focus / press / disabled states all implemented.
- [ ] Reduced-motion variant exists if component animates.
- [ ] Renders without console warnings on the target platform.

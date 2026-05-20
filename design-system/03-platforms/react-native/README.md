# React Native (NativeWind + react-native-reusables)

> Stack: Expo SDK 53+, NativeWind v4, react-native-reusables (founded-labs) for component scaffolds. Lumen tokens consumed via NativeWind's `tailwind.config.ts`.

> **v0.11.13 currency.** This guide reflects the Premium Psychology recolor — anchors are spring green `#00FA8A` (accent), obsidian mint `#171A18` (dark canvas), light anchor `#E6E6E6`, paper `#FAFAFA`. Seven principles now (hierarchy, first-impression, micro-interactions joined the original five) and 35 component contracts. v0.11.13 closes the DTCG inheritance audit; the `@lumen/tokens-rn` artifact compiles from the same primitive → semantic → component graph as web.

## Setup

### 1. Create the Expo app
```bash
pnpm dlx create-expo-app@latest my-app --template
cd my-app
pnpm add nativewind tailwindcss
```

### 2. Wire NativeWind to Lumen tokens

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import lumenTokens from "./node_modules/@lumen/tokens-rn/tokens.json"; // or copy from _build/json

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: lumenTokens.color,
      spacing: lumenTokens.space,
      borderRadius: lumenTokens.radius,
    },
  },
} satisfies Config;
```

### 3. Install Satoshi via Expo Font
```bash
pnpm add @expo-google-fonts/static-app
```

```ts
// app/_layout.tsx
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // v0.10 — Lumen is Satoshi-only. JetBrains Mono / Source Serif 4 / Inter
  // were all retired; tabular numerics + editorial moments use Satoshi
  // OpenType features (tnum, lnum, zero) on the same family.
  const [loaded] = useFonts({
    "Satoshi-Regular": require("../assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Medium":  require("../assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Bold":    require("../assets/fonts/Satoshi-Bold.otf"),
  });
  if (!loaded) return null;
  SplashScreen.hideAsync();
  return /* ... */;
}
```

### 4. Components via react-native-reusables
```bash
pnpm dlx @lumen/cli add button
```

This copies a `Button.tsx` into your `components/` directory styled with the Lumen tokens.

## Platform notes

- **Touch targets:** mobile minimum 44×44 (iOS) / 48×48 dp (Android). The `Button` component sets these by default.
- **Dynamic Type:** wrap text in `Animated.Text` and respect `Appearance` font-scale. The `Lumen` text components handle this.
- **Reduced motion:** Use `AccessibilityInfo.isReduceMotionEnabled()` on mount and conditionally disable animations.
- **Dark mode:** `useColorScheme()` from React Native returns `'light' | 'dark' | null`. Pair with NativeWind's `dark:` variant.

## What changes vs. web

- No CSS variables. NativeWind compiles tokens into the bundle.
- No `data-theme` toggle — use `useColorScheme()` and let NativeWind handle it.
- No `<html>` element. Set top-level `View` background to `surface.page`.
- Animations: use `react-native-reanimated` v3+ (web's CSS transitions don't translate).

## Things to know

- Use `expo-font` for self-hosting Satoshi, NOT Google Fonts (Satoshi is on Fontshare, not Google).
- NativeCN is an alternative to react-native-reusables — both work; pick one and stick.
- Live-data primitives (Stat, LiveDot, RateTicker) are in the Lumen registry; install with `@lumen/cli add live-dot`.

## Reduced motion + accessibility

```ts
import { AccessibilityInfo } from "react-native";

const [reduceMotion, setReduceMotion] = useState(false);
useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
  return () => sub.remove();
}, []);
```

Use this `reduceMotion` flag to disable `LiveDot` pulse and `RateTicker` marquee.

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to React Native — where the wrapper-paints-focus pattern is **not native** and requires explicit modeling.

### The shell pattern in React Native

React Native's `TextInput` doesn't expose a CSS-style `:has(:focus-visible)` or `:focus-within` selector. There's no parent-paints-on-child-focus mechanism. The workaround that preserves the v0.6 architecture: a `<View>` wrapper paints the shell visuals, and the wrapper subscribes to the inner `TextInput`'s `onFocus` / `onBlur` events to drive its own state.

```tsx
import { View, TextInput, type TextInputProps } from "react-native";
import { useState } from "react";
import { tokens } from "@lumen/tokens-rn";

type Props = TextInputProps & {
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  leadingIcon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export function LumenField({ invalid, disabled, readOnly, leadingIcon, trailingAddon, size = "md", ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor =
    invalid ? tokens.color.border.error :
    focused ? tokens.color.border.focus :
    tokens.color.border.default;

  return (
    <View style={[styles.shell[size], { borderColor, borderWidth: 1 }, focused && styles.ring(invalid)]}>
      {leadingIcon}
      <TextInput
        style={styles.input}
        editable={!disabled && !readOnly}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {trailingAddon}
    </View>
  );
}
```

The discipline that makes this still feel "v0.6": the inner `TextInput` renders **bare** (`borderWidth: 0`, no padding around the value), and only the wrapper paints chrome. Slots are siblings inside the same `<View>` so the focus boundary contains them by construction — same as the web shell.

**Library option.** `react-native-paper` ships an `outlined` `TextInput` variant that mirrors this wrapper-paints pattern out of the box. Map Lumen tokens via `theme.colors.outline` + `theme.colors.primary` + `theme.roundness`. Trade-off: you get the pattern for free but inherit Material 3's floating-label behavior, which Lumen doesn't use (we ship stacked labels). Use Paper only if you're already on it.

### Token mapping

Tokens are consumed via NativeWind utility classes when using Tailwind, or via the `@lumen/tokens-rn` JS object directly when not.

| Lumen token | React Native equivalent | Notes |
|---|---|---|
| `input.height.sm` | `height: 32` | dp on Android, pt on iOS |
| `input.height.md` | `height: 40` | the default |
| `input.height.lg` | `height: 48` | meets Apple HIG 44 pt + WCAG 2.5.8 |
| `input.padding.x.md` | `paddingHorizontal: 12` | |
| `input.background.rest` | `backgroundColor: tokens.color.surface.input.rest` | |
| `input.border.rest` | `borderColor: tokens.color.border.default`, `borderWidth: 1` | |
| `input.border.focus` | `borderColor: tokens.color.border.focus` (driven by `onFocus` state) | RN can't observe child focus from parent — must be manual |
| `input.ring.focus` | `shadowColor` + `shadowRadius` (iOS) / `elevation` (Android) | RN has no native equivalent of CSS `box-shadow` outer glow on Android pre-API 28 |
| `input.ring.error` | same shape, error-tinted | |
| `input.transition` | `Animated.timing` with `duration: 150`, `easing: Easing.bezier(0.2, 0, 0, 1)` | RN has no CSS transitions; animate explicitly |

**Token I wish existed but doesn't:** an `input.shadow.android.elevation` variant. The `--shadow-input-focus` halo composes via CSS box-shadow on web (**v0.14 R11** — now neutral `var(--border-frame)`, was spring-green pre-R11 per [ADR 0030](../../../_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md)); on Android it requires `elevation` (which casts a black drop shadow only) plus a tinted border. Post-R11 the fidelity gap is smaller — Android's neutral drop shadow now lands closer to the web's neutral halo than it ever did to the old lime ring — but the gap isn't zero; document it, don't paper over it.

### Density modes

React Native has no CSS variable cascade, so density is a prop, not a context attribute:

```tsx
import { Platform } from "react-native";

const heightFor = (size: "sm" | "md" | "lg", density: "compact" | "comfortable") => {
  if (density === "compact") return Platform.select({ ios: 32, android: 36, default: 32 });
  return { sm: 32, md: 40, lg: 48 }[size];
};
```

Or wire density via React Context and have `<LumenField>` read from it (parallel to the web's `[data-density="compact"]` cascade). The Context approach matches the v0.6 spirit better — pass `density` through the form root, not per-field.

### Validation timing

Same rules as web. RN-specific implementation:

1. **Don't validate during typing.** Track `hasBlurred` per field; gate validation on it.
2. **Validate on blur** in `onBlur={(e) => { setHasBlurred(true); validate(e.nativeEvent.text); }}`.
3. **Switch to onChange** after first error — once `hasBlurred && error`, validate inside `onChangeText`.
4. **On submit**, iterate the form schema; for the first invalid field, call `inputRef.current?.focus()` to scroll-into-view + open keyboard.
5. **Server validation**: announce via `AccessibilityInfo.announceForAccessibility(message)` (the RN equivalent of `aria-live`).
6. **Async validation**: debounce 300–500 ms; render a spinner in the trailing slot via `<ActivityIndicator />`.

**Submit is never disabled as the only signal of validation failure** — same web rule applies. Native iOS muscle memory expects the submit affordance to always respond.

### Read-only vs disabled

React Native's `TextInput` exposes a single prop, `editable`. Both `disabled` and `readOnly` set `editable={false}`, but they should look different:

| State | RN props | Visual |
|---|---|---|
| `disabled` | `editable={false}` + dim shell + cursor `not-allowed` (web) / no caret | muted bg |
| `readOnly` | `editable={false}` + full contrast + caret hidden | rest bg, copyable via long-press |

For the read-only **copyable** behavior on Android, set `selectTextOnFocus={true}` and keep `editable={false}` — the native long-press copy sheet still appears. On iOS, the native menu controller handles it.

### Web-only features that don't translate

| Web feature | RN equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | manual `useState` + `onFocus` / `onBlur` | workaround above |
| `:focus-within` fallback | same workaround covers both | n/a |
| Autofill bg override (`-webkit-box-shadow`) | iOS keychain / Android autofill paints over the shell briefly | known caveat; tracked for v0.6.x |
| `field-sizing: content` (auto-grow textarea) | `multiline` + `onContentSizeChange` to drive `height` state | manual measurement |
| Lit top edge (inset shadow) | not feasible on Android elevation; use a 1 px tinted top border instead | platform compromise |

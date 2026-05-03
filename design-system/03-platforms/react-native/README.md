# React Native (NativeWind + react-native-reusables)

> Stack: Expo SDK 53+, NativeWind v4, react-native-reusables (founded-labs) for component scaffolds. Lumen tokens consumed via NativeWind's `tailwind.config.ts`.

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
  const [loaded] = useFonts({
    "Satoshi-Regular": require("../assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Medium":  require("../assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Bold":    require("../assets/fonts/Satoshi-Bold.otf"),
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
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

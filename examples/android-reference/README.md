# android-reference — Lumen v0.13 Android reference app

> Jetpack Compose on Android API 26+. Four surfaces: stat, primary button, glass popover (Haze), live-dot pulse. Demonstrates the Android contract from [`design-system/04-platforms/android.md`](../../design-system/04-platforms/android.md).

## What this proves

- **Haze for backdrop blur** — `Modifier.hazeSource` + `Modifier.hazeEffect` produces frosted-glass over the canvas. Android's stock `Modifier.blur` blurs the element, not the backdrop, and is API 31+ only.
- **`LocalAccessibilityManager.isReduceMotionEnabled`** observed — when on, swaps Haze for solid `surface.raised` at 92% alpha + collapses spring animations to `snap()`.
- **Hard rule 9** — `LumenPrimaryButton` uses `LumenColors.actionPrimaryFg` (`#07120D`), never white on lime.
- **Hard rule 16** — glass on the popover only. The canvas, stat, button, live-dot all stay solid.
- **LiveDot pulse** with reduce-motion fallback (drops the infinite repeat).

## Build

```bash
cd examples/android-reference
./gradlew :app:installDebug   # requires Android SDK + connected device or emulator
```

Build requires:
- JDK 17+
- Android SDK Platform 35 + Build-Tools 35
- An Android device or emulator running API 26+ (Android 8.0)
- Gradle 8.7+ (use `./gradlew` if shipped; otherwise install)

The reference uses Compose BOM `2024.12.01`, Kotlin `2.0.21`, Android Gradle Plugin `8.7.0`, and `dev.chrisbanes:haze:1.5.4`.

## What's NOT in this reference

- **Gradle wrapper.** Operator runs `gradle wrapper --gradle-version 8.7` once if needed; the standard wrapper isn't checked in (avoids ~50kb of binary noise in this repo for a reference app).
- **Satoshi font.** Same ITF-FFL self-host caveat — drop `satoshi_variable.otf` into `app/src/main/res/font/` and reference via `FontFamily(Font(R.font.satoshi_variable, ...))`. The reference uses Android's default font for portability.
- **Material 3 ColorScheme bridge.** Real apps wrap Material 3 components with `MaterialTheme(colorScheme = LumenColorScheme.toMaterial3())` so Material 3 components also pick up Lumen tokens.

## Files

```
android-reference/
├── README.md
├── build.gradle.kts                    # Root build script
├── settings.gradle.kts                 # Single :app module
└── app/
    ├── build.gradle.kts                # App module — Compose + Haze deps
    └── src/main/
        ├── AndroidManifest.xml
        └── java/dev/warp/lumen/reference/
            └── MainActivity.kt          # @main + four surfaces
```

## Related

- [`../../design-system/04-platforms/android.md`](../../design-system/04-platforms/android.md) — full Android translation guide.
- [`../ios-reference/`](../ios-reference/) — the sister mobile reference.
- [Haze library](https://github.com/chrisbanes/haze) — backdrop-blur primitive.
- [`../../dist/compose/LumenColors.kt`](../../dist/compose/LumenColors.kt) — generated full token graph for production apps.

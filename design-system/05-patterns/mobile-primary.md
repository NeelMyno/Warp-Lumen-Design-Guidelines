# mobile-primary.md — the mobile primary surface pattern

> Mobile is not desktop with smaller margins. Touch is not click with worse aim. iOS HIG and Material 3 each ship a chrome contract — heights, spacings, gestures — that pre-dates Lumen and that users feel the moment a surface drifts off it. The mobile-primary pattern is how Lumen lives inside that contract: **platform-native chrome on the outside, Lumen tokens on the inside**, the Satoshi voice carrying across.

The same shape ships three ways — SwiftUI on iOS, Jetpack Compose on Android, React Native + NativeWind on Expo. Different runtimes, identical visual language. The chrome dimensions come from the platform; everything inside the `ScrollContainer` is Lumen's.

## 1. The shape

```
MobileShell (iOS or Android frame)
  ├── StatusBar              → platform-native (44pt iOS / 24dp Android system bar)
  ├── NavBar                 → 44pt iOS · 56dp Android Material 3 top app bar
  │   ├── BackButton (leading)        → IconButton.surface=ghost
  │   ├── Title (center / leading)    → type.heading.h4 or .h5, Satoshi
  │   └── Actions (trailing)          → up to 2 IconButton.surface=ghost
  │
  ├── ScrollContainer         → padding-x: space.page.md (24px), gap-y: space.section.sm (32px)
  │   ├── HeroCard            → single focal element — Stat / ProgressRing / KPI / hero image
  │   │                         Card.lifted, radius.xl (16px), one focal point per first-impression rule
  │   ├── Section
  │   │   ├── SectionHeader   → eyebrow.sans + heading.h5, ≥ 1.5× weight gap to row labels
  │   │   └── List
  │   │       ├── Row         → 56pt iOS / 64dp Material — Avatar/Icon + Heading + body.sm + trailing value/chevron
  │   │       ├── Row
  │   │       └── Row
  │   ├── Section (next)
  │   │   └── ...
  │   └── ActionGroup         → FAB (anchored bottom-right) OR sticky bottom bar (full-width primary)
  │
  └── TabBar (iOS) / BottomNav (Android)
       ├── Destination 1      → icon + 11pt label · accent on active
       ├── Destination 2
       ├── Destination 3 (active)
       └── Destination 4–5
```

Platform variants converge on the same internal grammar. The `NavBar` height differs (44pt iOS vs 56dp Android), the `TabBar` height differs (49pt iOS vs 80dp Material 3 navigation bar), but the `ScrollContainer` interior is the same Satoshi-on-Lumen-tokens composition everywhere.

## 2. Density mode — platform-native

This pattern is the **one density tier the operator-vs-marketing axis doesn't own.** iOS HIG specifies the chrome dimensions: 44pt nav bar, 49pt tab bar, 44pt minimum touch target. Material 3 specifies its own: 56dp top app bar, 80dp navigation bar, 48dp minimum touch target. Lumen tokens fill the content area inside that chrome — they don't override it.

The rationale is one part affordance, one part recognizability. **Affordance** — Apple's 44pt floor and Material's 48dp floor are derived from the average finger pad and the average mis-tap cost; below those thresholds, a meaningful share of users mis-hit. **Recognizability** — a tab bar that's 60pt tall feels foreign on iOS the same way a 90px-padded sidebar feels foreign on macOS. Users notice the deviation before they notice the design.

So the rule: **chrome dimensions track the platform, content tokens track Lumen**. A row inside the `ScrollContainer` uses `space.stack.md` between blocks; a navigation-bar height does not.

## 3. Tokens for wrappers

| Wrapper | Token / value | Notes |
|---|---|---|
| NavBar height | 44pt iOS · 56dp Material 3 | platform tokens dictate chrome — not a Lumen knob |
| NavBar title type | `type.heading.h4` (17px) or `.h5` (15px) | Satoshi, medium weight — single typeface contract holds across nav |
| TabBar / BottomNav height | 49pt iOS · 80dp Material 3 nav bar | platform tokens |
| TabBar active indicator | `color.action.primary.fg` (spring green `#00FA8A`) | the one accent on the active destination |
| ScrollContainer padding-x | `space.page.md` (24px) | content gutter — same as web mobile breakpoint |
| Inter-section gap | `space.section.sm` (32px) | between groups; mobile breathes less than marketing |
| Intra-section row gap | `space.stack.md` (16px) | between list rows or stacked cards |
| Card radius | `radius.xl` (16px) | the v0.8 reconciled mobile-card value — sits between `lg` (12) and `2xl` (20) |
| Mobile-bezel cards | `radius.4xl` (36px) | the brutalist mobile-bezel pattern — opt-in, hero-only |
| Touch target floor | `size.control.touch` (44px) | Apple HIG floor; Material 3 wants 48dp — round up |
| Primary CTA mobile size | `size.control.lg` (48px) | clears both floors comfortably |
| FAB margin (iOS) | `space.4` (16px) | from the screen edge |
| FAB margin (Material 3) | `space.6` (24px) | Material 3 default — slightly more breathing room |
| Sticky bottom bar | full-width Button.primary.lg + safe-area inset | uses `env(safe-area-inset-bottom)` on RN/web, `.safeAreaInset(.bottom)` on SwiftUI |

The token `radius.xl` (16px) for the standard mobile card came out of the v0.8 reconciliation — small enough not to read as a marketing surface, large enough to register as touch-friendly on a 6.1" screen. The `radius.4xl` (36px) is reserved for the brutalist mobile-bezel pattern where the card edge mimics the device bezel itself; use it for hero-only surfaces, not generic cards, or the page reads as a stack of brutalist tiles instead of a hierarchy.

## 4. Component recipe

**NavBar.** The chrome is platform-native (`UINavigationBar` on iOS, `TopAppBar` on Compose, `<Stack.Screen>` headers on RN), but the typography is Lumen — title rendered in Satoshi at `type.heading.h4` or `.h5`, never in San Francisco or Roboto. Action buttons in the trailing slot are `IconButton.surface=ghost`, 24×24 icon at `1.5px` stroke (matches the iconography rule). Maximum two trailing actions; if you need three, the third goes in an overflow menu.

**TabBar (iOS) / BottomNav (Android).** 4–5 destinations on iOS, 3–5 on Android per Material 3. Each destination = icon + 11pt label (iOS) or 12sp label (Android). Active destination tints with `color.action.primary.fg` (spring green) — the one accent doing one job (signaling current location). Inactive destinations use `color.text.tertiary`. **Don't** ship six tabs; Apple and Google have agreed that's the threshold past which scanning collapses. If you have six destinations, demote the least-frequent one to a "More" sheet and keep the bar to five.

**HeroCard.** The single focal element of the screen, per first-impression rule. Use `Card.lifted` (the visible-shadow elevation tier on mobile — `shadow.lifted` lands cleanly on a 16px radius). Hero content is one of: `Stat` (the KPI summary), `ProgressRing` (a goal-completion or progress-toward-target visual), a `KPI Card` composition (Stat + sparkline + delta), or a hero image with explicit play affordance if it's video. **One focal element**, not three — the whole point of the hero is that the eye lands somewhere unambiguous in 50ms.

**List rows.** Each row composes Field-style: leading slot (Avatar 32×32 or Icon 24×24), label (heading.h5 or body.md medium), secondary line (body.sm in `text-secondary`), trailing value or chevron. Minimum row height is **56pt on iOS, 64dp on Android per Material list-item spec**. Don't compress below the floor — the floor IS the floor for a reason. Rows separate via `border.hairline` 1px or via `space.stack.sm` gap, never both.

**FAB.** The floating action button is the primary mobile action surface (see the `Fab` component contract). Anchored bottom-right — bottom-left only when the language is RTL. Size: 56×56 default. Icon-only or extended (icon + label). Color: spring-green fill with `accent.fg` icon, the same single-accent contract. Margin: 16pt (iOS) or 24dp (Material 3) from the screen edge plus the bottom safe-area inset.

**Sticky bottom bar (alternative to FAB).** Full-width band anchored to the bottom of the viewport. Contains a `Button.primary.lg` (48pt height) plus optional secondary action. Padded with `env(safe-area-inset-bottom)` on web, `.safeAreaInset(edge: .bottom)` on SwiftUI, `WindowInsets.systemBars` on Compose — never let the button get clipped by the home-indicator gesture area. Use a sticky bottom bar instead of a FAB when the action is the only thing on the page (checkout, sign in submit, accept terms).

**Mobile gestures (per [`motion.md` § Mobile gestures](../04-content/motion.md)).** The pattern budgets gesture moments deliberately:

- **Lists** support **swipe-to-delete** (right-to-left, destructive) on iOS and **swipe-to-archive** (left-to-right) on Android per Material patterns. The action surface slides in 1:1 with the finger; over-swipe past 50% commits, under-swipe snaps back at `motion.duration.fast`.
- **Data surfaces** support **pull-to-refresh** with a `LiveDot` indicator at the threshold. Don't ship pull-to-refresh on data that doesn't refresh — that's a trust violation.
- **Modals on mobile prefer bottom-sheet** with a 36×4 drag handle and three detents (mini, half, full). Drag-down dismisses; tap-outside dismisses; tap-X is a fallback for when drag-down is contextually disabled.
- **Long-press** fires at 500ms on iOS, 400ms on Android. The source element scales 1.0 → 0.98 over `motion.duration.fast` to acknowledge the press. Use sparingly — long-press is invisible until discovered, so it's never the only path to a critical action.
- **Pinch-to-zoom** is allowed on photos, maps, and large-image content only. Never on UI chrome — the contract there is gesture-free.
- **Drag-to-reorder** uses long-press to lift (with `shadow.lifted` and a 1.0 → 1.02 scale), translates 1:1, and resolves on drop.

**Reduced-motion.** Every gesture above has a tap-to-confirm fallback. Honor `UIAccessibility.isReduceMotionEnabled` (iOS), `AccessibilityManager.isEnabled` for animation-scale (Android), `prefers-reduced-motion: reduce` (RN web). When reduced motion is on, swipe actions reveal via long-press + tap, pull-to-refresh becomes a tap-the-refresh-icon affordance, drag-to-reorder becomes a "move up / move down" menu.

## 5. Anti-patterns

These are the LLM-generated mistakes that look reasonable in isolation and read as off-platform the moment you see them on a real device.

- **Shipping web component sizes on mobile.** A 40px button (the web default `size.control.md`) is below the 44pt iOS touch floor — users mis-tap. Bump to `size.control.lg` (48px) or `size.control.touch` (44px) on every tappable element on mobile.

- **Hamburger menu instead of TabBar/BottomNav.** Hamburgers hide nav, hurt discovery, and add a tap to every destination switch. TabBar / BottomNav makes 4–5 destinations always visible, which is the entire reason both platforms ship the primitive. The hamburger is for level-2 navigation, not level-1.

- **FAB AND sticky bottom bar.** They compete for the same screen real estate at the bottom of the viewport — pick one. FAB for "primary action available everywhere on the page"; sticky bottom bar for "this is the one action of the screen."

- **Modal for navigation.** Modals trap focus and break the back gesture (swipe-from-edge on iOS, system back on Android). Use `NavigationLink` / `<Stack.Screen>` push semantics for navigation; reserve modals for focused tasks the user needs to complete or abandon.

- **Auto-play video in HeroCard.** Mobile data and battery concerns make this hostile by default. Use a static image (or a hero composition without video) and provide an explicit play affordance. If video is non-negotiable, autoplay muted with a visible mute/unmute control and `prefers-reduced-data` honored.

- **Decorative pull-to-refresh on data that doesn't refresh.** Trust-breaking. If pull-to-refresh fires and the data is identical, users learn the gesture is a placebo. Either wire it to a real refresh or omit it.

- **Bottom-sheet that can't be dismissed by drag.** Drag-down should always dismiss. Tap-outside should also dismiss. Tap-X is the fallback for cases where drag-down is contextually disabled. A bottom-sheet trapped behind a single dismiss button violates the platform contract on both iOS and Android.

- **5+ tabs on a TabBar.** iOS HIG = 5 max; Material 3 nav bar = 3–5. Beyond that, scanning collapses. Use a "More" tab on iOS or demote to a drawer destination on Android.

- **Nav title in a different family or weight from the rest of the app.** Use `type.heading.h4` or `.h5` — Satoshi everywhere. The single-typeface contract is what makes the platform-native chrome read as branded; break it and the nav looks like a different app's nav grafted on top.

- **Stacking long-form content inside a `Card.lifted`.** Lifted cards work for hero focal elements, not for body content. A long article inside a lifted card reads as marketing-overproduced; use `Card.bordered` (`border.hairline`) for body sections and reserve `Card.lifted` for the one hero per screen.

- **Skipping the safe-area inset on the bottom bar.** On iPhones with the home indicator, content under the bar gets clipped by the gesture area. Always pad with `env(safe-area-inset-bottom)` / `.safeAreaInset(.bottom)` / `WindowInsets.systemBars`.

## 6. Working reference

`audit-dashboard/src/app/mobile/page.tsx` — the canonical web reference for this pattern, exercising the iOS and Material 3 chrome shapes side-by-side (the dashboard renders both platform frames so reviewers can compare). For the platform-native code, see:

- iOS / SwiftUI: `design-system/02-components/{button,card,fab,field,stat}/examples/ios.swift` — composed against the `LumenField` shell pattern in [`03-platforms/ios-native/README.md`](../03-platforms/ios-native/README.md).
- Android / Compose: `design-system/02-components/{button,card,fab,field,stat}/examples/android.kt` — composed against the `OutlinedTextField` shell mapping in [`03-platforms/android-native/README.md`](../03-platforms/android-native/README.md).
- React Native: `design-system/02-components/{button,card,fab,field,stat}/examples/react-native.tsx` — Expo + NativeWind, same Satoshi-and-tokens contract.

When in doubt about a chrome dimension, defer to the platform guide — Apple HIG (iOS) or Material 3 specs (Android) win every time over a Lumen value, because they own the touch-floor contract. When in doubt about a content dimension, defer to Lumen — the patterns in this directory own that layer.

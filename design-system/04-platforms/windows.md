---
name: Windows (Electron default · WinUI 3 documentary)
type: platform-guide
platform: windows
runtime: Electron 30+ (default) · WinUI 3 / .NET 8 / C# 12 (documentary path)
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./macos.md, ./web.md]
---

# Windows — Lumen v0.13 platform guide

> **Default recommendation: Electron with `vibrancy: 'acrylic'`.** The web bundle already ships Lumen via Phase 2 — there's no incremental work for Windows beyond the BrowserWindow config. WinUI 3 native is documented for completeness but is not a Phase 3 deliverable; build a WinUI 3 target only when a Warp product specifically requires native Win32 integration.

## 1. What this platform is

Windows is where **enterprise carrier operators and freight brokerages live**. The Warp products that ship to Windows:

- **Warp desktop app — Windows variant** — Electron wrapper around the SaaS, primary Win11 distribution channel. ≥ 95% of Windows Lumen surface area.
- **Cross-dock command center — Windows kiosk** — when the hub is on Windows-on-ARM hardware rather than Mac mini.
- **Carrier-fleet TMS desktop** — partners who run Windows-only IT stacks. Same Electron bundle, white-labeled per partner.

What Lumen specifically does NOT target on Windows: native WinUI 3 / WPF / Win32 line-of-business apps. If a Warp product genuinely needs that path (deep Win32 integration with shipping-label printers, COM drivers, etc.), the WinUI 3 path is documented in §8.

## 2. Token mapping table

### Default — Electron + web tokens (95% of cases)

The Electron path reuses the web token graph verbatim. The Phase 2 shadcn registry installs into the renderer, [`dist/css/lumen.css`](../../dist/css/lumen.css) injects the semantic variables, [`dist/tailwind/lumen.preset.ts`](../../dist/tailwind/lumen.preset.ts) wires Tailwind. **There is no Windows-specific token translation when running Electron — the renderer is Chromium.**

The one wiring step is the BrowserWindow config:

```ts
import { BrowserWindow } from 'electron';

const win = new BrowserWindow({
    width: 1440,
    height: 900,
    frame: false,                      // Custom Lumen window chrome
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#0d0d0d00',            // transparent — show our chrome
        symbolColor: '#fafafa',        // window control glyphs (min/max/close)
        height: 28,
    },
    backgroundMaterial: 'acrylic',     // Windows 11+ Mica/Acrylic
    vibrancy: 'sidebar',                // macOS — see macos.md
    backgroundColor: '#00000000',       // transparent so Acrylic shows through
    webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
    },
});
```

### WinUI 3 native — when you must (documentary)

If the product genuinely needs Win32-native integration, here is the token mapping:

| Lumen token | WinUI 3 API | Notes |
|---|---|---|
| `surface.canvas` | `MicaBackdrop` system backdrop or `<Grid Background="{StaticResource LumenSurfaceCanvas}"/>` | Mica is the OS-painted backdrop; static resource works for inset surfaces. |
| `surface.raised` | `<Border Background="{StaticResource LumenSurfaceRaised}" CornerRadius="8"/>` | Card surface. |
| `surface.popover` / `surface.glass` | `AcrylicBrush` with `TintColor` and `TintOpacity = 0.5` | WinUI 3 native vibrancy. |
| `surface.glass-strong` | `AcrylicBrush` with `TintOpacity = 0.7` | Modal vibrancy. |
| Text / Border / Action | `ResourceDictionary` static resources generated from Phase 0 JSON | Build a `LumenTokens.xaml` resource dictionary from `dist/json/tokens.json`. |
| Motion | Composition API animations — `Microsoft.UI.Composition` | `EasingFunction` is `CubicBezierEasingFunction(0.2f, 0f, 0f, 1f)` for decelerate. |
| Typography | Custom font load via `Microsoft.UI.Text.FontFamily("Satoshi Variable")` after registering via `manifest.xml` | Satoshi must be installed as an app-private font. |

A `LumenTokens.xaml` resource dictionary generator is **not** part of Phase 3 — when a Warp product requires WinUI 3 native, that team builds the resource dictionary as a Phase 6 follow-up using the Style Dictionary tooling that already emits Compose / iOS / Liquid.

## 3. Identity budget

### Electron path
**Lumen claim: ~95% of pixel surface.** Higher than macOS because Electron lets us paint the title bar (via `titleBarOverlay`) and the entire window chrome. What we don't paint:

- **Windows system chrome** (~5%): the title bar overlay region for min/max/close buttons (≈ 138×28 px), system notifications, Action Center surfaces, ALT-TAB switcher.

### WinUI 3 native path
**Lumen claim: ~75–85%** depending on whether the app uses `NavigationView` (Windows-painted left rail) or paints its own. System taskbar, Start menu, system tray, system alert dialogs claim the rest.

## 4. Glass / blur translation

### Electron — Acrylic backdrop
The `backgroundMaterial: 'acrylic'` BrowserWindow option enables Windows 11 Acrylic on the entire window backdrop. CSS `backdrop-filter: blur(20px) saturate(140%)` then layers on Lumen-painted glass surfaces (popovers, sheets) above the Acrylic canvas.

Order of operations:
1. Windows OS paints Acrylic on the BrowserWindow.
2. Lumen-painted obsidian canvas (`var(--surface-canvas)`) lives at the renderer root; alpha varies per dark/light mode.
3. Lumen glass surfaces (popovers, sheets) layer `backdrop-filter: blur(20px)` on top.

### WinUI 3 — AcrylicBrush directly

```xml
<Border>
    <Border.Background>
        <AcrylicBrush
            TintColor="{StaticResource LumenSurfaceRaised}"
            TintOpacity="0.5"
            FallbackColor="{StaticResource LumenSurfaceRaisedSolid}"/>
    </Border.Background>
</Border>
```

`FallbackColor` is the solid surface used when Acrylic isn't available (transparency disabled, RDP session, low-spec hardware).

### Reduce Transparency

Both paths read from the same OS preference. Detection:

**Electron renderer (Chromium):**

```ts
@media (prefers-reduced-transparency: reduce) {
    :root {
        --surface-glass: var(--surface-raised);  /* solid fallback */
    }
}
```

Windows reports the user's "Transparency effects" toggle (Settings → Personalization → Colors) to the OS, which propagates through to `prefers-reduced-transparency` per the Phase 1 lumen-scoping.css contract.

**WinUI 3 native:** `UISettings.AdvancedEffectsEnabled` reflects the user's transparency preference. When false, swap `AcrylicBrush` for solid `SolidColorBrush` using the FallbackColor.

## 5. Motion translation

### Electron path
Identical to web — `motion.duration.*` durations consume from CSS variables; `cubic-bezier` easings via tailwind utilities or the lumen-scoping.css preset.

### WinUI 3 path

```csharp
// Decelerate easing
var decelerate = new CubicBezierEasingFunction(
    compositor,
    new Vector2(0.2f, 0f),
    new Vector2(0f, 1f)
);

// Default spring — Composition has SpringAnimation
var spring = compositor.CreateSpringScalarAnimation();
spring.DampingRatio = 0.84f;  // matches motion.spring.default
spring.Period = TimeSpan.FromMilliseconds(380);  // response 0.38s
spring.FinalValue = targetValue;
```

WinUI 3 `SpringAnimation` parameterizes via `DampingRatio` + `Period` (matching SwiftUI's `response:dampingFraction:`).

### Reduce Motion

Windows reports the user's "Animation effects" preference:

**Electron renderer:** `@media (prefers-reduced-motion: reduce)` works natively in Chromium.

**WinUI 3 native:** `UISettings.AnimationsEnabled`. When false, replace all animations with hard cuts.

## 6. Typography translation

### Electron path
Satoshi loaded via `@font-face` in the web bundle — identical to web.md.

### WinUI 3 native
Add Satoshi files to the app's `Assets/` folder, register in `Package.appxmanifest`:

```xml
<uap4:VisualElements>
    <uap4:Resources>
        <uap4:Resource Language="en-US"/>
    </uap4:Resources>
</uap4:VisualElements>
```

Reference in code:

```xml
<TextBlock
    FontFamily="ms-appx:///Assets/Fonts/Satoshi-Variable.ttf#Satoshi Variable"
    FontSize="14"
    Text="Lane LAX→SFO"/>
```

`tnum`, `lnum`, `zero` OpenType features carry via `TextOptions.FontFeatures`:

```xml
<TextBlock>
    <TextBlock.TextOptions>
        <TextOptions>
            <TextOptions.FontFeatures>tnum lnum zero</TextOptions.FontFeatures>
        </TextOptions>
    </TextBlock.TextOptions>
</TextBlock>
```

## 7. Specific don'ts (Windows Lumen Law)

### Electron path
- **Don't ship `frame: true` on Windows.** The default Windows title bar can't be styled and breaks the Lumen visual contract. Always `frame: false` + `titleBarOverlay`.
- **Don't paint Spring Green into the title bar overlay symbol color.** Window-control glyphs (min/max/close) stay neutral. Accent reserved for actionable affordances.
- **Don't disable Acrylic for users on Windows 10 (build < 22000).** Acrylic is Windows 11+. Detect via `process.getSystemVersion()` and fall back to solid `surface.canvas` for Win10.
- **Don't override the user's "Transparency effects" preference.** Some enterprise environments disable transparency at the policy level — respect it.
- **Don't paint into the Start menu, taskbar, or system tray.** OS surfaces. Lumen voice still applies to notification text content.

### WinUI 3 native
- **Don't use Mica on non-app-window surfaces.** Mica is window-backdrop-only. Inset surfaces use SolidColorBrush.
- **Don't apply AcrylicBrush to `ListView` row backgrounds.** Same legibility-cliff rule as other platforms.
- **Don't ship a Lumen WinUI 3 target without `FallbackColor` on every AcrylicBrush.** RDP sessions, low-spec hardware, and the transparency-off preference all need the fallback.

## 8. Reference snippets

### Electron BrowserWindow setup

```ts
import { BrowserWindow, app } from 'electron';

app.whenReady().then(() => {
    const isWin11 = process.platform === 'win32' &&
        parseInt(process.getSystemVersion().split('.')[0]) >= 22000;

    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 640,
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0d0d0d00',
            symbolColor: '#fafafa',
            height: 28,
        },
        backgroundMaterial: isWin11 ? 'acrylic' : undefined,
        backgroundColor: isWin11 ? '#00000000' : '#0d0d0d',  // fallback for Win10
        vibrancy: 'sidebar',  // macOS path; ignored on Win
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadURL('https://warp.app/');
});
```

### Custom Lumen title-bar overlay region (renderer-side CSS)

```css
/* In the renderer, painted by Lumen */
.lumen-titlebar {
    -webkit-app-region: drag;       /* Lets users drag the window */
    height: 28px;
    padding: 4px 12px;
    background: transparent;        /* Show the Acrylic backdrop */
    color: var(--text-primary);
    font-family: 'Satoshi Variable', sans-serif;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.lumen-titlebar > button {
    -webkit-app-region: no-drag;    /* Don't make buttons drag-handles */
}
```

### WinUI 3 — Primary button (XAML)

```xml
<Button
    Background="{StaticResource LumenActionPrimaryBgRest}"
    Foreground="{StaticResource LumenActionPrimaryFg}"
    Padding="14,8"
    CornerRadius="6"
    FontFamily="ms-appx:///Assets/Fonts/Satoshi-Variable.ttf#Satoshi Variable"
    FontSize="14"
    FontWeight="SemiBold">
    Book shipment
</Button>
```

### WinUI 3 — Acrylic popover

```xml
<Border CornerRadius="12" Padding="16">
    <Border.Background>
        <AcrylicBrush
            TintColor="{StaticResource LumenSurfaceRaised}"
            TintOpacity="0.5"
            TintLuminosityOpacity="0.7"
            FallbackColor="{StaticResource LumenSurfaceRaisedSolid}"/>
    </Border.Background>
    <StackPanel>
        <!-- popover content -->
    </StackPanel>
</Border>
```

**No reference app ships in [`examples/`](../../examples/) for Windows.** The Electron path is the existing web bundle plus the BrowserWindow config above; building a separate Windows reference would duplicate the audit-dashboard. The WinUI 3 path is documentary — build a target only when a specific Warp product requires it.

## Related

- [`./web.md`](./web.md) — Electron renderer reuses the web token graph.
- [`./macos.md`](./macos.md) — Electron `vibrancy: 'sidebar'` on macOS; the BrowserWindow config above is cross-platform.
- [`../00-foundations/modes.md`](../00-foundations/modes.md) — restrained / expressive mode scoping inside the renderer.

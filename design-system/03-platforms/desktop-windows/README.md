# Desktop · Windows (WinUI 3)

> Stack: WinUI 3 (.NET 8 + C# 12) on Windows 11. Token consumption via XAML resource dictionary generated from Lumen JSON. Mica titlebar, Fluent acrylic surfaces.

## Setup

### 1. Install Lumen tokens for Windows
Pull the WinUI XAML resource dictionary from `lumen-dist`:
```powershell
Invoke-WebRequest "https://cdn.warp.dev/lumen/v0.1.0/winui/LumenTokens.xaml" -OutFile "LumenTokens.xaml"
```

Add to your project's `Resources` folder.

### 2. Bundle Satoshi
1. Add `Satoshi-Variable.ttf` to `Assets/Fonts/`.
2. Set Build Action to `Content`, Copy to Output Directory: `Always`.
3. Register in `App.xaml`:
```xml
<Application.Resources>
  <ResourceDictionary>
    <ResourceDictionary.MergedDictionaries>
      <ResourceDictionary Source="Resources/LumenTokens.xaml"/>
    </ResourceDictionary.MergedDictionaries>
    <!-- v0.10 — Lumen is Satoshi-only. LumenMono / LumenSerif resources retired;
         tabular numerics + editorial moments ride Satoshi's OpenType features. -->
    <FontFamily x:Key="LumenSans">ms-appx:///Assets/Fonts/Satoshi-Variable.ttf#Satoshi</FontFamily>
  </ResourceDictionary>
</Application.Resources>
```

### 3. Use Lumen tokens
```xml
<Grid Background="{ThemeResource LumenSurfacePage}">
  <StackPanel Padding="{StaticResource LumenSpace4}">
    <TextBlock
      Text="On time"
      FontFamily="{StaticResource LumenSans}"
      Foreground="{ThemeResource LumenTextTertiary}"
      Style="{StaticResource LumenLabelEyebrow}"/>
    <TextBlock
      Text="98.2%"
      FontFamily="{StaticResource LumenSans}"
      FontSize="{StaticResource LumenSizeHeading31}"
      FontWeight="Bold"
      Foreground="{ThemeResource LumenTextPrimary}"/>
  </StackPanel>
</Grid>
```

## ClearType caveat

Satoshi is display-oriented and not deeply hinted for Windows GDI/ClearType. At 13–14 px UI sizes on 1080p displays, expect slight stem irregularity. **Mitigations:**

1. **Recommended:** bump Windows-specific UI text to 14 px minimum (Lumen's body floor) and pin DirectWrite ClearType rendering on. WinUI 3 honors this by default.
2. **Optical-size axis:** if a future Satoshi build ships an `opsz` axis, wire it through `FontVariations` to favor the small-text instance at 12–14 px.

QA at 12–14 px on a 1080p Windows 10/11 VM during pre-release. v0.10 retired the Inter Plan-B fallback — Lumen is Satoshi-only on every platform. If a hostile rendering environment ever forces a non-Satoshi swap, document it via a new ADR before reintroducing a fallback resource.

## Mica titlebar

WinUI 3 supports Mica (the translucent system material) via `MicaController`. Apply on the window root:

```xml
<Window x:Class="MyApp.MainWindow"
        SystemBackdrop="MicaAlt">
  ...
</Window>
```

Or programmatically:
```csharp
this.SystemBackdrop = new MicaBackdrop { Kind = MicaKind.BaseAlt };
```

## Live primitives

Implement `LiveDot` and `RateTicker` as `UserControl`s with Composition API animations (the WinUI animation system). Lumen ships these in the `LumenWinUI` NuGet package.

## Reduced motion

Honor `Windows.UI.ViewManagement.UISettings.AnimationsEnabled`:
```csharp
var settings = new Windows.UI.ViewManagement.UISettings();
if (!settings.AnimationsEnabled) {
  // disable LiveDot pulse, RateTicker marquee
}
```

## Dark mode

WinUI 3 supports `RequestedTheme` on `Window` and `FrameworkElement`. Lumen tokens are theme-aware:
```xml
<ResourceDictionary.ThemeDictionaries>
  <ResourceDictionary x:Key="Default">
    <Color x:Key="LumenSurfacePage">#fafaf7</Color>
  </ResourceDictionary>
  <ResourceDictionary x:Key="Dark">
    <Color x:Key="LumenSurfacePage">#131c2a</Color>
  </ResourceDictionary>
</ResourceDictionary.ThemeDictionaries>
```

The Style Dictionary `winui` format generates these dictionaries automatically.

## Distribution

- Microsoft Store: Lumen Satoshi distribution is permitted under FFL for app embedding.
- MSIX or direct install: bundle the font in `Assets/Fonts/`. Do NOT install the font system-wide via the installer.

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to WinUI 3 (and WPF as a fallback) on Windows 11.

### The shell pattern in WinUI 3

WinUI 3's `TextBox` ships with its own border + focus visual. The v0.6 pattern asks for the wrapper to own chrome and the inner control to render bare. Override via XAML `Style` resources mapped to Lumen tokens:

```xml
<Style x:Key="LumenTextBoxStyle" TargetType="TextBox">
  <Setter Property="FontFamily" Value="{StaticResource LumenSans}"/>
  <Setter Property="FontSize"   Value="14"/>
  <Setter Property="Background" Value="{ThemeResource LumenSurfaceInputRest}"/>
  <Setter Property="Foreground" Value="{ThemeResource LumenTextPrimary}"/>
  <Setter Property="BorderBrush" Value="{ThemeResource LumenBorderDefault}"/>
  <Setter Property="BorderThickness" Value="1"/>
  <Setter Property="CornerRadius" Value="{StaticResource LumenRadiusControlMd}"/>
  <Setter Property="Padding" Value="12,0"/>
  <Setter Property="MinHeight" Value="40"/>
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="TextBox">
        <Grid>
          <Border x:Name="ShellBorder"
                  Background="{TemplateBinding Background}"
                  BorderBrush="{TemplateBinding BorderBrush}"
                  BorderThickness="{TemplateBinding BorderThickness}"
                  CornerRadius="{TemplateBinding CornerRadius}">
            <ScrollViewer x:Name="ContentElement" Padding="{TemplateBinding Padding}"/>
          </Border>
          <VisualStateManager.VisualStateGroups>
            <VisualStateGroup x:Name="CommonStates">
              <VisualState x:Name="Normal"/>
              <VisualState x:Name="PointerOver">
                <VisualState.Setters>
                  <Setter Target="ShellBorder.BorderBrush" Value="{ThemeResource LumenBorderStrong}"/>
                </VisualState.Setters>
              </VisualState>
              <VisualState x:Name="Focused">
                <VisualState.Setters>
                  <Setter Target="ShellBorder.BorderBrush" Value="{ThemeResource LumenBorderFocus}"/>
                  <!-- v0.6 lime halo via DropShadow effect -->
                </VisualState.Setters>
              </VisualState>
              <VisualState x:Name="Disabled">
                <VisualState.Setters>
                  <Setter Target="ShellBorder.Background"  Value="{ThemeResource LumenSurfaceInputDisabled}"/>
                  <Setter Target="ShellBorder.BorderBrush" Value="{ThemeResource LumenBorderDisabled}"/>
                </VisualState.Setters>
              </VisualState>
            </VisualStateGroup>
          </VisualStateManager.VisualStateGroups>
        </Grid>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

The shell is the `Border` element; the inner `ScrollViewer` (which hosts the editable text) renders bare. WinUI's `VisualStateManager` is the structural equivalent of CSS's pseudo-classes — `Focused` paints the v0.6 ring on the wrapper, not the inner text.

For composed fields (icon + value + addon), wrap the `TextBox` in a `Grid` with three columns and set the `TextBox` style to a `BareTextBoxStyle` variant that strips the `Border` entirely — matching the web slot pattern.

### Token mapping

| Lumen token | WinUI 3 / XAML equivalent | Notes |
|---|---|---|
| `input.height.sm` | `MinHeight="32"` | |
| `input.height.md` | `MinHeight="40"` | the default on Windows 11 |
| `input.height.lg` | `MinHeight="48"` | tablet hybrid only |
| `input.padding.x.md` | `Padding="12,0"` | |
| `input.background.rest` | `{ThemeResource LumenSurfaceInputRest}` | resolved via `ThemeDictionaries` |
| `input.border.rest` | `{ThemeResource LumenBorderDefault}` | |
| `input.border.focus` | `{ThemeResource LumenBorderFocus}` (via `Focused` VisualState) | |
| `input.ring.focus` | `Border.Effect = DropShadowEffect { Color = LimeA32, BlurRadius = 6 }` | DropShadow is gaussian; for a sharp 3 px ring, stack two `Border` elements |
| `input.ring.error` | same shape, error red | |
| `input.transition` | WinUI animates VisualState transitions automatically; override via `<Storyboard>` for finer control | |

**Token I wish existed but doesn't:** WinUI's `DropShadowEffect` is gaussian-blurred; the v0.6 `box-shadow: 0 0 0 3px lime-a32` is a **sharp** outer ring. The cleanest map is a stacked `Border` element with negative `Margin = "-3"` and the lime fill — but that's a per-template patch, not a token. A platform-aware `input.ring.focus.winui` token (mapped to `BorderThickness="3" + LimeA32` on a stacked border) would let Style Dictionary emit clean XAML.

### Density modes

Windows 11 is conventionally **dense** — File Explorer, Settings, Office all run tight. `compact` is the **implicit default** for desktop apps. Switch to `comfortable` only for:
- Tablet hybrid surfaces (Surface devices used in pen-only mode).
- Touch-first onboarding flows.

Wire density via a `ResourceDictionary` swap or a `DataTrigger` on a `Form` root:

```xml
<Style x:Key="LumenTextBoxCompact" BasedOn="{StaticResource LumenTextBoxStyle}" TargetType="TextBox">
  <Setter Property="MinHeight" Value="32"/>
  <Setter Property="Padding" Value="8,0"/>
  <Setter Property="FontSize" Value="13"/>
</Style>
```

### Validation timing

Same rules as web. WinUI implementation:

1. **Don't validate during typing.** Track `bool _hasInteracted` in the page code-behind; gate validation on it.
2. **Validate on blur** via `TextBox.LostFocus += OnFieldBlur`.
3. **Switch to onChange** after first error — once `error != null`, validate inside `TextBox.TextChanged`.
4. **On submit**, iterate fields; for the first invalid, call `field.Focus(FocusState.Programmatic)` and `field.StartBringIntoView()`.
5. **Server validation**: announce via `Microsoft.UI.Xaml.Automation.Peers.AutomationPeer.RaiseAutomationEvent(AutomationEvents.LiveRegionChanged)` (the WinUI equivalent of `aria-live`).
6. **Async validation**: launch a debounced `Task.Delay` inside `TextChanged`; render a `ProgressRing` in the trailing slot.

**Submit is never disabled as the only signal of validation failure.** Windows users expect Tab + Enter to surface the validation summary.

### Read-only vs disabled

| State | WinUI | Visual | In tab order? | Caret? | Copyable? |
|---|---|---|---|---|---|
| `disabled` | `IsEnabled="False"` | muted via Lumen disabled tokens | no | no | no |
| `readOnly` | `IsReadOnly="True"` | rest bg, full contrast, native context menu offers Copy | yes | no | yes |

`IsReadOnly="True"` keeps the field in the focus order and preserves Ctrl-C — the correct semantic for non-editable values.

### ClearType caveat for forms

The Satoshi/ClearType caveat above applies to form text too. At 13–14 px Satoshi on 1080p ClearType, value text and helper text can show stem irregularity. Mitigations:

1. **Bump form text to 14 px minimum** on Windows-targeted styles — this is Lumen's body floor and the most common fix.
2. **Pin ClearType + DirectWrite rendering** via XAML resources. WinUI 3 defaults are already correct; verify on shipped builds.
3. **Last resort:** if Satoshi rendering ever proves unworkable for a Windows-only build, raise a new ADR before reintroducing a fallback family. v0.10 is single-typeface.

### Mica + acrylic compatibility

WinUI 3 surfaces (windows, panels) frequently use `MicaBackdrop` or `AcrylicBrush`. The `.lumen-field` shell stays fully opaque on top of these — NN/g's "don't glass interactive elements" warning honored. The lit-edge inset becomes especially natural here: the 1 px highlight at the top of the field reads as a reflection on the surrounding mica substrate.

### Web-only features that don't translate

| Web feature | WinUI equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | `VisualStateManager` `Focused` state on the wrapper Border | clean |
| Autofill bg override | Windows Credential Manager autofill respects the templated TextBox cleanly | clean |
| `field-sizing: content` | `TextBox` with `AcceptsReturn="True" + TextWrapping="Wrap"` grows naturally; height grows with content via `MinHeight` instead of fixed `Height` | partial |
| 3 px sharp outer halo | gaussian `DropShadowEffect` or stacked `Border` (see token mapping) | platform compromise |

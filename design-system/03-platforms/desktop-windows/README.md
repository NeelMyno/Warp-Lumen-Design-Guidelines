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
    <FontFamily x:Key="LumenSans">ms-appx:///Assets/Fonts/Satoshi-Variable.ttf#Satoshi</FontFamily>
    <FontFamily x:Key="LumenMono">ms-appx:///Assets/Fonts/JetBrainsMono-Variable.ttf#JetBrains Mono</FontFamily>
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

1. **Recommended:** bump Windows-specific UI text to 14 px minimum.
2. **Fallback:** detect Windows + low-DPI and switch to Inter via XAML resource:

```xml
<FontFamily x:Key="LumenSansFallback">Inter, Segoe UI Variable, Segoe UI, sans-serif</FontFamily>
```

QA at 12–14 px on a 1080p Windows 10/11 VM during pre-release.

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

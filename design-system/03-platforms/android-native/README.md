# Android native (Jetpack Compose)

> Stack: Kotlin 2 + Jetpack Compose on Android API 26+ (Android 8.0). Lumen tokens delivered as a Kotlin module. Satoshi bundled as a font resource.

> **v0.11.13 currency.** This guide reflects the Premium Psychology recolor — anchors are spring green `#00FA8A` (accent), obsidian mint `#171A18` (dark canvas), light anchor `#E6E6E6`, paper `#FAFAFA`. Seven principles now (hierarchy, first-impression, micro-interactions joined the original five) and 35 component contracts. v0.11.13 closes the DTCG inheritance audit; `LumenTokens.Color.accent._500` now resolves to spring green and the dark-mode surface family rebuilds against obsidian mint.

## Setup

### 1. Add Lumen Compose dependency

`build.gradle.kts`:
```kotlin
dependencies {
  implementation("dev.warp:lumen-compose:0.11.13")
}
```

### 2. Bundle Satoshi

Drop the OTF files into `app/src/main/res/font/`:
- `satoshi_regular.otf`
- `satoshi_medium.otf`
- `satoshi_bold.otf`
- `satoshi_black.otf`

Use lowercase names (Android resource naming rule).

### 3. Register the font
```kotlin
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontWeight

val Satoshi = FontFamily(
  Font(R.font.satoshi_regular, FontWeight.Normal),
  Font(R.font.satoshi_medium,  FontWeight.Medium),
  Font(R.font.satoshi_bold,    FontWeight.Bold),
  Font(R.font.satoshi_black,   FontWeight.Black),
)
```

### 4. Use Lumen tokens
```kotlin
import dev.warp.lumen.LumenTokens
import dev.warp.lumen.LumenTheme

@Composable
fun App() {
  LumenTheme {  // wires both light + dark color schemes
    Surface(color = MaterialTheme.colorScheme.background) {
      Card(
        shape = RoundedCornerShape(LumenTokens.Radius.card.default),
        modifier = Modifier.padding(LumenTokens.Space._4)
      ) {
        Stat(label = "On time", value = "98.2", unit = "%")
      }
    }
  }
}
```

## Mapping Lumen scale to Material 3 type roles

See `01-tokens/README.md` for the full table. Highlights:
- `display.md` → `displaySmall` (36 sp)
- `heading.h1` → `headlineLarge` (32 sp)
- `heading.h2` → `headlineMedium` (28 sp)
- `heading.h3` → `headlineSmall` (24 sp)
- `body.md` → `bodyLarge` (16 sp)
- `body.sm` → `bodyMedium` (14 sp)
- `caption` → `bodySmall` (12 sp)
- `label.sm` → `labelLarge` (14 sp)

## Live primitives (Compose)

```kotlin
@Composable
fun LiveDot(
  color: Color = LumenTokens.Color.accent._500,
  size: Dp = 8.dp,
  label: String? = null,
) {
  val infinite = rememberInfiniteTransition(label = "live-pulse")
  val reduceMotion = LocalAccessibilityManager.current.isReduceMotionEnabled

  val scale by infinite.animateFloat(
    initialValue = 1f, targetValue = 2.4f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = 3000, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Restart
    ),
    label = "scale"
  )
  val opacity by infinite.animateFloat(
    initialValue = 0.7f, targetValue = 0f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = 3000, easing = FastOutSlowInEasing)
    ),
    label = "opacity"
  )

  Row(verticalAlignment = Alignment.CenterVertically) {
    Box(modifier = Modifier.size(size)) {
      Box(modifier = Modifier
        .matchParentSize()
        .clip(CircleShape)
        .background(color)
      )
      if (!reduceMotion) {
        Box(modifier = Modifier
          .matchParentSize()
          .scale(scale)
          .alpha(opacity)
          .border(1.5.dp, color, CircleShape)
        )
      }
    }
    label?.let {
      Spacer(Modifier.width(LumenTokens.Space._2))
      Text(it.uppercase(), style = MaterialTheme.typography.labelMedium)
    }
  }
}
```

## Touch targets and a11y

- Material 3 enforces 48×48 dp minimum — Lumen primitives respect this.
- TalkBack labels on every icon-only control.
- Honor `Settings.Global.ANIMATOR_DURATION_SCALE` and `LocalAccessibilityManager.current.isReduceMotionEnabled`.

## Dark mode

`LumenTheme` reads `isSystemInDarkTheme()` and switches automatically. Override with `LumenTheme(darkTheme = true)` for forced dark.

## Things to know

- Material 3 components are the substrate; Lumen tokens override the theme.
- Don't use Material's default colors. Use `LumenTokens.Color.*`.
- For OSS-friendly distribution, ship Lumen as a published Maven Central artifact.
- Tested on Android 8.0+ (API 26+); below that, use Roboto fallback for Satoshi.

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to Jetpack Compose on Android — where Material 3's `OutlinedTextField` is **already the shell pattern** by construction.

### The shell pattern in Compose

Compose's `OutlinedTextField` is a near-perfect match for v0.6: the outline IS the focus surface, the inner text core renders bare, and leading/trailing slots bond inside the outline. No workaround needed. Map Lumen tokens via `OutlinedTextFieldDefaults.colors(...)` to take ownership of every state.

```kotlin
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.layout.height
import androidx.compose.ui.Modifier
import dev.warp.lumen.LumenTokens

@Composable
fun LumenField(
  value: String,
  onValueChange: (String) -> Unit,
  label: String,
  isError: Boolean = false,
  enabled: Boolean = true,
  readOnly: Boolean = false,
  leadingIcon: @Composable (() -> Unit)? = null,
  trailingAddon: @Composable (() -> Unit)? = null,
  size: FieldSize = FieldSize.Md,
) {
  OutlinedTextField(
    value = value,
    onValueChange = onValueChange,
    label = { Text(label) },
    isError = isError,
    enabled = enabled,
    readOnly = readOnly,
    leadingIcon = leadingIcon,
    trailingIcon = trailingAddon,
    shape = RoundedCornerShape(LumenTokens.Radius.control.md),
    modifier = Modifier.height(size.height),
    colors = OutlinedTextFieldDefaults.colors(
      focusedContainerColor   = LumenTokens.Color.surface.input.rest,
      unfocusedContainerColor = LumenTokens.Color.surface.input.rest,
      disabledContainerColor  = LumenTokens.Color.surface.input.disabled,
      errorContainerColor     = LumenTokens.Color.surface.input.rest,
      focusedBorderColor      = LumenTokens.Color.border.focus,
      unfocusedBorderColor    = LumenTokens.Color.border.default,
      disabledBorderColor     = LumenTokens.Color.border.disabled,
      errorBorderColor        = LumenTokens.Color.border.error,
      focusedTextColor        = LumenTokens.Color.text.primary,
      unfocusedTextColor      = LumenTokens.Color.text.primary,
      cursorColor             = LumenTokens.Color.accent._500,
      errorCursorColor        = LumenTokens.Color.border.error,
    ),
  )
}
```

The architectural caveat: M3's `OutlinedTextField` ships with a **floating label** by default. v0.6 prescribes **stacked labels** (Linear / Geist / Stripe convergence). Two paths:

1. **Pass `label = null`** and render a `Text` above the field manually — closer to Lumen's stacked-label semantics; loses M3's animated label-to-supporting-text choreography.
2. **Keep the floating label** — accept the platform idiom. Material 3 users expect floating; Compose users especially.

Internal apps (operator dashboards): use path (1) for stacked. Consumer-facing apps: path (2) is fine.

### Token mapping

| Lumen token | Compose / M3 equivalent | Notes |
|---|---|---|
| `input.height.sm` | `Modifier.height(48.dp)` | M3 floor is 48 dp for touch targets — sm collapses to 48, not 32 |
| `input.height.md` | `Modifier.height(56.dp)` | M3 default `OutlinedTextField` height |
| `input.height.lg` | `Modifier.height(64.dp)` | accommodates supporting text inline |
| `input.padding.x.md` | `OutlinedTextFieldDefaults.contentPadding(horizontal = 12.dp)` | |
| `input.background.rest` | `colors(focusedContainerColor = …, unfocusedContainerColor = …)` | |
| `input.border.rest` | `colors(unfocusedBorderColor = …)` | |
| `input.border.focus` | `colors(focusedBorderColor = …)` | M3 paints automatically on focus |
| `input.ring.focus` | M3 thickens the outline on focus (1 dp → 2 dp) but does NOT paint an outer halo | platform mismatch — see below |
| `input.ring.error` | same shape, M3 thickens to error red | |
| `input.transition` | M3 animates outline color/thickness automatically; duration matches `MaterialTheme.motionScheme` | inherits M3 motion |

**Token I wish existed but doesn't:** the v0.6 `box-shadow` halo (3 px spring-green ring at 32% alpha — `#00FA8A` in v0.11) doesn't have a clean M3 equivalent. M3's focus signal is **outline thickening**, not an outer glow. To paint Lumen's spring-green halo on top of the M3 outline, wrap the `OutlinedTextField` in a `Box` with a `Modifier.drawBehind { drawRoundRect(...) }` that subscribes to the field's `interactionSource.collectIsFocusedAsState()`. A platform-aware `input.ring.focus.android` token (mapped to "outline thickness 2 dp" instead of "box-shadow 3 px") would let Style Dictionary emit the right form per target without consumer-side patching.

### Density modes

Compose's idiomatic density control is `LocalDensity` and the `MaterialTheme.typography` ramps. Wire `compact` density via a `CompositionLocal`:

```kotlin
val LocalLumenDensity = compositionLocalOf { LumenDensity.Comfortable }

@Composable
fun LumenForm(density: LumenDensity = LumenDensity.Comfortable, content: @Composable () -> Unit) {
  CompositionLocalProvider(LocalLumenDensity provides density) {
    content()
  }
}
```

Inside `LumenField`, read `LocalLumenDensity.current` and switch height + content padding accordingly. Operator dashboards default `Compact` (48 dp); consumer apps stay `Comfortable` (56 dp).

### Validation timing

Same rules as web. Compose implementation:

1. **Don't validate during typing.** Track `var hasInteracted by remember { mutableStateOf(false) }`; gate validation on it.
2. **Validate on blur** via `Modifier.onFocusChanged { state -> if (!state.isFocused && hasInteracted) validate() }`.
3. **Switch to onChange** after first error — once `error != null`, validate inside `onValueChange`.
4. **On submit**, iterate fields; for the first invalid, call `focusRequester.requestFocus()` + `bringIntoViewRequester.bringIntoView()` to scroll.
5. **Server validation**: announce via `Modifier.semantics { liveRegion = LiveRegionMode.Polite; error = serverError }`.
6. **Async validation**: launch a debounced coroutine inside `LaunchedEffect(value)`; render a `CircularProgressIndicator` in the trailing slot.

**Submit is never disabled as the only signal of validation failure.** Material 3 buttons should remain pressable so the validation summary surfaces.

### Read-only vs disabled

| State | Compose props | Visual | Focusable? | Caret? | Copyable? |
|---|---|---|---|---|---|
| `disabled` | `enabled = false` | muted container + outline + text via M3 disabled colors | no | no | no |
| `readOnly` | `enabled = true, readOnly = true` | rest bg, full contrast, native text-selection menu on long-press | yes | no | yes |

The distinction matters: `readOnly = true` keeps the field in the focus order and preserves long-press copy — the correct semantic for non-editable values that the user might want to share.

### Material 3 semantics for errors

Use `Modifier.semantics { error = "ZIP must be 5 digits" }` so TalkBack announces the error message alongside the visual error state. M3's `OutlinedTextField` automatically wires `isError = true` to a TalkBack "invalid entry" announcement, but the message itself comes from your semantics block.

```kotlin
LumenField(
  value = zip,
  onValueChange = { zip = it },
  label = "Pickup ZIP",
  isError = error != null,
  modifier = Modifier.semantics { error?.let { this.error = it } },
)
```

### Web-only features that don't translate

| Web feature | Compose equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | `OutlinedTextField` paints focus by construction; `interactionSource.collectIsFocusedAsState()` for custom variants | clean — M3 was already there |
| Autofill bg override | Android Autofill Framework respects M3 outlined fields cleanly | clean |
| `field-sizing: content` (auto-grow Textarea) | `OutlinedTextField` with `singleLine = false` + no fixed height grows naturally | clean |
| Lit top edge (inset highlight) | not idiomatic on M3 outlined surfaces; skip on Android | platform compromise |
| 3 px outer halo focus ring | replaced by M3 outline thickening (see token table above) | platform substitution |

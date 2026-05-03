# Android native (Jetpack Compose)

> Stack: Kotlin 2 + Jetpack Compose on Android API 26+ (Android 8.0). Lumen tokens delivered as a Kotlin module. Satoshi bundled as a font resource.

## Setup

### 1. Add Lumen Compose dependency

`build.gradle.kts`:
```kotlin
dependencies {
  implementation("dev.warp:lumen-compose:0.1.0")
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

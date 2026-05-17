// LumenAndroidReference — three Lumen v0.13 surfaces in Compose with Haze.
//
// Demonstrates the Android contract from design-system/04-platforms/android.md:
//  - Haze for backdrop blur (Android's stock Modifier.blur blurs the element)
//  - LocalAccessibilityManager.isReduceMotionEnabled → solid fallback for glass
//  - Hard rule 9 — primary button uses actionPrimaryFg, never white on lime
//  - Hard rule 16 — Haze on the floating popover; never on dense data rows

package dev.warp.lumen.reference

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalAccessibilityManager
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material.Text
import androidx.compose.animation.core.*
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.HazeStyle
import dev.chrisbanes.haze.HazeTint
import dev.chrisbanes.haze.hazeSource
import dev.chrisbanes.haze.hazeEffect

// MARK: - Token subset (vendored — production reuses dist/compose/LumenColors.kt)
object LumenColors {
    val surfaceCanvas = Color(0xff0d0d0d)
    val surfaceRaised = Color(0xff171717)
    val surfaceGlassTint = Color(0xff0d0d0d).copy(alpha = 0.5f)
    val textPrimary  = Color(0xfffafafa)
    val textTertiary = Color(0xff737373)
    val borderDefault = Color.White.copy(alpha = 0.18f)
    val borderHairline = Color.White.copy(alpha = 0.06f)

    val actionPrimaryBgRest = Color(0xff00fa8a)
    val actionPrimaryFg     = Color(0xff07120d)  // hard rule 9
}

object LumenDimens {
    val radiusMd = 6.dp
    val radiusLg = 12.dp
    val spacing2 = 8.dp
    val spacing4 = 16.dp
    val spacing6 = 24.dp
}

object LumenEasing {
    val decelerate = CubicBezierEasing(0.2f, 0f, 0f, 1f)
}

object LumenSpring {
    // k=280, d=28, m=1 → dampingRatio=0.84, stiffness=280f
    val default = spring<Float>(dampingRatio = 0.84f, stiffness = 280f)
    // k=200, d=32, m=1 → dampingRatio=1.0 (clamp), stiffness=200f
    val gentle  = spring<Float>(dampingRatio = 1.0f, stiffness = 200f)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App()
        }
    }
}

@androidx.compose.runtime.Composable
fun App() {
    val hazeState = remember { HazeState() }
    var popoverShown by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(LumenColors.surfaceCanvas)
            .hazeSource(hazeState)  // Mark this as the backdrop Haze samples
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(LumenDimens.spacing6),
            verticalArrangement = Arrangement.spacedBy(LumenDimens.spacing6)
        ) {
            // Header
            Text(
                text = "L U M E N   v 0 . 1 3   ·   A N D R O I D",
                color = LumenColors.textTertiary,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
            )

            Spacer(modifier = Modifier.height(LumenDimens.spacing4))

            // Surface 1: Stat
            LumenStat(value = "98.2%", label = "ON-TIME DELIVERY")

            HorizontalDivider()

            // Surface 2: Primary button
            LumenPrimaryButton(label = "Book shipment", onClick = { popoverShown = true })

            HorizontalDivider()

            // Surface 3: Live dot
            Row(verticalAlignment = Alignment.CenterVertically) {
                LumenLiveDot()
                Spacer(modifier = Modifier.width(LumenDimens.spacing2))
                Text(
                    text = "L I V E",
                    color = LumenColors.textPrimary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }

        // Surface 4: Glass popover — overlays the hazeSource above
        if (popoverShown) {
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(LumenDimens.spacing6)
            ) {
                LumenGlassPopover(hazeState = hazeState) {
                    Column {
                        Text(
                            text = "Confirmed",
                            color = LumenColors.textPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                        )
                        Spacer(modifier = Modifier.height(LumenDimens.spacing2))
                        Text(
                            text = "Shipment AB47 booked. Tracking is live.",
                            color = LumenColors.textTertiary,
                            fontSize = 14.sp,
                        )
                    }
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
fun LumenStat(value: String, label: String, unit: String? = null) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = value,
                color = LumenColors.textPrimary,
                fontSize = 49.sp,
                fontWeight = FontWeight.Bold,
            )
            unit?.let {
                Text(
                    text = it,
                    color = LumenColors.textTertiary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium,
                )
            }
        }
        Text(
            text = label.uppercase().toCharArray().joinToString(" "),
            color = LumenColors.textTertiary,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
        )
    }
}

@androidx.compose.runtime.Composable
fun LumenPrimaryButton(label: String, onClick: () -> Unit) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val accessibilityManager = LocalAccessibilityManager.current
    val reduceMotion = accessibilityManager?.isReduceMotionEnabled ?: false

    val brightness by animateFloatAsState(
        targetValue = if (isPressed) 0.92f else 1f,
        animationSpec = if (reduceMotion) snap() else tween(80, easing = LumenEasing.decelerate),
        label = "press",
    )

    Box(
        modifier = Modifier
            .heightIn(min = 48.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(LumenDimens.radiusMd))
            .background(LumenColors.actionPrimaryBgRest.copy(alpha = brightness))
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick,
            )
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            color = LumenColors.actionPrimaryFg,  // hard rule 9
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
        )
    }
}

@androidx.compose.runtime.Composable
fun LumenGlassPopover(
    hazeState: HazeState,
    content: @androidx.compose.runtime.Composable () -> Unit,
) {
    val accessibilityManager = LocalAccessibilityManager.current
    val reduceMotion = accessibilityManager?.isReduceMotionEnabled ?: false

    val surfaceModifier = if (reduceMotion) {
        Modifier.background(LumenColors.surfaceRaised.copy(alpha = 0.92f))
    } else {
        Modifier.hazeEffect(state = hazeState) {
            backgroundColor = LumenColors.surfaceCanvas
            blurRadius = 20.dp
            tints = listOf(HazeTint(LumenColors.surfaceGlassTint))
        }
    }

    Box(
        modifier = surfaceModifier
            .clip(RoundedCornerShape(LumenDimens.radiusLg))
            .border(1.dp, LumenColors.borderDefault, RoundedCornerShape(LumenDimens.radiusLg))
            .padding(16.dp),
    ) {
        content()
    }
}

@androidx.compose.runtime.Composable
fun LumenLiveDot() {
    val accessibilityManager = LocalAccessibilityManager.current
    val reduceMotion = accessibilityManager?.isReduceMotionEnabled ?: false

    if (reduceMotion) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(LumenColors.actionPrimaryBgRest)
        )
    } else {
        val infinite = rememberInfiniteTransition(label = "live-dot")
        val scale by infinite.animateFloat(
            initialValue = 1f,
            targetValue = 1.3f,
            animationSpec = infiniteRepeatable(
                animation = tween(1500, easing = EaseInOut),
                repeatMode = RepeatMode.Reverse,
            ),
            label = "scale",
        )
        Box(
            modifier = Modifier
                .size(8.dp)
                .scale(scale)
                .clip(CircleShape)
                .background(LumenColors.actionPrimaryBgRest)
        )
    }
}

@androidx.compose.runtime.Composable
fun HorizontalDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(LumenColors.borderHairline)
    )
}

// Lumen Card — Android Jetpack Compose example (v0.14)

package design.warp.lumen.card.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Text

object LumenCardTokens {
    val SurfaceRaised = Color(0xFF151515)
    val BorderHairline = Color(0x12FFFFFF)  // white.alpha(0.07)
    val TextPrimary = Color(0xFFE6E6E6)
    val TextSecondary = Color(0xFF6B6B6B)
    val RadiusLg = 12.dp
    val InsetMd = 16.dp
    val InsetLg = 24.dp
}

@Composable
fun LumenCard(
    modifier: Modifier = Modifier,
    title: String? = null,
    supporting: String? = null,
    padding: Dp = LumenCardTokens.InsetMd,
    elevation: Boolean = false,
    content: @Composable () -> Unit = {},
) {
    val shape = RoundedCornerShape(LumenCardTokens.RadiusLg)
    Column(
        modifier = modifier
            .then(if (elevation) Modifier.shadow(8.dp, shape) else Modifier)
            .clip(shape)
            .background(LumenCardTokens.SurfaceRaised, shape)
            .border(1.dp, LumenCardTokens.BorderHairline, shape)
            .padding(padding),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        if (title != null) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(text = title, color = LumenCardTokens.TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                if (supporting != null) {
                    Text(text = supporting, color = LumenCardTokens.TextSecondary, fontSize = 14.sp)
                }
            }
        }
        content()
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF0D0D0D)
@Composable
fun LumenCardDemo() {
    Column(
        modifier = Modifier
            .background(Color(0xFF0D0D0D))
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        LumenCard(
            title = "Booked",
            supporting = "Confirmation BK-12345 sent to your inbox.",
        ) {
            Text("Pickup at 09:00, delivery by 17:00. Standard LTL.", color = LumenCardTokens.TextPrimary, fontSize = 14.sp)
        }
        LumenCard(padding = LumenCardTokens.InsetLg, elevation = true) {
            Text("Operator card with elevation + lg padding.", color = LumenCardTokens.TextPrimary, fontSize = 14.sp)
        }
    }
}

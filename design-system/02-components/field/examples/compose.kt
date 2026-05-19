// Lumen Field — Android Jetpack Compose example (v0.14)

package design.warp.lumen.field.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Text

object LumenFieldTokens {
    val SurfaceField = Color(0xFF151515)
    val BorderDefault = Color(0xFF404040)
    val BorderFocus = Color(0xFF00FA8A)
    val BorderInvalid = Color(0xFFCA2D2D)
    val TextPrimary = Color(0xFFE6E6E6)
    val TextSecondary = Color(0xFF6B6B6B)
    val TextTertiary = Color(0xFF9A9A9A)
    val TextDanger = Color(0xFFEC5757)
    val Placeholder = Color(0xFF6B6B6B)
    val RadiusMd = 6.dp
    val ControlMd = 40.dp
}

enum class LumenFieldStatus { NORMAL, INVALID }

@Composable
fun LumenField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    helpText: String? = null,
    errorText: String? = null,
    status: LumenFieldStatus = LumenFieldStatus.NORMAL,
    required: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
) {
    var focused by remember { mutableStateOf(false) }
    val shape = RoundedCornerShape(LumenFieldTokens.RadiusMd)
    val borderColor = when {
        status == LumenFieldStatus.INVALID -> LumenFieldTokens.BorderInvalid
        focused -> LumenFieldTokens.BorderFocus
        else -> LumenFieldTokens.BorderDefault
    }
    val borderWidth = if (focused) 2.dp else 1.dp

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(text = label, color = LumenFieldTokens.TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Medium)
            if (required) {
                Text(text = "*", color = LumenFieldTokens.TextDanger, fontSize = 13.sp, fontWeight = FontWeight.Medium)
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(LumenFieldTokens.ControlMd)
                .clip(shape)
                .background(LumenFieldTokens.SurfaceField, shape)
                .border(borderWidth, borderColor, shape)
                .padding(horizontal = 12.dp),
            contentAlignment = Alignment.CenterStart,
        ) {
            if (value.isEmpty() && !focused) {
                Text(text = placeholder, color = LumenFieldTokens.Placeholder, fontSize = 14.sp)
            }
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier
                    .fillMaxWidth()
                    .onFocusChanged { focused = it.isFocused },
                singleLine = true,
                textStyle = TextStyle(color = LumenFieldTokens.TextPrimary, fontSize = 14.sp),
                cursorBrush = SolidColor(LumenFieldTokens.BorderFocus),
                keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            )
        }

        when {
            status == LumenFieldStatus.INVALID && errorText != null ->
                Text(text = errorText, color = LumenFieldTokens.TextDanger, fontSize = 12.sp)
            helpText != null ->
                Text(text = helpText, color = LumenFieldTokens.TextTertiary, fontSize = 12.sp)
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF0D0D0D)
@Composable
fun LumenFieldDemo() {
    var email by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("Avery Mercer") }
    var invalid by remember { mutableStateOf("not-an-email") }

    Column(
        modifier = Modifier.background(Color(0xFF0D0D0D)).padding(24.dp).fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        LumenField(
            label = "Email",
            value = email,
            onValueChange = { email = it },
            placeholder = "you@warp.com",
            helpText = "We'll use this for shipment notifications.",
            required = true,
            keyboardType = KeyboardType.Email,
        )
        LumenField(label = "Full name", value = name, onValueChange = { name = it }, placeholder = "First Last")
        LumenField(
            label = "Login email",
            value = invalid,
            onValueChange = { invalid = it },
            placeholder = "you@warp.com",
            errorText = "Enter a valid email address.",
            status = LumenFieldStatus.INVALID,
        )
    }
}

// Root build script for LumenAndroidReference.
// Compose-only — no Material 3 default theming because we ship our own theme.

plugins {
    id("com.android.application") version "8.7.0" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21" apply false
}

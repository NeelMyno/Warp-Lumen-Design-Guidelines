// LumenAndroidReference app module.
// Compose UI · Haze backdrop blur · API 26+.

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "dev.warp.lumen.reference"
    compileSdk = 35

    defaultConfig {
        applicationId = "dev.warp.lumen.reference"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.13.0"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.activity:activity-compose:1.10.0")
    implementation("androidx.core:core-ktx:1.15.0")

    // Haze — the backdrop-blur library. Android's stock Modifier.blur is API 31+
    // and blurs the element rather than the backdrop.
    implementation("dev.chrisbanes.haze:haze:1.5.4")
}

plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
}

android {
    namespace = "com.centralino.data"
    compileSdk = 34

    defaultConfig {
        minSdk = 29
        targetSdk = 34
        consumerProguardFiles("consumer-rules.pro")

        // Room annotation processor arguments
        javaCompileOptions {
            annotationProcessorOptions {
                arguments["room.schemaLocation"] = "$projectDir/schemas"
                // Disable incremental annotation processing to avoid SQLite native lib issues
                arguments["room.incremental"] = "true"
                arguments["room.expandProjection"] = "true"
            }
        }
    }
}

dependencies {
    implementation(project(":domain"))

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")

    // Room + SQLCipher via safe helper
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    // SQLite JDBC with native libraries for all platforms (fixes Windows kapt issue)
    kapt("org.xerial:sqlite-jdbc:3.42.0.1")
    implementation("net.zetetic:android-database-sqlcipher:4.5.4")
    implementation("androidx.sqlite:sqlite-ktx:2.4.0")
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("com.google.dagger:hilt-android:2.51.1")
    kapt("com.google.dagger:hilt-android-compiler:2.51.1")

    implementation("com.jakewharton.timber:timber:5.0.1")

    implementation("androidx.security:security-crypto:1.1.0-alpha06")

}

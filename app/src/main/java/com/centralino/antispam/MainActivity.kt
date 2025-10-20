package com.centralino.antispam

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.centralino.antispam.ui.screens.LogRegisterScreen
import com.centralino.antispam.ui.screens.RulesScreen
import com.centralino.antispam.ui.screens.SettingsScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity: ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AppRoot() }
    }
}

@Composable
fun AppRoot() {
    val nav = rememberNavController()
    val items = listOf("registro", "regole", "impostazioni")
    Scaffold(
        bottomBar = {
            NavigationBar {
                val entry by nav.currentBackStackEntryAsState()
                val route = entry?.destination?.route
                items.forEach { r ->
                    NavigationBarItem(
                        selected = route == r,
                        onClick = { nav.navigate(r) },
                        label = { Text(r.replaceFirstChar { it.uppercaseChar() }) },
                        icon = { Icon(Icons.Filled.Info, contentDescription = null) }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(navController = nav, startDestination = "registro") {
            composable("registro") { LogRegisterScreen(padding) }
            composable("regole") { RulesScreen(padding) }
            composable("impostazioni") { SettingsScreen(padding) }
        }
    }
}

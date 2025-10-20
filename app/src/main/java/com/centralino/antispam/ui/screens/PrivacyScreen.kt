package com.centralino.antispam.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PrivacyScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        horizontalAlignment = Alignment.Start
    ) {
        Text("Privacy e Sicurezza", style = MaterialTheme.typography.titleLarge)
        Text("Centralino Anti-Spam rispetta la tua privacy:", style = MaterialTheme.typography.bodyMedium)
        Text("- Nessun dato viene inviato al cloud.", style = MaterialTheme.typography.bodyMedium)
        Text("- I dati sono conservati localmente e cifrati.", style = MaterialTheme.typography.bodyMedium)
        Text("- La cronologia delle chiamate viene mantenuta per 30 giorni.", style = MaterialTheme.typography.bodyMedium)
        Text("- Puoi configurare la durata della conservazione nelle impostazioni.", style = MaterialTheme.typography.bodyMedium)
    }
}
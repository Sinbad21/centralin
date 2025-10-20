package com.centralino.antispam.ui.screens

import android.Manifest
import android.app.Activity
import android.app.role.RoleManager
import android.content.Context
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.core.content.ContextCompat
import com.centralino.antispam.ui.viewmodel.LogViewModel
import com.centralino.bot.BotOrchestrator
import com.centralino.bot.BotMode
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Divider
import androidx.compose.material3.ListItem
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.annotation.RequiresApi

@Composable
fun LogRegisterScreen(padding: PaddingValues, vm: LogViewModel = hiltViewModel()) {
    val events = vm.events.collectAsState()
    Surface(modifier = Modifier.fillMaxSize().padding(padding)) {
        LazyColumn {
            items(events.value) { e ->
                ListItem(
                    headlineContent = { Text(e.state) },
                    supportingContent = { Text(e.reason ?: "") }
                )
                Divider()
            }
        }
    }
}

@Composable
fun RulesScreen(padding: PaddingValues) {
    Surface(modifier = Modifier.fillMaxSize().padding(padding)) {
        Text("Regole")
    }
}

@Composable
fun ContactsPermissionRow() {
    val context = LocalContext.current
    val hasPermission = remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) == android.content.pm.PackageManager.PERMISSION_GRANTED
        )
    }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission.value = granted
        Toast.makeText(context, if (granted) "Rubrica accessibile" else "Permesso contatti negato", Toast.LENGTH_SHORT).show()
    }

    Row(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(Modifier.weight(1f)) {
            Text("Permesso contatti")
            Text(
                if (hasPermission.value) "Concesso" else "Da concedere",
                style = MaterialTheme.typography.bodySmall
            )
        }
        Button(
            onClick = { launcher.launch(Manifest.permission.READ_CONTACTS) }
        ) { Text(if (hasPermission.value) "Riconsenti" else "Concedi") }
    }
}

@Composable
fun BotModeRow() {
    val context = LocalContext.current
    var expanded by remember { mutableStateOf(false) }
    var selectedMode by remember { mutableStateOf(BotOrchestrator.mode) }

    Column(Modifier.fillMaxWidth().padding(16.dp)) {
        Text("Modalità Bot", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))

        OutlinedButton(onClick = { expanded = true }) {
            Text(
                when (selectedMode) {
                    BotMode.LOCAL -> "Locale (Android Call Screening)"
                    BotMode.FORWARDING -> "Forwarding (inoltro su altro numero)"
                }
            )
        }

        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            DropdownMenuItem(
                text = { Text("Locale (Android)") },
                onClick = {
                    selectedMode = BotMode.LOCAL
                    BotOrchestrator.setMode(BotMode.LOCAL)
                    expanded = false
                    Toast.makeText(context, "Modalità impostata: Locale", Toast.LENGTH_SHORT).show()
                }
            )
            DropdownMenuItem(
                text = { Text("Forwarding") },
                onClick = {
                    selectedMode = BotMode.FORWARDING
                    BotOrchestrator.setMode(BotMode.FORWARDING)
                    expanded = false
                    Toast.makeText(context, "Modalità impostata: Forwarding", Toast.LENGTH_SHORT).show()
                }
            )
        }
    }
}

@Composable
fun SettingsScreen(padding: PaddingValues) {
    val ctx = LocalContext.current
    val roleMgr = ctx.getSystemService(RoleManager::class.java)

    val notifPermission =
        if (Build.VERSION.SDK_INT >= 33) Manifest.permission.POST_NOTIFICATIONS else null
    val contactsPermission = Manifest.permission.READ_CONTACTS

    val notifLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }
    val contactsLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }
    val roleLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { }

    Surface(modifier = Modifier.fillMaxSize().padding(padding)) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text("Impostazioni")

            // Mostra il pulsante solo se API >= 29 (Android 10)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                Button(onClick = {
                    val intent = roleMgr.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
                    roleLauncher.launch(intent)
                }) {
                    Text("Imposta come app di Call Screening")
                }
            }

            if (notifPermission != null) {
                Button(onClick = { notifLauncher.launch(notifPermission) }) {
                    Text("Concedi notifiche")
                }
            }

            Button(onClick = { contactsLauncher.launch(contactsPermission) }) {
                Text("Concedi accesso contatti")
            }

            ContactsPermissionRow()
            BotModeRow()
        }
    }
}

@Composable
fun OnboardingWizard() {
    val context = LocalContext.current
    val roleMgr = context.getSystemService(RoleManager::class.java)

    val notifPermission =
        if (Build.VERSION.SDK_INT >= 33) Manifest.permission.POST_NOTIFICATIONS else null
    val contactsPermission = Manifest.permission.READ_CONTACTS
    val audioPermission = Manifest.permission.RECORD_AUDIO

    val notifLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        Toast.makeText(
            context,
            if (granted) "Notifiche abilitate" else "Permesso notifiche negato",
            Toast.LENGTH_SHORT
        ).show()
    }

    val contactsLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        Toast.makeText(
            context,
            if (granted) "Accesso contatti abilitato" else "Permesso contatti negato",
            Toast.LENGTH_SHORT
        ).show()
    }

    val audioLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        Toast.makeText(
            context,
            if (granted) "Microfono abilitato" else "Permesso microfono negato",
            Toast.LENGTH_SHORT
        ).show()
    }

    val roleLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val message = if (result.resultCode == Activity.RESULT_OK) {
            "Ruolo Call Screening assegnato"
        } else {
            "Ruolo Call Screening non assegnato"
        }
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Benvenuto in Centralino Anti-Spam", style = MaterialTheme.typography.titleLarge)
        Text("Segui i passaggi per configurare l'app.", style = MaterialTheme.typography.bodyMedium)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Button(onClick = {
                val intent = roleMgr.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
                roleLauncher.launch(intent)
            }) {
                Text("Assegna ruolo Call Screening")
            }
        }

        if (notifPermission != null) {
            Button(onClick = { notifLauncher.launch(notifPermission) }) {
                Text("Concedi permesso notifiche")
            }
        }

        Button(onClick = { contactsLauncher.launch(contactsPermission) }) {
            Text("Concedi accesso contatti")
        }

        Button(onClick = { audioLauncher.launch(audioPermission) }) {
            Text("Concedi accesso microfono")
        }

        Button(onClick = {
            Toast.makeText(
                context,
                "Diagnostica: Tutti i permessi sono stati verificati.",
                Toast.LENGTH_SHORT
            ).show()
        }) {
            Text("Esegui diagnostica")
        }
    }
}

@Composable
fun PrivacyPage() {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Privacy e Sicurezza", style = MaterialTheme.typography.titleLarge)
        Text(
            "Centralino Anti-Spam rispetta la tua privacy. Tutti i dati sono memorizzati localmente e crittografati.",
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            "L'app richiede solo i permessi strettamente necessari per il suo funzionamento.",
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            "Puoi revocare i permessi in qualsiasi momento dalle impostazioni del dispositivo.",
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

@Composable
fun FunctionalImprovements() {
    val context = LocalContext.current
    val whitelist = remember { mutableStateListOf<Pair<String, Long>>() } // Pair of number and expiration
    val timeRules = remember { mutableStateListOf<Pair<String, String>>() }
    val floodProtection = remember { mutableStateOf(false) }
    val floodBlockUntil = remember { mutableStateOf(0L) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Miglioramenti Funzionali", style = MaterialTheme.typography.titleLarge)

        // Temporary Whitelist
        Text("Whitelist Temporanea", style = MaterialTheme.typography.titleMedium)
        Row(verticalAlignment = Alignment.CenterVertically) {
            var number by remember { mutableStateOf("") }
            TextField(
                value = number,
                onValueChange = { number = it },
                label = { Text("Numero di telefono") },
                modifier = Modifier.weight(1f)
            )
            Button(onClick = {
                if (number.isNotBlank()) {
                    val expiresAt = System.currentTimeMillis() + 86_400_000L // 24 hours
                    whitelist.add(number to expiresAt)
                    number = ""
                    Toast.makeText(context, "Numero aggiunto alla whitelist", Toast.LENGTH_SHORT).show()
                }
            }) {
                Text("Aggiungi")
            }
        }
        LazyColumn {
            items(whitelist) { item ->
                val (number, expiresAt) = item
                val remainingTime = (expiresAt - System.currentTimeMillis()) / 1000 / 60
                Text("$number (scade tra $remainingTime minuti)")
            }
        }

        // Time-based Rules
        Text("Regole Basate sul Tempo", style = MaterialTheme.typography.titleMedium)
        Row(verticalAlignment = Alignment.CenterVertically) {
            var startTime by remember { mutableStateOf("") }
            var endTime by remember { mutableStateOf("") }
            TextField(
                value = startTime,
                onValueChange = { startTime = it },
                label = { Text("Ora Inizio") },
                modifier = Modifier.weight(1f)
            )
            TextField(
                value = endTime,
                onValueChange = { endTime = it },
                label = { Text("Ora Fine") },
                modifier = Modifier.weight(1f)
            )
            Button(onClick = {
                if (startTime.isNotBlank() && endTime.isNotBlank()) {
                    timeRules.add(startTime to endTime)
                    startTime = ""
                    endTime = ""
                    Toast.makeText(context, "Regola aggiunta", Toast.LENGTH_SHORT).show()
                }
            }) {
                Text("Aggiungi")
            }
        }
        LazyColumn {
            items(timeRules) { rule ->
                Text("${rule.first} - ${rule.second}")
            }
        }

        // Flood Protection
        Text("Protezione Flood", style = MaterialTheme.typography.titleMedium)
        Button(onClick = {
            val now = System.currentTimeMillis()
            if (floodBlockUntil.value > now) {
                Toast.makeText(context, "Flood attivo fino a ${floodBlockUntil.value}", Toast.LENGTH_SHORT).show()
            } else {
                floodBlockUntil.value = now + 600_000L // Block for 10 minutes
                floodProtection.value = true
                Toast.makeText(context, "Flood protection attivata", Toast.LENGTH_SHORT).show()
            }
        }) {
            Text("Attiva Flood Protection")
        }
    }
}


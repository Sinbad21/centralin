package com.centralino.antispam.permission

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class PermissionActivity : AppCompatActivity() {

    private val audioLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        Toast.makeText(
            this,
            if (granted) "Microfono abilitato" else "Permesso microfono negato",
            Toast.LENGTH_SHORT
        ).show()
        finish()
    }

    private val notifLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { _ ->
        // opzionale: puoi mostrare un toast come sopra
        // non bloccare l'activity, chiudi comunque
        finish()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val askAudio = intent.getBooleanExtra("ask_audio", false)
        val askNotif = intent.getBooleanExtra("ask_notif", false)

        // Se non ci sono richieste esplicite, chiudi
        if (!askAudio && !askNotif) {
            finish(); return
        }

        // Richiedi nell'ordine: audio -> notifiche
        if (askAudio) {
            val has = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
            if (!has) {
                audioLauncher.launch(Manifest.permission.RECORD_AUDIO)
                return
            }
        }

        if (askNotif && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val has = ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
            if (!has) {
                notifLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                return
            }
        }

        // Se nulla da chiedere, chiudi
        finish()
    }
}

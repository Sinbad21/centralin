package com.centralino.telephony.receiver

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.core.content.ContextCompat

class ActionReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        when(action) {
            "com.centralino.ACCEPT_CALL" -> {
                val number = intent.getStringExtra("number") ?: intent.getStringExtra("e164")
                if (number.isNullOrBlank()) {
                    Toast.makeText(context, "Nessun numero", Toast.LENGTH_SHORT).show()
                    return
                }
                val call = if (ContextCompat.checkSelfPermission(context, Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
                    Intent(Intent.ACTION_CALL, Uri.parse("tel:${'$'}number"))
                } else {
                    Intent(Intent.ACTION_DIAL, Uri.parse("tel:${'$'}number"))
                }
                call.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                ContextCompat.startActivity(context, call, null)
            }
            "com.centralino.REJECT_CALL" -> {
                Toast.makeText(context, "Chiamata rifiutata", Toast.LENGTH_SHORT).show()
            }
            "com.centralino.CALL_BACK" -> {
                val number = intent.getStringExtra("number") ?: intent.getStringExtra("e164")
                val i = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${'$'}number"))
                i.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                ContextCompat.startActivity(context, i, null)
            }
        }
    }
}

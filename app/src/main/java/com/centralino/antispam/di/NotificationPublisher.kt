package com.centralino.antispam.notification

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.centralino.antispam.R


object NotificationPublisher {

    private const val CHANNEL_ID = "call_screening_channel"

    fun showIncomingScreening(
        context: Context,
        number: String,
        preview: String
    ) {
        // Intent per CTA
        
        val acceptIntent = Intent("com.centralino.ACCEPT_CALL").apply {
            setClass(context, com.centralino.telephony.receiver.ActionReceiver::class.java)
            putExtra("e164", number)
        }
        val rejectIntent = Intent("com.centralino.REJECT_CALL").apply {
            setClass(context, com.centralino.telephony.receiver.ActionReceiver::class.java)
            putExtra("e164", number)
        }
        val recallIntent = Intent("com.centralino.CALL_BACK").apply {
            setClass(context, com.centralino.telephony.receiver.ActionReceiver::class.java)
            putExtra("e164", number)
        }

        val acceptPending = PendingIntent.getBroadcast(
            context, 0, acceptIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val rejectPending = PendingIntent.getBroadcast(
            context, 1, rejectIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val recallPending = PendingIntent.getBroadcast(
            context, 2, recallIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_call)
            .setContentTitle("Chiamata sconosciuta")
            .setContentText("$number • $preview")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(R.drawable.ic_accept, "Accetta", acceptPending)
            .addAction(R.drawable.ic_reject, "Rifiuta", rejectPending)
            .addAction(R.drawable.ic_recall, "Richiama", recallPending)
            .setAutoCancel(true)

        with(NotificationManagerCompat.from(context)) {
            notify(number.hashCode(), builder.build())
        }
    }
}

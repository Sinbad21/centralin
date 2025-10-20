package com.centralino.telephony.notify

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.centralino.domain.NotificationActions
import com.centralino.domain.NotificationPublisher
import com.centralino.telephony.R

class SystemNotificationPublisher(private val app: Application) : NotificationPublisher {

    override fun ensureCallScreeningChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "call_screening_channel",
                "Call screening",
                NotificationManager.IMPORTANCE_HIGH
            )
            (app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
                .createNotificationChannel(channel)
        }
    }

    override fun showIncomingScreening(number: String, preview: String) {
        ensureCallScreeningChannel()
        val context = app.applicationContext

        val acceptPending = PendingIntent.getBroadcast(
            context, 0, Intent(NotificationActions.ACCEPT),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val rejectPending = PendingIntent.getBroadcast(
            context, 1, Intent(NotificationActions.REJECT),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val recallPending = PendingIntent.getBroadcast(
            context, 2, Intent(NotificationActions.CALL_BACK),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, "call_screening_channel")
            .setSmallIcon(R.drawable.ic_call)
            .setContentTitle("Chiamata sconosciuta")
            .setContentText("$number • $preview")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(R.drawable.ic_accept, "Accetta", acceptPending)
            .addAction(R.drawable.ic_reject, "Rifiuta", rejectPending)
            .addAction(R.drawable.ic_recall, "Richiama", recallPending)
            .setAutoCancel(true)

        NotificationManagerCompat.from(context).notify(number.hashCode(), builder.build())
    }
}
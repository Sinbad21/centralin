package com.centralino.telephony.notify

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import androidx.annotation.RequiresPermission
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.centralino.domain.NotificationPublisher
import com.centralino.telephony.receiver.ActionReceiver
import com.centralino.telephony.R

class SystemNotificationPublisher(private val context: Context) : NotificationPublisher {

    private val channelId = "call_screening_channel"

    @RequiresPermission(value = Manifest.permission.POST_NOTIFICATIONS)
    override fun publishScreeningNotification(
        callId: String,
        number: String?,
        displayName: String?,
        summary: String?,
        score: Double
    ) {
        ensureChannel()

        val title = context.getString(
            R.string.notification_title_screening,
            displayName ?: number ?: "Sconosciuto"
        )
        val text = (summary ?: "").take(200) +
                " (spam: ${String.format("%.2f", score)})"

        val acceptIntent = Intent(context, ActionReceiver::class.java).apply {
            action = "com.centralino.ACCEPT_CALL"
            putExtra("callId", callId)
        }
        val rejectIntent = Intent(context, ActionReceiver::class.java).apply {
            action = "com.centralino.REJECT_CALL"
            putExtra("callId", callId)
        }
        val callbackIntent = Intent(context, ActionReceiver::class.java).apply {
            action = "com.centralino.CALL_BACK"
            putExtra("number", number)
        }

        val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0

        val notif = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.sym_call_incoming)
            .setContentTitle(title)
            .setContentText(text)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setAutoCancel(true)
            .addAction(
                NotificationCompat.Action(
                    0,
                    context.getString(R.string.notification_action_accept),
                    PendingIntent.getBroadcast(context, 1, acceptIntent, flags)
                )
            )
            .addAction(
                NotificationCompat.Action(
                    0,
                    context.getString(R.string.notification_action_reject),
                    PendingIntent.getBroadcast(context, 2, rejectIntent, flags)
                )
            )
            .addAction(
                NotificationCompat.Action(
                    0,
                    context.getString(R.string.notification_action_callback),
                    PendingIntent.getBroadcast(context, 3, callbackIntent, flags)
                )
            )
            .build()

        NotificationManagerCompat.from(context).notify(callId.hashCode(), notif)
    }

    private fun ensureChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val mgr = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val ch = NotificationChannel(
                channelId,
                context.getString(R.string.notification_channel_calls),
                NotificationManager.IMPORTANCE_HIGH
            )
            ch.enableLights(true)
            ch.lightColor = Color.RED
            ch.enableVibration(true)
            mgr.createNotificationChannel(ch)
        }
    }
}

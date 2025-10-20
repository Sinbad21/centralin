package com.centralino.antispam

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.*
import java.util.concurrent.TimeUnit
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class CentralinoApp : Application(), Configuration.Provider {

    @Inject lateinit var workerFactory: HiltWorkerFactory

    override fun getWorkManagerConfiguration(): Configuration {
        return Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "call_screening_channel",            // deve essere lo stesso CHANNEL_ID usato in NotificationPublisher
                "Screening Chiamate",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifiche per le chiamate sconosciute in screening"
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    val workRequest = PeriodicWorkRequestBuilder<RetentionWorker>(1, TimeUnit.DAYS)
        .setConstraints(Constraints.Builder()
            .setRequiresBatteryNotLow(true)
            .setRequiresDeviceIdle(false)
            .build())
        .build()

    WorkManager.getInstance(this).enqueueUniquePeriodicWork(
        "RetentionCleanup",
        ExistingPeriodicWorkPolicy.KEEP,
        workRequest
    )
}

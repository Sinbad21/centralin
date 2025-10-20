package com.centralino.antispam.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.centralino.data.repo.MaintenanceRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

@HiltWorker
class RetentionWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val maintenanceRepo: MaintenanceRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            maintenanceRepo.cleanupRetention(30) // Retain last 30 days
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
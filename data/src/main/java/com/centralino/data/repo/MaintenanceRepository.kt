package com.centralino.data.repo

import com.centralino.data.db.dao.CallEventDao
import com.centralino.data.db.dao.TranscriptDao
import javax.inject.Inject
import javax.inject.Singleton

interface MaintenanceRepository {
    suspend fun cleanupRetention(days: Int)
}

@Singleton
class MaintenanceRepositoryImpl @Inject constructor(
    private val callDao: CallEventDao,
    private val trDao: TranscriptDao
) : MaintenanceRepository {
    override suspend fun cleanupRetention(days: Int) {
        val olderThan = System.currentTimeMillis() - days * 86_400_000L
        trDao.deleteLinkedOlderThan(olderThan)
        callDao.deleteOlderThan(olderThan)
    }
}
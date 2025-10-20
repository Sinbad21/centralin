package com.centralino.data.db.dao

import androidx.room.*
import com.centralino.data.db.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface CallerDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: CallerEntity): Long

    @Query("SELECT * FROM callers WHERE e164 = :e164 LIMIT 1")
    suspend fun findByE164(e164: String?): CallerEntity?
}

@Dao
interface CallEventDao {
    @Insert
    suspend fun insert(entity: CallEventEntity): Long

    @Query("SELECT * FROM call_events ORDER BY timestamp DESC")
    fun getAll(): Flow<List<CallEventEntity>>

    @Query("DELETE FROM call_events WHERE timestamp < :threshold")
    suspend fun deleteOlderThan(threshold: Long)
}

@Dao
interface TranscriptDao {
    @Insert
    suspend fun insert(entity: TranscriptEntity): Long

    @Query("SELECT * FROM transcripts WHERE call_event_id = :eventId LIMIT 1")
    suspend fun findByEvent(eventId: Long): TranscriptEntity?

    @Query("DELETE FROM transcripts WHERE call_event_id IN (SELECT id FROM call_events WHERE timestamp < :olderThan)")
    suspend fun deleteLinkedOlderThan(olderThan: Long)
}

@Dao
interface RuleDao {
    @Query("SELECT * FROM rules WHERE enabled = 1")
    suspend fun getEnabled(): List<RuleEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: RuleEntity): Long
}

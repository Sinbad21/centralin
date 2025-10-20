package com.centralino.data.db.entities

import androidx.room.*

@Entity(tableName = "callers", indices = [Index(value = ["e164"])])
data class CallerEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "e164") val e164: String?,
    @ColumnInfo(name = "label") val label: String?,
    @ColumnInfo(name = "last_score") val lastScore: Double?,
    @ColumnInfo(name = "last_seen") val lastSeen: Long?
)

@Entity(
    tableName = "call_events",
    indices = [Index(value = ["caller_id"])],
    foreignKeys = [
        ForeignKey(
            entity = CallerEntity::class,
            parentColumns = ["id"],
            childColumns = ["caller_id"],
            onDelete = ForeignKey.SET_NULL
        )
    ]
)
data class CallEventEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "caller_id") val callerId: Long?,
    @ColumnInfo(name = "timestamp") val timestamp: Long,
    @ColumnInfo(name = "state") val state: String,
    @ColumnInfo(name = "decision") val decision: String?,
    @ColumnInfo(name = "reason") val reason: String?
)

@Entity(
    tableName = "transcripts",
    indices = [Index(value = ["call_event_id"], unique = true)],
    foreignKeys = [
        ForeignKey(
            entity = CallEventEntity::class,
            parentColumns = ["id"],
            childColumns = ["call_event_id"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class TranscriptEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "call_event_id") val callEventId: Long,
    @ColumnInfo(name = "text") val text: String,
    @ColumnInfo(name = "summary") val summary: String?
)

@Entity(tableName = "rules")
data class RuleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "type") val type: String,
    @ColumnInfo(name = "value") val value: String,
    @ColumnInfo(name = "weight") val weight: Double,
    @ColumnInfo(name = "enabled") val enabled: Boolean
)

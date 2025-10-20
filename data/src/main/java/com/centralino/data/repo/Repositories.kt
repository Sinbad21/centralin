package com.centralino.data.repo

import android.content.ContentResolver
import android.database.Cursor
import android.provider.ContactsContract
import com.centralino.data.db.dao.*
import com.centralino.data.db.entities.*
import com.centralino.domain.*
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

// ---------- Implementazioni ----------

class CallRepositoryImpl @Inject constructor(
    private val callerDao: CallerDao,
    private val callEventDao: CallEventDao
) : CallRepository {

    override suspend fun findOrCreateCallerByNumber(e164: String?): Caller {
        val existing = callerDao.findByE164(e164)
        val id = existing?.id ?: callerDao.upsert(
            CallerEntity(
                e164 = e164,
                label = null,
                lastScore = null,
                lastSeen = System.currentTimeMillis()
            )
        )
        return Caller(
            id = id,
            e164 = e164,
            label = existing?.label,
            lastScore = existing?.lastScore,
            lastSeen = System.currentTimeMillis()
        )
    }

    override suspend fun logEvent(event: CallEvent): Long {
        return callEventDao.insert(
            CallEventEntity(
                callerId = event.callerId,
                timestamp = event.timestamp,
                state = event.state,
                decision = event.decision,
                reason = event.reason
            )
        )
    }

    override fun getCallLog(): Flow<List<CallEvent>> {
        return callEventDao.getAll().map { list ->
            list.map { e ->
                CallEvent(
                    id = e.id,
                    callerId = e.callerId,
                    timestamp = e.timestamp,
                    state = e.state,
                    decision = e.decision,
                    reason = e.reason
                )
            }
        }
    }
}

class TranscriptionRepositoryImpl @Inject constructor(
    private val transcriptDao: TranscriptDao
) : TranscriptionRepository {

    override suspend fun saveTranscript(callEventId: Long, text: String, summary: String?): Long {
        return transcriptDao.insert(
            TranscriptEntity(callEventId = callEventId, text = text, summary = summary)
        )
    }

    override suspend fun getTranscriptByEvent(callEventId: Long) =
        transcriptDao.findByEvent(callEventId)?.let {
            Transcript(
                id = it.id,
                callEventId = it.callEventId,
                text = it.text,
                summary = it.summary
            )
        }
}

class ContactsRepositoryImpl @Inject constructor(
    private val resolver: ContentResolver
) : ContactsRepository {

    override suspend fun isKnownContact(e164: String?): Pair<Boolean, String?> {
        if (e164.isNullOrBlank()) return false to null

        val uri = ContactsContract.PhoneLookup.CONTENT_FILTER_URI.buildUpon()
            .appendPath(e164)
            .build()

        resolver.query(
            uri,
            arrayOf(ContactsContract.PhoneLookup.DISPLAY_NAME),
            null,
            null,
            null
        )?.use { c: Cursor ->
            return if (c.moveToFirst()) {
                val idx = c.getColumnIndexOrThrow(ContactsContract.PhoneLookup.DISPLAY_NAME)
                true to c.getString(idx)
            } else {
                false to null
            }
        }

        return false to null
    }
}

// ---------- Hilt Bindings ----------

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindCallRepository(impl: CallRepositoryImpl): CallRepository

    @Binds
    @Singleton
    abstract fun bindTranscriptionRepository(impl: TranscriptionRepositoryImpl): TranscriptionRepository

    @Binds
    @Singleton
    abstract fun bindContactsRepository(impl: ContactsRepositoryImpl): ContactsRepository
}

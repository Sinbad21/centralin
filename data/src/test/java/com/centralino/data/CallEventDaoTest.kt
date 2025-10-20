package com.centralino.data

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.centralino.antispam.data.AppDatabase
import com.centralino.antispam.data.CallEventDao
import com.centralino.antispam.data.TranscriptDao
import com.centralino.antispam.data.entities.CallEventEntity
import com.centralino.antispam.data.entities.TranscriptEntity
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class CallEventDaoTest {
    private lateinit var db: AppDatabase
    private lateinit var callDao: CallEventDao
    private lateinit var trDao: TranscriptDao

    @Before
    fun setup() {
        db = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(), AppDatabase::class.java
        ).build()
        callDao = db.callEventDao()
        trDao = db.transcriptDao()
    }

    @Test
    fun retention_deletes_older() = runTest {
        val oldTs = System.currentTimeMillis() - 40 * 86_400_000L
        val id = callDao.insert(CallEventEntity(timestamp = oldTs, ...))
        trDao.insert(TranscriptEntity(callEventId = id, text = "x", summary = null))
        trDao.deleteLinkedOlderThan(System.currentTimeMillis() - 30 * 86_400_000L)
        callDao.deleteOlderThan(System.currentTimeMillis() - 30 * 86_400_000L)
        assertNull(trDao.findByEvent(id))
    }
}
package com.centralino.antispam

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.room.Room
import com.centralino.antispam.data.AppDatabase
import com.centralino.antispam.data.CallEventDao
import com.centralino.antispam.data.entities.CallEvent
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.IOException

@RunWith(AndroidJUnit4::class)
class CallEventDaoTest {

    private lateinit var db: AppDatabase
    private lateinit var dao: CallEventDao

    @Before
    fun createDb() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java).build()
        dao = db.callEventDao()
    }

    @After
    @Throws(IOException::class)
    fun closeDb() {
        db.close()
    }

    @Test
    fun writeAndReadCallEvent() {
        val callEvent = CallEvent(id = 1, number = "+1234567890", timestamp = System.currentTimeMillis())
        dao.insert(callEvent)
        val retrieved = dao.getAll()
        assertEquals(1, retrieved.size)
        assertEquals(callEvent.number, retrieved[0].number)
    }
}
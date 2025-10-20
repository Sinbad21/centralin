package com.centralino.data.db

import android.content.Context
import androidx.room.*
import com.centralino.data.db.dao.*
import com.centralino.data.db.entities.*
import net.sqlcipher.database.SQLiteDatabase
import net.sqlcipher.database.SupportFactory

@Database(
    entities = [CallerEntity::class, CallEventEntity::class, TranscriptEntity::class, RuleEntity::class],
    version = 2,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun callerDao(): CallerDao
    abstract fun callEventDao(): CallEventDao
    abstract fun transcriptDao(): TranscriptDao
    abstract fun ruleDao(): RuleDao

    companion object {
        fun build(context: Context, passphrase: ByteArray): AppDatabase {
            SQLiteDatabase.loadLibs(context)
            val factory = SupportFactory(passphrase)
            return Room.databaseBuilder(context, AppDatabase::class.java, "centralino.db")
                .openHelperFactory(factory)
                .addMigrations(object : Migration(1, 2) {
                    override fun migrate(db: SupportSQLiteDatabase) {
                        // No schema changes, migration is a no-op
                    }
                })
                .build()
        }
    }
}

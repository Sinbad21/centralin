package com.centralino.data.db

import android.content.Context
import androidx.room.Room
import com.centralino.data.db.dao.CallerDao
import com.centralino.data.db.dao.CallEventDao
import com.centralino.data.db.dao.TranscriptDao
import com.centralino.data.db.dao.RuleDao
import com.centralino.data.security.SqlCipherKeyStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import net.sqlcipher.database.SQLiteDatabase
import net.sqlcipher.database.SupportFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DbModule {

    @Provides
    @Singleton
    fun provideDb(
        @ApplicationContext ctx: Context
    ): AppDatabase {
        // carica librerie SQLCipher
        SQLiteDatabase.loadLibs(ctx)

        // recupera o crea la chiave crittografica
        val passphrase: ByteArray = SqlCipherKeyStore.getOrCreateKey(ctx)
        val factory = SupportFactory(passphrase)

        return Room.databaseBuilder(
            ctx,
            AppDatabase::class.java,
            "centralino.db"
        )
            .openHelperFactory(factory)
            .fallbackToDestructiveMigration() // rimuovere quando aggiungi migrazioni
            .build()
    }

    @Provides
    fun provideCallerDao(db: AppDatabase): CallerDao = db.callerDao()

    @Provides
    fun provideCallEventDao(db: AppDatabase): CallEventDao = db.callEventDao()

    @Provides
    fun provideTranscriptDao(db: AppDatabase): TranscriptDao = db.transcriptDao()

    @Provides
    fun provideRuleDao(db: AppDatabase): RuleDao = db.ruleDao()
}

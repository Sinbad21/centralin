package com.centralino.antispam.di

import android.app.Application
import com.centralino.data.db.AppDatabase
import com.centralino.data.db.dao.CallEventDao
import com.centralino.data.db.dao.CallerDao
import com.centralino.data.db.dao.RuleDao
import com.centralino.data.db.dao.TranscriptDao
import com.centralino.data.repo.CallRepositoryImpl
import com.centralino.data.repo.ContactsRepositoryImpl
import com.centralino.data.repo.TranscriptionRepositoryImpl
import com.centralino.domain.CallEvaluatorUseCase
import com.centralino.domain.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides @Singleton
    fun provideDb(app: Application): AppDatabase {
        val pass = ByteArray(32) { 7 } // TODO: derive from Android Keystore
        return AppDatabase.build(app, pass)
    }

    @Provides fun callerDao(db: AppDatabase): CallerDao = db.callerDao()
    @Provides fun callEventDao(db: AppDatabase): CallEventDao = db.callEventDao()
    @Provides fun transcriptDao(db: AppDatabase): TranscriptDao = db.transcriptDao()
    @Provides fun ruleDao(db: AppDatabase): RuleDao = db.ruleDao()

    @Provides @Singleton
    fun callRepo(caller: CallerDao, event: CallEventDao): CallRepository = CallRepositoryImpl(caller, event)

    @Provides @Singleton
    fun transcriptionRepo(t: TranscriptDao): TranscriptionRepository = TranscriptionRepositoryImpl(t)

    @Provides @Singleton
    fun contactsRepo(app: Application): ContactsRepository = ContactsRepositoryImpl(app.contentResolver)

    @Provides @Singleton
    fun useCase(contacts: ContactsRepository, scorer: SpamScorer, repo: CallRepository): CallEvaluatorUseCase =
        CallEvaluatorUseCase(contacts, scorer, repo)
}

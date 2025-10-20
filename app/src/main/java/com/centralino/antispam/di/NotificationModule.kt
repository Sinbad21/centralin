package com.centralino.antispam.di

import android.app.Application
import com.centralino.domain.NotificationPublisher
import com.centralino.telephony.notify.SystemNotificationPublisher
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NotificationModule {
    @Provides @Singleton
    fun publisher(app: Application): NotificationPublisher = SystemNotificationPublisher(app)
}

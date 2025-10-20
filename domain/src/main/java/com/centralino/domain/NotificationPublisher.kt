package com.centralino.domain

interface NotificationPublisher {
    fun showIncomingScreening(number: String, preview: String)
}
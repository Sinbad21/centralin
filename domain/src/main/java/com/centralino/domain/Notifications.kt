package com.centralino.domain

object NotificationActions {
    const val ACCEPT = "com.centralino.ACCEPT_CALL"
    const val REJECT = "com.centralino.REJECT_CALL"
    const val CALL_BACK = "com.centralino.CALL_BACK"
}

interface NotificationChannelProvider {
    fun ensureCallScreeningChannel()
}

interface NotificationPublisher : NotificationChannelProvider {
    fun showIncomingScreening(number: String, preview: String)
}
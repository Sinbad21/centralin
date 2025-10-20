package com.centralino.telephony.service

import android.os.Build
import android.provider.ContactsContract
import android.telecom.Call
import android.telecom.CallScreeningService
import com.centralino.bot.BotOrchestrator
import com.centralino.domain.NotificationPublisher
import com.centralino.repository.CallRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@AndroidEntryPoint
class AppCallScreeningService : CallScreeningService() {

    enum class ScreeningDecision { ALLOW, SILENCE, REJECT, BOT }

    @Inject lateinit var notifier: NotificationPublisher
    @Inject lateinit var callRepo: CallRepository  // dal data: log eventi
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onScreenCall(callDetails: Call.Details) {
        val number = callDetails.handle?.schemeSpecificPart
        val slotIndex = callDetails.extras?.getInt("android.telecom.extra.SLOT_INDEX", -1) ?: -1

        val decision = decideQuick(number)

        val response = when (decision) {
            ScreeningDecision.ALLOW -> CallResponse.Builder().setDisallowCall(false).build()
            ScreeningDecision.SILENCE -> CallResponse.Builder()
                .setDisallowCall(false)
                .setSilenceCall(true)
                .build()
            ScreeningDecision.REJECT -> CallResponse.Builder()
                .setDisallowCall(true)
                .setRejectCall(true)
                .build()
            ScreeningDecision.BOT -> CallResponse.Builder()
                .setDisallowCall(false)
                .setSilenceCall(true)
                .build()
        }
        respondToCall(callDetails, response)

        scope.launch {
            val id = callRepo.logEvent(
                number = number,
                simSlot = slotIndex,
                decision = decision.name,
                timestamp = System.currentTimeMillis()
            )
        }

        if (decision == ScreeningDecision.BOT) {
            scope.launch {
                runCatching {
                    val raw = BotOrchestrator.runPreScreening(applicationContext, number)
                    val summary = BotOrchestrator.summarizeResponse(raw)
                    notifier.showIncomingScreening(number ?: "Sconosciuto", summary)
                }.onFailure { e ->
                    Timber.e(e, "Bot/notification failed")
                    notifier.showIncomingScreening(number ?: "Sconosciuto", "Errore durante il bot: ${e.message}")
                }
            }
        }
    }

    private fun decideQuick(number: String?): ScreeningDecision {
        if (number.isNullOrBlank()) return ScreeningDecision.SILENCE
        if (isKnownContact(number)) return ScreeningDecision.ALLOW

        return if (isBotEnabled()) ScreeningDecision.BOT else ScreeningDecision.SILENCE
    }

    private fun isKnownContact(e164: String): Boolean {
        val uri = ContactsContract.PhoneLookup.CONTENT_FILTER_URI.buildUpon()
            .appendPath(e164).build()
        contentResolver.query(uri, arrayOf(ContactsContract.PhoneLookup._ID), null, null, null)
            .use { c -> return c?.moveToFirst() == true }
    }

    private fun isBotEnabled(): Boolean {
        return CentralinoPrefs.isBotEnabled(applicationContext)
    }
}

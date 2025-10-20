package com.centralino.domain

import kotlinx.coroutines.flow.Flow

sealed class CallState {
    data class Incoming(val number: String?, val simSlot: Int? = null): CallState()
    data class KnownContact(val contactName: String, val number: String): CallState()
    data class Unknown(val number: String): CallState()
}

enum class Decision { ALLOW, BLOCK, SCREEN }

data class Caller(
    val id: Long = 0,
    val e164: String?,
    val label: String? = null,
    val lastScore: Double? = null,
    val lastSeen: Long? = null
)

data class CallEvent(
    val id: Long = 0,
    val callerId: Long?,
    val timestamp: Long,
    val state: String,
    val decision: String?,
    val reason: String?
)

data class Transcript(
    val id: Long = 0,
    val callEventId: Long,
    val text: String,
    val summary: String?
)

data class Rule(
    val id: Long = 0,
    val type: String,
    val value: String,
    val weight: Double,
    val enabled: Boolean
)

interface SpamScorer {
    suspend fun score(numberE164: String?, context: SpamContext): Double
}

data class SpamContext(
    val isAnonymous: Boolean,
    val frequencyLast7d: Int,
    val lastDurationSec: Int?,
    val rules: List<Rule>
)

interface TranscriptionRepository {
    suspend fun saveTranscript(callEventId: Long, text: String, summary: String?): Long
    suspend fun getTranscriptByEvent(callEventId: Long): Transcript?
}

interface CallRepository {
    suspend fun findOrCreateCallerByNumber(e164: String?): Caller
    suspend fun logEvent(event: CallEvent): Long
    fun getCallLog(): Flow<List<CallEvent>>
}

interface ContactsRepository {
    suspend fun isKnownContact(e164: String?): Pair<Boolean, String?>
}

sealed class EvaluateResult {
    data class Allow(val reason: String): EvaluateResult()
    data class Block(val reason: String): EvaluateResult()
    data class Screen(val reason: String): EvaluateResult()
}

class CallEvaluatorUseCase(
    private val contacts: ContactsRepository,
    private val spamScorer: SpamScorer,
    private val callRepo: CallRepository
) {
    suspend operator fun invoke(numberRaw: String?, simSlot: Int? = null): EvaluateResult {
        val normalized = NumberUtils.normalizeE164(numberRaw)
        val (isKnown, name) = contacts.isKnownContact(normalized)
        if (NumberUtils.isEmergency(normalized)) return EvaluateResult.Allow("Emergency")
        if (isKnown) return EvaluateResult.Allow("Known contact: ${'$'}{name ?: normalized}")

        val ctx = SpamContext(
            isAnonymous = normalized == null,
            frequencyLast7d = 0,
            lastDurationSec = null,
            rules = emptyList()
        )
        val score = spamScorer.score(normalized, ctx)
        callRepo.logEvent(
            CallEvent(
                callerId = null,
                timestamp = System.currentTimeMillis(),
                state = "EVALUATED",
                decision = "SCREEN",
                reason = "score=${'$'}score"
            )
        )
        return if (score >= 0.8) EvaluateResult.Block("High spam score ${'$'}score") else EvaluateResult.Screen("Unknown caller")
    }
}

object NumberUtils {
    fun normalizeE164(number: String?): String? {
        if (number.isNullOrBlank()) return null
        val n = number.filter { it.isDigit() || it == '+' }
        return when {
            n.startsWith("+") -> n
            n.startsWith("00") -> "+" + n.drop(2)
            else -> n // assume national, TODO: inject country
        }
    }

    fun isEmergency(e164: String?): Boolean {
        val em = setOf("112", "911")
        return e164 != null && (e164 in em)
    }
}

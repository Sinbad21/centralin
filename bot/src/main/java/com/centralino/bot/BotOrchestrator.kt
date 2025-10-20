package com.centralino.bot

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import androidx.core.content.ContextCompat
import com.centralino.data.CallRepository
import kotlinx.coroutines.*
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import timber.log.Timber
import java.util.Locale
import javax.inject.Inject
import kotlin.coroutines.resume

// Operating modes for the bot: LOCAL performs on-device TTS/ASR, FORWARDING simulates call forwarding
enum class BotMode { LOCAL, FORWARDING }

object BotOrchestrator {

    // Current operating mode (default LOCAL). Could later be persisted in DataStore.
    var mode: BotMode = BotMode.LOCAL
        private set

    fun setMode(newMode: BotMode) { mode = newMode }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    @Inject lateinit var callRepo: CallRepository

    suspend fun runPreScreening(context: Context, number: String?): String =
        when (mode) {
            BotMode.LOCAL -> runLocalBot(context, number)
            BotMode.FORWARDING -> runForwardingBot(context, number)
        }

    // --- LOCAL MODE IMPLEMENTATION (existing TTS/ASR logic refactored) ---
    private suspend fun runLocalBot(context: Context, number: String?): String {
        val appCtx = context.applicationContext
        val hasAudio = ContextCompat.checkSelfPermission(appCtx, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        if (!hasAudio) return "Permesso microfono mancante"

        val am = appCtx.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val gotFocus = am.requestAudioFocus(
            AudioManager.OnAudioFocusChangeListener { },
            AudioManager.STREAM_MUSIC,
            AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
        ) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED

        var tts: TextToSpeech? = null
        var sr: SpeechRecognizer? = null

        return try {
            withContext(Dispatchers.Main) {
                val done = CompletableDeferred<Unit>()
                tts = TextToSpeech(appCtx) { status ->
                    if (status == TextToSpeech.SUCCESS) {
                        try { tts?.language = Locale.ITALY } catch (_: Throwable) {}
                        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                            override fun onStart(utteranceId: String?) {}
                            override fun onDone(utteranceId: String?) { if (!done.isCompleted) done.complete(Unit) }
                            override fun onError(utteranceId: String?) { if (!done.isCompleted) done.complete(Unit) }
                        })
                        val params = Bundle().apply { putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1f) }
                        val utteranceId = "prescreen_prompt"
                        val prompt = "Salve, questo numero non accetta sconosciuti. Dica chi è e il motivo della chiamata."
                        tts?.speak(prompt, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
                    } else {
                        if (!done.isCompleted) done.complete(Unit)
                    }
                }
                withTimeoutOrNull(3000) { done.await() }
            }

            val transcript = withContext(Dispatchers.Main) {
                sr = SpeechRecognizer.createSpeechRecognizer(appCtx)
                val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, "it-IT")
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                    putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, appCtx.packageName)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
                }
                withTimeoutOrNull(10_000) {
                    suspendCancellableCoroutine<String> { cont ->
                        var best: String? = null
                        val listener = object : RecognitionListener {
                            override fun onReadyForSpeech(params: Bundle?) {}
                            override fun onBeginningOfSpeech() {}
                            override fun onRmsChanged(rmsdB: Float) {}
                            override fun onBufferReceived(buffer: ByteArray?) {}
                            override fun onEndOfSpeech() {}
                            override fun onError(error: Int) { if (!cont.isCompleted) cont.resume("Errore durante l’ascolto") }
                            override fun onResults(results: Bundle) {
                                val list = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                                best = list?.firstOrNull()?.takeIf { it.isNotBlank() }
                                if (!cont.isCompleted) cont.resume(best ?: "Nessuna risposta utile")
                            }
                            override fun onPartialResults(partialResults: Bundle) {
                                val list = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                                val p = list?.firstOrNull()
                                if (!p.isNullOrBlank()) best = p
                            }
                            override fun onEvent(eventType: Int, params: Bundle?) {}
                        }
                        sr?.setRecognitionListener(listener)
                        try { sr?.startListening(i) } catch (t: Throwable) {
                            Timber.e(t, "startListening failed")
                            if (!cont.isCompleted) cont.resume("Errore durante l’ascolto")
                        }
                        cont.invokeOnCancellation { try { sr?.cancel() } catch (_: Throwable) {} }
                    }
                }
            } ?: "Nessuna risposta utile"

            // Save transcript to database
            scope.launch {
                callRepo.logEvent(
                    number = number,
                    simSlot = -1, // Placeholder for slot index
                    decision = "BOT",
                    timestamp = System.currentTimeMillis(),
                    transcript = transcript
                )
            }

            transcript
        } catch (t: Throwable) {
            Timber.e(t, "Pre-screening error")
            "Errore durante l’ascolto"
        } finally {
            try { sr?.stopListening(); sr?.cancel(); sr?.destroy() } catch (_: Throwable) {}
            try { tts?.stop(); tts?.shutdown() } catch (_: Throwable) {}
            if (gotFocus) try { am.abandonAudioFocus(null) } catch (_: Throwable) {}
        }
    }

    // --- FORWARDING MODE (stub) ---
    private suspend fun runForwardingBot(context: Context, number: String): String {
        // Placeholder: simulate forwarding; future implementation could trigger actual call forwarding or VoIP bridge
        Timber.i("Forwarding mode engaged for number=$number")
        return "Chiamata inoltrata al numero reale"
    }

    fun summarizeResponse(raw: String): String = raw.trim().let { if (it.length <= 200) it else it.take(197) + "…" }
}

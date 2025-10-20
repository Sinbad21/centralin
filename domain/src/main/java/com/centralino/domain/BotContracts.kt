package com.centralino.domain

// Hooks for future ASR/TTS capabilities if needed in domain
interface SpeechTranscriber {
    suspend fun transcribe(): String
}

interface TextSpeaker {
    suspend fun speak(text: String)
}

package com.centralino.antispam

import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.*
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

class BotOrchestratorTest {

    private lateinit var botOrchestrator: BotOrchestrator
    private val mockTTS = mock(TextToSpeech::class.java)
    private val mockASR = mock(SpeechRecognizer::class.java)

    @Before
    fun setUp() {
        botOrchestrator = BotOrchestrator(mockTTS, mockASR)
    }

    @Test
    fun `test TTS prompt`() {
        val prompt = "Hello, how can I help you?"
        botOrchestrator.speak(prompt)
        verify(mockTTS).speak(eq(prompt), any(), any(), any())
    }

    @Test
    fun `test ASR listening`() {
        botOrchestrator.listen()
        verify(mockASR).startListening(any())
    }

    @Test
    fun `test TTS and ASR interaction`() {
        val prompt = "Please say your name."
        botOrchestrator.speak(prompt)
        verify(mockTTS).speak(eq(prompt), any(), any(), any())

        botOrchestrator.listen()
        verify(mockASR).startListening(any())
    }
}
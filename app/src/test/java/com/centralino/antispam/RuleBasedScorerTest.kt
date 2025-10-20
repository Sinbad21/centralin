package com.centralino.antispam

import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`

class RuleBasedScorerTest {

    private lateinit var ruleBasedScorer: RuleBasedScorer

    @Before
    fun setUp() {
        ruleBasedScorer = RuleBasedScorer()
    }

    @Test
    fun `test score calculation for spam number`() {
        val spamNumber = "+1234567890"
        val score = ruleBasedScorer.calculateScore(spamNumber)
        assertEquals(100, score)
    }

    @Test
    fun `test score calculation for safe number`() {
        val safeNumber = "+0987654321"
        val score = ruleBasedScorer.calculateScore(safeNumber)
        assertEquals(0, score)
    }
}
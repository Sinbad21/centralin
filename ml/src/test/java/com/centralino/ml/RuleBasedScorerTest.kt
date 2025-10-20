package com.centralino.ml

import kotlinx.coroutines.test.runTest
import org.junit.Test
import kotlin.test.assertTrue

class RuleBasedScorerTest {
    private val scorer = RuleBasedScorer()

    @Test
    fun score_anonymous_high() = runTest {
        val s = scorer.score(null, SpamContext(isAnonymous = true))
        assertTrue(s >= 0.5)
    }
}
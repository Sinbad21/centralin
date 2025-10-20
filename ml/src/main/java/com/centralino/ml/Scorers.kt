package com.centralino.ml

import com.centralino.domain.Rule
import com.centralino.domain.SpamContext
import com.centralino.domain.SpamScorer

class RuleBasedScorer: SpamScorer {
    override suspend fun score(numberE164: String?, context: SpamContext): Double {
        var s = 0.0
        if (context.isAnonymous) s += 0.6
        if (numberE164 != null) {
            val patterns = listOf("+390", "+39899", "+39199") // example premium prefixes
            if (patterns.any { numberE164.startsWith(it) }) s += 0.3
        }
        if (context.frequencyLast7d > 3) s += 0.2
        context.rules.filter { it.enabled }.forEach { r ->
            if (r.type == "BLACKLIST" && numberE164?.contains(r.value) == true) s += r.weight
            if (r.type == "WHITELIST" && numberE164?.contains(r.value) == true) s -= r.weight
        }
        return s.coerceIn(0.0, 1.0)
    }
}

class MLScorerPlaceholder: SpamScorer {
    override suspend fun score(numberE164: String?, context: SpamContext): Double {
        // Hook for future TFLite or remote API
        return 0.0
    }
}

class WeightedEnsembleScorer(
    private val rule: RuleBasedScorer,
    private val ml: MLScorerPlaceholder,
    private val wRule: Double = 0.8,
    private val wMl: Double = 0.2
): SpamScorer {
    override suspend fun score(numberE164: String?, context: SpamContext): Double {
        val s1 = rule.score(numberE164, context)
        val s2 = ml.score(numberE164, context)
        return (s1 * wRule + s2 * wMl).coerceIn(0.0, 1.0)
    }
}

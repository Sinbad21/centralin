package com.centralino.antispam.di

import com.centralino.domain.SpamScorer
import com.centralino.ml.MLScorerPlaceholder
import com.centralino.ml.RuleBasedScorer
import com.centralino.ml.WeightedEnsembleScorer
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object ScoringModule {
    @Provides @Singleton fun rule() = RuleBasedScorer()
    @Provides @Singleton fun ml() = MLScorerPlaceholder()
    @Provides @Singleton fun scorer(rule: RuleBasedScorer, ml: MLScorerPlaceholder): SpamScorer = WeightedEnsembleScorer(rule, ml)
}

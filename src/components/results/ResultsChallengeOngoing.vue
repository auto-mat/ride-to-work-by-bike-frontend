<script lang="ts">
/**
 * ResultsChallengeOngoing Component
 *
 * @description * Use this component to render content of Results page when
 * a challenge is ongoing.
 * Commonly used in `ResultsPage`.
 *
 * @components
 * - `BadgeAchievement`: Component to render a badge.
 * - `CardChallenge`: Component to challenge card.
 * - `CardProgress`: Component to progress card.
 * - `CardProgressSlider`: Component to progress slider card.
 * - `CardStats`: Component to render a stat card.
 * - `SectionColumns`: Component to render content in columns.
 *
 * @example
 * <results-challenge-ongoing />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?m=dev&node-id=4858%3A104242)
 */

// libraries
import { defineComponent } from 'vue';

// components
import BadgeAchievement from '../homepage/BadgeAchievement.vue';
import CardChallenge from '../homepage/CardChallenge.vue';
import CardProgress from '../homepage/CardProgress.vue';
import CardProgressSlider from '../homepage/CardProgressSlider.vue';
import CardStats from '../homepage/CardStats.vue';
import SectionColumns from '../homepage/SectionColumns.vue';

// mocks
import {
  badgeList,
  cardsChallenge,
  cardsProgressSlider,
  cardsStats,
} from '../../mocks/homepage';

export default defineComponent({
  name: 'ResultsChallengeOngoing',
  components: {
    BadgeAchievement,
    CardChallenge,
    CardProgress,
    CardProgressSlider,
    CardStats,
    SectionColumns,
  },
  setup() {
    return {
      badgeList,
      cardsChallenge,
      cardsProgressSlider,
      cardsStats,
    };
  },
});
</script>

<template>
  <div data-cy="results-challenge-ongoing">
    <!-- Section: Current results -->
    <section>
      <!-- Title -->
      <h2
        class="text-h6 q-my-none text-weight-bold"
        data-cy="current-results-title"
      >
        {{ $t('results.titleCurrentResults') }}
      </h2>
      <!-- Stats: Current results -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-mt-lg"
        data-cy="current-results-list"
      >
        <card-stats v-for="card in cardsStats" :key="card.title" :card="card" />
      </section-columns>
    </section>

    <!-- Section: Ongoing challenges -->
    <section class="q-mt-xl">
      <!-- Title -->
      <h2
        class="text-h6 q-my-none text-weight-bold"
        data-cy="ongoing-challenges-title"
      >
        {{ $t('results.titleOngoingChallenges') }}
      </h2>
      <!-- Card: Featured challenge -->
      <div class="q-mt-lg">
        <card-progress-slider :card="cardsProgressSlider[0]" data-cy="card" />
      </div>
      <!-- TODO: Cards: challenges -->
    </section>

    <!-- Section: Badges -->
    <section class="q-pt-xl">
      <!-- Title -->
      <h2 class="text-h6 q-my-none text-weight-bold" data-cy="badges-title">
        {{ $t('results.titleBadges') }}
      </h2>
      <!-- Button -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-mt-lg"
        data-cy="badges-list"
      >
        <badge-achievement
          v-for="badge in badgeList"
          :key="badge.title"
          :badge="badge"
          class="full-width"
          data-cy="badge-item"
        />
      </section-columns>
    </section>

    <!-- Section: Upcoming challenges -->
    <section class="q-mt-xl">
      <!-- Title -->
      <h2
        class="text-h6 q-my-none text-weight-bold"
        data-cy="upcoming-challenges-title"
      >
        {{ $t('results.titleUpcomingChallenges') }}
      </h2>
      <!-- Cards: Challenge -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-mt-sm"
        data-cy="upcoming-challenges"
      >
        <card-challenge
          v-for="card in cardsChallenge.slice(0, 1)"
          :key="card.title"
          :card="card"
          data-cy="card-challenge"
        />
      </section-columns>
    </section>

    <!-- Section: Recent challenges -->
    <section class="q-mt-xl">
      <!-- Title -->
      <h2
        class="text-h6 q-my-none text-weight-bold"
        data-cy="recent-challenges-title"
      >
        {{ $t('results.titleRecentChallenges') }}
      </h2>
      <!-- Cards: Recent challenge -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-mt-sm"
        data-cy="recent-challenges"
      >
        <card-progress
          v-for="card in cardsProgressSlider.slice(1)"
          :key="card.title"
          :card="card"
        />
      </section-columns>
    </section>

    <!-- Section: Past challenges -->
    <section class="q-pt-xl">
      <!-- Title -->
      <h2
        class="text-h6 q-my-none text-weight-bold"
        data-cy="past-challenges-title"
      >
        {{ $t('results.titlePastChallenges') }}
      </h2>
      <!-- Button -->
      <div class="q-mt-lg">
        <q-btn
          rounded
          unelevated
          outline
          color="primary"
          data-cy="past-challenges-button"
        >
          {{ $t('results.buttonPastChallenges') }}
          <q-icon name="arrow_forward" size="18px" class="q-ml-sm" />
        </q-btn>
      </div>
    </section>
  </div>
</template>

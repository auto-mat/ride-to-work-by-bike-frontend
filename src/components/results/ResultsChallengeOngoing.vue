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
 * - `SectionHeading` Component to render a heading.
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
import SectionHeading from '../global/SectionHeading.vue';

// mocks
import { badgeList, cardsChallenge } from '../../mocks/homepage';

// fixtures
import cardsProgressSlider from '../../../test/cypress/fixtures/cardsProgress.json';
import cardsStatsFixture from 'test/cypress/fixtures/cardsStats.json';

// types
import type { CardStatistics } from '../../components/types/Statistics';

export default defineComponent({
  name: 'ResultsChallengeOngoing',
  components: {
    BadgeAchievement,
    CardChallenge,
    CardProgress,
    CardProgressSlider,
    CardStats,
    SectionColumns,
    SectionHeading,
  },
  setup() {
    const cardsStats: CardStatistics[] = cardsStatsFixture as CardStatistics[];
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
      <section-heading data-cy="current-results-title">
        {{ $t('results.titleCurrentResults') }}
      </section-heading>
      <!-- Stats: Current results -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-mt-lg"
        data-cy="current-results-list"
      >
        <card-stats
          v-for="card in cardsStats"
          :key="card.id"
          :category="card.category"
          :stats="card.stats"
        />
      </section-columns>
    </section>

    <!-- Section: Ongoing challenges -->
    <section class="q-mt-xl">
      <!-- Title -->
      <section-heading data-cy="ongoing-challenges-title">
        {{ $t('results.titleOngoingChallenges') }}
      </section-heading>
      <!-- Card: Featured challenge -->
      <div class="q-mt-lg">
        <card-progress-slider :card="cardsProgressSlider[0]" data-cy="card" />
      </div>
      <!-- TODO: Cards: challenges -->
    </section>

    <!-- Section: Badges -->
    <section class="q-pt-xl">
      <!-- Title -->
      <section-heading data-cy="badges-title">
        {{ $t('results.titleBadges') }}
      </section-heading>
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
      <section-heading data-cy="upcoming-challenges-title">
        {{ $t('results.titleUpcomingChallenges') }}
      </section-heading>
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
      <section-heading data-cy="recent-challenges-title">
        {{ $t('results.titleRecentChallenges') }}
      </section-heading>
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
      <section-heading data-cy="past-challenges-title">
        {{ $t('results.titlePastChallenges') }}
      </section-heading>
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

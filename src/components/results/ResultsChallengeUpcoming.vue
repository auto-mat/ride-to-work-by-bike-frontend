<script lang="ts">
/**
 * ResultsChallengeUpcoming Component
 *
 * @description * Use this component to render content of Results page when
 * there are no active challenges.
 * Commonly used in `ResultsPage`.
 *
 * @components
 * - `BadgeAchievement`: Component to render a badge.
 * - `CardChallenge`: Component to challenge card.
 * - `SectionColumns`: Component to render content in columns.
 *
 * @example
 * <results-challenge-upcoming />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?m=dev&node-id=4858%3A106374)
 */

// libraries
import { defineComponent } from 'vue';

// components
import BadgeAchievement from '../homepage/BadgeAchievement.vue';
import CardChallenge from '../homepage/CardChallenge.vue';
import SectionColumns from '../homepage/SectionColumns.vue';

// mocks
import { badgeList, cardsChallenge } from '../../mocks/homepage';

export default defineComponent({
  name: 'ResultsChallengeUpcoming',
  components: {
    BadgeAchievement,
    CardChallenge,
    SectionColumns,
  },
  setup() {
    return {
      badgeList,
      cardsChallenge,
    };
  },
});
</script>

<template>
  <div data-cy="results-challenge-upcoming">
    <!-- Section: Upcoming challenges -->
    <section>
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
          v-for="card in cardsChallenge"
          :key="card.title"
          :card="card"
          data-cy="card-challenge"
        />
      </section-columns>
    </section>
    <!-- Section: Badges -->
    <section class="q-pt-xl">
      <!-- Title -->
      <h2 class="text-h6 q-my-none text-weight-bold" data-cy="badges-title">
        {{ $t('results.titleBadges') }}
      </h2>
      <!-- Badges: Achievement -->
      <section-columns
        :columns="4"
        class="q-col-gutter-lg q-mt-sm"
        data-cy="list-badges"
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

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
 * - `SectionHeading` Component to render a heading.
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
import SectionHeading from '../global/SectionHeading.vue';

// mocks
import { badgeList, cardsChallenge } from '../../mocks/homepage';

export default defineComponent({
  name: 'ResultsChallengeUpcoming',
  components: {
    BadgeAchievement,
    CardChallenge,
    SectionColumns,
    SectionHeading,
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
      <section-heading class="q-mb-md" data-cy="upcoming-challenges-title">
        {{ $t('results.titleUpcomingChallenges') }}
      </section-heading>
      <!-- Cards: Challenge -->
      <section-columns
        :columns="3"
        class="q-col-gutter-lg"
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
      <section-heading class="q-mb-md" data-cy="badges-title">
        {{ $t('results.titleBadges') }}
      </section-heading>
      <!-- Badges: Achievement -->
      <section-columns
        :columns="4"
        class="q-col-gutter-lg"
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

    <!-- Section: Past challenges -->
    <section class="q-pt-xl">
      <!-- Title -->
      <section-heading class="q-mb-md" data-cy="past-challenges-title">
        {{ $t('results.titlePastChallenges') }}
      </section-heading>
      <!-- Button -->
      <div>
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

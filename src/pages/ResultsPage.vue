<script lang="ts">
/**
 * Results Page
 *
 * Shows upcoming challenges, badges, user progress, and other results.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4948%3A125553&mode=dev)
 **/

// libraries
import { defineComponent } from 'vue';

// components
import BadgeAchievement from 'src/components/homepage/BadgeAchievement.vue';
import CardChallenge from 'src/components/homepage/CardChallenge.vue';
import SectionColumns from 'src/components/homepage/SectionColumns.vue';

// mocks
import { badgeList, cardsChallenge } from '../mocks/homepage';

export default defineComponent({
  name: 'ResultsPage',
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
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl">
      <!-- Heading -->
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="results-page-title"
      >
        {{ $t('results.titleResults') }}
      </h1>
      <!-- Section: Upcoming challenges -->
      <div>
        <!-- Title -->
        <h2
          class="text-h6 q-mt-none text-weight-bold q-pt-xl"
          data-cy="upcoming-challenges-title"
        >
          {{ $t('results.titleUpcomingChallenges') }}
        </h2>
        <!-- Cards: Challenge -->
        <section-columns
          :columns="3"
          class="q-col-gutter-lg q-pb-xl"
          data-cy="upcoming-challenges"
        >
          <card-challenge
            v-for="card in cardsChallenge"
            :key="card.title"
            :card="card"
            data-cy="card-challenge"
          />
        </section-columns>
      </div>
      <!-- Section: Badges -->
      <div>
        <!-- Title -->
        <h2
          class="text-h6 q-mt-none text-weight-bold q-pt-xl"
          data-cy="badges-title"
        >
          {{ $t('results.titleBadges') }}
        </h2>
        <!-- Badges: Achievement -->
        <section-columns
          :columns="4"
          class="q-col-gutter-lg q-pt-xl q-pb-xl"
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
      </div>
      <!-- Section: Past challenges -->
      <div>
        <!-- Title -->
        <h2
          class="text-h6 q-mt-none text-weight-bold q-pt-xl"
          data-cy="past-challenges-title"
        >
          {{ $t('results.titlePastChallenges') }}
        </h2>
        <!-- Button -->
        <q-btn
          rounded
          unelevated
          outline
          color="primary"
          class="q-mt-lg"
          data-cy="past-challenges-button"
        >
          {{ $t('results.buttonPastChallenges') }}
          <q-icon name="arrow_forward" size="18px" class="q-ml-sm" />
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

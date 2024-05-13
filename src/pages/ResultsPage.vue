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
import CardChallenge from 'src/components/homepage/CardChallenge.vue';
import SectionColumns from 'src/components/homepage/SectionColumns.vue';

// mocks
import { cardsChallenge } from '../mocks/homepage';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    CardChallenge,
    SectionColumns,
  },
  setup() {
    return {
      cardsChallenge,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white">
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
    </div>
  </q-page>
</template>

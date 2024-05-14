<script lang="ts">
/**
 * Results Page
 *
 * Shows upcoming challenges, badges, user progress, and other results.
 *
 * @components
 * - `ResultsChallengeUpcoming`: Component to render content in
 * the "challenge-upcoming" state.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4948%3A125553&mode=dev)
 **/

// libraries
import { defineComponent } from 'vue';

import ResultsChallengeUpcoming from 'components/results/ResultsChallengeUpcoming.vue';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    ResultsChallengeUpcoming,
  },
  setup() {
    return {
      state: 'challenge-upcoming',
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

      <results-challenge-upcoming
        v-if="state === 'challenge-upcoming'"
        data-cy="results-challenge-upcoming"
      />
    </div>
  </q-page>
</template>

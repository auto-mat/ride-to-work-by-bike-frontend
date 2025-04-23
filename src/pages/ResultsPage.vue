<script lang="ts">
/**
 * Results Page
 *
 * Shows upcoming challenges, badges, user progress, and other results.
 *
 * @components
 * - `ResultsChallengeOngoing`: Component to render content in
 * the "challenge-ongoing" state.
 * - `ResultsChallengeUpcoming`: Component to render content in
 * the "challenge-upcoming" state.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4948%3A125553&mode=dev)
 **/

// libraries
import { computed, defineComponent, onMounted } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';

// enums
// import { ResultsReportType, ResultsReportTypeByChallenge } from 'src/components/enums/Results';

// stores
import { useResultsStore } from 'src/stores/results';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    PageHeading,
  },
  setup() {
    const resultsStore = useResultsStore();

    onMounted(() => {
      resultsStore.loadResultsUrls();
    });

    const resultsUrls = computed(() => resultsStore.resultsUrls);

    // const activeTab = ref<ResultsReportType | ResultsReportTypeByChallenge>(
    //   ResultsReportType.regularity,
    // );
    // const resultsUrls = resultsStore.resultsUrls;

    return {
      // activeTab,
      resultsUrls,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg q-pt-lg bg-white q-pb-xl">
      <!-- Heading -->
      <page-heading data-cy="results-page-title">
        {{ $t('results.titleResults') }}
      </page-heading>

      <!-- <q-tabs
        inline-label
        v-model="activeTab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="center"
        data-cy="coordinator-tabs"
      >
        <q-tab
          v-for="reportType in resultsUrls.keys()"
          :key="reportType"
          :label="reportType"
        />
      </q-tabs> -->
    </div>
  </q-page>
</template>

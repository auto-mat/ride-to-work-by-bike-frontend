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
import { computed, defineComponent, onMounted, ref } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import {
  ResultsReportType,
  ResultsReportTypeByChallenge,
} from 'src/components/enums/Results';

// stores
import { useResultsStore } from 'src/stores/results';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    PageHeading,
  },
  setup() {
    const resultsStore = useResultsStore();

    const { challengeMonth, dataReportIframeHeight } = rideToWorkByBikeConfig;

    onMounted(() => {
      resultsStore.loadResultsUrls();
    });

    const resultsUrls = computed(() => resultsStore.getAvailableReportTypes);

    const activeTab = ref<ResultsReportType | ResultsReportTypeByChallenge>(
      challengeMonth === 'may'
        ? ResultsReportTypeByChallenge.may
        : ResultsReportTypeByChallenge.septemberJanuary,
    );

    const getResultsUrl = (
      reportType: ResultsReportType | ResultsReportTypeByChallenge,
    ) => {
      return resultsStore.getResultsUrl(reportType)?.data_report_url ?? '';
    };

    const getReportTypeLabel = (
      reportType: ResultsReportType | ResultsReportTypeByChallenge,
    ) => {
      return resultsStore.getReportTypeLabels[reportType];
    };

    return {
      activeTab,
      dataReportIframeHeight,
      resultsUrls,
      resultsStore,
      getReportTypeLabel,
      getResultsUrl,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg q-pt-lg bg-white">
      <!-- Heading -->
      <page-heading data-cy="results-page-title">
        {{ $t('results.titleResults') }}
      </page-heading>
    </div>
    <!-- Tabs: Report types -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="results-tabs"
    >
      <q-tab
        v-for="reportType in resultsUrls"
        :key="reportType"
        :name="reportType"
        :label="getReportTypeLabel(reportType)"
        :data-cy="`results-tab-${reportType}`"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels: Report types -->
    <q-tab-panels v-model="activeTab" animated class="q-pb-xl">
      <q-tab-panel
        v-for="reportType in resultsUrls"
        :key="reportType"
        :name="reportType"
        :data-cy="`results-tab-panel-${reportType}`"
      >
        <div v-if="getResultsUrl(reportType)">
          <iframe
            class="full-width"
            :style="{ height: dataReportIframeHeight }"
            :src="getResultsUrl(reportType)"
            frameBorder="0"
            :data-cy="`results-tab-panel-iframe-${reportType}`"
          />
        </div>
        <div v-else class="text-center text-grey-7 text-body-2 q-mt-lg">
          {{ $t('results.messageNoReport') }}
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

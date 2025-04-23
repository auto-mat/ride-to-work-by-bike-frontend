<script lang="ts">
/**
 * ResultsTabs Component
 *
 * @description * Use this component to render tabs on the ResultsPage.
 *
 * @example
 * <results-tabs />
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';

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
  name: 'ResultsTabs',
  setup() {
    const resultsStore = useResultsStore();
    const { challengeMonth, dataReportIframeHeight } = rideToWorkByBikeConfig;

    onMounted(async () => {
      // allows Cypress component test to register intercept
      if (window.Cypress) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

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
      getReportTypeLabel,
      getResultsUrl,
    };
  },
});
</script>

<template>
  <div data-cy="results-tabs">
    <!-- Tabs: Report types -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="results-tabs-buttons"
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
    <q-tab-panels v-model="activeTab" animated>
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
  </div>
</template>

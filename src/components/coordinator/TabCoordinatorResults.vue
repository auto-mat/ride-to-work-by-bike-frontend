<script lang="ts">
/**
 * TabCoordinatorResults Component
 *
 * @description * Wrapper for different sections of the Results tab.
 * Contains nested tabs for Summary (Metabase iframe) and Diplomas (diploma download table).
 *
 * Used in `CoordinatorTabs` component.
 *
 * @components
 * - `TableResults.vue` - main results table with diploma downloads
 *
 * @example
 * <tab-coordinator-results />
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// components
import TableResults from './TableResults.vue';

// enums
import { ResultsReportType } from 'src/components/enums/Results';

// stores
import { useResultsStore } from 'src/stores/results';

enum SubTabsCoordinatorResults {
  summary = 'summary',
  diplomas = 'diplomas',
}

export default defineComponent({
  name: 'TabCoordinatorResults',
  components: {
    TableResults,
  },
  setup() {
    const resultsStore = useResultsStore();
    const { dataReportIframeHeightCoordinator } = rideToWorkByBikeConfig;

    const activeSubTab = ref<SubTabsCoordinatorResults>(
      SubTabsCoordinatorResults.summary,
    );

    onMounted(() => {
      resultsStore.loadOrganizationCoordinatorUrl();
    });

    const coordinatorReportUrl = computed(() => {
      return (
        resultsStore.getResultsUrl(ResultsReportType.organizationCoordinator)
          ?.data_report_url ?? ''
      );
    });

    return {
      activeSubTab,
      coordinatorReportUrl,
      dataReportIframeHeightCoordinator,
      SubTabsCoordinatorResults,
    };
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-results">
    <!-- Sub-tab buttons -->
    <div class="q-pa-md row justify-center">
      <q-tabs
        v-model="activeSubTab"
        dense
        no-caps
        class="bg-grey-3 text-grey-8 rounded-borders"
        active-class="bg-primary text-white"
        indicator-color="transparent"
        data-cy="coordinator-results-sub-tabs"
      >
        <q-tab
          :name="SubTabsCoordinatorResults.summary"
          :label="$t('coordinator.tabResultsSummary')"
          class="q-px-lg"
          data-cy="coordinator-results-sub-tab-summary"
        />
        <q-tab
          :name="SubTabsCoordinatorResults.diplomas"
          :label="$t('coordinator.tabResultsDiplomas')"
          class="q-px-lg"
          data-cy="coordinator-results-sub-tab-diplomas"
        />
      </q-tabs>
    </div>
    <!-- Sub-tab panels -->
    <q-tab-panels v-model="activeSubTab" animated>
      <!-- Panel: Metabase summary -->
      <q-tab-panel
        :name="SubTabsCoordinatorResults.summary"
        data-cy="coordinator-results-panel-summary"
      >
        <div v-if="coordinatorReportUrl" data-cy="coordinator-results-report">
          <!-- Link: Open in new tab -->
          <div class="text-right q-mt-sm q-mb-md">
            <a
              :href="coordinatorReportUrl"
              target="_blank"
              class="text-primary"
              data-cy="coordinator-results-link-open-in-new-tab"
            >
              {{ $t('results.linkOpenResultsInNewTab') }}
            </a>
          </div>
          <!-- Iframe: Metabase report -->
          <iframe
            class="full-width"
            :style="{ height: dataReportIframeHeightCoordinator }"
            :src="coordinatorReportUrl"
            frameBorder="0"
            data-cy="coordinator-results-iframe"
          />
        </div>
        <div v-else class="text-center text-grey-7 text-body-2 q-mt-lg">
          <!-- Message: No report -->
          {{ $t('results.messageNoReport') }}
        </div>
      </q-tab-panel>
      <!-- Panel: Diplomas -->
      <q-tab-panel
        :name="SubTabsCoordinatorResults.diplomas"
        class="q-px-lg"
        data-cy="coordinator-results-panel-diplomas"
      >
        <table-results class="q-mt-xl" data-cy="table-results" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

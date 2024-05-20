<script lang="ts">
/**
 * ResultsTabs Component
 *
 * @description * Use this component to render tabs on the ResultsDetailPage.
 *
 * @components
 * - `ResultsGrid`: Component to render a data report in a grid.
 * - `ResultsTable`: Component to render rankings in a table.`
 *
 * @example
 * <results-tabs />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A105197&t=4cALO2fsjKI90AW1-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// routes
import { routesConf } from 'src/router/routes_conf';

type ResultsTabsOption = 'report' | 'consistency' | 'performance';

export default defineComponent({
  name: 'ResultsTabs',
  props: {
    locked: {
      type: Array as () => ResultsTabsOption[],
      default: () => [],
    },
  },
  setup(props) {
    // list of available tabs
    const tabs: ResultsTabsOption[] = ['report', 'consistency', 'performance'];
    const activeTab = ref('' as ResultsTabsOption);

    // locked tabs - exposed for testing and further logic
    const lockedTabs = props.locked;

    /**
     * Checks if the given tab is locked.
     * @param tab the tab to check
     */
    const isLocked = (tab: ResultsTabsOption): boolean => {
      if (!lockedTabs.length) return false;
      return lockedTabs.includes(tab);
    };

    return {
      activeTab,
      routesConf,
      tabs,
      isLocked,
    };
  },
});
</script>

<template>
  <div data-cy="results-tabs">
    <!-- Tab buttons -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="results-tabs-buttons"
    >
      <q-route-tab
        :to="routesConf['results_report'].path"
        name="report"
        alert-icon="mdi-lock"
        :alert="isLocked('report')"
        :disable="isLocked('report')"
        :label="$t('results.tabReport')"
        data-cy="results-tabs-button-report"
      />
      <q-route-tab
        :to="routesConf['results_consistency'].path"
        name="consistency"
        alert-icon="mdi-lock"
        :alert="isLocked('consistency')"
        :disable="isLocked('consistency')"
        :label="$t('results.tabConsistency')"
        data-cy="results-tabs-button-consistency"
      />
      <q-route-tab
        :to="routesConf['results_performance'].path"
        name="performance"
        alert-icon="mdi-lock"
        :alert="isLocked('performance')"
        :disable="isLocked('performance')"
        :label="$t('results.tabPerformance')"
        data-cy="results-tabs-button-performance"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Report -->
      <q-tab-panel name="report" data-cy="results-tabs-panel-report">
        <!-- Title -->
        <div class="text-h6" data-cy="results-tabs-title-report">
          {{ $t('results.tabReport') }}
        </div>
      </q-tab-panel>
      <!-- Panel: Consistency -->
      <q-tab-panel name="consistency" data-cy="results-tabs-panel-consistency">
        <!-- Title -->
        <div class="text-h6" data-cy="results-tabs-title-consistency">
          {{ $t('results.tabConsistency') }}
        </div>
      </q-tab-panel>
      <!-- Panel: Performance -->
      <q-tab-panel name="performance" data-cy="results-tabs-panel-performance">
        <!-- Title -->
        <div class="text-h6" data-cy="results-tabs-title-performance">
          {{ $t('results.tabPerformance') }}
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

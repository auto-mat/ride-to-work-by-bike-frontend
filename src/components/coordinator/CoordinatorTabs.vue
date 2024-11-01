<script lang="ts">
/**
 * CoordinatorTabs Component
 *
 * @description * Use this component to render tabs on the Coordinator page.
 * Note: Used on `CoordinatorPage`.
 *
 * @example
 * <coordinator-tabs />
 */

// libraries
import { defineComponent, ref } from 'vue';

// routes
import { routesConf } from '../../router/routes_conf';

enum tabsCoordinator {
  tasks = 'tasks',
  fees = 'fees',
  invoices = 'invoices',
  packages = 'packages',
  attendance = 'attendance',
  challenges = 'challenges',
  results = 'results',
  none = '',
}

export default defineComponent({
  name: 'CoordinatorTabs',
  setup() {
    const activeTab = ref(tabsCoordinator.none);

    return {
      activeTab,
      routesConf,
      tabsCoordinator,
    };
  },
});
</script>

<template>
  <div>
    <!-- Tab buttons -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="coordinator-tabs"
    >
      <q-route-tab
        :to="routesConf['coordinator_tasks'].path"
        :name="tabsCoordinator.tasks"
        :label="$t('coordinator.tabTasks')"
        data-cy="coordinator-tabs-button-tasks"
      />
      <q-route-tab
        :to="routesConf['coordinator_fees'].path"
        :name="tabsCoordinator.fees"
        :label="$t('coordinator.tabFees')"
        data-cy="coordinator-tabs-button-fees"
      />
      <q-route-tab
        :to="routesConf['coordinator_invoices'].path"
        :name="tabsCoordinator.invoices"
        :label="$t('coordinator.tabInvoices')"
        data-cy="coordinator-tabs-button-invoices"
      />
      <q-route-tab
        :to="routesConf['coordinator_packages'].path"
        :name="tabsCoordinator.packages"
        :label="$t('coordinator.tabPackages')"
        data-cy="coordinator-tabs-button-packages"
      />
      <q-route-tab
        :to="routesConf['coordinator_attendance'].path"
        :name="tabsCoordinator.attendance"
        :label="$t('coordinator.tabAttendance')"
        data-cy="coordinator-tabs-button-attendance"
      />
      <q-route-tab
        :to="routesConf['coordinator_challenges'].path"
        :name="tabsCoordinator.challenges"
        :label="$t('coordinator.tabChallenges')"
        data-cy="coordinator-tabs-button-challenges"
      />
      <q-route-tab
        :to="routesConf['coordinator_results'].path"
        :name="tabsCoordinator.results"
        :label="$t('coordinator.tabResults')"
        data-cy="coordinator-tabs-button-results"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Tasks -->
      <q-tab-panel
        :name="tabsCoordinator.tasks"
        class="q-px-lg"
        data-cy="coordinator-tabs-panel-tasks"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Fees -->
      <q-tab-panel
        :name="tabsCoordinator.fees"
        data-cy="coordinator-tabs-panel-fees"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Invoices -->
      <q-tab-panel
        :name="tabsCoordinator.invoices"
        data-cy="coordinator-tabs-panel-invoices"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Packages -->
      <q-tab-panel
        :name="tabsCoordinator.packages"
        data-cy="coordinator-tabs-panel-packages"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Attendance -->
      <q-tab-panel
        :name="tabsCoordinator.attendance"
        data-cy="coordinator-tabs-panel-attendance"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Challenges -->
      <q-tab-panel
        :name="tabsCoordinator.challenges"
        data-cy="coordinator-tabs-panel-challenges"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
      <!-- Panel: Results -->
      <q-tab-panel
        :name="tabsCoordinator.results"
        data-cy="coordinator-tabs-panel-results"
      >
        <!-- TODO: add content -->
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

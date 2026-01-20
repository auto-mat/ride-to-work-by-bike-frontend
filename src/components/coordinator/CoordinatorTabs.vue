<script lang="ts">
/**
 * CoordinatorTabs Component
 *
 * @description * Use this component to render tabs on the Coordinator page.
 * Note: Used on `CompanyCoordinatorPage`.
 *
 * @components
 * - `TabCoordinatorAttendance`: Component to render attendance data.
 * - `TabCoordinatorFeeApproval`: Component to render fee approval data.
 * - `TabCoordinatorInvoices`: Component to render invoices data.
 * - `TaskListCoordinator`: Component to render a list of tasks.
 *
 * @example
 * <coordinator-tabs />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import TabCoordinatorAttendance from './TabCoordinatorAttendance.vue';
import TabCoordinatorBoxes from './TabCoordinatorBoxes.vue';
import TabCoordinatorCompanyChallenge from './TabCoordinatorCompanyChallenge.vue';
import TabCoordinatorFeeApproval from './TabCoordinatorFeeApproval.vue';
import TabCoordinatorInvoices from './TabCoordinatorInvoices.vue';
import TabCoordinatorResults from './TabCoordinatorResults.vue';
import TaskListCoordinator from './TaskListCoordinator.vue';

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
  components: {
    TabCoordinatorAttendance,
    TabCoordinatorBoxes,
    TabCoordinatorCompanyChallenge,
    TabCoordinatorFeeApproval,
    TabCoordinatorInvoices,
    TabCoordinatorResults,
    TaskListCoordinator,
  },
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
        <task-list-coordinator data-cy="task-list-coordinator" />
      </q-tab-panel>
      <!-- Panel: Fees -->
      <q-tab-panel
        :name="tabsCoordinator.fees"
        data-cy="coordinator-tabs-panel-fees"
      >
        <tab-coordinator-fee-approval data-cy="tab-coordinator-fee-approval" />
      </q-tab-panel>
      <!-- Panel: Invoices -->
      <q-tab-panel
        :name="tabsCoordinator.invoices"
        data-cy="coordinator-tabs-panel-invoices"
      >
        <tab-coordinator-invoices data-cy="tab-coordinator-invoices" />
      </q-tab-panel>
      <!-- Panel: Packages -->
      <q-tab-panel
        :name="tabsCoordinator.packages"
        data-cy="coordinator-tabs-panel-packages"
      >
        <tab-coordinator-boxes data-cy="tab-coordinator-boxes" />
      </q-tab-panel>
      <!-- Panel: Attendance -->
      <q-tab-panel
        :name="tabsCoordinator.attendance"
        data-cy="coordinator-tabs-panel-attendance"
      >
        <tab-coordinator-attendance data-cy="tab-coordinator-attendance" />
      </q-tab-panel>
      <!-- Panel: Challenges -->
      <q-tab-panel
        :name="tabsCoordinator.challenges"
        data-cy="coordinator-tabs-panel-challenges"
      >
        <tab-coordinator-company-challenge
          data-cy="tab-coordinator-company-challenge"
        />
      </q-tab-panel>
      <!-- Panel: Results -->
      <q-tab-panel
        :name="tabsCoordinator.results"
        data-cy="coordinator-tabs-panel-results"
      >
        <tab-coordinator-results data-cy="tab-coordinator-results" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

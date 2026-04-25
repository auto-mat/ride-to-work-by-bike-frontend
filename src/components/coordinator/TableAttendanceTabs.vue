<script lang="ts">
/**
 * TableAttendanceTabs Component
 *
 * @description * Use this component to display tabs with attendance tables.
 * Used on `CompanyCoordinator` page in the `attendance` section.
 *
 * @components
 * - `TableAttendance.vue` - renders the subsidiary list for a given variant
 *
 * @example
 * <table-attendance-tabs />
 */

// libraries
import { defineComponent, ref } from 'vue';

enum SubTabsTableAttendance {
  active = 'active',
  empty = 'empty',
}

// components
import TableAttendance from './TableAttendance.vue';

// composables
import { useTableAttendanceData } from '../../composables/useTableAttendanceData';

export default defineComponent({
  name: 'TableAttendanceTabs',
  components: {
    TableAttendance,
  },
  setup() {
    const { emptySubsidiariesData } = useTableAttendanceData();
    const activeSubTab = ref<SubTabsTableAttendance>(
      SubTabsTableAttendance.active,
    );

    return {
      activeSubTab,
      emptySubsidiariesData,
      SubTabsTableAttendance,
    };
  },
});
</script>

<template>
  <div data-cy="table-attendance">
    <!-- Tabs (if empty subsidiaries exist) -->
    <template v-if="emptySubsidiariesData.length > 0">
      <div class="q-py-md row">
        <q-tabs
          v-model="activeSubTab"
          dense
          no-caps
          class="bg-grey-3 text-grey-8 rounded-borders"
          active-class="bg-primary text-white"
          indicator-color="transparent"
          data-cy="table-attendance-sub-tabs"
        >
          <q-tab
            :name="SubTabsTableAttendance.active"
            :label="$t('coordinator.tabActiveSubsidiaries')"
            class="q-px-lg"
            data-cy="table-attendance-sub-tab-active"
          />
          <q-tab
            :name="SubTabsTableAttendance.empty"
            :label="
              $t('coordinator.tabEmptySubsidiaries', {
                count: emptySubsidiariesData.length,
              })
            "
            class="q-px-lg"
            data-cy="table-attendance-sub-tab-empty"
          />
        </q-tabs>
      </div>
    </template>
    <!-- Panel: Active subsidiaries -->
    <div
      v-show="
        emptySubsidiariesData.length === 0 ||
        activeSubTab === SubTabsTableAttendance.active
      "
      data-cy="table-attendance-panel-active"
    >
      <table-attendance variant="active" />
    </div>
    <!-- Panel: Empty subsidiaries -->
    <div
      v-if="emptySubsidiariesData.length > 0"
      v-show="activeSubTab === SubTabsTableAttendance.empty"
      data-cy="table-attendance-panel-empty"
    >
      <table-attendance variant="empty" />
    </div>
  </div>
</template>

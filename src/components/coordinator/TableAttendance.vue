<script lang="ts">
/**
 * TableAttendance Component
 *
 * @description * Use this component to display a table with attendance information.
 * Shown on `CoordinatorAttendance` page.
 *
 * @example
 * <table-attendance />
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, onMounted, ref } from 'vue';

// composables
import { useTable, useTableAttendance } from '../../composables/useTable';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// TODO: Add fixture for attendance data
import tableAttendance from '../../../test/cypress/fixtures/tableAttendance.json';

export default defineComponent({
  name: 'TableAttendance',

  setup() {
    const tableRef = ref<QTable | null>(null);
    // sort by name initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('name');
      }
    });

    const { columns, visibleColumns } = useTableAttendance();
    const { sortByTeam } = useTable();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      tableAttendance,
      tableRef,
      visibleColumns,
      sortByTeam,
    };
  },
});
</script>

<template>
  <div class="q-pa-md" data-cy="table-attendance">
    <div>
      <!-- Title -->
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="table-attendance-title"
      >
        {{ $t('table.titleAttendance') }}
      </h3>
    </div>
    <div class="q-my-lg">
      <!-- Table -->
      <q-table
        ref="tableRef"
        flat
        bordered
        binary-state-sort
        :rows="tableAttendance"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="name"
        :sort-method="sortByTeam"
        :style="{ borderRadius }"
        data-cy="table-attendance-table"
      >
        <template v-slot:body="props">
          <!-- Group header -->
          <q-tr
            v-if="props.row.isFirst"
            class="bg-primary text-weight-bold text-white"
            data-cy="table-attendance-team-header"
          >
            <q-td colspan="7">
              {{ props.row.team }}
            </q-td>
          </q-tr>
          <!-- Row -->
          <q-tr
            :props="props"
            :class="{ 'cursor-pointer': true }"
            data-cy="table-attendance-row"
          >
            <!-- Name -->
            <q-td key="name" :props="props" data-cy="table-attendance-name">
              {{ props.row.name }}
            </q-td>
            <!-- Nickname -->
            <q-td
              key="nickname"
              :props="props"
              data-cy="table-attendance-nickname"
            >
              {{ props.row.nickname }}
            </q-td>
            <!-- Contact -->
            <q-td
              key="contact"
              :props="props"
              data-cy="table-attendance-contact"
            >
              {{ props.row.contact }}
            </q-td>
            <!-- Fee Approved -->
            <q-td
              key="isFeeApproved"
              :props="props"
              data-cy="table-attendance-fee-approved"
            >
              <q-icon
                :name="props.row.isFeeApproved ? 'check' : 'close'"
                :color="props.row.isFeeApproved ? 'positive' : 'negative'"
              />
            </q-td>
            <!-- Payment Type -->
            <q-td
              key="paymentType"
              :props="props"
              data-cy="table-attendance-payment-type"
            >
              {{ props.row.paymentType }}
            </q-td>
            <!-- Payment State -->
            <q-td
              key="paymentState"
              :props="props"
              data-cy="table-attendance-payment-state"
            >
              {{ props.row.paymentState }}
            </q-td>
            <!-- Action buttons -->
            <q-td
              auto-width
              key="actions"
              :props="props"
              data-cy="table-attendance-actions"
            >
              <q-btn dense flat round>
                <q-icon name="more_vert" />
                <q-menu auto-close>
                  <q-list style="min-width: 100px">
                    <q-item clickable>
                      <q-item-section>New tab</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>New incognito tab</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

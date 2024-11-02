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

// fixtures
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

    const {
      columns,
      visibleColumns,
      getPaymentStateIcon,
      getPaymentStateLabel,
      getPaymentTypeLabel,
    } = useTableAttendance();
    const { sortByTeam } = useTable();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    /**
     * Teams list is used to display empty team rows in the table.
     * If team does not have data (members), it will be displayed
     * based on this list.
     * It will be displayed before the next group header.
     */
    const teams = ref([
      // TODO: Add teams
    ]);

    return {
      borderRadius,
      columns,
      tableAttendance,
      tableRef,
      teams,
      visibleColumns,
      getPaymentStateIcon,
      getPaymentStateLabel,
      getPaymentTypeLabel,
      sortByTeam,
    };
  },
});
</script>

<template>
  <div data-cy="table-attendance">
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
          class="text-grey-10"
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
            auto-width
            key="contact"
            :props="props"
            data-cy="table-attendance-contact"
          >
            <q-icon
              size="18px"
              color="primary"
              name="svguse:icons/table_attendance/icons.svg#info"
              data-cy="table-attendance-contact-icon"
            />
          </q-td>
          <!-- Fee Approved -->
          <q-td
            auto-width
            key="isFeeApproved"
            :props="props"
            data-cy="table-attendance-fee-approved"
          >
            <q-icon
              size="18px"
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
            {{ getPaymentTypeLabel(props.row.paymentType) }}
          </q-td>
          <!-- Payment State -->
          <q-td
            key="paymentState"
            :props="props"
            data-cy="table-attendance-payment-state"
          >
            <q-icon
              :name="getPaymentStateIcon(props.row.paymentState)"
              size="18px"
              :color="
                props.row.paymentState === 'paid' ? 'positive' : 'primary'
              "
              class="q-mr-xs"
            />
            {{ getPaymentStateLabel(props.row.paymentState) }}
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
                <!-- TODO: Add actions -->
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

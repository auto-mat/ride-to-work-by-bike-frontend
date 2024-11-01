<script lang="ts">
/**
 * TableFeeApproval Component
 *
 * @description * Use this component to display a table with fee payments for
 * approval.
 * Shown on `CompanyCoordinatoFees` page.
 *
 * @example
 * <table-fee-approval />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=uDGm2WzHopjjpn5o-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, onMounted, ref } from 'vue';

// composables
import { useTable, useTableFeeApproval } from '../../composables/useTable';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// fixtures
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';

export default defineComponent({
  name: 'TableFeeApproval',

  setup() {
    // holds an array of currently selected rows
    const selected = ref([]);
    const tableRef = ref<QTable | null>(null);
    // sort by dateCreated initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('dateCreated');
      }
    });

    const { columns, visibleColumns } = useTableFeeApproval();
    const { sortByAddress } = useTable();

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      selected,
      tableFeeApproval,
      tableRef,
      visibleColumns,
      sortByAddress,
    };
  },
});
</script>

<template>
  <div class="q-pa-md" data-cy="table-fee-approval">
    <div>
      <!-- Title -->
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="table-fee-approval-title"
      >
        {{ $t('table.titleFeeApproval') }}
      </h3>
    </div>
    <div class="q-my-lg">
      <!-- Table -->
      <q-table
        ref="tableRef"
        flat
        bordered
        binary-state-sort
        :rows="tableFeeApproval"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="name"
        :sort-method="sortByAddress"
        selection="multiple"
        v-model:selected="selected"
        :style="{ borderRadius }"
        data-cy="table-fee-approval-table"
      >
        <template v-slot:body="props">
          <q-tr
            v-if="props.row.isFirst"
            class="bg-primary text-weight-bold text-white"
            data-cy="table-fee-approval-address-header"
          >
            <q-td colspan="7">
              {{ props.row.address }}
            </q-td>
          </q-tr>
          <q-tr
            :props="props"
            class="data-row text-grey-10"
            data-cy="table-fee-approval-row"
          >
            <q-td>
              <q-checkbox
                v-model="props.selected"
                color="primary"
                data-cy="table-fee-approval-checkbox"
              />
            </q-td>
            <q-td
              key="amount"
              :props="props"
              data-cy="table-fee-approval-amount"
            >
              {{ props.row.amount }}
            </q-td>
            <q-td key="name" :props="props" data-cy="table-fee-approval-name">
              {{ props.row.name }}
            </q-td>
            <q-td key="email" :props="props" data-cy="table-fee-approval-email">
              {{ props.row.email }}
            </q-td>
            <q-td
              key="nickname"
              :props="props"
              data-cy="table-fee-approval-nickname"
            >
              {{ props.row.nickname }}
            </q-td>
            <q-td
              key="address"
              :props="props"
              data-cy="table-fee-approval-address"
            >
              {{ props.row.address }}
            </q-td>
            <q-td
              key="dateCreated"
              :props="props"
              data-cy="table-fee-approval-date"
            >
              <!-- Custom loop to get formatted content -->
              <template v-for="col in props.cols" :key="col.field">
                <span v-if="col.field === 'dateCreated'">
                  {{ col.value }}
                </span>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="q-mt-lg text-right">
      <!-- Button -->
      <q-btn
        rounded
        unelevated
        :label="$t('table.buttonFeeApproval')"
        color="primary"
        data-cy="table-fee-approval-button"
      />
    </div>
  </div>
</template>

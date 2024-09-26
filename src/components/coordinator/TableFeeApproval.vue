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
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=MqCoIBTXNV4xkXVk-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, onMounted, ref } from 'vue';

// composables
import { useTable, useTableFeeApproval } from '../../composables/useTable';

// fixtures
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';

export default defineComponent({
  name: 'TableFeeApproval',

  setup() {
    // holds an array of currently selected rows
    const selected = ref([]);
    const tableRef = ref<QTable | null>(null);
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('dateCreated');
      }
    })

    const { columns, visibleColumns } = useTableFeeApproval();
    const { sortByTeam } = useTable();

    return {
      columns,
      selected,
      tableFeeApproval,
      tableRef,
      visibleColumns,
      sortByTeam,
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
        :sort-method="sortByTeam"
        selection="multiple"
        v-model:selected="selected"
        :style="{ 'border-radius': '8px' }"
      >
        <template v-slot:body="props">
          <q-tr v-if="props.row.isFirst" class="bg-blue-grey-2">
            <q-td colspan="7" class="text-weight-bold">
              {{ props.row.team }}
            </q-td>
          </q-tr>
          <q-tr :props="props" class="data-row">
            <q-td>
              <q-checkbox v-model="props.selected" color="primary" />
            </q-td>
            <q-td key="amount" :props="props">
              {{ props.row.amount }}
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="nickname" :props="props">
              {{ props.row.nickname }}
            </q-td>
            <q-td key="team" :props="props">
              {{ props.row.team }}
            </q-td>
            <q-td key="dateCreated" :props="props">
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

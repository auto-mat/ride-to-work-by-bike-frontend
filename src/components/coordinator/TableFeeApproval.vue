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
import { date } from 'quasar';
import { defineComponent, ref } from 'vue';

// composables
import { useTable, useTableFeeApproval } from '../../composables/useTable';

// fixtures
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';

export default defineComponent({
  name: 'TableFeeApproval',

  setup() {
    // holds an array of currently selected rows
    const selected = ref([]);

    const { columns } = useTableFeeApproval();
    const { sortByTeam } = useTable();

    // format date
    const { formatDate } = date;
    const rowsFeeApproval = tableFeeApproval.map((row) => {
      return {
        ...row,
        dateCreated: formatDate(new Date(row.dateCreated), 'D. MMM. YYYY'),
      };
    });

    return {
      columns,
      selected,
      rowsFeeApproval,
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
        flat
        bordered
        :rows="rowsFeeApproval"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="selected"
        :style="{ 'border-radius': '8px' }"
      />
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

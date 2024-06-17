<script lang="ts">
/**
 * TableFeeApproval Component
 *
 * @description * Use this component to display a table with fee payments for
 * approval.
 * Shown on `CompanyCoordinatoFees` page.
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <TableFeeApproval></TableFeeApproval>
 *
 * @see [Figma Design](...)
 */

// libraries
import { defineComponent, ref } from 'vue';

// composables
import { useTable, useTableFeeApproval } from '../../composables/useTable';

// fixtures
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';

export default defineComponent({
  name: 'TableFeeApproval',

  setup() {
    const selected = ref([]);

    const { columns } = useTableFeeApproval();
    const { sortByTeam } = useTable();

    return {
      columns,
      selected,
      tableFeeApproval,
      sortByTeam,
    };
  },
});
</script>

<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="tableFeeApproval"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :sort-method="sortByTeam"
      v-model:selected="selected"
      :style="{ 'border-radius': '8px' }"
    />
  </div>
</template>

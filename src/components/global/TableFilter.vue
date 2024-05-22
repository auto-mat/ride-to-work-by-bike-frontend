<script lang="ts">
/**
 * TableFilter Component
 *
 * @description * Use this component to display data in a table.
 *
 * @example
 * <table-filter />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A102839&t=4cALO2fsjKI90AW1-1)
 */

// libraries
import { defineComponent } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { useTable } from '../../composables/useTable';

// fixtures
import tableResultsRows from '../../../test/cypress/fixtures/tableResultsFilterRows.json';

// types
import { FormSelectOption } from '../types/Form';
import { TableRow } from '../types/Table';

export default defineComponent({
  name: 'TableFilter',
  setup() {
    const filterOptions = [
      {
        label: i18n.global.t('global.all'),
        value: '',
      },
      {
        label: 'Organizace 1',
        value: 'Organizace 1',
      },
      {
        label: 'Organizace 2',
        value: 'Organizace 2',
      },
    ] as FormSelectOption[];

    const rows = tableResultsRows as TableRow[];

    const {
      filterCompound,
      filterQuery,
      searchQuery,
      tableResultsColumns: columns,
      filterMethod,
    } = useTable();

    return {
      columns,
      filterCompound,
      filterOptions,
      filterQuery,
      rows,
      searchQuery,
      filterMethod,
    };
  },
});
</script>

<template>
  <div data-cy="table-filter">
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      :filter="filterCompound"
      :filter-method="filterMethod"
      row-key="id"
      data-cy="table-filter-table"
    >
      <!-- Top-Left: Filters -->
      <template v-slot:top-left>
        <div class="flex items-center gap-16 q-my-xs">
          <!-- Filter: Search -->
          <q-input
            borderless
            dense
            debounce="300"
            v-model="searchQuery"
            placeholder="Search"
            data-cy="table-filter-search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- Filter: Select -->
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="filterQuery"
            :options="filterOptions"
            data-cy="table-filter-select"
          >
          </q-select>
        </div>
      </template>

      <template v-slot:top-right>
        <div class="q-my-xs">
          <q-btn
            unelevated
            outline
            rounded
            color="primary"
            data-cy="table-button-download"
          >
            <q-icon name="download" size="18px" />
          </q-btn>
        </div>
      </template>

      <!-- Empty table -->
      <template v-slot:no-data>
        <div
          class="full-width row flex-center text-grey-10 q-gutter-sm"
          data-cy="table-no-data"
        >
          <span>{{ $t('table.textEmptyTable') }}</span>
        </div>
      </template>
    </q-table>
  </div>
</template>

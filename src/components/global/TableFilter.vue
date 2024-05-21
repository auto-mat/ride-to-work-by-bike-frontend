<script lang="ts">
/**
 * TableFilter Component
 *
 * @description * Use this component to display data in a table.
 *
 * @props
 * - `columns` (TableColumn[], required): The object representing columns.
 *   It should be of type `TableColumn[]`.
 * - `rows` (Array, required): The Array of objects representing rows.
 *
 * @example
 * <table-filter />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A102839&t=4cALO2fsjKI90AW1-1)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// types
import { FormSelectOption } from '../types/Form';

type TableColumn = {
  align: string;
  field: string;
  format?: (val: number | string | null) => string;
  label: string;
  name: string;
  required: boolean;
  sortable: boolean;
};

type TableRow = {
  [key: string]: number | string | null;
};

type FilterMethodInput = { search: string; filter: string };

export default defineComponent({
  name: 'TableFilter',
  setup() {
    const columns: TableColumn[] = [
      {
        name: 'rank',
        required: true,
        label: i18n.global.t('results.labelRank'),
        align: 'left',
        field: 'rank',
        format: (val: number | string | null) => (val ? `${val}.` : ''),
        sortable: true,
      },
      {
        name: 'consistency',
        required: true,
        label: i18n.global.t('results.labelConsistency'),
        align: 'left',
        field: 'consistency',
        sortable: true,
      },
      {
        name: 'route-count',
        required: true,
        label: i18n.global.t('results.labelRouteCount'),
        align: 'left',
        field: 'routeCount',
        format: (val: number | string | null) => (val ? `${val}%` : ''),
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: i18n.global.t('results.labelParticipant'),
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'team',
        required: true,
        label: i18n.global.t('results.labelTeam'),
        align: 'left',
        field: 'team',
        sortable: true,
      },
      {
        name: 'organization',
        required: true,
        label: i18n.global.t('results.labelOrganization'),
        align: 'left',
        field: 'organization',
        sortable: true,
      },
      {
        name: 'category',
        required: true,
        label: i18n.global.t('results.labelCategory'),
        align: 'left',
        field: 'category',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: i18n.global.t('results.labelCity'),
        align: 'left',
        field: 'city',
        sortable: true,
      },
    ];

    const rows: TableRow[] = [
      {
        city: 'Brno',
        name: 'Petr',
        team: 'Team 1',
        organization: 'Organizace 1',
        category: 'Kategorie 1',
        routeCount: 10,
        consistency: 100,
        rank: 1,
        id: 1,
      },
      {
        city: 'Praha',
        name: 'Pavel',
        team: 'Team 2',
        organization: 'Organizace 2',
        category: 'Kategorie 2',
        routeCount: 20,
        consistency: 50,
        rank: 2,
        id: 2,
      },
      {
        city: 'Praha',
        name: 'Marta',
        team: 'Team 2',
        organization: 'Organizace 3',
        category: 'Kategorie 3',
        routeCount: 22,
        consistency: 80,
        rank: 2,
        id: 2,
      },
    ];

    const searchQuery = ref('');

    const filterQuery = ref('');
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

    /**
     * Creates an object containing the search query and the filter query.
     */
    const filterCompound = computed((): FilterMethodInput => {
      return {
        search: searchQuery.value,
        filter: filterQuery.value,
      };
    });

    /**
     * Provides filter functionality
     **/
    const filterMethod = (
      rows: readonly TableRow[],
      terms: FilterMethodInput,
      cols: readonly TableColumn[],
      cellValue: (col: TableColumn, row: TableRow) => string,
    ): readonly TableRow[] | undefined => {
      const { search, filter } = terms;
      if (!search && !filter) {
        return rows;
      }
      if (!filter) {
        defaultFilter(search);
      }
      if (!search) {
        defaultFilter(filter);
      }
      // both filter options are selected
      const lowerTerms = [search, filter].map((query) => query.toLowerCase());
      return rows.filter((row) => {
        // combine conditions into an && operator
        return (
          cols.some((col) => {
            const val = cellValue(col, row) + '';
            const haystack =
              val === 'undefined' || val === 'null' ? '' : val.toLowerCase();
            return haystack.indexOf(lowerTerms[0]) !== -1;
          }) &&
          cols.some((col) => {
            const val = cellValue(col, row) + '';
            const haystack =
              val === 'undefined' || val === 'null' ? '' : val.toLowerCase();
            return haystack.indexOf(lowerTerms[1]) !== -1;
          })
        );
      });

      /**
       * Default filter function based on QTable source code
       * @param query string
       */
      function defaultFilter(query: string) {
        const lowerTerms = query ? query.toLowerCase() : '';
        return rows.filter((row) =>
          cols.some((col) => {
            const val = cellValue(col, row) + '';
            const haystack =
              val === 'undefined' || val === 'null' ? '' : val.toLowerCase();
            return haystack.indexOf(lowerTerms) !== -1;
          }),
        );
      }
    };

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
    >
      <!-- Top-Left: Filters -->
      <template v-slot:top-left>
        <div class="flex items-center gap-8">
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

      <!-- Empty table -->
      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-10 q-gutter-sm">
          <span>{{ $t('table.textEmptyTable') }}</span>
        </div>
      </template>
    </q-table>
  </div>
</template>

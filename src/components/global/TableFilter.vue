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
import { defineComponent, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

type TableColumn = {
  align: string;
  field: string;
  format?: (val: number | string | null) => string;
  label: string;
  name: string;
  required: boolean;
  sortable: boolean;
};

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

    const rows = [
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
    ];

    const searchQuery = ref('');

    return {
      columns,
      rows,
      searchQuery,
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
      :filter="searchQuery"
      row-key="id"
    >
      <!-- Search Filter -->
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Empty table -->
      <template v-slot:no-data="{ icon, message, searchQuery }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Well this is sad... {{ message }} </span>
          <q-icon size="2em" :name="searchQuery ? 'filter_b_and_w' : icon" />
        </div>
      </template>
    </q-table>
  </div>
</template>

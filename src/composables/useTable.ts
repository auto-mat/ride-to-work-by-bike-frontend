// librarires
import { computed, ref } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';

// types
import type { TableColumn, TableRow } from '../components/types/Table';

type FilterMethodInput = { search: string; filter: string };

export const useTable = () => {
  // Used in the `ResultsDetailPage`
  const tableResultsColumns: TableColumn[] = [
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

  const searchQuery = ref('');
  const filterQuery = ref('');

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
   * Upon typing, find strings which contain query entered into the filter
   * Function must match QTable filterMethod interface
   * @param rows TableRow[]
   * @param terms FilterMethodInput
   * @param cols TableColumn[]
   * @param cellValue (col: TableColumn, row: TableRow) => string
   * @returns TableRow[]
   **/
  const filterMethod = (
    rows: readonly TableRow[],
    terms: FilterMethodInput,
    cols: readonly TableColumn[],
    cellValue: (col: TableColumn, row: TableRow) => string,
  ): readonly TableRow[] => {
    const { search, filter } = terms;
    if (!search && !filter) {
      return rows;
    }
    if (!filter) {
      return defaultFilter(search);
    }
    if (!search) {
      return defaultFilter(filter);
    }
    // both filter options are selected
    const lowerTerms = [search, filter].map((query) => query.toLowerCase());
    return rows.filter((row) => {
      // combine conditions into an && operator
      return (
        !!isMatch({ cols, row, term: lowerTerms[0] }) &&
        !!isMatch({ cols, row, term: lowerTerms[1] })
      );
    });

    /**
     * Default filter function based on QTable source code
     * @param query string
     * @returns TableRow[]
     */
    function defaultFilter(query: string): TableRow[] {
      const lowerTerms = query ? query.toLowerCase() : '';
      return rows.filter((row) => !!isMatch({ cols, row, term: lowerTerms }));
    }

    /**
     * Checks if a row matches the search query
     * @param row TableRow
     * @param term string
     * @returns boolean
     */
    function isMatch({
      cols,
      row,
      term,
    }: {
      cols: readonly TableColumn[];
      row: TableRow;
      term: string;
    }): boolean {
      return cols.some((col) => {
        const val = cellValue(col, row) + '';
        const haystack =
          val === 'undefined' || val === 'null' ? '' : val.toLowerCase();
        return haystack.indexOf(term) !== -1;
      });
    }
  };

  return {
    filterCompound,
    filterQuery,
    searchQuery,
    tableResultsColumns,
    filterMethod,
  };
};

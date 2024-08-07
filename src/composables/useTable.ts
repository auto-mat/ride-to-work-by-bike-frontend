// librarires
import { date } from 'quasar';
import { computed, ref } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';
// TODO: import format price

// types
import type { QTableProps } from 'quasar';
import type { TableColumn, TableRow } from '../components/types/Table';

type FilterMethodInput = { search: string; filter: string };

const formatPrice = (value: number | string | null) => {
  return String(value);
};

export const useTable = () => {
  // Used in the `ResultsDetailPage`
  const tableResultsColumns: QTableProps['columns'] = [
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
        let val = cellValue(col, row);
        val =
          val === 'undefined' || val === 'null'
            ? ''
            : val.toString().toLowerCase();
        return val.indexOf(term) !== -1;
      });
    }
  };

  /**
   * Sorts an array of TableRow objects by team and then by the specified column.
   *
   * @param {readonly TableRow[]} rows - The array of TableRow objects to be sorted.
   * @param {string} sortBy - The column to sort by.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {readonly TableRow[]} The sorted array of TableRow objects.
   */
  const sortByTeam = (
    rows: readonly TableRow[],
    sortBy: string,
    descending: boolean,
  ): readonly TableRow[] => {
    const data = [...rows];
    if (!sortBy) return data;

    sortDataByValue(data, sortBy, descending);
    sortDataByTeam(data, descending);
    markFirstInGroup(data);

    return data;
  };

  /**
   * Sorts data array by given column in ascending or descending order.
   * @param {TableRow[]} data - The array to be sorted.
   * @param {string} sortBy - The column to sort by.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {void}
   */
  function sortDataByValue(data: TableRow[], sortBy: string, descending: boolean): void {
    data.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      if (!aVal || !bVal) {
        return 0;
      }
      else if (aVal < bVal) {
        return descending ? 1 : -1;
      }
      else if (aVal > bVal) {
        return descending ? -1 : 1;
      }
      else {
        return 0;
      }
    });
  }

  /**
   * Sorts data array by team in ascending or descending order.
   * @param {TableRow[]} data - The array of TableRow objects to be sorted.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {void}
   */
  function sortDataByTeam(data: TableRow[], descending: boolean): void {
    data.sort((a, b) => {
      if (!a.team || !b.team) {
        return 0;
      }
      else if (a.team < b.team) {
        return descending ? 1 : -1;
      }
      else if (a.team > b.team) {
        return descending ? -1 : 1;
      }
      else {
        return 0;
      }
    });
  }

  /**
   * If item is first in team, set isFirst to true.
   * @param {TableRow[]} data - The array of items.
   * @return {void}
   */
  function markFirstInGroup(data: TableRow[]): void {
    const seenTeams = new Set();
    data.forEach(row => {
      if (!seenTeams.has(row.team)) {
        row.isFirst = true;
        seenTeams.add(row.team);
      } else {
        row.isFirst = false;
      }
    });
  }

  return {
    filterCompound,
    filterQuery,
    searchQuery,
    tableResultsColumns,
    filterMethod,
    sortByTeam,
  };
};

export const useTableFeeApproval = () => {
  const tableFeeApprovalColumns: QTableProps['columns'] = [
    {
      align: 'left',
      field: 'amount',
      format: (val: number | string | null): string => formatPrice(val),
      label: i18n.global.t('table.labelAmount'),
      name: 'amount',
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: 'name',
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelName'),
      name: 'name',
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: 'email',
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelEmail'),
      name: 'email',
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: 'nickname',
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelNickname'),
      name: 'nickname',
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: 'team',
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelTeam'),
      name: 'team',
      required: false,
      sortable: true,
    },
    {
      align: 'left',
      field: 'dateCreated',
      format: (val: number | string | null): string => (
        val ?
        (date.formatDate(new Date(String(val)), 'D. MMM. YYYY')) :
        ''
      ),
      label: i18n.global.t('table.labelDateRegistered'),
      name: 'dateCreated',
      required: true,
      sortable: true,
    },
  ];

  const tableFeeApprovalVisibleColumns: string[] = [
    'amount',
    'name',
    'email',
    'nickname',
    'dateCreated',
  ];

  return {
    columns: tableFeeApprovalColumns,
    visibleColumns: tableFeeApprovalVisibleColumns
  };
};

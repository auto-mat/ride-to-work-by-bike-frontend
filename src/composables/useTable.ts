// librarires
import { date } from 'quasar';
import { computed, ref } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';
// TODO: import format price

// types
import type { QTableProps } from 'quasar';
import {
  TableColumn,
  TableRow,
  ResultsTableColumns,
  FeeApprovalTableColumns,
  AttendanceTableColumns,
} from '../components/types/Table';

type FilterMethodInput = { search: string; filter: string };

const formatPrice = (value: number | string | null) => {
  return String(value);
};

export const useTable = () => {
  // Used in the `ResultsDetailPage`
  const tableResultsColumns: QTableProps['columns'] = [
    {
      name: ResultsTableColumns.rank,
      required: true,
      label: i18n.global.t('results.labelRank'),
      align: 'left',
      field: ResultsTableColumns.rank,
      format: (val: number | string | null) => (val ? `${val}.` : ''),
      sortable: true,
    },
    {
      name: ResultsTableColumns.consistency,
      required: true,
      label: i18n.global.t('results.labelConsistency'),
      align: 'left',
      field: ResultsTableColumns.consistency,
      sortable: true,
    },
    {
      name: ResultsTableColumns.routeCount,
      required: true,
      label: i18n.global.t('results.labelRouteCount'),
      align: 'left',
      field: ResultsTableColumns.routeCount,
      format: (val: number | string | null) => (val ? `${val}%` : ''),
      sortable: true,
    },
    {
      name: ResultsTableColumns.name,
      required: true,
      label: i18n.global.t('results.labelParticipant'),
      align: 'left',
      field: ResultsTableColumns.name,
      sortable: true,
    },
    {
      name: ResultsTableColumns.team,
      required: true,
      label: i18n.global.t('results.labelTeam'),
      align: 'left',
      field: ResultsTableColumns.team,
      sortable: true,
    },
    {
      name: ResultsTableColumns.organization,
      required: true,
      label: i18n.global.t('results.labelOrganization'),
      align: 'left',
      field: ResultsTableColumns.organization,
      sortable: true,
    },
    {
      name: ResultsTableColumns.category,
      required: true,
      label: i18n.global.t('results.labelCategory'),
      align: 'left',
      field: ResultsTableColumns.category,
      sortable: true,
    },
    {
      name: ResultsTableColumns.city,
      required: true,
      label: i18n.global.t('results.labelCity'),
      align: 'left',
      field: ResultsTableColumns.city,
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
   * @param {TableRow[]} rows - Table rows
   * @param {FilterMethodInput} terms - Terms
   * @param {TableColumn[]} cols - Table columns
   * @param {(col: TableColumn, row: TableRow) => string} cellValue - Table cell value
   * @returns {TableRow[]}
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
     * @param {string} query - Query
     * @returns {TableRow[]}
     */
    function defaultFilter(query: string): TableRow[] {
      const lowerTerms = query ? query.toLowerCase() : '';
      return rows.filter((row) => !!isMatch({ cols, row, term: lowerTerms }));
    }

    /**
     * Checks if a row matches the search query
     * @param {TableRow} row - Table row
     * @param {string} term - Term
     * @returns {boolean}
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
   * Sorts an array of TableRow objects and group them by address.
   * First uses standard sort, then sorts results by address to create groups.
   * Finally, marks the first item in each group so we can show group headers.
   * @param {readonly TableRow[]} rows - The array of TableRows to be sorted.
   * @param {string} sortBy - The column to sort by.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {readonly TableRow[]} - The sorted array of TableRows.
   */
  const sortByAddress = (
    rows: readonly TableRow[],
    sortBy: string,
    descending: boolean,
  ): readonly TableRow[] => {
    const data = [...rows];
    if (!sortBy) return data;

    sortDataByValue(data, sortBy, descending);
    sortDataByKey(data, FeeApprovalTableColumns.address, descending);
    markFirstInGroup(data, FeeApprovalTableColumns.address);

    return data;
  };

  /**
   * Sorts data array by given column in ascending or descending order.
   * @param {TableRow[]} data - The array to be sorted.
   * @param {string} sortBy - The column to sort by.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {void}
   */
  function sortDataByValue(
    data: TableRow[],
    sortBy: string,
    descending: boolean,
  ): void {
    data.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      if (!aVal || !bVal) {
        return 0;
      } else if (aVal < bVal) {
        return descending ? 1 : -1;
      } else if (aVal > bVal) {
        return descending ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Sorts data array by given key in ascending or descending order.
   * This is used to sort data into groups by a key.
   * Together with `markFirstInGroup`, it can be used to show group headers.
   * @param {TableRow[]} data - The array of TableRow objects to be sorted.
   * @param {string} key - The key to sort by.
   * @param {boolean} descending - Whether to sort in descending order.
   * @return {void}
   */
  function sortDataByKey(
    data: TableRow[],
    key: string,
    descending: boolean,
  ): void {
    data.sort((a, b) => {
      if (!a[key] || !b[key]) {
        return 0;
      } else if (a[key] < b[key]) {
        return descending ? 1 : -1;
      } else if (a[key] > b[key]) {
        return descending ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Loop through items in a list
   * If you find item with a new value for given key, set isFirst to true.
   * This is used in combination with grouping by a key to show group header.
   * @param {TableRow[]} data - The array of items.
   * @param {string} key - The key to group by.
   * @return {void}
   */
  function markFirstInGroup(data: TableRow[], key: string): void {
    const seenTeams = new Set();
    data.forEach((row) => {
      if (!seenTeams.has(row[key])) {
        row.isFirst = true;
        seenTeams.add(row[key]);
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
    sortByAddress,
    formatPrice,
  };
};

export const useTableFeeApproval = () => {
  const tableFeeApprovalColumns: QTableProps['columns'] = [
    {
      align: 'left',
      field: FeeApprovalTableColumns.amount,
      format: (val: number | string | null): string => formatPrice(val),
      label: i18n.global.t('table.labelAmount'),
      name: FeeApprovalTableColumns.amount,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: FeeApprovalTableColumns.name,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelName'),
      name: FeeApprovalTableColumns.name,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: FeeApprovalTableColumns.email,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelEmail'),
      name: FeeApprovalTableColumns.email,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: FeeApprovalTableColumns.nickname,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelNickname'),
      name: FeeApprovalTableColumns.nickname,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: FeeApprovalTableColumns.address,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelTeam'),
      name: FeeApprovalTableColumns.address,
      required: false,
      sortable: true,
    },
    {
      align: 'left',
      field: FeeApprovalTableColumns.dateCreated,
      format: (val: number | string | null): string =>
        val ? date.formatDate(new Date(String(val)), 'D. MMM. YYYY') : '',
      label: i18n.global.t('table.labelDateRegistered'),
      name: FeeApprovalTableColumns.dateCreated,
      required: true,
      sortable: true,
    },
  ];

  // hide address column as the table is grouped by the key 'address'
  const tableFeeApprovalVisibleColumns: string[] = [
    FeeApprovalTableColumns.amount,
    FeeApprovalTableColumns.name,
    FeeApprovalTableColumns.email,
    FeeApprovalTableColumns.nickname,
    FeeApprovalTableColumns.dateCreated,
  ];

  return {
    columns: tableFeeApprovalColumns,
    visibleColumns: tableFeeApprovalVisibleColumns,
  };
};

export const useTableAttendance = () => {
  const tableAttendanceColumns: QTableProps['columns'] = [
    {
      align: 'left',
      field: AttendanceTableColumns.name,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelName'),
      name: AttendanceTableColumns.name,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: AttendanceTableColumns.nickname,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelNickname'),
      name: AttendanceTableColumns.nickname,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: AttendanceTableColumns.contact,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelContact'),
      name: AttendanceTableColumns.contact,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: AttendanceTableColumns.isFeeApproved,
      format: (val: boolean): boolean => val,
      label: i18n.global.t('table.labelFeeApproved'),
      name: AttendanceTableColumns.isFeeApproved,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: AttendanceTableColumns.paymentType,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelPaymentType'),
      name: AttendanceTableColumns.paymentType,
      required: true,
      sortable: true,
    },
    {
      align: 'left',
      field: AttendanceTableColumns.paymentState,
      format: (val: number | string | null): string => (val ? `${val}` : ''),
      label: i18n.global.t('table.labelPaymentState'),
      name: AttendanceTableColumns.paymentState,
      required: true,
      sortable: true,
    },
  ];

  const tableAttendanceVisibleColumns: string[] = [
    AttendanceTableColumns.name,
    AttendanceTableColumns.nickname,
    AttendanceTableColumns.contact,
    AttendanceTableColumns.isFeeApproved,
    AttendanceTableColumns.paymentType,
    AttendanceTableColumns.paymentState,
  ];

  return {
    columns: tableAttendanceColumns,
    visibleColumns: tableAttendanceVisibleColumns,
  };
};

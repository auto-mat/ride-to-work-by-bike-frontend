export type TableColumn = {
  align: string;
  field: string;
  format?: (val: number | string | null) => string;
  label: string;
  name: string;
  required: boolean;
  sortable: boolean;
};

export type TableRow = {
  [key: string]: number | string | null;
};

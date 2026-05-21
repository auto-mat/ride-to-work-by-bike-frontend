// composables
import { i18n } from '../../src/boot/i18n';

// types
import type { QTableProps } from 'quasar';
import type { CompetitionResult } from '../components/types/Competition';
import { ExportFileType } from '../components/enums/Coordinator';

import { wrapCsvValue } from '../utils/export_table';

/**
 * Composable for exporting organization challenge result table
 * to ODS, XLS, CSV file format
 *
 * Getting organization challenge result adjusted data for
 * exporting to file.
 */
export const useExportOrganizationChallengeTable = () => {
  const getChallengeResultData = (
    fileType: ExportFileType,
    columns: QTableProps['columns'],
    rows: CompetitionResult[],
    competitionResultDecimalNumber: string,
  ): (string | number)[][] => {
    const dataRows: (string | number)[][] = [];
    // Header
    if (fileType === 'csv') {
      dataRows.push([
        columns.map((column) => wrapCsvValue(column.label)).join(','),
      ]);
    } else {
      dataRows.push(columns.map((column) => column.label));
    }
    // Adjust data
    rows.forEach((result) => {
      const row = [
        result.place,
        result.name,
        i18n.global.n(result.frequency * 100, competitionResultDecimalNumber),
        i18n.global.n(result.distance, competitionResultDecimalNumber),
        i18n.global.n(result.emissions.co2, competitionResultDecimalNumber),
      ];
      if (fileType === 'csv') {
        dataRows.push([row.map((cell) => wrapCsvValue(cell)).join(',')]);
      } else {
        dataRows.push(row);
      }
    });
    return dataRows;
  };

  return {
    getChallengeResultData,
  };
};

// libraries
import { exportFile } from 'quasar';
import ExcelJS from 'exceljs';
import { OdsDocument } from 'odf-kit';

/**
 * Composable for exporting table data
 * to ODS, XLS, CSV file format
 */
export const useExportTable = () => {
  const downloadCsvFileFormat = async (
    fileName: string,
    dataRows: (number | string)[],
  ): Promise<boolean | Error> => {
    const csvContent = dataRows.join('\r\n');
    return exportFile(fileName, csvContent, 'text/csv');
  };

  const downloadXlsFileFormat = async (
    fileName: string,
    data: (number | string)[],
    sheetName: string,
  ): Promise<boolean | Error> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.addRows(data);

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return exportFile(fileName, buffer, 'application/vnd.ms-excel');
  };

  const downloadOdsFileFormat = async (
    fileName: string,
    data: (number | string)[][],
    sheetName: string,
  ): Promise<boolean | Error> => {
    const doc = new OdsDocument();
    const sheet = doc.addSheet(sheetName);
    data.forEach((row) => {
      sheet.addRow(row);
    });

    // Generate buffer
    const buffer = await doc.save();
    return exportFile(
      fileName,
      buffer,
      'application/vnd.oasis.opendocument.spreadsheet',
    );
  };

  return {
    downloadOdsFileFormat,
    downloadXlsFileFormat,
    downloadCsvFileFormat,
  };
};

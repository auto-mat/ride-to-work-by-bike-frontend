// libraries
import { exportFile, Notify } from 'quasar';

// composables
import { i18n } from '../../src/boot/i18n';
import { useTableAttendance } from './useTable';
import { useTeamMemberApprovalStatus } from './useTeamMemberApprovalStatus';

// types
import type {
  TableAttendanceRow,
  TableAttendanceSubsidiaryData,
} from './useTableAttendanceData';

/**
 * Wraps CSV value with escaping
 * @param {string | number | boolean | null} val - Value to wrap
 * @returns {string} - Wrapped and escaped value
 */
const wrapCsvValue = (val: string | number | boolean | null): string =>
  `"${val ? String(val) : ''}"`;

/**
 * Composable for exporting table attendance data to CSV
 */
export const useExportTableAttendance = () => {
  const { getPaymentStateLabel, getPaymentTypeLabel } = useTableAttendance();
  const { getStatusLabel } = useTeamMemberApprovalStatus();

  /**
   * Exports table attendance data to CSV file
   * @param {TableAttendanceSubsidiaryData[]} subsidiariesData - Data to export
   */
  const exportTableAttendance = (
    subsidiariesData: TableAttendanceSubsidiaryData[],
  ): void => {
    if (!subsidiariesData || subsidiariesData.length === 0) {
      Notify.create({
        message: i18n.global.t('coordinator.messageExportNoData'),
        color: 'warning',
      });
      return;
    }
    // remove empty placeholder rows and add subsidiary name
    const allRows: Array<TableAttendanceRow & { subsidiaryName: string }> = [];
    subsidiariesData.forEach((subsidiaryData) => {
      const nonEmptyMembers = subsidiaryData.members.filter(
        (member) => !member.isEmpty,
      );
      nonEmptyMembers.forEach((member) => {
        allRows.push({
          ...member,
          subsidiaryName: subsidiaryData.subsidiary.name,
        });
      });
    });
    if (allRows.length === 0) {
      Notify.create({
        message: i18n.global.t('coordinator.messageExportNoData'),
        color: 'warning',
      });
      return;
    }
    const headers = [
      i18n.global.t('table.labelEmail'),
      i18n.global.t('table.labelName'),
      i18n.global.t('table.labelNickname'),
      i18n.global.t('table.labelPhone'),
      i18n.global.t('table.labelApprovedForTeam'),
      i18n.global.t('table.labelFeeApproved'),
      i18n.global.t('table.labelPaymentType'),
      i18n.global.t('table.labelPaymentState'),
      i18n.global.t('table.labelTShirtSizeUpdated'),
      i18n.global.t('table.labelTeam'),
      i18n.global.t('table.labelSubsidiary'),
    ];
    // build CSV
    const csvRows: string[] = [];
    // header
    csvRows.push(headers.map((header) => wrapCsvValue(header)).join(','));
    // data rows
    allRows.forEach((member) => {
      const row = [
        member.email,
        member.name,
        member.nickname,
        member.telephone,
        getStatusLabel(member.approvedForTeam),
        member.isFeeApproved
          ? i18n.global.t('global.yes')
          : i18n.global.t('global.no'),
        getPaymentTypeLabel(member.paymentType),
        getPaymentStateLabel(member.paymentState),
        member.tShirtSizeUpdated
          ? i18n.global.d(
              new Date(member.tShirtSizeUpdated),
              'monthDayHourMinute',
            )
          : '',
        member.team,
        member.subsidiaryName,
      ];
      csvRows.push(row.map((cell) => wrapCsvValue(cell)).join(','));
    });
    const csvContent = csvRows.join('\r\n');
    // export file
    const status = exportFile(
      'organization-attendance.csv',
      csvContent,
      'text/csv',
    );
    if (status !== true) {
      Notify.create({
        message: i18n.global.t('coordinator.messageExportFailed'),
        color: 'negative',
      });
    }
  };

  return {
    exportTableAttendance,
  };
};

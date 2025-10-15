// libraries
import { computed } from 'vue';

// enums
import { TeamMemberStatus } from 'src/components/enums/TeamMember';
import { PaymentState, PaymentType } from 'src/components/enums/Payment';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { Ref } from 'vue';
import type {
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
} from 'src/components/types/AdminOrganisation';

export interface TableAttendanceRow {
  name: string;
  nickname: string | null;
  contact: string;
  isFeeApproved: boolean;
  paymentType: PaymentType;
  paymentState: PaymentState;
  team: string;
  isFirst?: boolean;
}

export interface TableAttendanceSubsidiaryData {
  subsidiary: AdminSubsidiary;
  members: TableAttendanceRow[];
}

/**
 * Transforms AdminTeamMember to TableAttendanceRow
 * @param {AdminTeamMember} member - Team member from API
 * @param {string} teamName - Name of the team
 * @param {PaymentType} paymentType - Payment type derived from member source array
 * @returns {TableAttendanceRow} - Flattened row for table
 */
function transformMemberToRow(
  member: AdminTeamMember,
  teamName: string,
  paymentType: PaymentType,
): TableAttendanceRow {
  return {
    name: member.name,
    nickname: member.nickname,
    contact: member.email,
    isFeeApproved: member.approved_for_team === TeamMemberStatus.approved,
    paymentType,
    paymentState: member.payment_status,
    team: teamName,
  };
}

/**
 * Composable for transforming admin organisation data to table attendance format
 * @returns {Ref<{subsidiariesData: TableAttendanceSubsidiaryData[]}>} - Object containing subsidiaries data
 */
export const useTableAttendanceData = (): {
  subsidiariesData: Ref<TableAttendanceSubsidiaryData[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();
  /**
   * Computed property that transforms store data into table format
   * Returns array of objects, one per subsidiary, each containing flattened member rows
   */
  const subsidiariesData = computed<TableAttendanceSubsidiaryData[]>(() => {
    const organisation = adminOrganisationStore.getCurrentAdminOrganisation;

    if (!organisation || !organisation.subsidiaries) {
      return [];
    }

    return organisation.subsidiaries.map((subsidiary: AdminSubsidiary) => {
      // Collect all members from all teams in this subsidiary
      const allMembers: TableAttendanceRow[] = [];
      subsidiary.teams.forEach((team: AdminTeam) => {
        // Process members_with_paid_entry_fee_by_org_coord - PaymentType.organization
        team.members_with_paid_entry_fee_by_org_coord.forEach(
          (member: AdminTeamMember) => {
            allMembers.push(
              transformMemberToRow(member, team.name, PaymentType.organization),
            );
          },
        );
        // Process members_without_paid_entry_fee_by_org_coord - PaymentType.organization
        team.members_without_paid_entry_fee_by_org_coord.forEach(
          (member: AdminTeamMember) => {
            allMembers.push(
              transformMemberToRow(member, team.name, PaymentType.organization),
            );
          },
        );
        // Process other_members - PaymentType.registration
        team.other_members.forEach((member: AdminTeamMember) => {
          allMembers.push(
            transformMemberToRow(member, team.name, PaymentType.registration),
          );
        });
      });

      return {
        subsidiary,
        members: allMembers,
      };
    });
  });

  return {
    subsidiariesData,
  };
};

// libraries
import { computed } from 'vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type {
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
} from 'src/components/types/AdminOrganisation';
import { TeamMemberStatus } from 'src/components/enums/TeamMember';
import { PaymentState } from 'src/components/enums/Payment';

export interface TableAttendanceRow {
  name: string;
  nickname: string | null;
  contact: string;
  isFeeApproved: boolean;
  paymentType: string;
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
 * @returns {TableAttendanceRow} - Flattened row for table
 */
function transformMemberToRow(
  member: AdminTeamMember,
  teamName: string,
): TableAttendanceRow {
  return {
    name: member.name,
    nickname: member.nickname,
    contact: member.email,
    isFeeApproved: member.approved_for_team === TeamMemberStatus.approved,
    paymentType: member.payment_type,
    paymentState: member.payment_status,
    team: teamName,
  };
}

/**
 * Composable for transforming admin organisation data to table attendance format
 * @returns {Object} - Object containing subsidiaries data
 */
export const useTableAttendanceData = () => {
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
        // Combine all member arrays
        const allTeamMembers = [
          ...team.members_with_paid_entry_fee_by_org_coord,
          ...team.members_without_paid_entry_fee_by_org_coord,
          ...team.other_members,
        ];

        // Transform each member and add team name
        allTeamMembers.forEach((member: AdminTeamMember) => {
          allMembers.push(transformMemberToRow(member, team.name));
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

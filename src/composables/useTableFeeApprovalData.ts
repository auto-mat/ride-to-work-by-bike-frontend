// libraries
import { computed } from 'vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { Ref } from 'vue';
import type {
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
} from 'src/components/types/AdminOrganisation';

export interface TableFeeApprovalRow {
  name: string;
  email: string;
  nickname: string | null;
  amount: number;
  dateCreated: string;
  address: string;
  selected?: boolean;
  isFirst?: boolean;
}

/**
 * Transforms AdminTeamMember to TableFeeApprovalRow
 * @param {AdminTeamMember} member - Team member from API
 * @param {string} subsidiaryAddress - Address of the subsidiary
 * @returns {TableFeeApprovalRow} - Flattened row for table
 */
function transformMemberToRow(
  member: AdminTeamMember,
  subsidiaryAddress: string,
): TableFeeApprovalRow {
  return {
    name: member.name,
    email: member.email,
    nickname: member.nickname,
    amount: parseFloat(member.payment_amount) || 0,
    dateCreated: member.date_of_challenge_registration,
    address: subsidiaryAddress,
    selected: false,
  };
}

/**
 * Build data object for fee approval table
 * Flat array of members grouped by subsidiary
 * @param {boolean} approved - Whether to show approved or non-approved members
 * @returns {Ref<TableFeeApprovalRow[]>} - Array of table rows
 */
export const useTableFeeApprovalData = (
  approved: boolean,
): {
  feeApprovalData: Ref<TableFeeApprovalRow[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();

  const feeApprovalData = computed<TableFeeApprovalRow[]>(() => {
    const organisation = adminOrganisationStore.getCurrentAdminOrganisation;

    if (!organisation || !organisation.subsidiaries) {
      return [];
    }
    const allMembers: TableFeeApprovalRow[] = [];
    // loop over subsidiaries
    organisation.subsidiaries.forEach((subsidiary: AdminSubsidiary) => {
      const subsidiaryAddress = `${subsidiary.street} ${subsidiary.street_number}, ${subsidiary.city}`;
      // loop over teams
      subsidiary.teams.forEach((team: AdminTeam) => {
        // get members based on approval status
        const memberArray = approved
          ? team.members_with_paid_entry_fee_by_org_coord
          : team.members_without_paid_entry_fee_by_org_coord;
        // transform members to rows
        memberArray.forEach((member: AdminTeamMember) => {
          allMembers.push(transformMemberToRow(member, subsidiaryAddress));
        });
      });
    });

    return allMembers;
  });

  return {
    feeApprovalData,
  };
};

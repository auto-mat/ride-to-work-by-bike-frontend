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
  email: string;
  telephone: string;
  diploma?: string | null;
  approvedForTeam: TeamMemberStatus;
  isFeeApproved: boolean;
  paymentType: PaymentType;
  paymentState: PaymentState;
  tShirtSizeUpdated: string | null;
  team: string;
  teamId: number;
  memberId: number;
  subsidiaryId: number;
  isFirst?: boolean;
  isEmpty?: boolean;
}

export interface TableAttendanceSubsidiaryData {
  subsidiary: AdminSubsidiary;
  members: TableAttendanceRow[];
}

interface TransformMemberParams {
  member: AdminTeamMember;
  teamName: string;
  teamId: number;
  subsidiaryId: number;
  paymentType: PaymentType;
  isFeeApproved: boolean;
}

/**
 * Transforms AdminTeamMember to TableAttendanceRow
 * @param {TransformMemberParams} params - Parameters object
 * @returns {TableAttendanceRow} - Flattened row for table
 */
function transformMemberToRow({
  member,
  teamName,
  teamId,
  subsidiaryId,
  paymentType,
  isFeeApproved,
}: TransformMemberParams): TableAttendanceRow {
  return {
    name: member.name_for_trusted,
    nickname: member.nickname,
    email: member.email,
    telephone: member.telephone,
    diploma: member.diploma,
    approvedForTeam: member.approved_for_team,
    isFeeApproved,
    paymentType,
    paymentState: member.payment_status,
    tShirtSizeUpdated: member.t_shirt_size_updated,
    team: teamName,
    teamId,
    memberId: member.id,
    subsidiaryId,
  };
}

/**
 * Build data object for attendance tables (one per subsidiary)
 * @returns {Ref<{subsidiariesData: TableAttendanceSubsidiaryData[]}>} - Array of subsidiary data objects
 */
export const useTableAttendanceData = (): {
  subsidiariesData: Ref<TableAttendanceSubsidiaryData[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();
  const subsidiariesData = computed<TableAttendanceSubsidiaryData[]>(() => {
    const organisation = adminOrganisationStore.getCurrentAdminOrganisation;

    if (!organisation || !organisation.subsidiaries) {
      return [];
    }

    return organisation.subsidiaries.map((subsidiary: AdminSubsidiary) => {
      // collect all members from all teams in this subsidiary
      const allMembers: TableAttendanceRow[] = [];
      subsidiary.teams.forEach((team: AdminTeam) => {
        const teamHasMembers =
          team.members_with_paid_entry_fee_by_org_coord.length > 0 ||
          team.members_without_paid_entry_fee_by_org_coord.length > 0 ||
          team.other_members.length > 0;
        // empty team - add hidden placeholder row
        if (!teamHasMembers) {
          allMembers.push({
            name: '',
            nickname: null,
            email: '',
            telephone: '',
            diploma: '',
            approvedForTeam: TeamMemberStatus.approved,
            isFeeApproved: false,
            paymentType: PaymentType.registration,
            paymentState: PaymentState.none,
            tShirtSizeUpdated: null,
            team: team.name,
            teamId: team.id,
            memberId: 0, // Empty team has no member
            subsidiaryId: subsidiary.id,
            isEmpty: true,
          });
        }
        // process members with entry fee paid by org coordinator
        team.members_with_paid_entry_fee_by_org_coord.forEach(
          (member: AdminTeamMember) => {
            allMembers.push(
              transformMemberToRow({
                member,
                teamName: team.name,
                teamId: team.id,
                subsidiaryId: subsidiary.id,
                paymentType: PaymentType.organization,
                isFeeApproved: true,
              }),
            );
          },
        );
        // process members without entry fee paid by org coordinator
        team.members_without_paid_entry_fee_by_org_coord.forEach(
          (member: AdminTeamMember) => {
            allMembers.push(
              transformMemberToRow({
                member,
                teamName: team.name,
                teamId: team.id,
                subsidiaryId: subsidiary.id,
                paymentType: PaymentType.organization,
                isFeeApproved: false,
              }),
            );
          },
        );
        // process other_members who pay their entry fee themselves
        team.other_members.forEach((member: AdminTeamMember) => {
          allMembers.push(
            transformMemberToRow({
              member,
              teamName: team.name,
              teamId: team.id,
              subsidiaryId: subsidiary.id,
              paymentType: PaymentType.registration,
              isFeeApproved: true,
            }),
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

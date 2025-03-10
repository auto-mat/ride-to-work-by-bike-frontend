// composables
import { i18n } from 'src/boot/i18n';

// enums
import { Colors } from '../components/enums/Colors';
import { Icons } from '../components/enums/Icons';
import { TeamMemberStatus } from '../components/enums/TeamMember';
// types
import type { ExtendedMemberResults } from 'src/components/types/Results';

export const useTeamMemberApprovalStatus = () => {
  const getStatusLabel = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return i18n.global.t('teamMembersList.approved');
      case TeamMemberStatus.undecided:
        return i18n.global.t('teamMembersList.undecided');
      case TeamMemberStatus.denied:
        return i18n.global.t('teamMembersList.denied');
    }
  };

  const getStatusColor = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return Colors.positive;
      case TeamMemberStatus.undecided:
        return Colors.warning;
      case TeamMemberStatus.denied:
        return Colors.negative;
    }
  };

  const getStatusIcon = (member: ExtendedMemberResults): string => {
    switch (member.approved_for_team) {
      case TeamMemberStatus.approved:
        return Icons.check;
      case TeamMemberStatus.undecided:
        return Icons.help;
      case TeamMemberStatus.denied:
        return Icons.close;
    }
  };

  return { getStatusLabel, getStatusColor, getStatusIcon };
};

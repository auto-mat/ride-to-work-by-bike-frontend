// types
import type { Ref } from 'vue';

export interface SendTeamMembershipInvitationEmailPayload {
  email: string;
}

export interface SendTeamMembershipInvitationEmailResponse {
  team_membership_invitation_email_sended: string[];
}

export interface UseApiSendTeamMembershipInvitationEmailReturn {
  isLoading: Ref<boolean>;
  postSendTeamMembershipInvitationEmail: (
    payload: SendTeamMembershipInvitationEmailPayload,
  ) => Promise<SendTeamMembershipInvitationEmailResponse | null>;
}

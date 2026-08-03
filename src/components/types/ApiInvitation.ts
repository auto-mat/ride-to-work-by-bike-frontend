// types
import type { Ref } from 'vue';

export interface InvitationTokenData {
  team_id: number;
  subsidiary_id: number;
  company_id: number;
  campaign_id: number;
  exp: number;
}

export interface ValidateInvitationTokenRequest {
  token: string;
}

export interface ValidateInvitationTokenResponse {
  token: InvitationTokenData;
}

export interface ValidateInvitationTokenError {
  error: {
    token: string[];
  };
}

export interface UseApiPostValidateTeamMembershipInvitationEmailReturn {
  isLoading: Ref<boolean>;
  postValidateTeamMembershipInvitationEmail: (
    payload: ValidateInvitationTokenRequest,
  ) => Promise<ValidateInvitationTokenResponse | null>;
}

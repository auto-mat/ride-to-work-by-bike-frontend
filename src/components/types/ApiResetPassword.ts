// types
import type { Ref } from 'vue';

export interface PostResetPasswordConfirmPayload {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
}

export interface PostResetPasswordConfirmResponse {
  detail: string;
}

export interface UseApiPostResetPasswordConfirmReturn {
  isLoading: Ref<boolean>;
  resetPasswordConfirm: (
    payload: PostResetPasswordConfirmPayload,
  ) => Promise<PostResetPasswordConfirmResponse | null>;
}

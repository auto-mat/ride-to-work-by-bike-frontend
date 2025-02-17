import { UserLogin } from './User';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

export interface LoginOptions {
  redirectAfterLogin: boolean;
  showErrorMessage: boolean;
  showSuccessMessage: boolean;
}

/**
 * Facebook login types
 * Used in LoginRegisterButtons.vue
 */
export enum FacebookLoginStatus {
  connected = 'connected',
  notAuthorized = 'not_authorized',
  unknown = 'unknown',
}

export interface FacebookLoginResponse {
  status: FacebookLoginStatus;
  authResponse: FacebookAuthResponse | null;
}

export interface FacebookAuthResponse {
  userID: string;
  expiresIn: number;
  accessToken: string;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

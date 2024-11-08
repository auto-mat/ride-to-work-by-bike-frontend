import { UserLogin } from './User';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

export interface GoogleAuthResponse {
  clientId: string;
  credential: string;
  select_by: string;
  error?: string;
}

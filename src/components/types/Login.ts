import { UserLogin } from './User';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

export interface GoogleAuthResponse {
  code: string;
  scope: string;
  authuser: string;
  hd: string;
  prompt: string;
}

export interface GoogleLoginError {
  error: string;
}

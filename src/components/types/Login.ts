import { UserLogin } from './User';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

import type { UserLogin } from './User';

export interface OriginalAdminData {
  user: UserLogin;
  accessToken: string;
  refreshToken: string;
  jwtExpiration: number | null;
}

export interface ImpersonatedUserData {
  user: UserLogin;
}

export interface ImpersonationState {
  isActive: boolean;
  originalAdmin: OriginalAdminData | null;
  impersonatedUser: ImpersonatedUserData | null;
}

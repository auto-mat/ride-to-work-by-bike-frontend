// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from '../composables/useApi';
import { useJwt } from '../composables/useJwt';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface RefreshTokenResponse {
  access: string;
  access_token_expiration: string;
}

export const emptyUser: User = {
  email: '',
  first_name: '',
  last_name: '',
  pk: 0,
  username: '',
};

const { apiFetch } = useApi();

export const useLoginStore = defineStore('login', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    user: emptyUser,
    accessToken: '',
    refreshToken: '',
    jwtExpiration: null as number | null,
  }),

  getters: {
    getUser: (state): User => state.user,
    getAccessToken: (state): string => state.accessToken,
    getRefreshToken: (state): string => state.refreshToken,
    getJwtExpiration: (state): number | null => state.jwtExpiration,
  },

  actions: {
    setUser(user: User): void {
      Object.assign(this.user, user);
    },
    setAccessToken(token: string): void {
      this.accessToken = token;
    },
    setRefreshToken(token: string): void {
      this.refreshToken = token;
    },
    setJwtExpiration(expiration: number): void {
      this.jwtExpiration = expiration;
    },
    /**
     * Login user
     * Checks if email and password are set.
     * If not, shows a notification.
     * If yes, sends the login request to the API.
     * If successful, sets the token.
     * @param payload - LoginPayload
     * @returns Promise<LoginResponse | null>
     */
    async login(payload: LoginPayload): Promise<LoginResponse | null> {
      // check that email is set
      if (!payload.username) {
        Notify.create({
          message: i18n.global.t('login.form.messageEmailReqired'),
          color: 'negative',
        });
        return null;
      }
      // check that password is set
      if (!payload.password) {
        Notify.create({
          message: i18n.global.t('login.form.messagePasswordRequired'),
          color: 'negative',
        });
        return null;
      }
      // login
      const { data } = await apiFetch<LoginResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiLogin,
        method: 'post',
        payload,
        translationKey: 'login',
        logger: this.$log,
      });
      // set tokens
      if (data && data.access_token && data.refresh_token) {
        this.setAccessToken(data.access_token);
        this.setRefreshToken(data.refresh_token);

        // set JWT expiration
        const { readJwtExpiration } = useJwt();
        const expiration = readJwtExpiration(data.access_token);
        if (expiration) {
          this.setJwtExpiration(expiration);
        }

        // token refresh (if no page reload before expiration)
        this.scheduleTokenRefresh();
      }
      // set user
      if (data && data.user) {
        this.setUser(data.user);
      }

      return data;
    },
    /**
     * Logout user
     * Sets the access token, refresh token and user to empty values.
     */
    logout(): void {
      this.setAccessToken('');
      this.setRefreshToken('');
      this.setUser(emptyUser);
    },
    /**
     * Schedule token refresh (on page load, if logged in)
     * Refreshes the token 1 minute before expiration.
     * This function is being called in `pinia.js` boot file.
     */
    scheduleTokenRefresh() {
      const timeUntilExpiration = this.getTimeUntilExpiration();
      if (timeUntilExpiration) {
        // refresh token 1 minute before expiration
        const refreshTime = (timeUntilExpiration - 60) * 1000;

        if (refreshTime > 0) {
          setTimeout(() => {
            this.refreshTokens();
          }, refreshTime);
        } else {
          // token expired - refresh immediately
          this.refreshTokens();
        }
      }
    },
    /**
     * Validate access token (before sending an API request)
     * Checks if the access token is expired.
     * If no expiration is set, logs the user out.
     * If the token is expired, tries to refresh it.
     * If refresh fails, logs the user out.
     * If refresh succeeds, returns true.
     * If the token is not expired, returns true.
     * @returns Promise<boolean> (token is valid)
     */
    async validateAccessToken(): Promise<boolean> {
      const expiration = this.getJwtExpiration;
      if (!expiration) {
        // no expiration set - user is not logged in
        this.logout();
        return false;
      } else {
        // token is set - check if it is expired
        if (this.isJwtExpired()) {
          // try to refresh tokens
          await this.refreshTokens();
          // check if refresh was successful
          if (this.isJwtExpired()) {
            // refresh failed - logout
            this.logout();
            return false;
          } else {
            // refresh successful
            return true;
          }
        } else {
          // token is not expired
          return true;
        }
      }
    },
    /**
     * Refresh tokens
     * Sends a request to refresh the access token using the refresh token.
     * If successful, sets the new access token.
     * @returns Promise<RefreshTokenResponse | null>
     */
    async refreshTokens(): Promise<RefreshTokenResponse | null> {
      // check that refresh token is set
      if (!this.refreshToken) {
        Notify.create({
          message: i18n.global.t('refreshTokens.messageRefreshTokenRequired'),
          color: 'negative',
        });
        return null;
      }
      // refresh tokens
      const payload = { refresh: this.refreshToken };
      const { data } = await apiFetch<RefreshTokenResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiRefresh,
        method: 'post',
        payload,
        translationKey: 'refreshTokens',
        logger: this.$log,
        showSuccessMessage: false,
      });

      // set new access token
      if (data && data.access) {
        this.setAccessToken(data.access);

        // set JWT expiration
        const { readJwtExpiration } = useJwt();
        const expiration = readJwtExpiration(data.access);
        if (expiration) {
          this.setJwtExpiration(expiration);
        }
      }

      // token refresh (if no page reload before expiration)
      this.scheduleTokenRefresh();

      return data;
    },
    /**
     * Calculates the time until JWT expiration.
     * @returns {number | null} Time in seconds until expiration.
     */
    getTimeUntilExpiration(): number | null {
      const currentTime = Math.floor(Date.now() / 1000);
      return this.jwtExpiration ? this.jwtExpiration - currentTime : null;
    },
    /**
     * Checks if the JWT is expired.
     * @returns {boolean} True if expired, else false.
     */
    isJwtExpired(): boolean {
      const expiration = this.jwtExpiration;
      const currentTime = Math.floor(Date.now() / 1000);
      return !expiration || currentTime > expiration;
    },
  },

  persist: true,
});

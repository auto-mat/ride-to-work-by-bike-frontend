// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { Router } from 'vue-router';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from '../composables/useApi';
import { useJwt } from '../composables/useJwt';
import { timestampToDatetimeString } from 'src/utils';
import { setAccessRefreshTokens } from '../utils/set_access_refresh_tokens';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { routesConf } from '../router/routes_conf';

// types
import type { Logger } from '../components/types/Logger';
import type { UserLogin } from '../components/types/User';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: UserLogin;
}

interface RefreshTokenResponse {
  access: string;
  access_expiration: string;
}

export const emptyUser: UserLogin = {
  email: '',
  first_name: '',
  last_name: '',
  pk: 0,
  username: '',
};

const { apiFetch } = useApi();

export const useLoginStore = defineStore('login', {
  // ! you have to manually enable persist (persist config below)
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    user: emptyUser as UserLogin, // persisted
    accessToken: '',
    refreshToken: '', // persisted
    jwtExpiration: null as number | null, // persisted, unit: seconds, https://www.rfc-editor.org/rfc/rfc7519#section-2
    refreshTokenTimeout: null as NodeJS.Timeout | null, // unit: seconds
  }),

  getters: {
    getUser: (state): UserLogin => state.user,
    getAccessToken: (state): string => state.accessToken,
    getRefreshToken: (state): string => state.refreshToken,
    getJwtExpiration: (state): number | null => state.jwtExpiration,
    getRefreshTokenTimeout: (state): NodeJS.Timeout | null =>
      state.refreshTokenTimeout,
  },

  actions: {
    setUser(user: UserLogin): void {
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
    setRefreshTokenTimeout(timeout: NodeJS.Timeout | null): void {
      this.refreshTokenTimeout = timeout;
    },
    clearRefreshTokenTimeout(): void {
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
        this.refreshTokenTimeout = null;
      }
    },

    /**
     * Login user
     * Checks if email and password are set.
     * If not, shows a notification.
     * If yes, sends the login request to the API.
     * If successful, sets the token.
     * @param {LoginPayload} payload - Login input data (username, password)
     * @returns {Promise<LoginResponse | null>} - Response
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
      this.$log?.debug(`Login username <${payload.username}>.`);
      this.$log?.debug(`Login password <${payload.password}>.`);
      // login
      this.$log?.info('Get API access/refresh token.');
      const { data } = await apiFetch<LoginResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiLogin,
        method: 'post',
        payload,
        translationKey: 'login',
        logger: this.$log,
      });
      // set user
      if (data && data.user) {
        this.$log?.info('Save user data into login store.');
        this.setUser(data.user);
        this.$log?.debug(
          `Login store saved user data <${JSON.stringify(this.getUser, null, 2)}>.`,
        );
      }
      if (data && data.access && data.refresh) {
        // set tokens
        setAccessRefreshTokens({
          access: data.access,
          refresh: data.refresh,
          loginStore: this,
          $log: this.$log as Logger,
        });

        if (this.$router) {
          this.$log?.debug(
            `Login was successfull, redirect to <${routesConf['home']['path']}> URL.`,
          );
          this.$router.push(routesConf['home']['path']);
        }
      }

      return data;
    },
    /**
     * Logout user
     * Sets the access token, refresh token and user to empty values.
     */
    logout(): void {
      this.$log?.info('Logout user.');
      this.setAccessToken('');
      this.setRefreshToken('');
      this.setUser(emptyUser);
      this.clearRefreshTokenTimeout();
      this.$log?.info(`Login store access token <${this.getAccessToken}>.`);
      this.$log?.info(`Login store refresh token <${this.getRefreshToken}>.`);
      this.$log?.info(
        `Login store user <${JSON.stringify(this.getUser, null, 2)}>.`,
      );
      this.$log?.info(
        `Login store refresh token timeout <${this.getRefreshTokenTimeout}>.`,
      );
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
        const refreshTime = timeUntilExpiration - 60;

        if (refreshTime > 0) {
          this.$log?.debug(
            `Schedule refresh access token in <${Math.floor(refreshTime / 60)}> minutes.`,
          );
          // store timeout in store so it can be cancelled on logout
          this.setRefreshTokenTimeout(
            setTimeout(() => {
              this.refreshTokens();
            }, refreshTime * 1000), // miliseconds
          );
        } else {
          // token expired - refresh immediately
          this.$log?.info('Access token expired, refresh it immediately.');
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
     * @returns {Promise<boolean>} - Token is valid
     */
    async validateAccessToken(): Promise<boolean> {
      this.$log?.info('Validate access token.');
      if (!this.getJwtExpiration) {
        // no expiration set - user is not logged in
        this.$log?.info(
          'No access token expiration set, user is not logged in.',
        );
        this.logout();
        return false;
      } else {
        // token is set - check if it is expired
        if (this.isJwtExpired()) {
          this.$log?.info('Access token is expired.');
          // try to refresh tokens
          await this.refreshTokens();
          // check if refresh was successful
          if (this.isJwtExpired()) {
            // refresh failed - logout
            this.$log?.info('Refresh access token failed, logout user.');
            this.logout();
            return false;
          } else {
            // refresh successful
            this.$log?.info('Refresh access token was successfull.');
            return true;
          }
        } else {
          // token is not expired
          this.$log?.info('Access token is not expired.');
          return true;
        }
      }
    },
    /**
     * Refresh tokens
     * Sends a request to refresh the access token using the refresh token.
     * If successful, sets the new access token.
     * @returns {Promise<RefreshTokenResponse | null>} - Refresh token response or null
     */
    async refreshTokens(): Promise<RefreshTokenResponse | null> {
      // check that refresh token is set
      this.$log?.info('Call refresh token.');
      if (!this.refreshToken) {
        this.$log?.info(`No refresh token <${this.refreshToken}>.`);
        Notify.create({
          message: i18n.global.t('refreshTokens.messageRefreshTokenRequired'),
          color: 'negative',
        });
        return null;
      }
      // refresh tokens
      const payload = { refresh: this.refreshToken };
      this.$log?.info('Obtain new API access token.');
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
        this.$log?.info('Save newly obtained access token into store.');
        this.setAccessToken(data.access);
        this.$log?.debug(
          `Login store saved newly obtained access token <${this.getAccessToken}>.`,
        );

        // set JWT expiration
        const { readJwtExpiration } = useJwt();
        const expiration = readJwtExpiration(data.access);
        if (expiration) {
          this.setJwtExpiration(expiration);
          this.$log?.debug(
            `Current time <${timestampToDatetimeString(Date.now() / 1000)}>.`,
          );
          this.$log?.debug(
            `Login store saved newly obtained access token expiration time <${this.getJwtExpiration ? timestampToDatetimeString(this.getJwtExpiration) : null}>.`,
          );
        }

        // token refresh (if no page reload before expiration)
        this.scheduleTokenRefresh();
      }

      return data;
    },
    /**
     * Calculates the time until JWT expiration.
     * Action is used instead of getter to provide reactive value in tests.
     * @returns {number | null} - Time in seconds until expiration or null.
     */
    getTimeUntilExpiration(): number | null {
      const currentTime = Math.floor(Date.now() / 1000); // seconds
      const timeUntilExpiration = this.getJwtExpiration
        ? this.getJwtExpiration - currentTime
        : null;
      this.$log?.debug(
        `Time until access token expirated in <${timeUntilExpiration ? Math.floor(timeUntilExpiration / 60) : null}> minutes.`,
      );
      return timeUntilExpiration;
    },
    /**
     * Checks if the JWT is expired.
     * Action is used instead of getter to provide reactive value in tests.
     * @returns {boolean} True if expired, else false.
     */
    isJwtExpired(): boolean {
      const expiration = this.jwtExpiration;
      const currentTimeSeconds = Math.floor(Date.now() / 1000); // seconds
      this.$log?.debug(
        `Is access token expired <${!expiration || currentTimeSeconds > expiration}>.`,
      );
      this.$log?.debug(
        `Current date time <${timestampToDatetimeString(currentTimeSeconds)}, JWT expiration date time <${expiration ? timestampToDatetimeString(expiration) : null}>.`,
      );
      return !expiration || currentTimeSeconds > expiration;
    },
  },

  persist: {
    pick: ['user', 'refreshToken', 'jwtExpiration'],
  },
});

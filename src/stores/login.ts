// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { Router } from 'vue-router';
import { CallbackTypes } from 'vue3-google-login';

// composables
import { i18n } from '../boot/i18n';
import { useApi } from '../composables/useApi';
import { useJwt } from '../composables/useJwt';
import { timestampToDatetimeString } from 'src/utils';
import { setAccessRefreshTokens } from '../utils/set_access_refresh_tokens';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { routesConf } from '../router/routes_conf';

// stores
import { useRegisterStore } from './register';

// types
import type { Logger } from '../components/types/Logger';
import type { UserLogin } from '../components/types/User';
import type { LoginResponse } from 'src/components/types/Login';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

interface LoginPayload {
  username: string;
  password: string;
}

interface RefreshTokenResponse {
  access: string;
  access_expiration: string;
}

interface PasswordResetResponse {
  detail: string;
}

export const emptyUser: UserLogin = {
  email: '',
  first_name: '',
  last_name: '',
  pk: 0,
  username: '',
};

export enum LoginFormState {
  login = 'login',
  passwordReset = 'password-reset',
  resetFinished = 'reset-finished',
}

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
    loginFormState: LoginFormState.login,
    passwordResetEmail: '',
  }),

  getters: {
    getUser: (state): UserLogin => state.user,
    getAccessToken: (state): string => state.accessToken,
    getRefreshToken: (state): string => state.refreshToken,
    getJwtExpiration: (state): number | null => state.jwtExpiration,
    getLoginFormState: (state): LoginFormState => state.loginFormState,
    getPasswordResetEmail: (state): string => state.passwordResetEmail,
    getRefreshTokenTimeout: (state): NodeJS.Timeout | null =>
      state.refreshTokenTimeout,
    getUserEmail: (state): string => state.user.email,
    isUserLoggedIn: (state): boolean => (state.user.email ? true : false),
  },

  actions: {
    setUser(user: UserLogin): void {
      this.user = user;
    },
    setAccessToken(token: string): void {
      this.accessToken = token;
    },
    setRefreshToken(token: string): void {
      this.refreshToken = token;
    },
    setJwtExpiration(expiration: number | null): void {
      this.jwtExpiration = expiration;
    },
    setLoginFormState(state: LoginFormState): void {
      this.loginFormState = state;
    },
    setPasswordResetEmail(email: string): void {
      this.passwordResetEmail = email;
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

        await this.redirectHomeAfterLogin();
      }

      return data;
    },
    /**
     * Set user after login
     */
    setUserAfterLogin(data: LoginResponse): void {
      if (data && data.user) {
        this.$log?.info('Save user data into login store.');
        this.setUser(data.user);
        this.$log?.debug(
          `Login store saved user data <${JSON.stringify(this.getUser, null, 2)}>.`,
        );
      }
    },
    /**
     * Redirect home after login
     * First waits for the email verification check.
     * Then redirects to home page.
     * (Possible redirection is handled by router guards.)
     */
    async redirectHomeAfterLogin(): Promise<void> {
      const registerStore = useRegisterStore();
      /*
       * Check if user email address is verified before login,
       * prevent to show confirming your email page.
       */
      await registerStore.checkEmailVerification().then(() => {
        this.$log?.debug(
          `Login was successfull, redirect to <${routesConf['home']['path']}> URL.`,
        );
        // redirect to home page
        if (this.$router) {
          this.$router.push(routesConf['home']['path']);
        }
      });
    },
    /**
     * Logout user
     * Sets the access token, refresh token and user to empty values.
     */
    logout(): void {
      this.$log?.debug(`Logout user <${this.getUser.email}>.`);
      this.setAccessToken('');
      this.setRefreshToken('');
      this.setJwtExpiration(null);
      this.setUser(emptyUser);
      this.clearRefreshTokenTimeout();
      this.$log?.debug(`Login store access token <${this.getAccessToken}>.`);
      this.$log?.debug(`Login store refresh token <${this.getRefreshToken}>.`);
      this.$log?.debug(
        `Login store JWT expiration <${this.getJwtExpiration}>.`,
      );
      this.$log?.debug(
        `Login store user <${JSON.stringify(this.getUser, null, 2)}>.`,
      );
      this.$log?.debug(
        `Login store refresh token timeout <${this.getRefreshTokenTimeout}>.`,
      );
      // redirect to login page
      if (this.$router) {
        this.$log?.debug(
          `Logout was successfull, redirect to <${routesConf['login']['path']}> URL.`,
        );
        this.$router.push(routesConf['login']['path']);
      }
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
        this.$log?.debug(`No refresh token <${this.refreshToken}>.`);
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
    /**
     * Reset password
     * Sends a request to reset the password using the email.
     * @param {string} email - Email
     * @return {Promise<void>}
     */
    async resetPassword(email: string): Promise<PasswordResetResponse | null> {
      const payload = { email };
      this.$log?.debug(`Reset password email <${payload.email}>.`);
      const { data } = await apiFetch<PasswordResetResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiResetPassword,
        method: 'post',
        payload,
        showSuccessMessage: false,
        translationKey: 'resetPassword',
        logger: this.$log,
      });

      if (data) {
        this.$log?.debug(`Reset password response <${data.detail}>.`);
        // set password reset email
        this.$log?.debug(`Set password reset email to <${payload.email}>.`);
        this.setPasswordResetEmail(payload.email);
        this.$log?.debug(
          `Login store password reset email <${this.getPasswordResetEmail}>.`,
        );
        // set login form state
        this.$log?.debug(
          `Set login form state to <${LoginFormState.resetFinished}>.`,
        );
        this.setLoginFormState(LoginFormState.resetFinished);
        this.$log?.debug(
          `Login store login form state <${this.getLoginFormState}>.`,
        );
      }

      return data;
    },
    async authenticateWithGoogle(response: CallbackTypes.CodePopupResponse) {
      this.$log?.debug(`Authenticate with Google code <${response.code}>.`);
      const payload = {
        access_token: '',
        code: response.code,
        id_token: '',
      };
      const { data } = await apiFetch<LoginResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiLoginGoogle,
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
        this.$log?.info('Successfully authenticated with Google');
        // set tokens
        setAccessRefreshTokens({
          access: data.access,
          refresh: data.refresh,
          loginStore: this,
          $log: this.$log as Logger,
        });

        await this.redirectHomeAfterLogin();
      }

      return data;
    },
  },

  persist: {
    pick: ['user', 'refreshToken', 'jwtExpiration'],
  },
});

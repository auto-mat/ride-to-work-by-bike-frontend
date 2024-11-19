// libraries
import { defineStore } from 'pinia';
import { Router } from 'vue-router';

// composables
import { useApi } from 'src/composables/useApi';
import { setAccessRefreshTokens } from '../utils/set_access_refresh_tokens';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { routesConf } from '../router/routes_conf';

// stores
import { useLoginStore } from './login';

// types
import type { Logger } from '../components/types/Logger';
import type { LoginResponse as RegisterResponse } from '../components/types/Login';
import type { RegisterCoordinatorRequest } from '../components/types/Register';

// utils
import { requestDefaultHeader, requestTokenHeader } from 'src/utils';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

interface HasVerifiedEmailResponse {
  has_user_verified_email_address: boolean;
}

export const useRegisterStore = defineStore('register', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isEmailVerified: false,
    // TODO: Get this state from the API
    isRegistrationComplete: false,
  }),

  getters: {
    getIsEmailVerified: (state): boolean => state.isEmailVerified,
    getIsRegistrationComplete: (state): boolean => state.isRegistrationComplete,
  },

  actions: {
    setIsEmailVerified(awaiting: boolean): void {
      this.isEmailVerified = awaiting;
    },
    setIsRegistrationComplete(isComplete: boolean): void {
      this.isRegistrationComplete = isComplete;
    },
    /**
     * Register user
     * Sends the registration request to the API.
     * If successful:
     *   - sets auth tokens from the response
     *   - stores user email in register store
     *   - sets isEmailVerified flag to false
     *   - redirects to email verification page
     * If not successful, returns response data.
     * @param {string} email - Email address
     * @param {string} password - Password
     * @return {Promise<RegisterResponse | null>} - Register response or null
     */
    async register(
      email: string,
      password: string,
    ): Promise<RegisterResponse | null> {
      const { apiFetch } = useApi();
      this.$log?.debug(`Register email <${email}>.`);
      this.$log?.debug(`Register password <${password}>.`);
      // register
      this.$log?.info('Post API registration details.');
      const { data } = await apiFetch<RegisterResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiRegister,
        method: 'post',
        payload: {
          email: email,
          password1: password,
          password2: password,
        },
        translationKey: 'register',
        logger: this.$log,
      });

      if (data?.user?.email) {
        // set isEmailVerified in store
        this.$log?.info('Setting isEmailVerified state.');
        this.setIsEmailVerified(false);
        this.$log?.debug(
          `Register store set isEmailVerified to <${this.getIsEmailVerified}>.`,
        );

        // redirect to confirm email page
        if (this.$router) {
          this.$log?.debug(
            `Registration was succcesfull, redirect to <${routesConf['verify_email']['path']}> URL.`,
          );
          this.$router.push(routesConf['verify_email']['path']);
        }
      }

      // set user and tokens
      if (data && data.access && data.refresh) {
        const loginStore = useLoginStore();
        this.$log?.info('Save user data into login store.');
        loginStore.setUser(data.user);
        this.$log?.debug(
          `Login store saved user data <${JSON.stringify(loginStore.getUser, null, 2)}>.`,
        );
        setAccessRefreshTokens({
          access: data.access,
          refresh: data.refresh,
          loginStore,
          $log: this.$log as Logger,
        });
      }

      return data;
    },
    /**
     * Check email verification
     * Sends the email verification check request to the API.
     * If successful, sets isEmailVerified flag to the value from the response.
     * @returns {Promise<void>}
     */
    async checkEmailVerification(): Promise<void> {
      const { apiFetch } = useApi();
      const loginStore = useLoginStore();
      this.$log?.debug(
        `Checking email verification for <${loginStore.getUserEmail}>.`,
      );
      // Append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // check email verification
      const { data } = await apiFetch<HasVerifiedEmailResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiHasUserVerifiedEmail,
        method: 'get',
        translationKey: 'checkEmailVerification',
        showSuccessMessage: false,
        headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
        logger: this.$log,
      });

      // type check data
      if (data && typeof data?.has_user_verified_email_address === 'boolean') {
        this.$log?.info('Email verification check successful.');
        this.setIsEmailVerified(data.has_user_verified_email_address);
        this.$log?.debug(
          `Email verified status set to <${this.isEmailVerified}>.`,
        );
      } else {
        this.$log?.warn('Email verification check failed or returned no data.');
      }
    },
    /**
     * Register coordinator
     * Sends the coordinator registration request to the API.
     * This is done AFTER the user is registered.
     * If successful:
     *   - sets isRegistrationComplete flag to true
     *   - redirects to home page
     * If not successful, returns response data.
     * @param {RegisterCoordinatorRequest} payload - Register coordinator request payload
     * @returns {Promise<RegisterResponse | null>} - Register coordinator response or null
     */
    async registerCoordinator(
      payload: RegisterCoordinatorRequest,
    ): Promise<void> {
      const { apiFetch } = useApi();
      this.$log?.debug(
        `Register coordinator payload <${JSON.stringify(payload, null, 2)}>.`,
      );
      // register
      this.$log?.info('Post API coordinator registration details.');
      const { success } = await apiFetch<null>({
        endpoint: rideToWorkByBikeConfig.urlApiRegisterCoordinator,
        method: 'post',
        payload,
        translationKey: 'registerCoordinator',
        logger: this.$log,
      });

      if (success) {
        this.$log?.info('Coordinator registration successful.');
        // set isRegistrationComplete in store
        this.$log?.debug(
          `Register store setting isRegistrationComplete to <${true}>.`,
        );
        this.setIsRegistrationComplete(true);
        this.$log?.debug(
          `Register store isRegistrationComplete set to <${this.getIsRegistrationComplete}>.`,
        );

        // redirect to home page
        if (this.$router) {
          this.$log?.debug(
            `Coordinator registration succcesfull, redirect to <${routesConf['home']['path']}> URL.`,
          );
          this.$router.push(routesConf['home']['path']);
        }
      }
    },
  },

  persist: {
    pick: ['isEmailVerified'],
  },
});

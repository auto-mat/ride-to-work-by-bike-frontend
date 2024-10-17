// libraries
import { defineStore } from 'pinia';
import { Router } from 'vue-router';

// composables
import { useApi } from 'src/composables/useApi';
import { setAccessRefreshTokens } from '../utils/set_access_refresh_tokens';

// stores
import { useLoginStore } from './login';

// utils
import { requestDefaultHeader, requestTokenHeader } from 'src/utils';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { routesConf } from '../router/routes_conf';

// types
import type { Logger } from '../components/types/Logger';
import type { LoginResponse as RegisterResponse } from 'src/components/types/Login';

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
    email: '',
    isEmailVerified: false,
  }),

  getters: {
    getEmail: (state): string => state.email,
    getIsEmailVerified: (state): boolean => state.isEmailVerified,
  },

  actions: {
    setEmail(email: string): void {
      this.email = email;
    },
    setIsEmailVerified(awaiting: boolean): void {
      this.isEmailVerified = awaiting;
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
        // set email in store
        this.$log?.info('Registration successful. Saving email to store.');
        this.setEmail(data.user.email);
        this.$log?.debug(`Register store saved email <${this.getEmail}>.`);
        // set isEmailVerified in store
        this.$log?.info('Setting isEmailVerified flag.');
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
      this.$log?.debug(`Checking email verification for <${this.email}>.`);
      const loginStore = useLoginStore();
      // Append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // check email verification
      const { data } = await apiFetch<HasVerifiedEmailResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiHasUserVerifiedEmail,
        method: 'get',
        translationKey: 'checkEmailVerification',
        showSuccessMessage: false,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
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
  },

  persist: {
    pick: ['email', 'isEmailVerified'],
  },
});

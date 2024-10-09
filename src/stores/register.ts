// libraries
import { defineStore } from 'pinia';
import { Router } from 'vue-router';

// composables
import { useApi } from 'src/composables/useApi';
import { useJwt } from '../composables/useJwt';

// stores
import { useLoginStore } from './login';

// utils
import {
  requestDefaultHeader,
  requestTokenHeader,
  timestampToDatetimeString,
} from 'src/utils';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { routesConf } from '../router/routes_conf';

// types
import type { Logger } from '../components/types/Logger';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

interface RegisterResponse {
  access: string;
  refresh: string;
  user: {
    email: string;
  };
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

      // set tokens
      if (data && data.access && data.refresh) {
        const loginStore = useLoginStore();
        this.$log?.info('Save access and refresh token into store.');
        loginStore.setAccessToken(data.access);
        loginStore.setRefreshToken(data.refresh);
        this.$log?.debug(
          `Login store saved access token <${loginStore.getAccessToken}>.`,
        );
        this.$log?.debug(
          `Login store saved refresh token <${loginStore.getRefreshToken}>.`,
        );

        // set JWT expiration
        const { readJwtExpiration } = useJwt();
        const expiration = readJwtExpiration(data.access);
        this.$log?.debug(
          `Current time <${timestampToDatetimeString(Date.now() / 1000)}>.`,
        );
        this.$log?.debug(
          `Access token expiration time <${expiration ? timestampToDatetimeString(expiration) : null}>.`,
        );
        if (expiration) {
          loginStore.setJwtExpiration(expiration);
          this.$log?.debug(
            `Login store saved access token expiration time <${loginStore.getJwtExpiration ? timestampToDatetimeString(loginStore.getJwtExpiration) : null}>.`,
          );
        }

        // token refresh (if no page reload before expiration)
        loginStore.scheduleTokenRefresh();
      }

      return data;
    },

    async checkEmailVerification(): Promise<void> {
      const { apiFetch } = useApi();
      this.$log?.debug(`Checking email verification for <${this.email}>.`);
      const loginStore = useLoginStore();
      // Append access token into HTTP header
      requestTokenHeader.Authorization += loginStore.getAccessToken;
      // check email verification
      const { data } = await apiFetch<HasVerifiedEmailResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiHasUserVerifiedEmail,
        method: 'get',
        translationKey: 'checkEmailVerification',
        showSuccessMessage: false,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader),
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

// libraries
import { defineStore } from 'pinia';
import { Router } from 'vue-router';

// composables
import { useApi } from 'src/composables/useApi';

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
  email: string;
}

interface HasVerifiedEmailResponse {
  validated: boolean;
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
          password: password,
        },
        translationKey: 'register',
        logger: this.$log,
      });

      if (data?.email) {
        // set email in store
        this.$log?.info('Registration successful. Saving email to store.');
        this.setEmail(data.email);
        this.$log?.debug(`Register store saved email <${this.getEmail}>.`);
        // set isEmailVerified in store
        this.$log?.info('Setting isEmailVerified flag.');
        this.setIsEmailVerified(false);
        this.$log?.debug(
          `Register store set isEmailVerified to <${this.getIsEmailVerified}>.`,
        );

        // redirect to confirm email page
        if (this.$router) {
          this.$log?.info(
            `Registration was succcesfull, redirect to <${routesConf['confirm_email']['path']}> URL.`,
          );
          this.$router.push(routesConf['confirm_email']['path']);
        }
      }

      return data;
    },

    async checkEmailVerification(): Promise<void> {
      const { apiFetch } = useApi();
      this.$log?.debug(`Checking email verification for <${this.email}>.`);
      // check email verification
      const { data } = await apiFetch<HasVerifiedEmailResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiHasUserVerifiedEmail,
        method: 'post',
        payload: {
          email: this.email,
        },
        translationKey: 'checkEmailVerification',
        showSuccessMessage: false,
        logger: this.$log,
      });

      // type check data
      if (data && typeof data?.validated === 'boolean') {
        this.$log?.info('Email verification check successful.');
        this.setIsEmailVerified(data.validated);
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

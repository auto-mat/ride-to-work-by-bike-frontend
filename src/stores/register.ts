// libraries
import { Notify } from 'quasar';
import { defineStore } from 'pinia';

// composables
import { useApi } from 'src/composables/useApi';
import { i18n } from 'src/boot/i18n';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';

interface RegisterResponse {
  email: string;
}

export const useRegisterStore = defineStore('register', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    email: '',
    isAwaitingConfirmation: false,
  }),

  getters: {
    getEmail: (state): string => state.email,
    getIsAwaitingConfirmation: (state): boolean => state.isAwaitingConfirmation,
  },

  actions: {
    setEmail(email: string): void {
      this.email = email;
    },
    setAwaitingConfirmation(awaiting: boolean): void {
      this.isAwaitingConfirmation = awaiting;
    },
    async register(email: string, password: string): Promise<void> {
      const { apiFetch } = useApi();

      try {
        const response = await apiFetch<RegisterResponse>({
          endpoint: rideToWorkByBikeConfig.urlApiRegister,
          method: 'post',
          payload: {
            email: email,
            password: password,
          },
          translationKey: 'register',
          logger: this.$log,
        });

        if (response.data?.email) {
          Notify.create({
            color: 'positive',
            message: i18n.global.t('register.form.messageSuccess', {
              email: response.data.email,
            }),
          });
          // set email in store
          this.setEmail(response.data.email);
          // set awaitingConfirmation in store
          this.setAwaitingConfirmation(true);
        }
      } catch (error) {
        this.$log?.debug(JSON.stringify(error));
        Notify.create({
          color: 'negative',
          message: i18n.global.t('register.form.messageError'),
        });
      }
    },
  },

  persist: {
    pick: ['email', 'awaitingConfirmation'],
  },
});

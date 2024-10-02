// libraries
import { defineStore } from 'pinia';

// types
import type { Logger } from '../components/types/Logger';

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
  },

  persist: {
    pick: ['email', 'awaitingConfirmation'],
  },
});

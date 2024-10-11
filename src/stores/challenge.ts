// libraries
import { defineStore } from 'pinia';

// types
import type { Logger } from '../components/types/Logger';

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isChallengeActive: false,
  }),

  getters: {
    getIsChallengeActive: (state): boolean => state.isChallengeActive,
  },

  actions: {
    setIsChallengeActive(isActive: boolean): void {
      this.isChallengeActive = isActive;
    },
  },

  persist: {
    pick: ['isChallengeActive'],
  },
});

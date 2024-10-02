// libraries
import { defineStore } from 'pinia';

// types
import type { Logger } from '../components/types/Logger';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isActiveChallenge: false,
  }),

  getters: {
    getIsActiveChallenge: (state): boolean => state.isActiveChallenge,
  },

  actions: {
    setIsActiveChallenge(isActive: boolean): void {
      this.isActiveChallenge = isActive;
    },
  },

  persist: {
    pick: ['isActiveChallenge'],
  },
});

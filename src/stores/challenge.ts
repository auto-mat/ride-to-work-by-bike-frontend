// libraries
import { defineStore } from 'pinia';

// enums
export enum ChallengeStatus {
  before = 'before',
  during = 'during',
  after = 'after',
}

// types
import type { Logger } from '../components/types/Logger';

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isChallengeActive: false,
    challengeStatus: ChallengeStatus.before,
  }),

  getters: {
    getIsChallengeActive: (state): boolean => state.isChallengeActive,
    getChallengeStatus: (state): ChallengeStatus => state.challengeStatus,
  },

  actions: {
    setIsChallengeActive(isActive: boolean): void {
      this.isChallengeActive = isActive;
    },
    setChallengeStatus(status: ChallengeStatus): void {
      this.challengeStatus = status;
    },
  },

  persist: {
    pick: ['isChallengeActive'],
  },
});

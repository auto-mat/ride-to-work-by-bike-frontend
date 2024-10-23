// libraries
import { defineStore } from 'pinia';
import { PhaseType } from '../components/types/Challenge';

// enums
export enum ChallengeStatus {
  before = 'before',
  during = 'during',
  after = 'after',
}

// fixtures
import thisCampaignFixture from '../../test/cypress/fixtures/thisCampaign.json';

// types
import type { Logger } from '../components/types/Logger';
import type { Phase } from '../components/types/Challenge';

const phaseSet = thisCampaignFixture.results[0].phase_set as Phase[] | null;

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    isChallengeActive: true,
    /**
     * Phase set for the current campaign
     * Phase object with id `registration` marks the ability to register.
     * Phase object with id `competition` marks the duration of the challenge.
     * Phase object with id `entry_enabled` marks the ability to log routes.
     * Phase object with id `payment` marks the ability to pay.
     * Phase object with id `invoices` marks the ability to see invoices.
     */
    phaseSet: phaseSet ? phaseSet : [],
  }),

  getters: {
    getChallengeStatus: (): ChallengeStatus => {
      const thisStore = useChallengeStore();
      if (thisStore.getIsChallengeInActivePhase) {
        return ChallengeStatus.during;
      } else if (thisStore.getIsChallengeInRegistrationPhase) {
        return ChallengeStatus.before;
      }
      return ChallengeStatus.after;
    },
    /**
     * Gets active challenge status
     * Status is based on phase_set array variable.
     * @returns {boolean}
     */
    getIsChallengeInActivePhase: (store): boolean => {
      const competitionPhase = store.phaseSet.find(
        (phase: Phase) => phase.phase_type === PhaseType.competition,
      );
      if (competitionPhase) {
        const startDate: number = new Date(
          competitionPhase.date_from,
        ).getTime();
        const endDate: number = new Date(competitionPhase.date_to).getTime();
        store.$log?.debug(`Competition phase date from: ${startDate}`);
        store.$log?.debug(`Competition phase date to: ${endDate}`);
        const date = new Date();
        const now: number = date.getTime();
        store.$log?.debug(`Competition phase now date: ${now}`);
        return now >= startDate && now <= endDate;
      }
      store.$log?.debug('No competition phase found.');
      return false;
    },
    getIsChallengeInRegistrationPhase: (store): boolean => {
      const registrationPhase = store.phaseSet.find(
        (phase: Phase) => phase.phase_type === PhaseType.registration,
      );
      if (registrationPhase) {
        const startDate: number = new Date(
          registrationPhase.date_from,
        ).getTime();
        const endDate: number = new Date(registrationPhase.date_to).getTime();
        store.$log?.debug(`Registration phase date from: ${startDate}`);
        store.$log?.debug(`Registration phase date to: ${endDate}`);
        const date = new Date();
        const now: number = date.getTime();
        return now >= startDate && now <= endDate;
      }
      store.$log?.debug('No before phase found.');
      return false;
    },
  },

  actions: {},

  persist: {
    pick: ['phaseSet'],
  },
});

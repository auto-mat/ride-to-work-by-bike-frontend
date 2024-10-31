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
    /**
     * Returns the status of the current challenge
     * This determines the stage the challenge is in.
     * @see {ChallengeStatus} enum for possible values.
     * @returns {ChallengeStatus}
     */
    getChallengeStatus: (): ChallengeStatus => {
      const thisStore = useChallengeStore();
      if (thisStore.getIsChallengeInPhase(PhaseType.competition)) {
        return ChallengeStatus.during;
      } else if (thisStore.getIsChallengeInPhase(PhaseType.registration)) {
        return ChallengeStatus.before;
      }
      return ChallengeStatus.after;
    },
  },

  actions: {
    /**
     * Checks if challenge is in a given phase
     * Returns true if now is within the phase dates
     * Returns false if now is not within the phase dates
     * or if the phase is not found in the phase set
     * @param {PhaseType} phaseType - Phase type to check
     * @returns {boolean}
     */
    getIsChallengeInPhase(phaseType: PhaseType): boolean {
      this.$log?.debug(`Checking if challenge is in <${phaseType}> phase.`);
      const phase = this.phaseSet.find(
        (phase: Phase) => phase.phase_type === phaseType,
      );
      if (phase) {
        const startDate: number = new Date(phase.date_from).getTime();
        const endDate: number = new Date(phase.date_to).getTime();
        this.$log?.debug(`<${phaseType}> phase date from <${startDate}>`);
        this.$log?.debug(`<${phaseType}> phase date to <${endDate}>`);
        const now: number = new Date().getTime();
        this.$log?.debug(`Now date <${now}>`);
        return now >= startDate && now <= endDate;
      }
      this.$log?.info(`No <${phaseType}> phase found.`);
      return false;
    },
  },

  persist: {
    pick: ['phaseSet'],
  },
});

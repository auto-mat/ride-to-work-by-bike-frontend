// libraries
import { defineStore } from 'pinia';

// adapters
import { companyChallengeAdapter } from '../adapters/companyChallengeAdapter';

// composables
import { useApiGetCompetition } from '../composables/useApiGetCompetition';
import { useApiPostCompetition } from '../composables/useApiPostCompetition';

// enums
import { CompetitionType, CompetitorType } from '../components/enums/Challenge';

// stores
import { useTripsStore } from './trips';

// types
import type { Logger } from '../components/types/Logger';
import type { Competition } from '../components/types/Competition';
import type { TransportType } from '../components/types/Route';

// utils
import { deepObjectWithSimplePropsCopy } from '../utils';

interface CompanyChallengeFormState {
  challengeType: CompetitionType;
  challengeParticipants: CompetitorType;
  challengeTransportType: TransportType[];
  challengeTitle: string;
  challengeDescription: string;
  challengeInfoUrl: string;
  challengeStart: string;
  challengeStop: string;
}

const emptyCompanyChallengeForm: CompanyChallengeFormState = {
  challengeType: CompetitionType.frequency,
  challengeParticipants: CompetitorType.singleUser,
  challengeTransportType: [],
  challengeTitle: '',
  challengeDescription: '',
  challengeInfoUrl: '',
  challengeStart: '',
  challengeStop: '',
};

interface AdminCompetitionState {
  $log: Logger | null;
  competitions: Competition[];
  isLoadingCompetition: boolean;
  companyChallengeForm: CompanyChallengeFormState;
}

export const useAdminCompetitionStore = defineStore('adminCompetition', {
  state: (): AdminCompetitionState => ({
    $log: null,
    competitions: [],
    isLoadingCompetition: false,
    companyChallengeForm: deepObjectWithSimplePropsCopy(
      emptyCompanyChallengeForm,
    ),
  }),

  getters: {
    getCompetitions: (state) => state.competitions,
    getIsLoadingCompetition: (state) => state.isLoadingCompetition,
    getCompanyChallengeForm: (state) => state.companyChallengeForm,
  },

  actions: {
    setCompetitions(competitions: Competition[]): void {
      this.competitions = competitions;
    },
    /**
     * Load competitions from API
     * @returns {Promise<void>}
     */
    async loadCompetitions(): Promise<void> {
      const { competitions, loadCompetition } = useApiGetCompetition(this.$log);
      this.isLoadingCompetition = true;
      await loadCompetition();
      this.setCompetitions(competitions.value);
      this.$log?.debug(
        `Competitions loaded <${JSON.stringify(this.competitions, null, 2)}>.`,
      );
      this.isLoadingCompetition = false;
    },
    /**
     * Reset company challenge form to initial state with eco transport types
     * @returns {Promise<void>}
     */
    async resetCompanyChallengeForm(): Promise<void> {
      const tripsStore = useTripsStore();

      // Ensure commute modes are loaded
      if (!tripsStore.getCommuteModes.length) {
        await tripsStore.loadCommuteModes();
      }

      // Reset form with deep copy
      this.companyChallengeForm = deepObjectWithSimplePropsCopy(
        emptyCompanyChallengeForm,
      );

      // Set eco-friendly transport types as default
      this.companyChallengeForm.challengeTransportType =
        tripsStore.getEcoCommuteModes.map((mode) => mode.slug);
    },
    /**
     * Create a new company challenge
     * @returns {Promise<boolean>} - Success status
     */
    async createCompanyChallenge(): Promise<boolean> {
      const { createCompetition } = useApiPostCompetition(this.$log);

      // Convert form state to API payload using adapter
      const payload = companyChallengeAdapter.toApiPayload(
        this.companyChallengeForm,
      );

      const result = await createCompetition(payload);

      if (result) {
        // Refresh competitions list
        await this.loadCompetitions();
        return true;
      }

      return false;
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.competitions = [];
      this.isLoadingCompetition = false;
      this.companyChallengeForm = deepObjectWithSimplePropsCopy(
        emptyCompanyChallengeForm,
      );
    },
  },

  persist: {
    omit: ['isLoadingCompetition'],
  },
});

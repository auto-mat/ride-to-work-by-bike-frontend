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
import type {
  Competition,
  CompanyChallengeFormState,
} from '../components/types/Competition';

// utils
import { deepObjectWithSimplePropsCopy } from '../utils';

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
    getChallengeType: (state) => state.companyChallengeForm.challengeType,
    getChallengeParticipants: (state) =>
      state.companyChallengeForm.challengeParticipants,
    getChallengeTransportType: (state) =>
      state.companyChallengeForm.challengeTransportType,
    getChallengeTitle: (state) => state.companyChallengeForm.challengeTitle,
    getChallengeDescription: (state) =>
      state.companyChallengeForm.challengeDescription,
    getChallengeInfoUrl: (state) => state.companyChallengeForm.challengeInfoUrl,
    getChallengeStart: (state) => state.companyChallengeForm.challengeStart,
    getChallengeStop: (state) => state.companyChallengeForm.challengeStop,
  },

  actions: {
    setCompetitions(competitions: Competition[]): void {
      this.competitions = competitions;
    },
    /**
     * Setter for company challenge form fields
     * @param {K} field - Field name to update
     * @param {CompanyChallengeFormState[K]} value - New value for the field
     * @returns {void}
     */
    setCompanyChallengeFormField<K extends keyof CompanyChallengeFormState>(
      field: K,
      value: CompanyChallengeFormState[K],
    ): void {
      this.companyChallengeForm[field] = value;
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
      // reset company challenge form state
      this.companyChallengeForm = deepObjectWithSimplePropsCopy(
        emptyCompanyChallengeForm,
      );
      // set eco-friendly transport types as default
      const tripsStore = useTripsStore();
      if (!tripsStore.getCommuteModes.length) {
        await tripsStore.loadCommuteModes();
      }
      this.companyChallengeForm.challengeTransportType =
        tripsStore.getEcoCommuteModes.map((mode) => mode.slug);
    },
    /**
     * Create a new company challenge
     * @returns {Promise<boolean>} - Success status
     */
    async createCompanyChallenge(): Promise<boolean> {
      const { createCompetition } = useApiPostCompetition(this.$log);
      // prepare payload
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

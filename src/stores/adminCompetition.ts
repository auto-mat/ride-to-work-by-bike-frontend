// libraries
import { defineStore } from 'pinia';

// adapters
import { companyChallengeAdapter } from '../adapters/companyChallengeAdapter';

// composables
import { useApiGetCompetition } from '../composables/useApiGetCompetition';
import { useApiPostCompetition } from '../composables/useApiPostCompetition';
import { useApiPutCompetition } from '../composables/useApiPutCompetition';

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
  isEditMode: boolean;
  editingCompetitionId: number | null;
}

export const useAdminCompetitionStore = defineStore('adminCompetition', {
  state: (): AdminCompetitionState => ({
    $log: null,
    competitions: [],
    isLoadingCompetition: false,
    companyChallengeForm: deepObjectWithSimplePropsCopy(
      emptyCompanyChallengeForm,
    ),
    isEditMode: false,
    editingCompetitionId: null,
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
    getIsEditMode: (state) => state.isEditMode,
    getEditingCompetitionId: (state) => state.editingCompetitionId,
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
      // reset edit mode together with form
      this.isEditMode = false;
      this.editingCompetitionId = null;
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
     * Load competition data into form for editing
     * @param {number} competitionId - ID of competition to edit
     * @returns {void}
     */
    loadCompetitionForEdit(competitionId: number): void {
      const editedCompetition = this.competitions.find(
        (competition) => competition.id === competitionId,
      );
      if (!editedCompetition) {
        this.$log?.error(`Competition with ID <${competitionId}> not found.`);
        return;
      }
      // set edit mode
      this.isEditMode = true;
      this.editingCompetitionId = competitionId;
      // transform competition data to form
      this.companyChallengeForm =
        companyChallengeAdapter.fromApiResponse(editedCompetition);
      this.$log?.debug(
        'Competition <${competitionId}> loaded for editing.' +
          ` Form state <${JSON.stringify(this.companyChallengeForm, null, 2)}>.`,
      );
    },
    /**
     * Update an existing company challenge
     * @returns {Promise<boolean>} - Success status
     */
    async updateCompanyChallenge(): Promise<boolean> {
      if (!this.editingCompetitionId) {
        this.$log?.error('No competition ID set for editing.');
        return false;
      }
      const { updateCompetition } = useApiPutCompetition(this.$log);
      // prepare payload
      const payload = companyChallengeAdapter.toApiPayload(
        this.companyChallengeForm,
      );
      const result = await updateCompetition(
        this.editingCompetitionId,
        payload,
      );
      if (result) {
        // refresh competitions
        await this.loadCompetitions();
        // reset edit mode
        this.isEditMode = false;
        this.editingCompetitionId = null;
        return true;
      }
      return false;
    },
    /**
     * Submit company challenge
     * Handles form submit depending on create/edit mode
     * @returns {Promise<boolean>} - Success status
     */
    async submitCompanyChallenge(): Promise<boolean> {
      if (this.isEditMode) {
        return await this.updateCompanyChallenge();
      } else {
        return await this.createCompanyChallenge();
      }
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.competitions = [];
      this.isLoadingCompetition = false;
      this.isEditMode = false;
      this.editingCompetitionId = null;
      this.companyChallengeForm = deepObjectWithSimplePropsCopy(
        emptyCompanyChallengeForm,
      );
    },
  },

  persist: {
    omit: ['isLoadingCompetition', 'isEditMode', 'editingCompetitionId'],
  },
});

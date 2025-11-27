// libraries
import { date } from 'quasar';

// stores
import { useTripsStore } from '../stores/trips';

// types
import type { PostCompetitionPayload } from '../components/types/ApiCompetition';
import type {
  CompetitionType,
  CompetitorType,
} from '../components/enums/Challenge';
import type { TransportType } from '../components/types/Route';

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

/**
 * Adapter for converting between form state and API payload for company challenge
 */
export const companyChallengeAdapter = {
  /**
   * Convert date from DD. MM. YYYY format to YYYY-MM-DD format
   * @param {string} dateStr - Date in DD. MM. YYYY format (from QDate mask)
   * @returns {string} - Date in YYYY-MM-DD format for API
   */
  convertDateToApiFormat(dateStr: string): string {
    if (!dateStr) return '';

    // Parse the date string using Quasar date utils
    const dateObj = date.extractDate(dateStr, 'DD. MM. YYYY');

    // Format to API format
    return date.formatDate(dateObj, 'YYYY-MM-DD');
  },

  /**
   * Convert transport type slugs to numeric IDs
   * @param {TransportType[]} transportTypes - Array of transport type slugs
   * @returns {number[]} - Array of numeric commute mode IDs
   */
  convertTransportTypesToIds(transportTypes: TransportType[]): number[] {
    const tripsStore = useTripsStore();

    return transportTypes
      .map((slug) => {
        const mode = tripsStore.getCommuteModeBySlug(slug);
        return mode?.id;
      })
      .filter((id): id is number => id !== undefined);
  },

  /**
   * Convert form state to API payload format
   * @param {CompanyChallengeFormState} formState - Form state from store
   * @returns {PostCompetitionPayload} - API-compatible payload
   */
  toApiPayload(formState: CompanyChallengeFormState): PostCompetitionPayload {
    const payload: PostCompetitionPayload = {
      name: formState.challengeTitle,
      competition_type: formState.challengeType,
      competitor_type: formState.challengeParticipants,
      commute_modes: this.convertTransportTypesToIds(
        formState.challengeTransportType,
      ),
      date_from: this.convertDateToApiFormat(formState.challengeStart),
      date_to: this.convertDateToApiFormat(formState.challengeStop),
    };

    // Add optional fields only if filled
    if (formState.challengeInfoUrl) {
      payload.url = formState.challengeInfoUrl;
    }

    if (formState.challengeDescription) {
      payload.description = formState.challengeDescription;
    }

    return payload;
  },
};

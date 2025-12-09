// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'boot/i18n';

// stores
import { useTripsStore } from '../stores/trips';

// types
import type { PostCompetitionPayload } from '../components/types/ApiCompetition';
import type {
  Competition,
  CompanyChallengeFormState,
  CommuteMode,
} from '../components/types/Competition';
import type { TransportType } from '../components/types/Route';

/**
 * Adapter for converting between form state and API payload for company challenge
 */
export const companyChallengeAdapter = {
  /**
   * Convert date from masked format to YYYY-MM-DD format
   * @param {string} dateStr - Date in localized masked format
   * @returns {string} - Date in YYYY-MM-DD format for API
   */
  convertDateToApiFormat(dateStr: string): string {
    if (!dateStr) return '';
    // parse localized date
    const localizedDateFormatMaskQDate = i18n.global
      .d(new Date(2025, 11, 29), 'numeric')
      .replace('2025', 'YYYY')
      .replace('12', 'MM')
      .replace('29', 'DD');
    const dateObj = date.extractDate(dateStr, localizedDateFormatMaskQDate);
    // format date
    return date.formatDate(dateObj, 'YYYY-MM-DD');
  },

  /**
   * Convert date from API format (YYYY-MM-DD) to localized masked format
   * @param {string} dateStr - Date in YYYY-MM-DD format from API
   * @returns {string} - Date in localized masked format for form
   */
  convertDateFromApiFormat(dateStr: string): string {
    if (!dateStr) return '';
    // parse API date format (YYYY-MM-DD)
    const dateObj = date.extractDate(dateStr, 'YYYY-MM-DD');
    // get localized date format
    const localizedDateFormatMaskQDate = i18n.global
      .d(new Date(2025, 11, 29), 'numeric')
      .replace('2025', 'YYYY')
      .replace('12', 'MM')
      .replace('29', 'DD');
    // format date
    return date.formatDate(dateObj, localizedDateFormatMaskQDate);
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
   * Convert commute mode objects to transport type slugs
   * @param {CommuteMode[]} commuteModes - Array of commute mode objects from API
   * @returns {TransportType[]} - Array of transport type slugs
   */
  convertCommuteModeIdsToSlugs(commuteModes: CommuteMode[]): TransportType[] {
    return commuteModes.map((mode) => mode.slug);
  },

  /**
   * Convert form state to API payload format
   * @param {CompanyChallengeFormState} formState - Form state from store
   * @returns {PostCompetitionPayload} - API payload
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
    // optional fields
    if (formState.challengeInfoUrl) {
      payload.url = formState.challengeInfoUrl;
    }
    if (formState.challengeDescription) {
      payload.description = formState.challengeDescription;
    }
    return payload;
  },

  /**
   * Convert API Competition response to form state
   * @param {Competition} competition - Competition from API
   * @returns {CompanyChallengeFormState} - Form state for store
   */
  fromApiResponse(competition: Competition): CompanyChallengeFormState {
    return {
      challengeType: competition.competition_type,
      challengeParticipants: competition.competitor_type,
      challengeTransportType: this.convertCommuteModeIdsToSlugs(
        competition.commute_modes,
      ),
      challengeTitle: competition.name,
      challengeDescription: competition.description || '',
      challengeInfoUrl: competition.url || '',
      challengeStart: this.convertDateFromApiFormat(competition.date_from),
      challengeStop: this.convertDateFromApiFormat(competition.date_to),
    };
  },
};

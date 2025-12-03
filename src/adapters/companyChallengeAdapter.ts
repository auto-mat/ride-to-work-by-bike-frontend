// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'boot/i18n';

// stores
import { useTripsStore } from '../stores/trips';

// types
import type { PostCompetitionPayload } from '../components/types/ApiCompetition';
import type { CompanyChallengeFormState } from '../components/types/Competition';
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
};

// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import { PaymentState, PaymentSubject } from '../components/enums/Payment';
import { OrganizationType } from '../components/types/Organization';

// types
import type {
  RegisterChallengeResult,
  RegisterChallengePostPayload,
} from '../components/types/ApiRegistration';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';
import type { ToApiPayloadStoreState } from '../components/types/ApiRegistration';

/**
 * Adapter for converting between API and store registration data formats
 */
export const registerChallengeAdapter = {
  /**
   * Convert API registration data to store format
   * @param {RegisterChallengeResult} apiData - Registration data from API
   * @returns {object} Store-compatible registration data
   */
  toStoreData(apiData: RegisterChallengeResult) {
    const personalDetails: RegisterChallengePersonalDetailsForm = {
      firstName: apiData.personal_details.first_name,
      lastName: apiData.personal_details.last_name,
      nickname: apiData.personal_details.nickname,
      gender: apiData.personal_details.sex as Gender,
      newsletter: this.parseNewsletterValues(
        apiData.personal_details.newsletter,
      ),
      terms: apiData.personal_details.personal_data_opt_in,
    };

    return {
      personalDetails,
      organizationId: apiData.organization_id,
      paymentSubject: apiData.personal_details
        .payment_subject as PaymentSubject,
      paymentState: apiData.personal_details.payment_status as PaymentState,
      paymentAmount: apiData.personal_details.payment_amount,
      organizationType: apiData.organization_type as OrganizationType,
      subsidiaryId: apiData.subsidiary_id,
      teamId: apiData.team_id,
      merchId: apiData.t_shirt_size_id,
      voucher: apiData.personal_details.discount_coupon,
    };
  },

  /**
   * Convert store state to API payload format, including given properties
   * @param {object} storeState - Partial store state with properties to send
   * @returns {RegisterChallengePostPayload} API-compatible payload
   */
  toApiPayload(
    storeState: ToApiPayloadStoreState,
  ): RegisterChallengePostPayload {
    const payload: RegisterChallengePostPayload = {};

    if (storeState.personalDetails) {
      const storePersonalDetails = storeState.personalDetails;

      if (storePersonalDetails.firstName !== undefined) {
        payload.first_name = storePersonalDetails.firstName;
      }
      if (storePersonalDetails.lastName !== undefined) {
        payload.last_name = storePersonalDetails.lastName;
      }
      if (storePersonalDetails.nickname !== undefined) {
        payload.nickname = storePersonalDetails.nickname;
      }
      if (storePersonalDetails.gender !== undefined) {
        payload.sex = storePersonalDetails.gender as Gender;
      }
      if (storePersonalDetails.newsletter?.length) {
        payload.newsletter = this.combineNewsletterValues(
          storePersonalDetails.newsletter,
        );
      }
      if (storePersonalDetails.terms !== undefined) {
        payload.personal_data_opt_in = storePersonalDetails.terms;
      }
    }

    // only send payment subject and amount if it's a company or school
    if (
      storeState.paymentSubject &&
      [PaymentSubject.company, PaymentSubject.school].includes(
        storeState.paymentSubject,
      )
    ) {
      payload.payment_subject = storeState.paymentSubject;

      if (storeState.paymentAmount !== undefined) {
        payload.payment_amount = storeState.paymentAmount;
      }
    }

    if (storeState.voucher) {
      payload.discount_coupon = storeState.voucher?.name;
    }
    if (storeState.teamId !== undefined) {
      payload.team_id = storeState.teamId;
    }
    if (storeState.merchId !== undefined) {
      payload.t_shirt_size_id = storeState.merchId;
    }

    return payload;
  },

  /**
   * Parse newsletter string from API to array of NewsletterType
   * @param {string} newsletter - Newsletter string from API
   * @returns {NewsletterType[]} Array of NewsletterType
   */
  parseNewsletterValues(newsletter: string): NewsletterType[] {
    if (!newsletter) return [];
    return newsletter
      .split('-')
      .map((option) => option.trim()) as NewsletterType[];
  },

  /**
   * Convert array of newsletter types to combined API value
   * @param {NewsletterType[]} newsletters - Array of newsletter types
   * @returns {string} Combined newsletter string value
   */
  combineNewsletterValues(newsletters: NewsletterType[]): string {
    if (!newsletters?.length) return '';
    // sort newsletter types (challenge, event, mobility)
    const sorted = [...newsletters].sort();
    // use switch statement to handle different lengths
    switch (sorted.length) {
      case 1:
        return sorted[0];
      case 2:
        return `${sorted[0]}-${sorted[1]}`;
      case 3:
        return `${sorted[0]}-${sorted[1]}-${sorted[2]}`;
      default:
        return '';
    }
  },
};

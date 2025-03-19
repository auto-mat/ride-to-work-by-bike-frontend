// adapters
import { newsletterAdapter } from './newsletterAdapter';

// enums
import { Gender } from '../components/types/Profile';
import { PaymentState, PaymentSubject } from '../components/enums/Payment';
import { PaymentCategory } from '../components/types/ApiPayu';
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
      email: apiData.personal_details.email,
      id: apiData.personal_details.id,
      isStaff: apiData.personal_details.is_staff,
      nickname: apiData.personal_details.nickname,
      gender: apiData.personal_details.sex as Gender,
      newsletter: newsletterAdapter.parseNewsletterValues(
        apiData.personal_details.newsletter,
      ),
      terms: apiData.personal_details.personal_data_opt_in,
      approvedForTeam: apiData.personal_details.approved_for_team,
    };

    return {
      personalDetails,
      organizationId: apiData.organization_id,
      paymentSubject: apiData.personal_details
        .payment_subject as PaymentSubject,
      paymentState: apiData.personal_details.payment_status as PaymentState,
      paymentAmount: apiData.personal_details.payment_amount,
      paymentCategory: apiData.personal_details
        .payment_category as PaymentCategory,
      organizationType: apiData.organization_type as OrganizationType,
      subsidiaryId: apiData.subsidiary_id,
      teamId: apiData.team_id,
      merchId: apiData.t_shirt_size_id,
      telephone: apiData.personal_details.telephone,
      telephoneOptIn: apiData.personal_details.telephone_opt_in,
      language: apiData.personal_details.language,
      voucher: apiData.personal_details.discount_coupon,
      citySlug: apiData.city_slug,
      cityWpSlug: apiData.city_wp_slug,
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
      if (storePersonalDetails.email !== undefined) {
        payload.email = storePersonalDetails.email;
      }
      if (storePersonalDetails.nickname !== undefined) {
        payload.nickname = storePersonalDetails.nickname;
      }
      if (storePersonalDetails.gender !== undefined) {
        payload.sex = storePersonalDetails.gender as Gender;
      }
      if (storePersonalDetails.language !== undefined) {
        payload.language = storePersonalDetails.language;
      }
      if (storePersonalDetails.newsletter !== undefined) {
        if (storePersonalDetails.newsletter?.length) {
          payload.newsletter = newsletterAdapter.combineNewsletterValues(
            storePersonalDetails.newsletter,
          );
        } else {
          payload.newsletter = '';
        }
      }
      if (storePersonalDetails.terms !== undefined) {
        payload.personal_data_opt_in = storePersonalDetails.terms;
      }
      if (storePersonalDetails.approvedForTeam !== undefined) {
        payload.approved_for_team = storePersonalDetails.approvedForTeam;
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
      if (storeState.paymentCategory) {
        payload.payment_category = storeState.paymentCategory;
      }
      if (storeState.products) {
        payload.products = storeState.products;
      }
    }
    if (storeState.voucher) {
      payload.discount_coupon = storeState.voucher?.name;
    }
    // if voucher is empty make sure it is reset
    if (storeState.voucher === null) {
      payload.discount_coupon = '';
    }
    if (storeState.teamId !== undefined) {
      payload.team_id = storeState.teamId;
    }
    if (storeState.merchId !== undefined) {
      payload.t_shirt_size_id = storeState.merchId;
    }
    if (storeState.telephone !== undefined) {
      payload.telephone = storeState.telephone;
    }
    if (storeState.telephoneOptIn !== undefined) {
      payload.telephone_opt_in = storeState.telephoneOptIn;
    }
    if (storeState.language !== undefined) {
      payload.language = storeState.language;
    }

    return payload;
  },
};

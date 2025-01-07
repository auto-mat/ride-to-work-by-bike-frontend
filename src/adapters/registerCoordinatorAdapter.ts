// adapters
import { newsletterAdapter } from './newsletterAdapter';

// enums
import { NewsletterType } from '../components/types/Newsletter';

// types
import type { RegisterCoordinatorRequest } from '../components/types/Register';
import type {
  RegisterChallengeCoordinatorForm,
  RegisterChallengePersonalDetailsForm,
} from '../components/types/RegisterChallenge';

/**
 * Adapter for converting between form and API coordinator registration data formats
 */
export const registerCoordinatorAdapter = {
  /**
   * Convert register coordinator form data to API payload format
   * @param formData Form data from the registration form.
   * @returns {RegisterCoordinatorRequest | null} API payload or null if data
   *   is invalid.
   */
  registerCoordinatorToApiPayload(formData: {
    firstName: string;
    lastName: string;
    organizationId: number | null;
    jobTitle: string;
    newsletter: NewsletterType[];
    phone: string;
    responsibility: boolean;
    terms: boolean;
  }): RegisterCoordinatorRequest | null {
    if (!formData.organizationId) {
      return null;
    }
    return {
      user_profile: {
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        newsletter: newsletterAdapter.combineNewsletterValues(
          formData.newsletter,
        ),
        phone: formData.phone,
      },
      user_attendance: {
        terms: formData.terms,
      },
      organizationId: formData.organizationId,
      jobTitle: formData.jobTitle,
      responsibility: formData.responsibility,
    };
  },

  /**
   * Convert register challenge form data to API payload format
   * @param {Object} data - object of store data properties.
   * @returns {RegisterCoordinatorRequest | null} API payload or null if data
   *  is invalid.
   */
  registerChallengeToApiPayload({
    formRegisterCoordinator,
    organizationId,
    personalDetails,
  }: {
    formRegisterCoordinator: RegisterChallengeCoordinatorForm;
    organizationId: number | null;
    personalDetails: RegisterChallengePersonalDetailsForm;
  }): RegisterCoordinatorRequest | null {
    if (!organizationId) {
      return null;
    }
    return {
      user_profile: {
        user: {
          firstName: personalDetails.firstName,
          lastName: personalDetails.lastName,
        },
        newsletter: newsletterAdapter.combineNewsletterValues(
          personalDetails.newsletter,
        ),
        phone: formRegisterCoordinator.phone,
      },
      user_attendance: {
        terms: formRegisterCoordinator.terms,
      },
      organizationId: organizationId,
      jobTitle: formRegisterCoordinator.jobTitle,
      responsibility: formRegisterCoordinator.responsibility,
    };
  },
};

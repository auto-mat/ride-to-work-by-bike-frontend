// adapters
import { newsletterAdapter } from './newsletterAdapter';

// enums
import { NewsletterType } from '../components/types/Newsletter';

// types
import type { RegisterCoordinatorRequest } from '../components/types/Register';

/**
 * Adapter for converting between form and API coordinator registration data formats
 */
export const registerCoordinatorAdapter = {
  /**
   * Convert form data to API payload format
   * @param formData Form data from the registration form
   * @returns API-compatible registration payload
   */
  toApiPayload(formData: {
    firstName: string;
    lastName: string;
    organizationId: string;
    jobTitle: string;
    newsletter: NewsletterType[];
    phone: string;
    responsibility: boolean;
    terms: boolean;
  }): RegisterCoordinatorRequest {
    return {
      firstName: formData.firstName,
      jobTitle: formData.jobTitle,
      lastName: formData.lastName,
      newsletter: newsletterAdapter.combineNewsletterValues(
        formData.newsletter,
      ),
      organizationId: Number(formData.organizationId) ?? undefined,
      phone: formData.phone,
      responsibility: formData.responsibility,
      terms: formData.terms,
    };
  },
};

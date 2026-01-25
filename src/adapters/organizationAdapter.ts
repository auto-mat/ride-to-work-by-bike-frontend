import type { FormOrganizationAddressFields } from '../components/types/Form';

/**
 * Organization Adapter
 *
 * Transforms organization data between form and API formats
 */
export const organizationAdapter = {
  /**
   * Convert organization address form data to API payload format
   * @param formData - Organization address fields from form
   * @returns API payload format for organization address
   */
  toApiAddressPayload(formData: FormOrganizationAddressFields) {
    return {
      street: formData.street,
      street_number: formData.houseNumber,
      city: formData.city,
      psc: formData.zip,
      recipient: '',
    };
  },
};

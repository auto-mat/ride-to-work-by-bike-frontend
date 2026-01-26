import type { FormOrganizationAddressFields } from '../components/types/Form';
import type { PostOrganizationAddress } from '../components/types/apiOrganization';

/**
 * Organization Adapter
 * Transforms organization data between form and API formats
 */
export const organizationAdapter = {
  /**
   * Convert organization address form data to API payload
   * @param formData - Organization address fields from form
   * @returns API payload format
   */
  toApiAddressPayload(
    formData: FormOrganizationAddressFields,
  ): PostOrganizationAddress {
    return {
      street: formData.street,
      street_number: formData.houseNumber,
      city: formData.city,
      psc: formData.zip,
      recipient: '',
    };
  },
};

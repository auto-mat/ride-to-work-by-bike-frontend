// types
import type { FormCompanyAddressFields } from '../components/types/Form';
import type {
  SubsidiaryPostApiPayload,
  SubsidiaryPostApiResponse,
} from '../components/types/ApiSubsidiary';

/**
 * Adapter for converting between API and form subsidiary data formats
 */
export const subsidiaryAdapter = {
  /**
   * Convert form data to API payload format
   */
  toApiPayload(formData: FormCompanyAddressFields): SubsidiaryPostApiPayload {
    return {
      address: {
        street: formData.street,
        street_number: formData.houseNumber,
        recipient: formData.department,
        city: formData.city,
        psc: formData.zip,
      },
      city_id: formData.cityChallenge,
    };
  },

  /**
   * Convert API response to form data format
   */
  toFormData(apiData: SubsidiaryPostApiResponse): FormCompanyAddressFields {
    return {
      street: apiData.address.street,
      houseNumber: apiData.address.street_number,
      city: apiData.address.city,
      zip: String(apiData.address.psc),
      cityChallenge: apiData.city_id,
      department: apiData.address.recipient,
    };
  },
};

// types
import type { FormCompanyAddressFields } from '../components/types/Form';
import type {
  SubsidiaryPostApiPayload,
  SubsidiaryPostApiResponse,
  SubsidiaryApi,
  SubsidiaryAddressPutApi,
} from '../components/types/ApiSubsidiary';
import type { OrganizationSubsidiary } from '../components/types/Organization';

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
      id: apiData.id,
      street: apiData.address.street,
      houseNumber: apiData.address.street_number,
      city: apiData.address.city,
      zip: String(apiData.address.psc),
      cityChallenge: apiData.city_id,
      department: apiData.address.recipient,
    };
  },

  /**
   * Convert API GET response to OrganizationSubsidiary format
   */
  fromApiPayloadGet(apiData: SubsidiaryApi): OrganizationSubsidiary {
    return {
      id: apiData.id,
      teams: apiData.teams,
      address: {
        id: undefined,
        street: apiData.address.street,
        houseNumber: apiData.address.street_number,
        city: apiData.address.city,
        zip: String(apiData.address.psc),
        cityChallenge: null,
        department: apiData.address.recipient,
      },
    };
  },

  /**
   * Get a formatted address string from the provided address object.
   * @param {FormCompanyAddressFields | undefined} address - The address object.
   * @returns {string} - Formatted string representation of the address or
   * empty string.
   */
  fromFormCompanyAddressFieldsToString(
    address: FormCompanyAddressFields | undefined,
  ): string {
    if (!address) return '';

    const parts = [
      address.street,
      address.houseNumber,
      address.city,
      address.zip,
      address.cityChallenge,
      address.department,
    ].filter(Boolean);

    return parts.join(', ');
  },

  /**
   * Convert subsidiary from organization structure API to form data
   * @param {SubsidiaryAddressPutApi} apiSubsidiary - Subsidiary from API
   * @returns {FormCompanyAddressFields} - Form data format
   */
  fromApiAddressToFormData(
    apiSubsidiary: SubsidiaryAddressPutApi,
  ): FormCompanyAddressFields {
    return {
      street: apiSubsidiary.street,
      houseNumber: apiSubsidiary.street_number
        ? String(apiSubsidiary.street_number)
        : '',
      city: apiSubsidiary.city,
      zip: apiSubsidiary.psc ? String(apiSubsidiary.psc) : '',
      cityChallenge: null,
      department: '',
    };
  },

  /**
   * Convert form data to API PUT payload for subsidiary update
   * Used for updating subsidiary address by coordinator (admin)
   * @param {FormCompanyAddressFields} formData - Form data
   * @returns {Pick<SubsidiaryPostApiPayload, 'address'>} - API payload format
   */
  fromFormDataToApiPayloadUpdate(
    formData: FormCompanyAddressFields,
  ): Pick<SubsidiaryPostApiPayload, 'address'> {
    return {
      address: {
        street: formData.street,
        street_number: formData.houseNumber,
        recipient: formData.department || '',
        city: formData.city,
        psc: formData.zip,
      },
    };
  },
};

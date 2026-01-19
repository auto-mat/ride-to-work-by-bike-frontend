// types
import type { City } from '../components/types/City';
import type { FormCompanyAddressFields } from '../components/types/Form';
import type {
  SubsidiaryPostApiPayload,
  SubsidiaryPostApiResponse,
  SubsidiaryApi,
  SubsidiaryPutApiPayload,
} from '../components/types/ApiSubsidiary';
import type { OrganizationSubsidiary } from '../components/types/Organization';
import type { AdminSubsidiary } from '../components/types/AdminOrganisation';

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
      boxAddresseeName: '',
      boxAddresseeTelephone: '',
      boxAddresseeEmail: '',
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
        boxAddresseeName: '',
        boxAddresseeTelephone: '',
        boxAddresseeEmail: '',
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
   * @param {AdminSubsidiary} apiSubsidiary - Subsidiary from API
   * @param {City[]} cities - Cities array for converting name to ID
   * @returns {FormCompanyAddressFields} - Form data format
   */
  fromApiAddressToFormData(
    apiSubsidiary: AdminSubsidiary,
    cities: City[] = [],
  ): FormCompanyAddressFields {
    // in edit subsidiary form, we keep cityChallenge as ID
    const cityId =
      apiSubsidiary.challenge_city && cities.length
        ? (cities.find((c) => c.name === apiSubsidiary.challenge_city)?.id ??
          null)
        : null;

    return {
      street: apiSubsidiary.street,
      houseNumber: apiSubsidiary.street_number
        ? String(apiSubsidiary.street_number)
        : '',
      city: apiSubsidiary.city,
      zip: apiSubsidiary.psc ? String(apiSubsidiary.psc) : '',
      cityChallenge: cityId,
      department: '',
      boxAddresseeName: apiSubsidiary.box_addressee_name || '',
      boxAddresseeTelephone: apiSubsidiary.box_addressee_telephone || '',
      boxAddresseeEmail: apiSubsidiary.box_addressee_email || '',
    };
  },

  /**
   * Convert form data to API PUT payload for subsidiary update
   * Used for updating subsidiary address by coordinator (admin)
   * @param {FormCompanyAddressFields} formData - Form data
   * @returns {SubsidiaryPutApiPayload} - API payload format
   */
  fromFormDataToApiPayloadUpdate(
    formData: FormCompanyAddressFields,
  ): SubsidiaryPutApiPayload {
    return {
      address: {
        street: formData.street,
        street_number: formData.houseNumber,
        recipient: formData.department || '',
        city: formData.city,
        psc: formData.zip,
      },
      box_addressee_name: formData.boxAddresseeName || null,
      box_addressee_telephone: formData.boxAddresseeTelephone || null,
      box_addressee_email: formData.boxAddresseeEmail || null,
      challenge_city_id: formData.cityChallenge,
    };
  },
};

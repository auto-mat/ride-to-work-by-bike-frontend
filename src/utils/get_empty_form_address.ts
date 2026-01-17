import type { FormCompanyAddressFields } from '../components/types/Form';

/**
 * Returns an empty FormCompanyAddressFields object
 * Used as default/initial state for address forms
 */
export const getEmptyFormAddress = (): FormCompanyAddressFields => ({
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
  cityChallenge: null,
  department: '',
  boxAddresseeName: '',
  boxAddresseeTelephone: '',
  boxAddresseeEmail: '',
});

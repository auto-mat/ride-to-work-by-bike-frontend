import { computed, ref, watch } from 'vue';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Organization } from '../components/types/Organization';
import type {
  FormCompanyAddressFields,
  FormOption,
  FormSelectTableOption,
} from 'src/components/types/Form';

export const useSelectedOrganization = (organizations: Organization[]) => {
  // store
  const store = useRegisterChallengeStore();

  const organizationId = computed<number | null>({
    get: (): number | null =>
      store.getOrganizationId ? store.getOrganizationId : null,
    set: (value: number | null) => store.setOrganizationId(value),
  });

  /**
   * Computes the organization options for the select table.
   * @returns {FormSelectTableOption[]} - The organization options.
   */
  const organizationOptions = computed<FormSelectTableOption[]>(() => {
    return organizations.map((organization: Organization) => ({
      label: organization.title,
      value: organization.id,
    }));
  });

  /**
   * Internal reference state for selected address.
   * Used as model value in `FormSelectOrganization` component.
   */
  const selectedAddress = ref<FormCompanyAddressFields | null>(null);

  /**
   * Control selected subsidiaryId based on selected address.
   */
  watch(selectedAddress, (newVal: FormCompanyAddressFields | null) => {
    const selectedOrganization = organizations.find(
      (organization) => organization.id === organizationId.value,
    );

    if (newVal) {
      const subsidiary = selectedOrganization?.subsidiaries.find(
        (subsidiary) => subsidiary.address === newVal,
      );
      subsidiaryId.value = subsidiary?.id ?? null;
    }
  });

  /**
   * Computes the subsidiaryId based on selected address and
   * current store value.
   */
  const subsidiaryId = computed<number | null>({
    get: (): number | null =>
      store.getSubsidiaryId ? store.getSubsidiaryId : null,
    set: (value: number | null) => store.setSubsidiaryId(value),
  });

  /**
   * Computes the address options for the address select
   * based on the selected organizationId.
   * @returns {FormSelectTableOption[]} - The address options or empty array.
   */
  const addressOptions = computed<FormOption[]>(() => {
    if (!organizationId.value) return [];

    const selectedOrganization = organizations.find(
      (organization) => organization.id === organizationId.value,
    );
    if (!selectedOrganization) return [];

    const addressOptions: FormOption[] = [] as FormOption[];

    // add subsidiaries addresses to the options
    selectedOrganization.subsidiaries.forEach((subsidiary) => {
      if (subsidiary.address) {
        addressOptions.push({
          label: getAddressString(subsidiary.address),
          value: subsidiary.address,
        });
      }
    });

    return addressOptions;
  });

  /**
   * Get a formatted address string from the provided address object.
   * @param {FormCompanyAddressFields | undefined} address - The address object.
   * @returns {string} - Formatted string representation of the address or
   * empty string.
   */
  function getAddressString(
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
  }

  return {
    selectedAddress,
    subsidiaryId,
    addressOptions,
    organizationId,
    organizationOptions,
  };
};

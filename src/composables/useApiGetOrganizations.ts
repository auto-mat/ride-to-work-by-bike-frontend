// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { OrganizationType } from '../components/types/Organization';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { FormSelectOption } from '../components/types/Form';
import type { GetOrganizationsResponse } from '../components/types/Organization';
import type { Logger } from '../components/types/Logger';
import type { OrganizationOption } from '../components/types/Organization';

type UseApiGetOrganizationsReturn = {
  isLoading: Ref<boolean>;
  options: Ref<FormSelectOption[]>;
  organizations: Ref<OrganizationOption[]>;
  loadOrganizations: (organizationType: OrganizationType) => Promise<void>;
  mapOrganizationToOption: (
    organization: OrganizationOption,
  ) => FormSelectOption;
};

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get organizations composable
 * Used to enable calling the API to get organizations
 * @param logger - Logger
 * @returns {UseApiGetOrganizationsReturn}
 */
export const useApiGetOrganizations = (
  logger: Logger | null,
): UseApiGetOrganizationsReturn => {
  const organizations = ref<OrganizationOption[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load organizations options
   * Fetches organizations and saves them into options
   */
  const loadOrganizations = async (
    organizationType: OrganizationType = OrganizationType.company,
  ): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting default organizations <${JSON.stringify(organizations.value, null, 2)}>.`,
    );
    organizations.value = [];
    logger?.debug(
      `Default organizations set to <${JSON.stringify(organizations.value, null, 2)}>.`,
    );
    // get organizations
    logger?.info('Get organizations from the API.');
    isLoading.value = true;
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();
    // fetch organizations
    const { data } = await apiFetch<GetOrganizationsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOrganizations}${organizationType}/`,
      method: 'get',
      translationKey: 'getOrganizations',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });
    if (data?.results?.length) {
      pushResultsToOptions(data);
    }
    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
    isLoading.value = false;
  };

  /**
   * Fetch next page of organizations
   * @param {string} url - Get organizations next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of organizations from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();
    // fetch next page
    const { data } = await apiFetch<GetOrganizationsResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getOrganizations',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });
    // store results
    if (data?.results?.length) {
      pushResultsToOptions(data);
    }
    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  /**
   * Push results to options
   * @param {GetOrganizationsResponse} data - Get organizations response
   * @returns {void}
   */
  const pushResultsToOptions = (data: GetOrganizationsResponse): void => {
    logger?.info('Organizations fetched. Saving to default options.');
    logger?.debug(
      `Adding organizations <${JSON.stringify(data.results, null, 2)}> to default organizations.`,
    );
    organizations.value.push(...data.results);
    logger?.debug(
      `Default organizations set to <${JSON.stringify(organizations.value, null, 2)}>.`,
    );
  };

  const options = computed<FormSelectOption[]>(() => {
    return organizations.value.map(mapOrganizationToOption);
  });

  const mapOrganizationToOption = (
    organization: OrganizationOption,
  ): FormSelectOption => ({
    label: organization.name,
    value: organization.id,
  });

  return {
    isLoading,
    options,
    organizations,
    loadOrganizations,
    mapOrganizationToOption,
  };
};

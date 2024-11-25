// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { FormSelectOption } from '../components/types/Form';
import type { GetOrganizationsResponse } from '../components/types/Organization';
import type { Logger } from '../components/types/Logger';
import type { OrganizationType } from '../components/types/Organization';

type UseApiGetOrganizationsReturn = {
  options: Ref<FormSelectOption[]>;
  isLoading: Ref<boolean>;
  loadOrganizations: (organizationType: OrganizationType) => Promise<void>;
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
  const options = ref<FormSelectOption[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load organizations options
   * Fetches organizations and saves them into options
   */
  const loadOrganizations = async (
    organizationType: OrganizationType,
  ): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting default options <${JSON.stringify(options.value, null, 2)}>.`,
    );
    options.value = [];
    logger?.debug(
      `Default options set to <${JSON.stringify(options.value, null, 2)}>.`,
    );
    // get organizations
    logger?.info('Get organizations from the API.');
    isLoading.value = true;
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;
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
    requestTokenHeader_.Authorization += loginStore.getAccessToken;
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
    const pageResults = data.results.map((organization) => ({
      label: organization.name,
      value: organization.id,
    }));
    logger?.info('Organizations fetched. Saving to default options.');
    logger?.debug(
      `Adding options <${JSON.stringify(pageResults, null, 2)}> to default options.`,
    );
    options.value.push(...pageResults);
    logger?.debug(
      `Default options set to <${JSON.stringify(options.value, null, 2)}>.`,
    );
  };

  return {
    options,
    isLoading,
    loadOrganizations,
  };
};

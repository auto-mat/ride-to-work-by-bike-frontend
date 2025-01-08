// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type { OrganizationSubsidiary } from '../components/types/Organization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface GetSubsidiariesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationSubsidiary[];
}

type UseApiGetSubsidiariesReturn = {
  subsidiaries: Ref<OrganizationSubsidiary[]>;
  isLoading: Ref<boolean>;
  loadSubsidiaries: (organizationId: number) => Promise<void>;
};

/**
 * Get subsidiaries composable
 * Used to enable calling the API to get organization subsidiaries
 * @param logger - Logger
 * @returns {UseApiGetSubsidiariesReturn}
 */
export const useApiGetSubsidiaries = (
  logger: Logger | null,
): UseApiGetSubsidiariesReturn => {
  const subsidiaries = ref<OrganizationSubsidiary[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load subsidiaries
   * Fetches subsidiaries and saves them into options
   * @param {number} organizationId - Organization Id to get subsidiaries
   * @returns {Promise<void>} - Promise
   */
  const loadSubsidiaries = async (organizationId: number): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting default options <${JSON.stringify(subsidiaries.value, null, 2)}>.`,
    );
    subsidiaries.value = [];
    logger?.debug(
      `Default options set to <${JSON.stringify(subsidiaries.value, null, 2)}>.`,
    );
    // get subsidiaries
    logger?.info('Get subsidiaries from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch subsidiaries
    const { data } = await apiFetch<GetSubsidiariesResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOrganizations}${organizationId}/${rideToWorkByBikeConfig.urlApiSubsidiaries}`,
      method: 'get',
      translationKey: 'getSubsidiaries',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      subsidiaries.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of subsidiaries
   * @param {string} url - Get subsidiaries next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of subsidiaries from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetSubsidiariesResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getSubsidiaries',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      subsidiaries.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    subsidiaries,
    isLoading,
    loadSubsidiaries,
  };
};

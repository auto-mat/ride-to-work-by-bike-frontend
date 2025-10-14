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
import type {
  AdminOrganisation,
  GetAdminOrganisationResponse,
} from '../components/types/AdminOrganisation';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetAdminOrganisationReturn = {
  organisations: Ref<AdminOrganisation[]>;
  isLoading: Ref<boolean>;
  loadAdminOrganisations: () => Promise<void>;
};

/**
 * Get admin organisation composable
 * Used to enable calling the API to get organizations for admin view
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetAdminOrganisationReturn}
 */
export const useApiGetAdminOrganisation = (
  logger: Logger | null,
): UseApiGetAdminOrganisationReturn => {
  const organisations = ref<AdminOrganisation[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load admin organisations
   * Fetches admin organisation data and saves them
   */
  const loadAdminOrganisations = async (): Promise<void> => {
    // reset organisations
    logger?.debug(
      `Reseting admin organisations <${JSON.stringify(organisations.value, null, 2)}>.`,
    );
    organisations.value = [];
    logger?.debug(
      `Admin organisations set to <${JSON.stringify(organisations.value, null, 2)}>.`,
    );

    // get admin organisations
    logger?.info('Get admin organisations from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // prepare headers with version
    const headers = Object.assign(requestDefaultHeader(), requestTokenHeader_);

    // fetch admin organisations
    const { data } = await apiFetch<GetAdminOrganisationResponse>({
      endpoint:
        rideToWorkByBikeConfig.urlApiOrganizationAdminOrganizationStructure,
      method: 'get',
      translationKey: 'getAdminOrganisations',
      showSuccessMessage: false,
      headers,
      logger,
    });

    if (data?.results?.length) {
      pushResultsToOrganisations(data);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of admin organisations
   * @param {string} url - Get admin organisations next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of admin organisations from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetAdminOrganisationResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getAdminOrganisations',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      pushResultsToOrganisations(data);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  /**
   * Push results to organisations
   * @param {GetAdminOrganisationResponse} data - Get admin organisations response
   * @returns {void}
   */
  const pushResultsToOrganisations = (
    data: GetAdminOrganisationResponse,
  ): void => {
    logger?.info('Admin organisations fetched. Saving to organisations array.');
    logger?.debug(
      `Adding admin organisations <${JSON.stringify(data.results, null, 2)}> to organisations.`,
    );
    organisations.value.push(...data.results);
    logger?.debug(
      `Admin organisations set to <${JSON.stringify(organisations.value, null, 2)}>.`,
    );
  };

  return {
    organisations,
    isLoading,
    loadAdminOrganisations,
  };
};

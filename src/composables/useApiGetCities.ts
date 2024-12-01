// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { City, GetCitiesResponse } from '../components/types/City';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type useApiGetCitiesReturn = {
  cities: Ref<City[]>;
  isLoading: Ref<boolean>;
  loadCities: () => Promise<void>;
};

/**
 * Get cities composable
 * Used to getting API cities data
 * @param logger - Logger
 * @returns {useApiGetCitiesReturn}
 */
export const useApiGetCities = (
  logger: Logger | null,
): useApiGetCitiesReturn => {
  const cities = ref<City[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load cities options
   * Fetches cities and saves them into options
   */
  const loadCities = async (): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting default options <${JSON.stringify(cities.value, null, 2)}>.`,
    );
    // reset options
    cities.value = [];
    logger?.debug(
      `Default options set to <${JSON.stringify(cities.value, null, 2)}>.`,
    );

    // get cities
    logger?.info('Get cities from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch cities
    const { data } = await apiFetch<GetCitiesResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCities}`,
      method: 'get',
      translationKey: 'getCities',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      cities.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of cities
   * @param {string} url - Get cities next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of cities from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch next page
    const { data } = await apiFetch<GetCitiesResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCities',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      cities.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    cities,
    isLoading,
    loadCities,
  };
};

// libraries
import { ref } from 'vue';

// adapters
import { tripsAdapter } from 'src/adapters/tripsAdapter';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Trip, GetTripsResponse } from '../components/types/Trip';
import type { Logger } from '../components/types/Logger';
import type { RouteItem } from '../components/types/Route';
type UseApiGetTripsReturn = {
  trips: Ref<Trip[]>;
  isLoading: Ref<boolean>;
  loadTrips: () => Promise<RouteItem[]>;
};

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get trips composable
 * Used to getting API trips data
 * @param {Logger} logger - Logger
 * @returns {UseApiGetTripsReturn}
 */
export const useApiGetTrips = (logger: Logger | null): UseApiGetTripsReturn => {
  const trips = ref<Trip[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load trips
   * Fetches trips, saves and returns them
   * @returns {Promise<Trip[]>} - Promise
   */
  const loadTrips = async (): Promise<RouteItem[]> => {
    // reset data
    logger?.debug(
      `Reseting trips data <${JSON.stringify(trips.value, null, 2)}>.`,
    );
    trips.value = [];
    logger?.debug(
      `Trips data reset to <${JSON.stringify(trips.value, null, 2)}>.`,
    );

    // get trips
    logger?.info('Get trips from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization = `${(requestTokenHeader_.Authorization as string) || ''} ${await loginStore.getAccessTokenWithRefresh()}`;

    // fetch trips
    const { data } = await apiFetch<GetTripsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiTrips}`,
      method: 'get',
      translationKey: 'getTrips',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      trips.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    const routeItems = trips.value.map((trip) => {
      return tripsAdapter.toRouteItem(trip);
    });

    isLoading.value = false;
    return routeItems;
  };

  /**
   * Fetch next page of trips
   * @param {string} url - Get trips next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of trips from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization = `${(requestTokenHeader_.Authorization as string) || ''} ${await loginStore.getAccessTokenWithRefresh()}`;

    // fetch next page
    const { data } = await apiFetch<GetTripsResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getTrips',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      trips.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    trips,
    isLoading,
    loadTrips,
  };
};

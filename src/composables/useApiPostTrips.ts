// libraries
import { unref } from 'vue';

// adapters
import { tripsAdapter } from '../adapters/tripsAdapter';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';
import { useTripsStore } from '../stores/trips';

// types
import type { ComputedRef } from 'vue';
import type { Logger } from '../components/types/Logger';
import type { Trip } from '../components/types/Trip';
import type { ApiResponse } from './useApi';
import type { RouteItem } from '../components/types/Route';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostTripsReturn {
  postTrips: (
    routeItems: RouteItem[] | ComputedRef<RouteItem[]>,
  ) => Promise<ApiResponse<{ trips: Trip[] }>>;
}

/**
 * Post trips composable
 * Used to create new trips or update existing trips
 * @param logger - Logger
 * @returns {UseApiPostTripsReturn}
 */
export const useApiPostTrips = (
  logger: Logger | null,
): UseApiPostTripsReturn => {
  const loginStore = useLoginStore();
  const tripsStore = useTripsStore();
  const { apiFetch } = useApi();

  /**
   * Create new trips or update existing trips
   * Can create or update multiple trips in a single request
   * @param {TripPostPayload[]} trips - Array of trips to create or update
   */
  const postTrips = async (
    routeItems: RouteItem[] | ComputedRef<RouteItem[]>,
  ): Promise<ApiResponse<{ trips: Trip[] }>> => {
    const trips = await Promise.all(
      unref(routeItems).map(
        async (routeItem) => await tripsAdapter.toTripPostPayload(routeItem),
      ),
    );

    logger?.debug(`Creating trips <${JSON.stringify(trips, null, 2)}>.`);
    tripsStore.setIsLoading(true);

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // prepare headers with version
    const headers = Object.assign(
      requestDefaultHeader(rideToWorkByBikeConfig.apiVersion2),
      requestTokenHeader_,
    );

    // post trips
    const response = await apiFetch<{ trips: Trip[] }>({
      endpoint: rideToWorkByBikeConfig.urlApiTrips,
      method: 'post',
      translationKey: 'postTrips',
      headers,
      payload: { trips },
      logger,
    });

    tripsStore.setIsLoading(false);

    return response;
  };

  return {
    postTrips,
  };
};

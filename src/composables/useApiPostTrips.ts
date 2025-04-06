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
import type { Logger } from '../components/types/Logger';
import type { Trip, TripPostPayload } from '../components/types/Trip';
import type { ApiResponse } from './useApi';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostTripsReturn {
  isLoading: Ref<boolean>;
  postTrips: (
    trips: TripPostPayload[],
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
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create new trips or update existing trips
   * Can create or update multiple trips in a single request
   * @param {TripPostPayload[]} trips - Array of trips to create or update
   */
  const postTrips = async (
    trips: TripPostPayload[],
  ): Promise<ApiResponse<{ trips: Trip[] }>> => {
    logger?.debug(`Creating trips <${JSON.stringify(trips, null, 2)}>.`);
    isLoading.value = true;

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

    isLoading.value = false;

    return response;
  };

  return {
    isLoading,
    postTrips,
  };
};

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
import type { FormSelectOptionNumberValue } from '../components/types/Form';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetOccupationsReturn = {
  occupations: Ref<FormSelectOptionNumberValue[]>;
  isLoading: Ref<boolean>;
  loadOccupations: () => Promise<void>;
};

/**
 * Get occupations composable
 * Used to fetch available occupation options
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetOccupationsReturn}
 */
export const useApiGetOccupations = (
  logger: Logger | null,
): UseApiGetOccupationsReturn => {
  const occupations = ref<FormSelectOptionNumberValue[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load occupations
   * Fetches occupation options and transforms them to FormOption format
   */
  const loadOccupations = async (): Promise<void> => {
    logger?.debug('Resetting occupations.');
    occupations.value = [];

    logger?.info('Get occupations from the API.');
    isLoading.value = true;
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<[number, string][]>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOccupations}`,
      method: 'get',
      translationKey: 'getOccupations',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data) {
      occupations.value = data.map(
        ([value, label]): FormSelectOptionNumberValue => ({
          value: value,
          label: label,
        }),
      );
    }

    isLoading.value = false;
  };

  return {
    occupations,
    isLoading,
    loadOccupations,
  };
};

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
import type { FormOption } from '../components/types/Form';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetAgeGroupsReturn = {
  ageGroups: Ref<FormOption[]>;
  isLoading: Ref<boolean>;
  loadAgeGroups: () => Promise<void>;
};

/**
 * Get age groups composable
 * Used to fetch available birth year options
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetAgeGroupsReturn}
 */
export const useApiGetAgeGroups = (
  logger: Logger | null,
): UseApiGetAgeGroupsReturn => {
  const ageGroups = ref<FormOption[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load age groups
   * Fetches birth year options and transforms them to FormOption format
   */
  const loadAgeGroups = async (): Promise<void> => {
    logger?.debug('Resetting age groups.');
    ageGroups.value = [];

    logger?.info('Get age groups from the API.');
    isLoading.value = true;
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<number[][]>({
      endpoint: `${rideToWorkByBikeConfig.urlApiAgeGroups}`,
      method: 'get',
      translationKey: 'getAgeGroups',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data) {
      // transform [[2026, 2026], ...] to [{ value: 2026, label: "2026" }, ...]
      ageGroups.value = data.map(([year]) => ({
        value: year,
        label: String(year),
      }));
    }

    isLoading.value = false;
  };

  return {
    ageGroups,
    isLoading,
    loadAgeGroups,
  };
};

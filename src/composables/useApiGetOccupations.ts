// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';
import type { FormOption } from '../components/types/Form';

// utils
import { requestDefaultHeader } from '../utils';

type UseApiGetOccupationsReturn = {
  occupations: Ref<FormOption[]>;
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
  const occupations = ref<FormOption[]>([]);
  const isLoading = ref<boolean>(false);
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

    const { data } = await apiFetch<[number, string][]>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOccupations}`,
      method: 'get',
      translationKey: 'getOccupations',
      showSuccessMessage: false,
      headers: requestDefaultHeader(),
      logger,
    });

    if (data) {
      // transform [[138, "IT"], ...] to [{ value: 138, label: "IT" }, ...]
      occupations.value = data.map(([id, label]) => ({
        value: id,
        label: label,
      }));
    }

    isLoading.value = false;
  };

  return {
    occupations,
    isLoading,
    loadOccupations,
  };
};

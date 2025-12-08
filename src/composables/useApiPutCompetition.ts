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
  PutCompetitionPayload,
  PutCompetitionResponse,
} from '../components/types/ApiCompetition';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPutCompetitionReturn {
  isLoading: Ref<boolean>;
  updateCompetition: (
    id: number,
    payload: PutCompetitionPayload,
  ) => Promise<PutCompetitionResponse | null>;
}

/**
 * Composable for updating company challenge
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutCompetitionReturn}
 */
export const useApiPutCompetition = (
  logger: Logger | null,
): UseApiPutCompetitionReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Update an existing competition/company challenge with given data
   * @param {number} id - Competition ID
   * @param {PutCompetitionPayload} payload - Competition data
   * @returns {Promise<PutCompetitionResponse | null>} - Promise
   */
  const updateCompetition = async (
    id: number,
    payload: PutCompetitionPayload,
  ): Promise<PutCompetitionResponse | null> => {
    logger?.debug(
      `Update competition with ID <${id}> and name <${payload.name}> ` +
        `and type <${payload.competition_type}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // put competition
    const { data } = await apiFetch<PutCompetitionResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCompetition}${id}/`,
      method: 'put',
      translationKey: 'updateCompetition',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    updateCompetition,
  };
};

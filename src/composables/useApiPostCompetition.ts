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
  PostCompetitionPayload,
  PostCompetitionResponse,
} from '../components/types/ApiCompetition';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostCompetitionReturn {
  isLoading: Ref<boolean>;
  createCompetition: (
    payload: PostCompetitionPayload,
  ) => Promise<PostCompetitionResponse | null>;
}

/**
 * Composable for creating company challenge
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostCompetitionReturn}
 */
export const useApiPostCompetition = (
  logger: Logger | null,
): UseApiPostCompetitionReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create a new competition/company challenge with given data
   * @param {PostCompetitionPayload} payload - Competition data
   * @returns {Promise<PostCompetitionResponse | null>} - Promise
   */
  const createCompetition = async (
    payload: PostCompetitionPayload,
  ): Promise<PostCompetitionResponse | null> => {
    logger?.debug(
      `Create new competition with name <${payload.name}> ` +
        `and type <${payload.competition_type}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post competition
    const { data } = await apiFetch<PostCompetitionResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiCompetition,
      method: 'post',
      translationKey: 'createCompetition',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    createCompetition,
  };
};

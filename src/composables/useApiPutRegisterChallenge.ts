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
import type {
  RegisterChallengePostPayload,
  RegisterChallengePostResponse,
} from '../components/types/ApiRegistration';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiPutRegisterChallengeReturn = {
  isLoading: Ref<boolean>;
  updateChallenge: (
    primaryKeyId: number | string,
    payload: RegisterChallengePostPayload,
  ) => Promise<RegisterChallengePostResponse | null>;
};

/**
 * Put register challenge composable
 * Used to enable calling the API to update a challenge registration
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutRegisterChallengeReturn}
 */
export const useApiPutRegisterChallenge = (
  logger: Logger | null,
): UseApiPutRegisterChallengeReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Update challenge registration
   * Puts updated registration data to the API
   * @param {number | string} primaryKeyId - Primary key ID of the registration
   * @param {RegisterChallengePostPayload} payload - New registration data
   * @returns {Promise<RegisterChallengePostResponse | null>} - API response
   */
  const updateChallenge = async (
    primaryKeyId: number | string,
    payload: RegisterChallengePostPayload,
  ): Promise<RegisterChallengePostResponse | null> => {
    logger?.info('Putting registration update to the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // put registration update
    const { data } = await apiFetch<RegisterChallengePostResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiRegisterChallenge}${primaryKeyId}/`,
      method: 'put',
      translationKey: 'putRegisterChallenge',
      showSuccessMessage: true,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    updateChallenge,
  };
};

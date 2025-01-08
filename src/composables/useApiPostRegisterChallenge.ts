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
  RegisterChallengePostPayload,
  RegisterChallengePostResponse,
} from '../components/types/ApiRegistration';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiPostRegisterChallengeReturn = {
  isLoading: Ref<boolean>;
  registerChallenge: (
    payload: RegisterChallengePostPayload,
  ) => Promise<RegisterChallengePostResponse | null>;
};

/**
 * Post register challenge composable
 * Used to enable calling the API to register for a challenge
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostRegisterChallengeReturn}
 */
export const useApiPostRegisterChallenge = (
  logger: Logger | null,
): UseApiPostRegisterChallengeReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Register for challenge
   * Posts registration data to the API
   * @param {RegisterChallengePostPayload} payload - Partial registration data to submit
   * @returns {Promise<RegisterChallengePostResponse | null>} - API response
   */
  const registerChallenge = async (
    payload: RegisterChallengePostPayload,
  ): Promise<RegisterChallengePostResponse | null> => {
    logger?.info('Posting registration to the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post registration
    const { data } = await apiFetch<RegisterChallengePostResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiRegisterChallenge}`,
      method: 'post',
      translationKey: 'postRegisterChallenge',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    registerChallenge,
  };
};

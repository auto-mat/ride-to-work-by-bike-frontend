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
  RegisterChallengeResult,
  RegisterChallengeResponse,
} from '../components/types/ApiRegistration';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetRegisterChallengeReturn = {
  registrations: Ref<RegisterChallengeResult[]>;
  isLoading: Ref<boolean>;
  loadRegistrations: () => Promise<void>;
};

/**
 * Get register challenge composable
 * Used to enable calling the API to get registration details
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetRegisterChallengeReturn}
 */
export const useApiGetRegisterChallenge = (
  logger: Logger | null,
): UseApiGetRegisterChallengeReturn => {
  const registrations = ref<RegisterChallengeResult[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load registration details
   * Fetches registration data and saves it
   */
  const loadRegistrations = async (): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting registrations <${JSON.stringify(registrations.value, null, 2)}>.`,
    );
    registrations.value = [];
    logger?.debug(
      `Registrations reset to <${JSON.stringify(registrations.value, null, 2)}>.`,
    );

    // get registrations
    logger?.info('Get registrations from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch registrations
    const { data } = await apiFetch<RegisterChallengeResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiRegisterChallenge}`,
      method: 'get',
      translationKey: 'getRegisterChallenge',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      registrations.value.push(...data.results);
    }

    // no need to fetch next page, as there is only one result

    isLoading.value = false;
  };

  return {
    registrations,
    isLoading,
    loadRegistrations,
  };
};

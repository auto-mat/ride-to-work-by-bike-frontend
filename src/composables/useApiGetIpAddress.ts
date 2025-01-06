// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// types
import type { Logger } from '../components/types/Logger';
import type { IpAddressResponse } from '../components/types/ApiIpAddress';

type UseApiGetIpAddressReturn = {
  ipAddressData: Ref<IpAddressResponse | null>;
  isLoading: Ref<boolean>;
  loadIpAddress: () => Promise<void>;
};

/**
 * Get IP address composable
 * Used to enable calling the API to get IP address and location details
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetIpAddressReturn}
 */
export const useApiGetIpAddress = (
  logger: Logger | null,
): UseApiGetIpAddressReturn => {
  const ipAddressData = ref<IpAddressResponse | null>(null);
  const isLoading = ref<boolean>(false);
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbIpAddressApi, false);

  /**
   * Load IP address details
   * Fetches IP address data and saves it
   */
  const loadIpAddress = async (): Promise<void> => {
    logger?.info('Get IP address data from the API.');
    isLoading.value = true;

    const { data } = await apiFetch<IpAddressResponse>({
      endpoint: '',
      method: 'get',
      translationKey: 'getIpAddress',
      showSuccessMessage: false,
      logger,
    });

    if (data) {
      ipAddressData.value = data;
      logger?.debug(`IP address data <${JSON.stringify(data, null, 2)}>.`);
    }

    isLoading.value = false;
  };

  return {
    ipAddressData,
    isLoading,
    loadIpAddress,
  };
};

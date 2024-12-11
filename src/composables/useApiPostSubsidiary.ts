// libraries
import { ref, Ref } from 'vue';

// adapters
import { subsidiaryAdapter } from '../adapters/subsidiaryAdapter';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { FormCompanyAddressFields } from '../components/types/Form';
import type { Logger } from '../components/types/Logger';
import type { SubsidiaryPostApiResponse } from '../components/types/ApiSubsidiary';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostSubsidiaryReturn {
  isLoading: Ref<boolean>;
  createSubsidiary: (
    organizationId: number,
    subsidiaryData: FormCompanyAddressFields,
  ) => Promise<FormCompanyAddressFields | null>;
}

/**
 * Post subsidiary composable
 * Used to enable calling the API to create organization subsidiary
 * @param logger - Logger
 * @returns {UseApiPostSubsidiaryReturn}
 */
export const useApiPostSubsidiary = (
  logger: Logger | null,
): UseApiPostSubsidiaryReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create subsidiary
   * Creates a new subsidiary under specified organization
   * @param {number} organizationId - Organization Id to create subsidiary under
   * @param {FormCompanyAddressFields} subsidiaryData - Subsidiary data to create
   * @returns {Promise<FormCompanyAddressFields | null>} - Promise
   */
  const createSubsidiary = async (
    organizationId: number,
    subsidiaryData: FormCompanyAddressFields,
  ): Promise<FormCompanyAddressFields | null> => {
    // convert form data to API payload format
    logger?.debug(
      `Creating subsidiary payload from data <${JSON.stringify(subsidiaryData, null, 2)}>.`,
    );
    const subsidiaryPayload = subsidiaryAdapter.toApiPayload(subsidiaryData);
    logger?.debug(
      `Created subsidiary payload <${JSON.stringify(subsidiaryPayload, null, 2)}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    try {
      // post subsidiary
      const { data } = await apiFetch<SubsidiaryPostApiResponse>({
        endpoint: `${rideToWorkByBikeConfig.urlApiOrganizations}${organizationId}/${rideToWorkByBikeConfig.urlApiSubsidiaries}`,
        method: 'post',
        translationKey: 'createSubsidiary',
        headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
        payload: subsidiaryPayload,
        logger,
      });

      isLoading.value = false;

      if (data) {
        logger?.debug(
          `Parsing response subsidiary data <${JSON.stringify(data, null, 2)}>.`,
        );
        const subsidiaryDataParsed = subsidiaryAdapter.toFormData(data);
        logger?.debug(
          `Parsed subsidiary data <${JSON.stringify(subsidiaryDataParsed, null, 2)}>.`,
        );

        return subsidiaryDataParsed;
      } else {
        logger?.debug('No data returned from subsidiary creation API.');
        return null;
      }
    } catch (error) {
      logger?.error(`Error creating subsidiary: ${error}`);
      isLoading.value = false;
      return null;
    }
  };

  return {
    isLoading,
    createSubsidiary,
  };
};

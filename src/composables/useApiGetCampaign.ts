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
  Campaign,
  ThisCampaignResponse,
} from '../components/types/Challenge';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetCampaignReturn = {
  campaigns: Ref<Campaign[]>;
  isLoading: Ref<boolean>;
  loadCampaign: () => Promise<void>;
};

/**
 * Get campaign composable
 * Used to enable calling the API to get campaign details
 * @param logger - Logger
 * @returns {UseApiGetCampaignReturn}
 */
export const useApiGetCampaign = (
  logger: Logger | null,
): UseApiGetCampaignReturn => {
  const campaigns = ref<Campaign[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load campaign details
   * Fetches campaign data and saves it
   */
  const loadCampaign = async (): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting campaigns <${JSON.stringify(campaigns.value, null, 2)}>.`,
    );
    campaigns.value = [];
    logger?.debug(
      `Campaigns reset to <${JSON.stringify(campaigns.value, null, 2)}>.`,
    );

    // get campaign
    logger?.info('Get campaign from the API.');
    isLoading.value = true;

    // fetch campaign
    const { data } = await apiFetch<ThisCampaignResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiThisCampaign}`,
      method: 'get',
      translationKey: 'getCampaign',
      showSuccessMessage: false,
      headers: requestDefaultHeader(),
      logger,
    });

    if (data?.results?.length) {
      campaigns.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of campaign data
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of campaign from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<ThisCampaignResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCampaign',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      campaigns.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    campaigns,
    isLoading,
    loadCampaign,
  };
};

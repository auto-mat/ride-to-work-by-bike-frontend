// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// types
import type { Logger } from '../components/types/Logger';
import type {
  Offer,
  GetOffersResponse,
  GetOffersParams,
} from '../components/types/Offer';

type UseApiGetOffersReturn = {
  offers: Ref<Offer[]>;
  isLoading: Ref<boolean>;
  loadOffers: () => Promise<void>;
};

/**
 * Get offers composable
 * Used to enable calling the feed API to get offers
 * @param logger - Logger
 * @returns {UseApiGetOffersReturn}
 */
export const useApiGetOffers = (
  logger: Logger | null,
): UseApiGetOffersReturn => {
  const offers = ref<Offer[]>([]);
  const isLoading = ref<boolean>(false);
  const { apiFetch } = useApi(true); // use feed URL

  /**
   * Load offers
   * Fetches offers and saves them
   */
  const loadOffers = async (): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting offers <${JSON.stringify(offers.value, null, 2)}>.`,
    );
    offers.value = [];

    // get offers
    logger?.info('Get offers from the API.');
    isLoading.value = true;

    // query parameters
    const params: GetOffersParams = {
      orderby: 'start_date',
      feed: 'content_to_backend',
      _post_type: 'locations',
      _page_subtype: 'event',
      _number: 100,
    };

    // fetch offers
    const { data } = await apiFetch<GetOffersResponse>({
      endpoint: '/',
      method: 'get',
      translationKey: 'getOffers',
      showSuccessMessage: false,
      params,
      logger,
    });

    if (data?.results?.length) {
      offers.value.push(...data.results);
    }

    isLoading.value = false;
  };

  return {
    offers,
    isLoading,
    loadOffers,
  };
};

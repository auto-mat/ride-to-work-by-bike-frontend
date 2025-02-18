// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// types
import type { ComputedRef, Ref } from 'vue';
import type { CardOffer } from '../components/types/Card';
import type { Logger } from '../components/types/Logger';
import type { Offer, GetOffersParams } from '../components/types/Offer';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetOffersReturn = {
  cards: ComputedRef<CardOffer[]>;
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
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbFeedApi); // use feed URL

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
    // TODO: remove hardcoded values and determine cases for param config
    const params: GetOffersParams = {
      order: 'DESC',
      orderby: 'DATE',
      feed: 'content_to_backend',
      _number: '100',
      _post_type: 'locations',
      _page_subtype: 'event',
      _from: '2025-01-01',
    };

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      rideToWorkByBikeConfig.apiBaseRtwbbFeedBearerToken;

    // fetch offers
    const { data } = await apiFetch<Offer[]>({
      endpoint: '/',
      method: 'get',
      translationKey: 'getOffers',
      showSuccessMessage: false,
      params,
      logger,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
    });

    if (data?.length) {
      offers.value.push(...data);
    }

    isLoading.value = false;
  };

  /**
   * Use offers to create cards
   * TODO: Fix metadata, link titles, icon, etc.
   * @returns {CardOffer[]}
   */
  const cards = computed((): CardOffer[] => {
    return offers.value.map((offer) => {
      return {
        title: offer.title,
        content: offer.content,
        image: {
          src: offer.image,
          alt: '',
        },
        code: '',
        icon: 'pedal_bike',
        link: {
          title: i18n.global.t('index.cardOffer.buttonEshop'),
          url: offer.url,
        },
        metadata: [],
      };
    });
  });

  return {
    cards,
    offers,
    isLoading,
    loadOffers,
  };
};

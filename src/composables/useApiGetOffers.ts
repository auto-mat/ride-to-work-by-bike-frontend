// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';
import {
  ApiOfferParamOrder,
  ApiOfferParamOrderby,
  ApiOfferParamFeed,
  ApiOfferParamPostType,
} from '../components/enums/Offers';

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
  // use feed URL for API fetch
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbFeedApi);

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
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;

    const params: Partial<GetOffersParams> = {
      order: ApiOfferParamOrder.DESC,
      orderby: ApiOfferParamOrderby.DATE,
      feed: ApiOfferParamFeed.CONTENT_TO_BACKEND,
      _post_type: ApiOfferParamPostType.LOCATIONS,
      _number: '1000',
      _from: startDate,
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
      params: params as Record<string, string>,
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
   * Offers are filtered by checking if start_date is empty.
   * (If start_date exists, the post is an event.)
   * @returns {CardOffer[]} - Offers in card format
   */
  const cards = computed((): CardOffer[] => {
    return offers.value
      .filter((offer) => offer.start_date === '')
      .map((offer) => {
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

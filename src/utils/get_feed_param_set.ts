// enums
import {
  ApiOfferParamOrder,
  ApiOfferParamOrderby,
  ApiOfferParamFeed,
  ApiOfferParamPostType,
} from '../components/enums/Offers';

// types
import type { GetOffersParams } from '../components/types/Offer';

/**
 * Get parameter set for offers feed
 * @returns {Partial<GetOffersParams>} Parameter set for offers
 */
export const getOffersFeedParamSet = (): Partial<GetOffersParams> => {
  const currentYear = new Date().getFullYear();

  return {
    order: ApiOfferParamOrder.DESC,
    orderby: ApiOfferParamOrderby.DATE,
    feed: ApiOfferParamFeed.CONTENT_TO_BACKEND,
    _post_type: ApiOfferParamPostType.LOCATIONS,
    _number: '1000',
    _year: currentYear.toString(),
  };
};

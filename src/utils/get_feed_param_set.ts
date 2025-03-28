// enums
import {
  ApiOfferParamOrder,
  ApiOfferParamOrderby,
  ApiOfferParamFeed,
  ApiOfferParamPostType,
  ApiOfferParamPageSubtype,
} from '../components/enums/Offers';

// types
import type { GetOffersParams } from '../components/types/Offer';

/**
 * Get parameter set for offers feed
 * @params {string} citySlug - City slug string
 * @returns {Partial<GetOffersParams>} - Parameter set for offers
 */
export const getOffersFeedParamSet = (
  citySlug: string,
  numberOfPosts: number,
): Partial<GetOffersParams> => {
  const currentYear = new Date().getFullYear();

  return {
    order: ApiOfferParamOrder.desc,
    orderby: ApiOfferParamOrderby.date,
    feed: ApiOfferParamFeed.contentToBackend,
    _post_type: ApiOfferParamPostType.locations,
    _page_subtype: ApiOfferParamPageSubtype.event,
    _post_parent: citySlug,
    _number: numberOfPosts.toString(),
    _year: currentYear.toString(),
  };
};

/**
 * Get parameter set for prizes feed
 * @params {string} citySlug - City slug string
 * @returns {Partial<GetOffersParams>} - Parameter set for prizes
 */
export const getPrizesFeedParamSet = (
  citySlug: string,
  numberOfPosts: number,
): Partial<GetOffersParams> => {
  const currentYear = new Date().getFullYear();

  return {
    order: ApiOfferParamOrder.desc,
    orderby: ApiOfferParamOrderby.date,
    feed: ApiOfferParamFeed.contentToBackend,
    _post_type: ApiOfferParamPostType.locations,
    _page_subtype: ApiOfferParamPageSubtype.prize,
    _post_parent: citySlug,
    _number: numberOfPosts.toString(),
    _year: currentYear.toString(),
  };
};

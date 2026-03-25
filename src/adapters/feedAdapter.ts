// composables
import { i18n } from '../boot/i18n';
import { isOfferValidMoreThanOneDay } from '../utils/get_offer_valid';

// enums
import { CardOfferMetadataKey } from '../components/enums/Card';
import { OfferCategorySlug, OfferEventType } from '../components/enums/Offers';

// types
import type { CardOffer } from '../components/types/Card';
import type { Offer } from '../components/types/Offer';
import type { CardMetadata } from '../components/types/Card';
import type { CardPrizeType } from '../components/types/Card';
import type { ThirdPartyVoucher } from '../components/types/ApiRegistration';

// utils
import { getNormalizedAbsoluteUrl } from '../utils/get_normalized_absolute_url';

/**
 * Adapter for converting between API and component feed data formats
 */
export const feedAdapter = {
  /**
   * Convert API posts to CardOffer format
   * Posts are filtered by checking if offer is valid for more than one day.
   * (If offer is valid only for one day, it is an event.)
   * @param {Offer[]} posts - Posts from API
   * @returns {CardOffer[]} - Posts in card format
   */
  toCardOffer(posts: Offer[]): CardOffer[] {
    return (
      posts
        // first filter offers that last more than one day
        .filter((post) => isOfferValidMoreThanOneDay(post))
        // map posts to card offer format
        .map((post) =>
          this.mapPostsToCardOffer(post, OfferEventType.multiDayOffer),
        )
    );
  },

  /**
   * Convert API posts to event cards
   * @param {Offer[]} posts - Posts from API
   * @returns {CardOffer[]} - Posts in card format
   */
  toCardEvent(posts: Offer[]): CardOffer[] {
    return (
      posts
        // first filter one-day offers only
        .filter((post) => !isOfferValidMoreThanOneDay(post))
        // map posts to card offer format
        .map((post) =>
          this.mapPostsToCardOffer(post, OfferEventType.oneDayEvent),
        )
    );
  },

  /**
   * Map posts to CardOffer format
   * @param {Offer} post - Post from API
   * @param {OfferEventType} type - Post type
   * @returns {CardOffer} - Post in card format
   */
  mapPostsToCardOffer(post: Offer, type: OfferEventType): CardOffer {
    // default icon slug
    let slug = OfferCategorySlug.discount;
    // if post has categories, use first category slug
    if (post.categories.length > 0) {
      slug = post.categories[0].slug;
    }
    // build icon source
    const iconId = `card-offer-${slug}`;
    const icon = `svguse:icons/card_offer/icons.svg#${iconId}`;
    // normalize voucher url
    const voucherUrl = getNormalizedAbsoluteUrl(post.voucher_url);
    // build metadata
    const metadata = buildOfferMetadata(post, type);

    return {
      id: post.id,
      title: post.title,
      voucher: post.voucher,
      voucherUrl,
      tShirtEvent: parseInt(post.akce_na_triko) ? true : false,
      icon,
      startDate: post.start_date,
      endDate: post.end_date,
      content: post.content,
      description: post.mobileapppopismista,
      image: {
        src: post.image,
        alt: post.title,
      },
      metadata,
      type,
    };
  },

  /**
   * Convert third-party vouchers to CardOffer format
   * @param {ThirdPartyVoucher[]} vouchers - Vouchers from registration API
   * @param {number} baseId - Base ID to calculate custom card IDs
   * @returns {CardOffer[]} - Vouchers in card format
   */
  thirdPartyVouchersToCardOffers(
    vouchers: ThirdPartyVoucher[],
    baseId: number,
  ): CardOffer[] {
    return vouchers.map((voucher, index) => {
      const title = voucher.amount
        ? `${voucher.voucher_type_name} ${voucher.amount}`
        : voucher.voucher_type_name;
      const iconId = `card-offer-${OfferCategorySlug.discount}`;
      const icon = `svguse:icons/card_offer/icons.svg#${iconId}`;
      const metadata: CardMetadata[] = [];
      if (voucher.good_till) {
        metadata.push({
          id: CardOfferMetadataKey.validity,
          text: i18n.global.t('index.cardOffer.offerValidTo', {
            endDate: i18n.global.d(new Date(voucher.good_till), 'monthDay'),
          }),
          icon: 'mdi-calendar',
        });
      }
      return {
        id: baseId + index,
        title,
        voucher: voucher.token,
        voucherUrl: voucher.voucher_type_url,
        tShirtEvent: false,
        icon,
        startDate: '',
        endDate: voucher.good_till,
        content: '',
        description: '',
        image: {
          src: voucher.voucher_type_image,
          alt: title,
        },
        metadata,
        type: OfferEventType.multiDayOffer,
      };
    });
  },

  /**
   * Convert API posts to CardPrize format
   * @param {Offer[]} posts - Posts from API
   * @returns {CardPrize[]} - Posts in card format
   */
  toCardPrize(posts: Offer[]): CardPrizeType[] {
    return posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      description: post.mobileapppopismista,
      image: {
        src: post.image,
        alt: post.title,
      },
      metadata: [],
    }));
  },
};

/**
 * Build array of metadata objects with id, text and icon.
 * @param {Offer} post - Offer
 * @returns {CardMetadata[]} - Metadata
 */
const buildOfferMetadata = (
  post: Offer,
  type: OfferEventType,
): CardMetadata[] => {
  const icon = 'mdi-calendar';
  const metadata: CardMetadata[] = [];
  // disregard timezone data
  const startDateLocal = post.start_date.replace('Z', '');
  // format dates
  let startDateFormatted: string = '';
  startDateFormatted = startDateLocal
    ? i18n.global.d(new Date(startDateLocal), 'monthDay')
    : '';
  const endDateFormatted: string = post.end_date
    ? i18n.global.d(new Date(post.end_date), 'monthDay')
    : '';

  // if post is event, use start date with time
  if (type === OfferEventType.oneDayEvent && startDateLocal) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidFrom', {
        startDate: startDateLocal
          ? i18n.global.d(new Date(startDateLocal), 'monthDayHourMinute')
          : '', // format time for events (one-day offers)
      }),
      icon: icon,
    });
  } else if (startDateLocal && post.end_date) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidFromTo', {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      }),
      icon: icon,
    });
  } else if (startDateLocal) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidFrom', {
        startDate: startDateFormatted,
      }),
      icon: icon,
    });
  } else if (post.end_date) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidTo', {
        endDate: endDateFormatted,
      }),
      icon: icon,
    });
  }

  return metadata;
};

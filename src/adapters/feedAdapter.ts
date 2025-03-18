// composables
import { i18n } from '../boot/i18n';
import { isOfferValidMoreThanOneDay } from '../utils/get_offer_valid';

// enums
import { CardOfferMetadataKey } from '../components/enums/Card';
import { OfferCategorySlug } from '../components/enums/Offers';
// types
import type { CardOffer } from '../components/types/Card';
import type { Offer } from '../components/types/Offer';
import type { CardMetadata } from '../components/types/Card';
import type { CardPrizeType } from '../components/types/Card';

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
        .map((post) => {
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
          const metadata = buildOfferMetadata(post);

          return {
            id: post.id,
            title: post.title,
            voucher: post.voucher,
            voucherUrl,
            tShirtEvent: post.akce_na_triko ? true : false,
            icon,
            startDate: post.start_date,
            endDate: post.end_date,
            excerpt: post.excerpt,
            content: post.content,
            image: {
              src: post.image,
              alt: post.title,
            },
            metadata,
          };
        })
    );
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
const buildOfferMetadata = (post: Offer): CardMetadata[] => {
  const icon = 'mdi-calendar';
  const metadata: CardMetadata[] = [];
  // format dates
  const startDateFormatted: string = post.start_date
    ? i18n.global.d(new Date(post.start_date), 'monthDay')
    : '';
  const endDateFormatted: string = post.end_date
    ? i18n.global.d(new Date(post.end_date), 'monthDay')
    : '';
  // validity metadata
  if (post.start_date && post.end_date) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidFromTo', {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      }),
      icon: icon,
    });
  } else if (post.start_date) {
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

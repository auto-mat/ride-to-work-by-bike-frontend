// composables
import { i18n } from '../boot/i18n';

// enums
import { CardOfferMetadataKey } from '../components/enums/Card';

// types
import type { CardOffer } from '../components/types/Card';
import type { Offer } from '../components/types/Offer';
import type { CardMetadata } from '../components/types/Card';

/**
 * Adapter for converting between API and component feed data formats
 */
export const feedAdapter = {
  /**
   * Convert API posts to CardOffer format
   * Posts are filtered by checking if end_date is empty.
   * (If end_date exists, the post is an event.)
   * @param {Offer[]} posts - Posts from API
   * @returns {CardOffer[]} - Posts in card format
   */
  toCardOffer(posts: Offer[]): CardOffer[] {
    return (
      posts
        // first filter posts without end_date
        // .filter((post) => post.end_date === '')
        // map posts to card offer format
        .map((post) => {
          // default icon slug
          let slug = 'sleva';
          // if post has categories, use first category slug
          if (post.categories.length > 0) {
            slug = post.categories[0].slug;
          }
          // build icon source
          const iconId = `card-offer-${slug}`;
          const icon = `svguse:icons/card_offer/icons.svg#${iconId}`;
          // build metadata
          const metadata = buildOfferMetadata(post);

          return {
            id: post.id,
            title: post.title,
            voucher: post.voucher,
            voucherUrl: post.voucher_url,
            tShirtEvent: post.akce_na_triko ? true : false,
            icon,
            startDate: post.start_date,
            endDate: post.end_date,
            excerpt: post.excerpt,
            content: post.content,
            image: {
              src: post.image,
              alt: '',
            },
            metadata,
          };
        })
    );
  },
};

const buildOfferMetadata = (post: Offer): CardMetadata[] => {
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
      icon: 'mdi-calendar',
    });
  } else if (post.start_date) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidFrom', {
        startDate: startDateFormatted,
      }),
      icon: 'mdi-calendar',
    });
  } else if (post.end_date) {
    metadata.push({
      id: CardOfferMetadataKey.validity,
      text: i18n.global.t('index.cardOffer.offerValidTo', {
        endDate: endDateFormatted,
      }),
      icon: 'mdi-calendar',
    });
  }

  return metadata;
};

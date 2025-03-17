// libraries
import { date } from 'quasar';

// types
import { Offer } from 'src/components/types/Offer';
import { CardOffer as CardOfferType } from 'src/components/types/Card';

/**
 * Check if given offer is valid more than one day.
 * If either start date is not set, or invalid,
 * the offer is marked as invalid.
 * If start date is set, but end date is not set,
 * the offer is marked as valid.
 * @param {Offer} post - Offer object
 * @returns {boolean} - True if offer is valid
 */
export const isOfferValidMoreThanOneDay = (post: Offer): boolean => {
  if (!post.start_date) {
    return false;
  }
  if (!post.end_date) {
    return true;
  }
  const startDate = new Date(post.start_date);
  const endDate = new Date(post.end_date);
  // check if dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }
  // compare dates without time component
  const start = date.startOfDate(startDate, 'day');
  const end = date.startOfDate(endDate, 'day');
  return date.getDateDiff(end, start, 'days') > 0;
};

/**
 * Check if given offer is past its end date.
 * Returns true only if the offer has an end date and that date is in the past.
 * Returns false in all other cases (no end date, or end date is in future).
 * @param {CardOfferType} card - Card offer object
 * @returns {boolean} - True if offer has ended, false otherwise
 */
export const isOfferPast = (card: CardOfferType): boolean => {
  // if no end date, offer hasn't ended
  if (!card.endDate) return false;

  const now = date.startOfDate(new Date(), 'day');
  const end = date.startOfDate(new Date(card.endDate), 'day');

  return date.getDateDiff(now, end, 'days') > 0;
};

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
 * @returns {boolean}
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
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];
  return startDateString !== endDateString;
};

/**
 * Check if given offer is currently valid.
 * If no start date is set, the offer is considered valid.
 * If only start date is set, the offer is considered valid
 * if the current date is on or after the start date.
 * If both start and end dates are set, the offer is considered valid
 * if the current date is between the start and end dates.
 * @param {CardOfferType} card - Card offer object
 * @returns {boolean}
 */
export const isOfferCurrentlyValid = (card: CardOfferType): boolean => {
  // no dates set, consider offer valid (default state)
  if (!card.startDate) return true;

  const now = date.startOfDate(new Date(), 'day');
  const start = date.startOfDate(new Date(card.startDate), 'day');
  // only start date is set, check if current date is on or after start
  if (!card.endDate) {
    return date.getDateDiff(now, start, 'days') >= 0;
  }
  // both dates are set, check if current date is between them
  const end = date.startOfDate(new Date(card.endDate), 'day');
  return date.isBetweenDates(now, start, end, {
    inclusiveFrom: true,
    inclusiveTo: true,
    onlyDate: true,
  });
};

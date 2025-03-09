// types
import { Offer } from 'src/components/types/Offer';

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

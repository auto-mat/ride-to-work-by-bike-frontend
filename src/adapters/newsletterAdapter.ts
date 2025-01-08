// types
import { NewsletterType } from 'src/components/types';

/**
 * Adapter for converting API and local format of newsletter selection.
 */
export const newsletterAdapter = {
  /**
   * Parse newsletter string from API to array of NewsletterType
   * @param {string} newsletter - Newsletter string from API
   * @returns {NewsletterType[]} - Array of NewsletterType
   */
  parseNewsletterValues(newsletter: string): NewsletterType[] {
    if (!newsletter) return [];
    return newsletter
      .split('-')
      .map((option) => option.trim()) as NewsletterType[];
  },

  /**
   * Convert array of newsletter types to combined API value
   * @param {NewsletterType[]} newsletters - Array of newsletter types
   * @returns {string} - Combined newsletter string value
   */
  combineNewsletterValues(newsletters: NewsletterType[]): string {
    if (!newsletters?.length) return '';
    // sort newsletter types (challenge, event, mobility)
    const sorted = [...newsletters].sort();
    // use switch statement to handle different lengths
    switch (sorted.length) {
      case 1:
        return sorted[0];
      case 2:
        return `${sorted[0]}-${sorted[1]}`;
      case 3:
        return `${sorted[0]}-${sorted[1]}-${sorted[2]}`;
      default:
        return '';
    }
  },
};

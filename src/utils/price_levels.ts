import type { PriceLevel } from '../components/types/Challenge';
import { PriceLevelCategory } from '../components/enums/Challenge';

const emptyPriceLevelBasic = {
  name: PriceLevelCategory.basic,
  category: PriceLevelCategory.basic,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

const emptyPriceLevelCompany = {
  name: PriceLevelCategory.company,
  category: PriceLevelCategory.company,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

/**
 * Get current price levels for each category
 * Returns the most recent price levels for basic and company categories
 * based on takes_effect_on date
 * @returns {Record<PriceLevelCategory, PriceLevel>} - Current price levels
 *   by category
 */
export const getCurrentPriceLevelsUtil = (
  priceLevels: PriceLevel[],
): Record<PriceLevelCategory, PriceLevel> => {
  if (!priceLevels) {
    // standardize empty price level structure to avoid JS errors
    const priceLevelsEmpty = {} as Record<PriceLevelCategory, PriceLevel>;
    priceLevelsEmpty[PriceLevelCategory.basic] = emptyPriceLevelBasic;
    priceLevelsEmpty[PriceLevelCategory.company] = emptyPriceLevelCompany;
    return priceLevelsEmpty;
  }
  // build price levels object with most recent price by category
  const priceLevelsComputed = priceLevels.reduce(
    (mostRecentPriceLevelsByCategory, priceLevel) => {
      // if price level is null or malformed, skip
      if (!priceLevel || !priceLevel.takes_effect_on || !priceLevel.category)
        return mostRecentPriceLevelsByCategory;

      const currentDate = new Date(priceLevel.takes_effect_on);
      const existingLevel =
        mostRecentPriceLevelsByCategory[priceLevel.category];

      if (
        !existingLevel ||
        currentDate > new Date(existingLevel.takes_effect_on)
      ) {
        mostRecentPriceLevelsByCategory[priceLevel.category] = priceLevel;
      }

      return mostRecentPriceLevelsByCategory;
    },
    {} as Record<PriceLevelCategory, PriceLevel>,
  );
  if (!priceLevelsComputed[PriceLevelCategory.basic]) {
    priceLevelsComputed[PriceLevelCategory.basic] = emptyPriceLevelBasic;
  }
  if (!priceLevelsComputed[PriceLevelCategory.company]) {
    priceLevelsComputed[PriceLevelCategory.company] = emptyPriceLevelCompany;
  }
  return priceLevelsComputed;
};

export const defaultPaymentAmountMinComputed = (
  currentPriceLevels: Record<PriceLevelCategory, PriceLevel>,
): number => {
  if (!currentPriceLevels) return 0;
  const currentPriceLevelsBasic = currentPriceLevels[PriceLevelCategory.basic];
  if (!currentPriceLevelsBasic) return 0;
  return currentPriceLevelsBasic.price;
};

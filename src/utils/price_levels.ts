import { getCurrentDateTimeAccordingTimezone } from './index';
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

const emptyPriceLevelSchool = {
  name: PriceLevelCategory.school,
  category: PriceLevelCategory.school,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

/**
 * Get current price levels for each category
 * Returns the most recent price levels for basic, company and school categories
 * based on takes_effect_on date
 * @returns {Record<PriceLevelCategory, PriceLevel>} - Current price levels
 *   by category
 */
export const getCurrentPriceLevelsUtil = (
  priceLevels: PriceLevel[],
  now?: Date,
): Record<PriceLevelCategory, PriceLevel> => {
  if (!priceLevels) {
    // standardize empty price level structure to avoid JS errors
    const priceLevelsEmpty = {} as Record<PriceLevelCategory, PriceLevel>;
    priceLevelsEmpty[PriceLevelCategory.basic] = emptyPriceLevelBasic;
    priceLevelsEmpty[PriceLevelCategory.company] = emptyPriceLevelCompany;
    priceLevelsEmpty[PriceLevelCategory.school] = emptyPriceLevelSchool;
    return priceLevelsEmpty;
  }
  if (!now) now = getCurrentDateTimeAccordingTimezone();

  const category = 'category';
  const takesEffectOn = 'takes_effect_on';

  const priceLevelsBasic = priceLevels.filter(
    (priceLevel) => priceLevel[category] === PriceLevelCategory.basic,
  );
  const priceLevelsCompany = priceLevels.filter(
    (priceLevel) => priceLevel[category] === PriceLevelCategory.company,
  );
  const priceLevelsSchool = priceLevels.filter(
    (priceLevel) => priceLevel[category] === PriceLevelCategory.school,
  );

  const sortByDate = (priceLevels: Array<PriceLevel>): Array<PriceLevel> => {
    return priceLevels.sort((a: PriceLevel, b: PriceLevel) => {
      if (new Date(a[takesEffectOn]) < new Date(b[takesEffectOn])) return -1;
      else if (new Date(a[takesEffectOn]) > new Date(b[takesEffectOn]))
        return 1;
      return 0;
    });
  };

  const getCurrentPriceLevel = (priceLevels: Array<PriceLevel>) => {
    const recentPriceLevel = [];
    if (priceLevels.length == 2) {
      if (
        new Date(priceLevels[0 + 1][takesEffectOn]).getTime() == now.getTime()
      )
        recentPriceLevel.push(priceLevels[1]);
      else if (
        new Date(priceLevels[0][takesEffectOn]) <= now &&
        new Date(priceLevels[0 + 1][takesEffectOn]) > now
      )
        recentPriceLevel.push(priceLevels[0]);
    } else {
      for (let index = 0; index < priceLevels.length; ++index) {
        if (
          index + 1 < priceLevels.length &&
          new Date(priceLevels[index][takesEffectOn]) <= now &&
          new Date(priceLevels[index + 1][takesEffectOn]) > now
        ) {
          recentPriceLevel.push(priceLevels[index]);
        }
        if (index === priceLevels.length - 1) {
          if (new Date(priceLevels[index][takesEffectOn]) <= now) {
            recentPriceLevel.push(priceLevels[index]);
          }
        }
      }
    }
    return recentPriceLevel.slice(-1)[0];
  };

  // build price levels object with most recent price by category
  const priceLevelComputed = {} as Record<PriceLevelCategory, PriceLevel>;
  const currentPriceLevelBasicComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsBasic),
  );
  const currentPriceLevelCategoryComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsCompany),
  );
  const currentPriceLevelSchoolComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsSchool),
  );
  if (currentPriceLevelBasicComputed)
    priceLevelComputed[PriceLevelCategory.basic] =
      currentPriceLevelBasicComputed;
  else priceLevelComputed[PriceLevelCategory.basic] = emptyPriceLevelBasic;
  if (currentPriceLevelCategoryComputed)
    priceLevelComputed[PriceLevelCategory.company] =
      currentPriceLevelCategoryComputed;
  else priceLevelComputed[PriceLevelCategory.company] = emptyPriceLevelCompany;
  if (currentPriceLevelSchoolComputed)
    priceLevelComputed[PriceLevelCategory.school] =
      currentPriceLevelSchoolComputed;
  else priceLevelComputed[PriceLevelCategory.school] = emptyPriceLevelSchool;
  return priceLevelComputed;
};

export const defaultPaymentAmountMinComputed = (
  currentPriceLevels: Record<PriceLevelCategory, PriceLevel>,
): number => {
  if (!currentPriceLevels) return 0;
  const currentPriceLevelsBasic = currentPriceLevels[PriceLevelCategory.basic];
  if (!currentPriceLevelsBasic) return 0;
  return currentPriceLevelsBasic.price;
};

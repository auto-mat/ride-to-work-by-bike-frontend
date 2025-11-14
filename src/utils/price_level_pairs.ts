// enums
import { PriceLevelCategory } from '../components/enums/Challenge';

/**
 * Bidirectional mapping between price level categories with and without rewards
 * Used to find the corresponding price when user toggles the reward checkbox
 */
export const priceLevelPairs: Record<PriceLevelCategory, PriceLevelCategory> = {
  [PriceLevelCategory.company]: PriceLevelCategory.companyWithReward,
  [PriceLevelCategory.companyWithReward]: PriceLevelCategory.company,
  [PriceLevelCategory.school]: PriceLevelCategory.schoolWithReward,
  [PriceLevelCategory.schoolWithReward]: PriceLevelCategory.school,
  [PriceLevelCategory.basic]: PriceLevelCategory.basicWithReward,
  [PriceLevelCategory.basicWithReward]: PriceLevelCategory.basic,
};

export const pairedCategories = [
  PriceLevelCategory.company,
  PriceLevelCategory.companyWithReward,
  PriceLevelCategory.school,
  PriceLevelCategory.schoolWithReward,
];

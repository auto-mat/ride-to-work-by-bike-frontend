// composables
import { i18n } from '../boot/i18n';

// enums
import {
  ItemStatistics,
  StatisticsId,
  StatisticsCategoryId,
} from '../components/types/Statistics';

// types
import { ResultsUnion } from '../components/types/Results';

export const useStats = () => {
  /**
   * Parse API data structure to a one-dimensional array of statistics.
   * Allows to specify ids of statistics to return.
   * @param {MemberResults[]} results - The API data structure.
   * @param {StatisticsId[]} ids - The IDs of the statistics to return.
   * @return {ItemStatistics[]} - The statistics.
   */
  const getResultStatistics = (
    results: ResultsUnion[],
    ids?: StatisticsId[],
  ): ItemStatistics[] => {
    // create all statistics array
    const allStats = results
      .map((member: ResultsUnion) => {
        const stats: ItemStatistics[] = [];
        // add frequency if it exists
        if (StatisticsId.frequency in member) {
          stats.push({
            id: StatisticsId.frequency,
            // convert to percentage
            value: formatNumberDecimal(member.frequency * 100, 0),
          });
        }
        // add distance if it exists
        if (StatisticsId.distance in member) {
          stats.push({
            id: StatisticsId.distance,
            value: formatNumberDecimal(member.distance, 2),
          });
        }
        // add eco_trip_count if it exists
        if (StatisticsId.routes in member) {
          stats.push({
            id: StatisticsId.routes,
            value: formatNumberDecimal(member.eco_trip_count),
          });
        }
        // add CO2 emissions if they exist
        if (StatisticsId.co2 in member.emissions) {
          stats.push({
            id: StatisticsId.co2,
            value: formatNumberDecimal(member.emissions.co2, 0),
          });
        }

        return stats;
      })
      .flat();

    // if specific IDs are requested, filter the results
    if (ids) {
      return allStats.filter((stat) => ids.includes(stat.id));
    }
    // else return all statistics
    return allStats;
  };
  /**
   * Format a number to given number of decimal places
   * If the number is an integer, it is returned as is.
   * @param {number} value - The number to format.
   * @param {number} decimals - The number of decimal places to format to.
   * @returns {number} - The formatted number.
   */
  const formatNumberDecimal = (value: number, decimals = 1): number => {
    return Number.isInteger(value) ? value : Number(value.toFixed(decimals));
  };
  /**
   * Get the icon of the statistic.
   * @param {StatisticsId} id - The id of the statistic.
   * @returns {string} - The icon of the statistic or an empty string.
   */
  const getStatIcon = (id: StatisticsId): string => {
    const baseSvgImgPath = 'svguse:icons/stats_bar/icons.svg#';
    switch (id) {
      case StatisticsId.frequency:
        return `${baseSvgImgPath}tabler-progress`;
      case StatisticsId.distance:
        return `${baseSvgImgPath}jam-arrows-h`;
      case StatisticsId.routes:
        return `${baseSvgImgPath}lucide-route`;
      case StatisticsId.co2:
        return `${baseSvgImgPath}tabler-leaf`;
      default:
        return '';
    }
  };
  /**
   * Get the label of the statistic.
   * @param {StatisticsId} id - The id of the statistic.
   * @returns {string} - The label of the statistic or an empty string.
   */
  const getStatLabel = (id: StatisticsId): string => {
    switch (id) {
      case StatisticsId.frequency:
        return i18n.global.t('statsBar.labelFrequency');
      case StatisticsId.routes:
        return i18n.global.t('statsBar.labelSustainableRoutes');
      case StatisticsId.co2:
        return i18n.global.t('statsBar.labelSaved');
      default:
        return '';
    }
  };
  /**
   * Get the unit of the statistic.
   * @param {StatisticsId} id - The id of the statistic.
   * @returns {string} - The unit of the statistic or an empty string.
   */
  const getStatUnit = (id: StatisticsId): string => {
    switch (id) {
      case StatisticsId.frequency:
        return i18n.global.t('global.percentageUnit');
      case StatisticsId.distance:
        return i18n.global.t('global.routeLengthUnit');
      case StatisticsId.co2:
        return i18n.global.t('global.carbonDioxideWeightUnit');
      default:
        return '';
    }
  };
  /**
   * Get the label of the statistic category.
   * @param {StatisticsCategoryId} id - The id of the statistic category.
   * @returns {string} - The label of the statistic category or an empty string.
   */
  const getStatCategoryLabel = (id: StatisticsCategoryId): string => {
    switch (id) {
      case StatisticsCategoryId.personal:
        return i18n.global.t('cardStats.labelPersonal');
      case StatisticsCategoryId.team:
        return i18n.global.t('cardStats.labelTeam');
      case StatisticsCategoryId.organization:
        return i18n.global.t('cardStats.labelOrganization');
      case StatisticsCategoryId.city:
        return i18n.global.t('cardStats.labelCity');
      default:
        return '';
    }
  };
  /**
   * Get the icon of the statistic category.
   * @param {StatisticsCategoryId} id - The id of the statistic category.
   * @returns {string} - The icon of the statistic category or an empty string.
   */
  const getStatCategoryIcon = (id: StatisticsCategoryId): string => {
    switch (id) {
      case StatisticsCategoryId.personal:
        return 'svguse:icons/card_stats/icons.svg#ion-person-outline';
      case StatisticsCategoryId.team:
        return 'svguse:icons/card_stats/icons.svg#three-circles';
      case StatisticsCategoryId.organization:
        return 'svguse:icons/card_stats/icons.svg#lucide-building';
      case StatisticsCategoryId.city:
        return 'svguse:icons/card_stats/icons.svg#lucide-building-2';
      default:
        return '';
    }
  };

  return {
    getResultStatistics,
    getStatCategoryIcon,
    getStatCategoryLabel,
    getStatIcon,
    getStatLabel,
    getStatUnit,
  };
};

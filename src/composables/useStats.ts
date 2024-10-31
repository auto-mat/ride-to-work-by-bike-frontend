// composables
import { i18n } from '../boot/i18n';

// enums
import {
  ItemStatistics,
  StatisticsId,
  StatisticsCategoryId,
} from '../components/types/Statistics';

// types
import { TeamMember } from '../components/types/Results';

export const useStats = () => {
  /**
   * Parse API data structure to a one-dimensional array of statistics.
   * @param {TeamMember[]} memberResults - The API data structure.
   * @return {ItemStatistics[]} The statistics.
   */
  const getMemberResultStats = (
    memberResults: TeamMember[],
  ): ItemStatistics[] => {
    // return id-value pairs of statistics
    return memberResults
      .map((member: TeamMember) => [
        {
          id: StatisticsId.distance,
          value: member[StatisticsId.distance].toString(),
        },
        {
          id: StatisticsId.routes,
          value: member[StatisticsId.routes].toString(),
        },
        {
          id: StatisticsId.co2,
          value: member.emissions[StatisticsId.co2].toString(),
        },
      ])
      .flat();
  };
  /**
   * Get the icon of the statistic.
   * @param id - The id of the statistic.
   * @returns The icon of the statistic or an empty string.
   */
  const getStatIcon = (id: StatisticsId) => {
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
   * @param id - The id of the statistic.
   * @returns The label of the statistic or an empty string.
   */
  const getStatLabel = (id: StatisticsId) => {
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
   * @param id - The id of the statistic.
   * @returns The unit of the statistic or an empty string.
   */
  const getStatUnit = (id: StatisticsId) => {
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

  const getStatCategoryIcon = (id: StatisticsCategoryId): string => {
    switch (id) {
      case StatisticsCategoryId.personal:
        return 'svguse:icons/card-stats/icons.svg#ion-person-outline';
      case StatisticsCategoryId.team:
        return 'svguse:icons/card-stats/icons.svg#three-circles';
      case StatisticsCategoryId.organization:
        return 'svguse:icons/card-stats/icons.svg#lucide-building';
      case StatisticsCategoryId.city:
        return 'svguse:icons/card-stats/icons.svg#lucide-building-2';
      default:
        return '';
    }
  };

  return {
    getMemberResultStats,
    getStatCategoryIcon,
    getStatCategoryLabel,
    getStatIcon,
    getStatLabel,
    getStatUnit,
  };
};

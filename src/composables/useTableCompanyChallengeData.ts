// libraries
import { computed } from 'vue';

// stores
import { useAdminCompetitionStore } from 'src/stores/adminCompetition';

// types
import type { Ref } from 'vue';
import type { Competition } from 'src/components/types/Competition';
import {
  CompetitionType,
  CompetitorType,
} from 'src/components/enums/Challenge';

export interface TableCompanyChallengeRow {
  name: string;
  startDate: string;
  endDate: string;
  competitionType: CompetitionType;
  competitorType: CompetitorType;
  transportTypes: string[];
}

/**
 * Transforms Competition into TableCompanyChallengeRow
 * @param {Competition} competition - Competition from API
 * @returns {TableCompanyChallengeRow} - Table row data
 */
function transformCompetitionToRow(
  competition: Competition,
): TableCompanyChallengeRow {
  return {
    name: competition.name,
    startDate: competition.date_from,
    endDate: competition.date_to,
    competitionType: competition.competition_type,
    competitorType: competition.competitor_type,
    transportTypes: competition.commute_modes
      ? competition.commute_modes.map((mode) => mode.slug)
      : [],
  };
}

/**
 * Build data object for company challenge table
 * @returns {Ref<TableCompanyChallengeRow[]>} - Array of table rows
 */
export const useTableCompanyChallengeData = (): {
  tableData: Ref<TableCompanyChallengeRow[]>;
} => {
  const adminCompetitionStore = useAdminCompetitionStore();

  const tableData = computed<TableCompanyChallengeRow[]>(() => {
    const competitions = adminCompetitionStore.getCompetitions;
    if (!competitions || competitions.length === 0) {
      return [];
    }
    const allRows: TableCompanyChallengeRow[] = [];
    // transform competitions to table rows
    competitions.forEach((competition: Competition) => {
      allRows.push(transformCompetitionToRow(competition));
    });

    return allRows;
  });

  return {
    tableData,
  };
};

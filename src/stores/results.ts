// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';
import { useApiGetResults } from 'src/composables/useApiGetResults';
import { useApiGetResultsByChallenge } from 'src/composables/useApiGetResultsByChallenge';

// stores
import { useRegisterChallengeStore } from './registerChallenge';

// types
import type { Logger } from '../components/types/Logger';
import type { ResultsResponse } from '../components/types/ApiResults';
import {
  ResultsReportType,
  ResultsReportTypeByChallenge,
} from '../components/enums/Results';

type ResultsUrlsType = Record<
  ResultsReportType | ResultsReportTypeByChallenge,
  ResultsResponse | undefined
>;

interface ResultsState {
  $log: Logger | null;
  resultsUrls: ResultsUrlsType;
  isLoading: boolean;
}

export const useResultsStore = defineStore('results', {
  state: (): ResultsState => ({
    $log: null,
    resultsUrls: {} as ResultsUrlsType,
    isLoading: false,
  }),

  getters: {
    getResultsUrls: (state) => state.resultsUrls,
    getIsLoading: (state) => state.isLoading,
    getAvailableReportTypes: (state) =>
      Object.keys(state.resultsUrls) as (
        | ResultsReportType
        | ResultsReportTypeByChallenge
      )[],
    getReportTypeLabels: () => {
      const labels: Record<
        ResultsReportType | ResultsReportTypeByChallenge,
        string
      > = {
        [ResultsReportType.regularity]: i18n.global.t(
          'results.reportType.regularity',
        ),
        [ResultsReportType.teamRegularityCity]: i18n.global.t(
          'results.reportType.teamRegularityCity',
        ),
        [ResultsReportType.performanceCity]: i18n.global.t(
          'results.reportType.performanceCity',
        ),
        [ResultsReportType.performanceOrganization]: i18n.global.t(
          'results.reportType.performanceOrganization',
        ),
        [ResultsReportType.organizationsReview]: i18n.global.t(
          'results.reportType.organizationsReview',
        ),
        [ResultsReportTypeByChallenge.may]: i18n.global.t(
          'results.reportType.may',
        ),
        [ResultsReportTypeByChallenge.septemberJanuary]: i18n.global.t(
          'results.reportType.septemberJanuary',
        ),
      };
      return labels;
    },
  },

  actions: {
    /**
     * Load all available results URLs based on user role
     * Save them to the resultsUrls object, keyed by the report type
     * @returns {Promise<void>}
     */
    async loadResultsUrls(): Promise<void> {
      this.isLoading = true;

      try {
        const registerChallengeStore = useRegisterChallengeStore();
        const isUserOrganizationAdmin =
          registerChallengeStore.getIsUserOrganizationAdmin;
        const isUserStaff = registerChallengeStore.getIsUserStaff;

        const { load: loadResultsByChallenge } = useApiGetResultsByChallenge(
          this.$log,
        );
        const { load: loadResults } = useApiGetResults(this.$log);

        /**
         * List of requests is being prepared
         * so that it can be fetched in parallel.
         */
        const requests: {
          type: ResultsReportType | ResultsReportTypeByChallenge;
          promise: Promise<ResultsResponse>;
        }[] = [];

        // prepare by-challenge results requests
        const challengeTypes = [
          ResultsReportTypeByChallenge.may,
          ResultsReportTypeByChallenge.septemberJanuary,
        ];
        for (const type of challengeTypes) {
          if (!this.resultsUrls[type]) {
            requests.push({
              type,
              promise: loadResultsByChallenge(type),
            });
          }
        }

        /**
         * Role-specific results requests can overlap,
         * so we use Set to avoid duplicates.
         */
        const reportTypesPerRole = new Set<ResultsReportType>();
        // Basic challenge member (default)
        [
          ResultsReportType.regularity,
          ResultsReportType.teamRegularityCity,
          ResultsReportType.performanceCity,
        ].forEach((type) => reportTypesPerRole.add(type));
        // add organization admin report types
        if (isUserOrganizationAdmin) {
          [
            ResultsReportType.performanceOrganization,
            ResultsReportType.organizationsReview,
          ].forEach((type) => reportTypesPerRole.add(type));
        }
        // add staff report types
        if (isUserStaff) {
          [ResultsReportType.organizationsReview].forEach((type) =>
            reportTypesPerRole.add(type),
          );
        }
        // prepare requests for all role-specific report types
        for (const type of reportTypesPerRole) {
          if (!this.resultsUrls[type]) {
            requests.push({
              type,
              promise: loadResults(type),
            });
          }
        }

        // if we have requests to fetch, execute them in parallel
        if (requests.length > 0) {
          const responses = await Promise.all(requests.map((r) => r.promise));
          // store all responses keyed by their report types
          requests.forEach((request, index) => {
            this.resultsUrls[request.type] = responses[index];
          });
        }
      } catch (error: unknown) {
        const errorMessage: string =
          error instanceof Error ? error.message : '';
        this.$log?.error(`Failed to load results URLs <${errorMessage}>.`);
        if (errorMessage) {
          Notify.create({
            type: 'negative',
            message: i18n.global.t(
              'results.messageFailedToLoadResultsUrlsWithMessage',
              {
                error: errorMessage,
              },
            ),
          });
        } else {
          Notify.create({
            type: 'negative',
            message: i18n.global.t('results.messageFailedToLoadResultsUrls'),
          });
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Get results URL for specific report type
     * @param {ResultsReportType | ResultsReportTypeByChallenge} reportType - Report type to get URL for
     * @returns {ResultsResponse | undefined} - Results URL or undefined if not found
     */
    getResultsUrl(
      reportType: ResultsReportType | ResultsReportTypeByChallenge,
    ): ResultsResponse | undefined {
      return this.resultsUrls[reportType];
    },

    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.resultsUrls = {} as ResultsUrlsType;
      this.isLoading = false;
    },
  },

  persist: {
    omit: ['isLoading'],
  },
});

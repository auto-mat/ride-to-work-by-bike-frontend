// enums
import {
  ResultsReportType,
  ResultsReportTypeByChallenge,
} from '../enums/Results';

// libraries
import type { Ref } from 'vue';

export interface ResultsResponse {
  data_report_url: string | null;
}

export interface useApiGetResultsReturn {
  isLoading: Ref<boolean>;
  load: (reportType: ResultsReportType) => Promise<ResultsResponse>;
}

export interface useApiGetResultsByChallengeReturn {
  isLoading: Ref<boolean>;
  load: (reportType: ResultsReportTypeByChallenge) => Promise<ResultsResponse>;
}

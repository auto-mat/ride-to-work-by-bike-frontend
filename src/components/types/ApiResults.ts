// libraries
import type { Ref } from 'vue';

export interface ResultsResponse {
  data_report_url: string | null;
}

export interface useApiGetResultsReturn {
  isLoading: Ref<boolean>;
  load: (reportType: string) => Promise<ResultsResponse>;
}

export interface useApiGetResultsByChallengeReturn {
  isLoading: Ref<boolean>;
  load: (reportType: string) => Promise<ResultsResponse>;
}

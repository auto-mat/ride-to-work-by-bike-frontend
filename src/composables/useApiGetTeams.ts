// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type { OrganizationTeam } from '../components/types/Organization';
import type { FormSelectTableOption } from '../components/types/Form';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface GetTeamsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationTeam[];
}

export const useApiGetTeams = (logger: Logger | null) => {
  const teams = ref<OrganizationTeam[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load teams
   * Fetches teams and saves them into options
   */
  const loadTeams = async (subsidiaryId: number): Promise<void> => {
    // reset options
    teams.value = [];

    // get teams
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch teams
    const { data } = await apiFetch<GetTeamsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiSubsidiaries}${subsidiaryId}/${rideToWorkByBikeConfig.urlApiTeams}`,
      method: 'get',
      translationKey: 'getTeams',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      teams.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of teams
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch next page
    const { data } = await apiFetch<GetTeamsResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getTeams',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      teams.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  const options = computed<FormSelectTableOption[]>(() => {
    return teams.value.map((team: OrganizationTeam): FormSelectTableOption => {
      return {
        label: team.name,
        value: team.id,
      };
    });
  });

  return {
    teams,
    options,
    isLoading,
    loadTeams,
  };
};

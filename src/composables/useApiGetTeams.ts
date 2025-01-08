// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';
import { useChallengeStore } from '../stores/challenge';

// types
import type { Logger } from '../components/types/Logger';
import type {
  GetTeamsResponse,
  OrganizationTeam,
  useApiGetTeamsReturn,
} from '../components/types/Organization';
import type { FormSelectTableOption } from '../components/types/Form';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get teams composable
 * Used to getting API teams data
 * @param logger - Logger
 * @returns {useApiGetTeamsReturn}
 */
export const useApiGetTeams = (logger: Logger | null): useApiGetTeamsReturn => {
  const teams = ref<OrganizationTeam[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const challengeStore = useChallengeStore();
  const { apiFetch } = useApi();

  /**
   * Load teams
   * Fetches teams and saves them into options
   */
  const loadTeams = async (subsidiaryId: number): Promise<void> => {
    // reset options
    logger?.debug(
      `Reseting default options <${JSON.stringify(teams.value, null, 2)}>.`,
    );
    // reset options
    teams.value = [];
    logger?.debug(
      `Default options set to <${JSON.stringify(teams.value, null, 2)}>.`,
    );

    // get teams
    logger?.info('Get teams from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

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
   * @param {string} url - Get teams next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of teams from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

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

  // Push results to options
  const options = computed<FormSelectTableOption[]>(() => {
    return teams.value.map(mapTeamToOption);
  });

  const mapTeamToOption = (team: OrganizationTeam): FormSelectTableOption => {
    return {
      label: team.name,
      value: team.id,
      members: team.members,
      maxMembers: challengeStore.getMaxTeamMembers,
    };
  };

  return {
    teams,
    options,
    isLoading,
    loadTeams,
    mapTeamToOption,
  };
};

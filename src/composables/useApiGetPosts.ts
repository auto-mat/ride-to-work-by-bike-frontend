// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';
// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';
import type { Offer, GetOffersParams } from '../components/types/Offer';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetPostsReturn = {
  posts: Ref<Offer[]>;
  isLoading: Ref<boolean>;
  loadPosts: (params: Partial<GetOffersParams>) => Promise<void>;
};

/**
 * Get posts composable
 * Used to enable calling the feed API to get posts
 * @param logger - Logger
 * @returns {UseApiGetPostsReturn}
 */
export const useApiGetPosts = (logger: Logger | null): UseApiGetPostsReturn => {
  const posts = ref<Offer[]>([]);
  const isLoading = ref<boolean>(false);

  // use feed URL for API fetch
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbFeedApi);

  /**
   * Load posts from the API
   * @param params - Query parameters for the API call
   */
  const loadPosts = async (params: Partial<GetOffersParams>): Promise<void> => {
    // reset posts
    logger?.debug(`Reseting posts <${JSON.stringify(posts.value, null, 2)}>.`);
    posts.value = [];

    // get posts
    logger?.info('Get posts from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      rideToWorkByBikeConfig.apiBaseRtwbbFeedBearerToken;

    // fetch posts
    const { data } = await apiFetch<Offer[]>({
      endpoint: '/',
      method: 'get',
      translationKey: 'getPosts',
      showSuccessMessage: false,
      params: params as Record<string, string>,
      logger,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
    });

    if (data?.length) {
      posts.value.push(...data);
    }

    isLoading.value = false;
  };

  return {
    posts,
    isLoading,
    loadPosts,
  };
};

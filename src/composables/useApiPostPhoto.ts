// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type { Photo } from '../components/types/ApiRegistration';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

const photoCaption = 'Profile photo';

interface UseApiPostPhotoReturn {
  isLoading: Ref<boolean>;
  postPhoto: (file: File) => Promise<Photo | null>;
}

/**
 * Composable for uploading a profile photo
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostPhotoReturn}
 */
export const useApiPostPhoto = (
  logger: Logger | null,
): UseApiPostPhotoReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Upload a profile photo
   * @param {File} file - Image file to upload
   * @returns {Promise<Photo | null>} - Uploaded photo data
   */
  const postPhoto = async (file: File): Promise<Photo | null> => {
    logger?.debug(`Upload profile photo <${file.name}>.`);
    isLoading.value = true;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', photoCaption);

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post photo
    const { data } = await apiFetch<Photo>({
      endpoint: rideToWorkByBikeConfig.urlApiPhoto,
      method: 'post',
      translationKey: 'uploadPhoto',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload: formData,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return { isLoading, postPhoto };
};

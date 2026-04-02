// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ExportFileType } from '../components/enums/Coordinator';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type { UseApiGetExportAttendanceReturn } from '../components/types/ApiExportAttendance';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get export attendance composable
 * Used for downloading attendance export files from the API
 * @param {Logger | null} logger
 * @returns {UseApiGetExportAttendanceReturn}
 */
export const useApiGetExportAttendance = (
  logger: Logger | null,
): UseApiGetExportAttendanceReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Download attendance export file
   * @param {ExportFileType} fileType - File format to export
   * @returns {Promise<void>}
   */
  const load = async (fileType: ExportFileType): Promise<void> => {
    logger?.debug(
      `Get export organization user attendance file type <${fileType}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<Blob>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCoordinatorOrganizationExport}${fileType}/`,
      method: 'get',
      translationKey: 'getExportAttendance',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
      responseType: 'blob',
    });

    if (data) {
      // trigger file download
      const filename = `organization-attendance.${fileType}`;
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    isLoading.value = false;
  };

  return {
    isLoading,
    load,
  };
};

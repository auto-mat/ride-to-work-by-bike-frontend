import type { Ref } from 'vue';
import type { ExportFileType } from '../enums/Coordinator';

export interface UseApiGetExportAttendanceReturn {
  isLoading: Ref<boolean>;
  load: (fileType: ExportFileType) => Promise<void>;
}

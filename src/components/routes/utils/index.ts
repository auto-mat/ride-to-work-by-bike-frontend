import { i18n } from '../../../boot/i18n';

import { RouteInputType, TransportType } from '../../types/Route';
import type { FormOption } from '../../types/Form';

const getRouteFormFieldOptions = (): FormOption[] => [
  {
    label: i18n.global.t('routes.actionInputDistance'),
    value: RouteInputType.inputNumber,
  },
  {
    label: i18n.global.t('routes.actionUploadFile'),
    value: RouteInputType.uploadFile,
  },
];

/**
 * Returns allowed transport types based on the given mode.
 * @param {boolean} isVacationMode - Whether vacation mode is active.
 * @return {TransportType[]} - The allowed transport types for the mode.
 */
const getAllowedTransportTypes = (isVacationMode: boolean): TransportType[] =>
  isVacationMode
    ? [TransportType.vacation, TransportType.none]
    : Object.values(TransportType).filter(
        (type) => type !== TransportType.vacation,
      );

export { getRouteFormFieldOptions, getAllowedTransportTypes };

import { i18n } from '../../../boot/i18n';

import { RouteInputType } from '../../types/Route';
import type { FormOption } from '../../types/Form';

const routeFormFieldOptions: FormOption[] = [
  {
    label: i18n.global.t('routes.actionInputDistance'),
    value: RouteInputType.inputNumber,
  },
  {
    label: i18n.global.t('routes.actionUploadFile'),
    value: RouteInputType.uploadFile,
  },
];

export { routeFormFieldOptions };

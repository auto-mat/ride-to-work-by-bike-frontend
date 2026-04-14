import { boot } from 'quasar/wrappers';

import { clickTrackEvt } from '../directives/events/track';

export default boot(({ app }) => {
  app.directive('click-track-evt', clickTrackEvt);
});

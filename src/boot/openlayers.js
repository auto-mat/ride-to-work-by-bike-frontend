import { boot } from 'quasar/wrappers';

import OpenLayersMap from 'vue3-openlayers';

export default boot(({ app }) => {
  app.use(OpenLayersMap);
});

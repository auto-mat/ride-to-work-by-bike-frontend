import { boot } from 'quasar/wrappers';

import VueLogger from 'vuejs3-logger';

const isProduction = process.env.NODE_ENV === 'production';

export const options = {
  // https://github.com/MarcSchaetz/vuejs3-logger#properties
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
};

export default boot(({ app }) => {
  app.use(VueLogger, options);
});

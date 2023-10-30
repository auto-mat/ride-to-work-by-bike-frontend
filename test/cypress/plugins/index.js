const path = require('path');
const { startDevServer } = require('@cypress/vite-dev-server');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', '..', 'vite.config.js'),
      },
    });
  });
};

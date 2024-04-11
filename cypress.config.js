const {
  injectQuasarDevServerConfig,
} = require('@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server');
const { defineConfig } = require('cypress');
const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

const { getAppConfig } = require('src/utils/get_app_conf');

module.exports = defineConfig({
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      on('task', {
        getAppConfig,
      });
      return config;
    },
    baseUrl: 'http://localhost:9000/',
    supportFile: 'test/cypress/support/e2e.js',
    specPattern: 'test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 60000,
    watchForFileChanges: false,
  },
  component: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      on('task', {
        getAppConfig,
      });
      return config;
    },
    supportFile: 'test/cypress/support/component.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'test/cypress/support/component-index.html',
    devServer: injectQuasarDevServerConfig(),
    defaultCommandTimeout: 60000,
  },
});

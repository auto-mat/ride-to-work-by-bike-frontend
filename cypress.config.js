import * as fs from 'fs';

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
        fileExists,
        deleteFile,
        readFile,
      });
      return config;
    },
    baseUrl: 'http://localhost:9000/',
    supportFile: 'test/cypress/support/e2e.js',
    specPattern: 'test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 60000,
    watchForFileChanges: true,
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

// Task to clean up created files after testing boilerplate script
function deleteFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err);
      // return null to indicate Cypress task success
      else resolve(null);
    });
  });
}

// Task to check the existence of a script-generated file
function fileExists(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function readFile(path) {
  return new Promise((resolve) => {
    if (fs.existsSync(path)) {
      resolve(fs.readFileSync(path, 'utf8'));
    }

    resolve(null);
  });
}

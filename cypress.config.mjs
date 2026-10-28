import * as fs from 'fs';
import { quasarComponentTestingConfig } from '@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server';
import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter';
import vitePreprocessor from 'cypress-vite';
import { getAppConfig } from './src/utils/get_app_conf.js';

export default defineConfig({
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: true,
  requestTimeout: 12000,
  e2e: {
    async setupNodeEvents(on, config) {
      // fixes default value for the NODE_ENV variable to prevent crash
      // with the `process is not defined` message
      if (process.env.NODE_ENV === undefined) {
        process.env.NODE_ENV = 'test';
      }
      // build e2e specs with app's Vite config
      const { getTestingConfig } = await import('@quasar/app-vite/testing');
      const viteConfig = await getTestingConfig();
      on('file:preprocessor', vitePreprocessor(viteConfig));
      addMatchImageSnapshotPlugin(on, config);
      installLogsPrinter(on, {
        printLogsToConsole: 'onFail',
        includeSuccessfulHookLogs: false,
        printLogsToFile: 'onFail',
        outputRoot: config.projectRoot + '/test/cypress/logs/',
        specRoot: 'e2e/',
        outputTarget: {
          'cypress-logs|txt': 'txt',
        },
      });
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
    modifyObstructiveCode: false,
  },
  component: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      installLogsPrinter(on, {
        printLogsToConsole: 'onFail',
        includeSuccessfulHookLogs: false,
        printLogsToFile: 'onFail',
        outputRoot: config.projectRoot + '/test/cypress/logs/',
        specRoot: 'component/',
        outputTarget: {
          'cypress-logs|txt': 'txt',
        },
      });
      on('task', {
        getAppConfig,
      });
      return config;
    },
    supportFile: 'test/cypress/support/component.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'test/cypress/support/component-index.html',
    ...quasarComponentTestingConfig(),
    // restore Cypress default, the extension's '' value breaks cy.intercept
    devServerPublicPathRoute: '/__cypress/src',
    defaultCommandTimeout: 60000,
    excludeSpecPattern: ['*/*/**/RoutesMap.cy.js'],
    modifyObstructiveCode: false,
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

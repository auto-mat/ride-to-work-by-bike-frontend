/* eslint-disable @typescript-eslint/no-require-imports */
import * as fs from 'fs';
import { injectQuasarDevServerConfig } from '@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server';
import { defineConfig } from 'cypress';
import path from 'path';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

const { getAppConfig } = require(
  path.join(__dirname, 'src/utils/get_app_conf'),
);

export default defineConfig({
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: true,
  requestTimeout: 12000,
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      require('cypress-terminal-report/src/installLogsPrinter')(on, {
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
  },
  component: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      require('cypress-terminal-report/src/installLogsPrinter')(on, {
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
    devServer: injectQuasarDevServerConfig(),
    defaultCommandTimeout: 60000,
    excludeSpecPattern: ['*/*/**/RoutesMap.cy.js'],
    // @ts-expect-error -- If not set it will break tests related to components that load public assets. See https://github.com/quasarframework/quasar-testing/issues/379
    devServerPublicPathRoute: '',
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

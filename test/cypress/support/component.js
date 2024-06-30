// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();

// Change this if you have a different entrypoint for the main scss.
import 'src/css/app.scss';
// Quasar styles
import 'quasar/src/css/index.sass';

// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import 'quasar/dist/icon-set/material-icons.umd.prod';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/dist/icon-set/mdi-v5.umd.prod';
import '@quasar/extras/mdi-v5/mdi-v5.css';
import 'quasar/dist/icon-set/ionicons-v4.umd.prod';
import '@quasar/extras/ionicons-v4/ionicons-v4.css';
import 'quasar/dist/icon-set/fontawesome-v5.umd.prod';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog } from 'quasar';
import VuePlugin from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.css';

// Since Cypress v10 we cannot import `config` directly from VTU as Cypress bundles its own version of it
// See https://github.com/cypress-io/cypress/issues/22611
import { mount, VueTestUtils } from 'cypress/vue';
const { config } = VueTestUtils;

// Example to import i18n from boot and use as plugin
// import { i18n } from 'src/boot/i18n';

// You can modify the global config here for all tests or pass in the configuration per test
// For example use the actual i18n instance or mock it
// config.global.plugins.push(i18n);
config.global.mocks = {
  $t: () => '',
};

// Overwrite the transition and transition-group stubs which are stubbed by test-utils by default.
// We do want transitions to show when doing visual testing :)
config.global.stubs = {};

installQuasarPlugin({ plugins: { Dialog } });

import VueLogger from 'vuejs3-logger';
import { register } from 'swiper/element/bundle';

import { options as loggerOptions } from '../../../src/boot/logger';
import { i18n as i18nApp } from '../../../src/boot/i18n';
// Import Vue router
import route from '../../../src/router';
import { initVars } from 'src/boot/global_vars';

// Initialize global variables
initVars();

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];

  // create router if one is not provided
  if (!options.router) {
    options.router = route();
  }

  // Register Swiper third party lib component
  register();

  // Add i18n plugin
  options.global.plugins.push({
    install(app) {
      app.use(options.router);
      app.use(i18nApp);
      app.use(VueLogger, loggerOptions);
      app.use(VuePlugin);
    },
  });

  return mount(component, options);
});

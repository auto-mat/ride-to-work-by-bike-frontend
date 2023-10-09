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

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog } from 'quasar';

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

import { options as loggerOptions } from '../../../src/boot/logger';
import { i18n as i18nApp } from '../../../src/boot/i18n';
import { register } from 'swiper/element/bundle';

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];

  // Register Swiper third party lib component
  register();

  // Add i18n plugin
  options.global.plugins.push({
    install(app) {
      app.use(i18nApp);
      app.use(VueLogger, loggerOptions);
    },
  });

  return mount(component, options);
});

import { routesConf } from '../../../src/router/routes_conf';

describe('Company coordinator page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['company_coordinator']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();

    it('renders left drawer', () => {
      cy.dataCy('q-drawer').should('be.visible');
      cy.dataCy('drawer-header').should('be.visible');
      cy.dataCy('user-select').should('be.visible');
      cy.dataCy('drawer-toggle-buttons').should('be.visible');
      cy.dataCy('drawer-menu').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['community']['path']);
      cy.viewport('iphone-6');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
  });
});

function coreTests() {}

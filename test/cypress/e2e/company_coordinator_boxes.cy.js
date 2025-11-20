import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Company coordinator boxes page', () => {
  context('previewing boxes', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // set system time to be in the correct active token window
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
            // setup coordinator test environment
            cy.setupCompanyCoordinatorTest(config, win.i18n);
            cy.visit(
              '#' + routesConf['coordinator_packages']['children']['fullPath'],
            );
            cy.dataCy('table-invoices-title').should('be.visible');
          });
        });
      });
    });

    it('should display the boxes table', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('table-boxes-title')
          .should('be.visible')
          .and('have.text', i18n.global.t('titleBoxes'));
      });
    });
  });
});

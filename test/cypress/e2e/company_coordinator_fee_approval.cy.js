import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Company coordinator fee approval page', () => {
  context('previewing members and approving payments', () => {
    beforeEach(() => {
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
            cy.setupCoordinatorFeeApprovalTest(config, win.i18n);
          });
        });
      });
    });
  });
});

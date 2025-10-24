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

    it('allows to approve single member payment', () => {
      cy.get('@config').then((config) => {
        cy.fixture('coordinatorFeeApprovalTest.json').then((test) => {
          cy.dataCy('table-fee-approval-not-approved').within(() => {
            cy.dataCy('table-fee-approval-row').should(
              'have.length',
              test.displayInitial.countWaitingForApproval,
            );
          });
          cy.dataCy('table-fee-approval-approved').within(() => {
            cy.dataCy('table-fee-approval-row').should(
              'have.length',
              test.displayInitial.countApproved,
            );
          });
          cy.waitForAdminOrganisationGetApi(
            test.fixtureAdminOrganisationInitial,
          );
          // check that initial admin organisation response is loaded
          cy.get('@getAdminOrganisation.all').should('have.length', 1);
          // intercept endpoints for approve payment responses
          cy.interceptCoordinatorApprovePaymentsPostApi(
            config,
            test.approvePayment.responseBody,
          );
          cy.interceptAdminOrganisationGetApi(
            config,
            test.fixtureAdminOrganisationAfterApproval,
          );
          // find row with selected member name
          cy.contains(test.approvePayment.name)
            .parent('tr')
            .should('be.visible')
            .find('[data-cy="table-fee-approval-checkbox"]')
            .click();
          // click approve button
          cy.dataCy('table-fee-approval-button')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
          // wait for API call to finish
          cy.waitForCoordinatorApprovePaymentsPostApi(
            test.approvePayment.requestPayload,
            test.approvePayment.responseBody,
          );
          cy.waitForAdminOrganisationGetApi(
            test.fixtureAdminOrganisationAfterApproval,
          );
          cy.get('@getAdminOrganisation.all').should('have.length', 2);
          // check that the member is approved
          cy.dataCy('table-fee-approval-not-approved').within(() => {
            cy.dataCy('table-fee-approval-row').should(
              'have.length',
              test.displayAfterApproval.countWaitingForApproval,
            );
          });
          cy.dataCy('table-fee-approval-approved').within(() => {
            cy.dataCy('table-fee-approval-row').should(
              'have.length',
              test.displayAfterApproval.countApproved,
            );
            cy.contains(test.approvePayment.name).should('be.visible');
          });
        });
      });
    });
  });
});

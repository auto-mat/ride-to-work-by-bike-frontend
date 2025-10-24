import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';
import testSet from '../fixtures/coordinatorFeeApprovalTest.json';

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

    testSet.forEach((test) => {
      it(`${test.description}`, () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            // check that initial admin organisation response is loaded
            cy.waitForAdminOrganisationGetApi(
              test.fixtureAdminOrganisationInitial,
            );
            cy.get('@getAdminOrganisation.all').should('have.length', 1);
            // test initial member distribution between tables
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
            // intercept endpoints for approve payment responses
            cy.interceptCoordinatorApprovePaymentsPostApi(
              config,
              test.approvePayment.responseBody,
            );
            cy.interceptAdminOrganisationGetApi(
              config,
              test.fixtureAdminOrganisationAfterApproval,
            );
            // select members to approve
            test.approvePayment.members.forEach((member) => {
              console.log('member.name:', member.name);
              // find row with selected member name
              cy.contains(member.name)
                .parent('tr')
                .should('be.visible')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
            });
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
              test.approvePayment.members.forEach((member) => {
                cy.contains(member.name).should('be.visible');
              });
            });
            if (test.approvePayment.success) {
              cy.contains(
                i18n.global.t(
                  'approvePayments.apiMessageSuccessWithCount',
                  { count: test.approvePayment.members.length },
                  test.approvePayment.members.length,
                ),
              ).should('be.visible');
            }
          });
        });
      });
    });
  });
});

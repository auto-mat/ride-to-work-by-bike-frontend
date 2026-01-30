import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';
import testSet from '../fixtures/coordinatorFeeApprovalTest.json';

describe('Company coordinator fee approval page', () => {
  context('previewing members and approving payments', () => {
    /**
     * Key intercepts within setupCompanyCoordinatorTest:
     * this_campaign: apiGetThisCampaign.json
     * coordinator/organization-structure: apiGetAdminOrganisationResponse.json
     * register-challenge: apiGetRegisterChallengeProfile.json
     */
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
            cy.setupCompanyCoordinatorTest(config, win.i18n);
          });
        });
      });
    });

    testSet.forEach((test) => {
      it(`${test.description}`, () => {
        cy.get('@config').then((config) => {
          cy.interceptAdminOrganisationGetApi(
            config,
            test.fixtureAdminOrganisationInitial,
          );
          cy.visit(
            '#' + routesConf['coordinator_fees']['children']['fullPath'],
          );
          cy.dataCy('table-fee-approval-not-approved-title').should(
            'be.visible',
          );
          cy.dataCy('table-fee-approval-approved-title').should('be.visible');
          cy.get('@i18n').then((i18n) => {
            // check that initial admin organisation response is loaded
            cy.waitForAdminOrganisationGetApi(
              test.fixtureAdminOrganisationInitial,
            );
            cy.get('@getAdminOrganisation.all').should('have.length', 1);
            cy.waitForCoordinatorInvoicesGetApi(
              'apiGetCoordinatorInvoicesResponse.json',
            );
            cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
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
              // find row with selected member name
              cy.contains(member.name)
                .parent('tr')
                .should('be.visible')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              if (member.changeReward) {
                // change reward input value
                cy.contains(member.name)
                  .parent('tr')
                  .should('be.visible')
                  .find('[data-cy="table-fee-approval-reward-checkbox"]')
                  .find('.q-checkbox__inner')
                  .click();
                const checkboxClass = member.changeRewardValue
                  ? 'q-checkbox__inner--truthy'
                  : 'q-checkbox__inner--falsy';
                cy.contains(member.name)
                  .parent('tr')
                  .should('be.visible')
                  .find('[data-cy="table-fee-approval-reward-checkbox"]')
                  .find('.q-checkbox__inner')
                  .should('have.class', checkboxClass);
              }
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
            // check that invoices are re-fetched after approval
            cy.waitForCoordinatorInvoicesGetApi(
              'apiGetCoordinatorInvoicesResponse.json',
            );
            cy.get('@getCoordinatorInvoices.all').should('have.length', 2);
            // after approval, check that members are in correct tables
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
              test.approvePayment.membersApproved.forEach((member) => {
                cy.contains(member.name).should('be.visible');
              });
            });
            if (test.approvePayment.success) {
              cy.contains(
                i18n.global.t(
                  'approvePayments.apiMessageSuccessWithCount',
                  { count: test.approvePayment.membersApproved.length },
                  test.approvePayment.membersApproved.length,
                ),
              ).should('be.visible');
            }
            if (test.approvePayment.error) {
              cy.contains(
                i18n.global.t('approvePayments.apiMessageErrorPartial'),
              ).should('be.visible');
            }
          });
        });
      });
    });
  });

  context('reward status toggling', () => {
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
            cy.setupCompanyCoordinatorTest(config, win.i18n);
            // override organisation structure
            cy.interceptAdminOrganisationGetApi(
              config,
              'apiGetAdminOrganisationResponseOlderPrice.json',
            );
          });
        });
      });
    });

    it('should update payment amount when toggling reward status multiple times', () => {
      cy.get('@config').then((config) => {
        // visit the fee approval page
        cy.visit('#' + routesConf['coordinator_fees']['children']['fullPath']);
        cy.dataCy('table-fee-approval-not-approved-title').should('be.visible');
        // wait for initial data load
        cy.waitForAdminOrganisationGetApi(
          'apiGetAdminOrganisationResponseOlderPrice.json',
        );
        // variables
        const memberName = 'Jana Novotná';
        const memberId = 20001;
        const originalAmount = 400;
        const amountWithoutReward = 350;
        cy.dataCy('table-fee-approval-not-approved').within(() => {
          // verify initial state
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              // amount
              cy.dataCy('table-fee-approval-amount').should(
                'contain',
                originalAmount,
              );
              // reward checkbox
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--truthy');
              // toggle reward OFF
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .click();
            });
          // verify amount changed
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              cy.dataCy('table-fee-approval-amount').should(
                'contain',
                amountWithoutReward,
              );
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--falsy');
            });
          // toggle reward NO
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .click();
            });
          // verify original amount
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              cy.dataCy('table-fee-approval-amount').should(
                'contain',
                originalAmount,
              );
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--truthy');
            });
          // toggle reward OFF
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .click();
            });
          // verify amount
          cy.contains(memberName)
            .parent('tr')
            .within(() => {
              cy.dataCy('table-fee-approval-amount').should(
                'contain',
                amountWithoutReward,
              );
              cy.dataCy('table-fee-approval-reward-checkbox')
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--falsy');
              // select member for approval
              cy.dataCy('table-fee-approval-checkbox').click();
            });
        });
        // intercept approval API call
        const expectedResponse = {
          message: 'Approved 1 payment successfully',
          approved_ids: [memberId],
        };
        cy.interceptCoordinatorApprovePaymentsPostApi(config, expectedResponse);
        // click approve
        cy.dataCy('table-fee-approval-button')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        // verify API request
        const expectedRequest = {
          ids: { [memberId]: amountWithoutReward },
        };
        cy.waitForCoordinatorApprovePaymentsPostApi(
          expectedRequest,
          expectedResponse,
        );
      });
    });
  });
});

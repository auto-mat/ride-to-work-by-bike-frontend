import { routesConf } from '../../../src/router/routes_conf';
import {
  systemTimeChallengeActive,
  systemTimeInvoicesPhaseInactive,
} from '../support/commonTests';
import testSet from '../fixtures/coordinatorInvoicesTest.json';

describe('Company coordinator invoices page', () => {
  context('previewing invoices', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
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
              '#' + routesConf['coordinator_invoices']['children']['fullPath'],
            );
            cy.dataCy('table-invoices-title').should('be.visible');
          });
        });
      });
    });

    testSet.forEach((test) => {
      it(`${test.description}`, () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            // check that initial admin organisation response is loaded
            cy.waitForCoordinatorInvoicesGetApi(
              test.fixtureCoordinatorInvoicesInitial,
            );
            cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
            // test initial table data
            cy.dataCy('table-invoices-row').should(
              'have.length',
              test.displayInitial.tableRows.length,
            );
            cy.dataCy('table-invoices-row').each((row, index) => {
              cy.verifyCoordinatorInvoicesTableRow(
                index,
                test.displayInitial.tableRows[index],
                i18n,
              );
            });
            // test creating an invoice
            cy.dataCy('button-create-invoice').click();
            cy.dataCy('dialog-create-invoice').should('be.visible');
            cy.dataCy('dialog-header').should(
              'contain',
              i18n.global.t('coordinator.titleCreateInvoice'),
            );
            cy.dataCy('form-create-invoice').should('be.visible');
            // test billing details
            const billingDetails =
              test.displayInitial.dialogCreateInvoice.billingDetails;
            cy.dataCy('form-create-invoice-organization-details')
              .should('be.visible')
              .and('contain', billingDetails.name)
              .and('contain', billingDetails.street)
              .and('contain', billingDetails.streetNumber)
              .and('contain', billingDetails.zip)
              .and('contain', billingDetails.city);
            cy.dataCy('form-create-invoice-organization-id')
              .should('be.visible')
              .and('contain', billingDetails.ico);
            cy.dataCy('form-create-invoice-organization-vat-id')
              .should('be.visible')
              .and('contain', billingDetails.dic);
            // confirm billing details toggle
            cy.dataCy('form-create-invoice-confirm-billing-details')
              .should('be.visible')
              .find('.q-toggle__inner')
              .should('have.class', 'q-toggle__inner--falsy');
            // test teams
            const teams = test.displayInitial.dialogCreateInvoice.teams;
            cy.dataCy('form-create-invoice-team').should('be.visible');
            cy.dataCy('form-create-invoice-team').should(
              'have.length',
              teams.length,
            );
            teams.forEach((team, index) => {
              cy.dataCy('form-create-invoice-team')
                .eq(index)
                .should('contain', team.name)
                .within(() => {
                  // test members
                  cy.dataCy('form-field-checkbox-team-item')
                    .should('be.visible')
                    .and('have.length', team.members.length);
                  team.members.forEach((member, memberIndex) => {
                    cy.dataCy('form-field-checkbox-team-item')
                      .eq(memberIndex)
                      .should('be.visible')
                      .and('contain', member.name)
                      .and('contain', member.amount);
                  });
                });
            });
            // test submitting the form
            cy.interceptCoordinatorMakeInvoicePostApi(
              config,
              test.postMakeInvoice.postResponse,
            );
            cy.interceptCoordinatorInvoicesGetApi(
              config,
              test.fixtureAdminInvoicesAfterMakeInvoice,
            );
            cy.dataCy('dialog-button-submit').click();
            // submit does not work without checking confirm billing details toggle
            cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
            // if additional information is provided, fill in the form
            if (test.postMakeInvoice.orderNumber) {
              cy.dataCy('form-create-invoice-order-number-input').type(
                test.postMakeInvoice.orderNumber,
              );
            }
            if (test.postMakeInvoice.clientNote) {
              cy.dataCy('form-create-invoice-note-input').type(
                test.postMakeInvoice.clientNote,
              );
            }
            if (test.postMakeInvoice.isDonorEntryFee) {
              cy.dataCy('form-create-invoice-donor-entry-fee-toggle')
                .find('.q-toggle__inner')
                .click();
              cy.dataCy('form-create-invoice-donor-entry-fee-toggle')
                .find('.q-toggle__inner')
                .should('have.class', 'q-toggle__inner--truthy');
            }
            cy.dataCy('form-create-invoice-confirm-billing-details')
              .find('.q-toggle__inner')
              .click();
            cy.dataCy('dialog-button-submit').click();
            // wait for API call to finish
            cy.get('@postCoordinatorMakeInvoice.all').should('have.length', 1);
            cy.get('@getCoordinatorInvoices.all').should('have.length', 2);
            cy.waitForCoordinatorMakeInvoicePostApi(
              test.postMakeInvoice.postPayload,
              test.postMakeInvoice.postResponse,
            );
            if (test.postMakeInvoice.success) {
              // check that the table has the correct number of rows
              cy.contains(
                i18n.global.t('makeInvoice.apiMessageSuccess'),
              ).should('be.visible');
              // check that dialog is closed
              cy.dataCy('dialog-create-invoice').should('not.exist');
              // test the updated invoices table
              cy.dataCy('table-invoices-row').each((row, index) => {
                cy.verifyCoordinatorInvoicesTableRow(
                  index,
                  test.displayAfterMakeInvoice.tableRows[index],
                  i18n,
                );
              });
            }
          });
        });
      });
    });

    it('does not allow to submit form when no payments are selected', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('button-create-invoice').click();
        cy.dataCy('dialog-create-invoice').should('be.visible');
        cy.dataCy('dialog-header').should(
          'contain',
          i18n.global.t('coordinator.titleCreateInvoice'),
        );
      });
      cy.dataCy('form-create-invoice-confirm-billing-details')
        .find('.q-toggle__inner')
        .click();
      // deselect all payments
      cy.dataCy('form-field-checkbox-team-item').each((item) => {
        cy.wrap(item).find('.q-checkbox__inner').click();
      });
      // submit button is disabled
      cy.dataCy('dialog-button-submit').should('be.disabled');
      // select at least one payment
      cy.dataCy('form-field-checkbox-team-item')
        .first()
        .find('.q-checkbox__inner')
        .click();
      cy.dataCy('dialog-button-submit').should('be.enabled');
    });
  });

  context('empty invoices', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
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
            // override coordinator invoices API response
            cy.interceptCoordinatorInvoicesGetApi(
              config,
              'apiGetCoordinatorInvoicesResponseEmpty.json',
            );
            cy.visit(
              '#' + routesConf['coordinator_invoices']['children']['fullPath'],
            );
            cy.dataCy('table-invoices-title').should('be.visible');
          });
        });
      });
    });

    it('does not allow to open create invoice dialog when no members are available', () => {
      // check that initial admin organisation response is loaded
      cy.waitForCoordinatorInvoicesGetApi(
        'apiGetCoordinatorInvoicesResponseEmpty.json',
      );
      cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
      // button should be disabled
      cy.dataCy('button-create-invoice')
        .should('be.visible')
        .and('have.attr', 'disabled');
    });
  });

  context('invoices phase changes to inactive', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
      // set system time to be in the correct active token window
      cy.clock(systemTimeInvoicesPhaseInactive, ['Date']).then(() => {
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
              '#' + routesConf['coordinator_invoices']['children']['fullPath'],
            );
            cy.dataCy('table-invoices-title').should('be.visible');
          });
        });
      });
    });

    it('does not allow to open dialog when invoices phase is inactive', () => {
      // check that initial admin organisation response is loaded
      cy.waitForCoordinatorInvoicesGetApi(
        'apiGetCoordinatorInvoicesResponse.json',
      );
      cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
      // button should be disabled
      cy.dataCy('button-create-invoice')
        .should('be.visible')
        .and('have.attr', 'disabled');
    });
  });

  context('invoices phase changes to inactive', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
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
              '#' + routesConf['coordinator_invoices']['children']['fullPath'],
            );
            cy.dataCy('table-invoices-title').should('be.visible');
          });
        });
      });
    });

    it('does not allow to send invoice request when invoices phase is inactive', () => {
      cy.get('@i18n').then((i18n) => {
        // check that initial admin organisation response is loaded
        cy.waitForCoordinatorInvoicesGetApi(
          'apiGetCoordinatorInvoicesResponse.json',
        );
        cy.get('@getCoordinatorInvoices.all').should('have.length', 1);
        // move clock from '2024-09-16T00:01:00.000Z' to '2024-10-08T00:01:00.000Z' (outside of invoices phase)
        cy.tick(22 * 24 * 60 * 60 * 1000);
        // test creating an invoice
        cy.dataCy('button-create-invoice').click();
        cy.dataCy('dialog-create-invoice').should('be.visible');
        cy.dataCy('dialog-header').should(
          'contain',
          i18n.global.t('coordinator.titleCreateInvoice'),
        );
        cy.dataCy('form-create-invoice').should('be.visible');
        cy.dataCy('form-create-invoice-confirm-billing-details')
          .find('.q-toggle__inner')
          .click();
        cy.dataCy('dialog-button-submit').click();
        // check that error message is displayed
        cy.contains(
          i18n.global.t('makeInvoice.apiMessageErrorNotInInvoicesPhase'),
        ).should('be.visible');
        cy.dataCy('dialog-create-invoice').should('be.visible');
      });
    });
  });
});

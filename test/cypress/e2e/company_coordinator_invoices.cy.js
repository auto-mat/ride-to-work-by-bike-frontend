import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';
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
              test.displayInitial.countInvoices,
            );
            cy.dataCy('table-invoices-row').each((row, index) => {
              cy.wrap(row).within(() => {
                cy.dataCy('table-invoices-exposure-date').should(
                  'contain',
                  test.displayInitial.tableRows[index].exposureDate,
                );
                cy.dataCy('table-invoices-order-number').should(
                  'contain',
                  test.displayInitial.tableRows[index].orderNumber,
                );
                cy.dataCy('table-invoices-url')
                  .find('.q-btn')
                  .invoke('attr', 'href')
                  .should(
                    'contain',
                    test.displayInitial.tableRows[index].invoiceUrl,
                  );
                cy.dataCy('table-invoices-payment-count').should(
                  'contain',
                  test.displayInitial.tableRows[index].paymentCount,
                );
                cy.dataCy('table-invoices-total-amount').should(
                  'contain',
                  test.displayInitial.tableRows[index].totalAmount,
                );
                if (test.displayInitial.tableRows[index].paidDate) {
                  cy.dataCy('table-invoices-paid-date').should(
                    'contain',
                    test.displayInitial.tableRows[index].paidDate,
                  );
                } else {
                  cy.dataCy('table-invoices-paid-date').should(
                    'contain',
                    i18n.global.t('table.labelNotConfirmed'),
                  );
                }
              });
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
            cy.dataCy('form-create-invoice-confirm-billing-details')
              .find('.q-toggle__inner')
              .click();
            cy.dataCy('dialog-button-submit').click();
            // wait for API call to finish
            cy.get('@postCoordinatorMakeInvoice.all').should('have.length', 1);
            cy.get('@getCoordinatorInvoices.all').should('have.length', 2);
          });
        });
      });
    });
  });
});

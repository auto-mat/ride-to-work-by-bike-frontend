/**
 * Admin API Commands for Cypress
 * Contains commands for intercepting and waiting for admin-related API calls
 */

import { computed } from 'vue';
import { httpSuccessfullStatus } from '../commonTests';
import { getApiBaseUrlWithLang } from '../../../../src/utils/get_api_base_url_with_lang';
import { bearerTokeAuth } from '../../../../src/utils';
import { defLocale } from '../../../../src/i18n/def_locale';

/**
 * Set admin organisation store state with invoices and organization data
 * @param {Object} data - Object with `store`, `invoices` and `organizations` properties
 */
Cypress.Commands.add(
  'setAdminOrganisationStoreState',
  ({ store, invoices = null, organizations = null }) => {
    cy.wrap(store).then((adminOrganisationStore) => {
      if (invoices) {
        const adminInvoices = computed(
          () => adminOrganisationStore.getAdminInvoices,
        );
        adminOrganisationStore.setAdminInvoices(invoices);
        cy.wrap(adminInvoices).its('value').should('deep.equal', invoices);
      }
      if (organizations) {
        const adminOrganizations = computed(
          () => adminOrganisationStore.getAdminOrganisations,
        );
        adminOrganisationStore.setAdminOrganisations(organizations);
        cy.wrap(adminOrganizations)
          .its('value')
          .should('deep.equal', organizations);
      }
      adminOrganisationStore.initializeSelectedMembers();
    });
  },
);

/**
 * Intercept admin organisation GET API call
 * Provides `@getAdminOrganisation` and `@getAdminOrganisationNextPage` aliases
 * Note: This command is never used with next page intercepts
 * @param {Object} config - App global config
 * @param {string} responseFixture - Fixture name for response data
 */
Cypress.Commands.add(
  'interceptAdminOrganisationGetApi',
  (config, responseFixture) => {
    const {
      apiBase,
      apiDefaultLang,
      urlApiOrganizationAdminOrganizationStructure,
    } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      defLocale,
    );
    const urlApiAdminOrganisationLocalized = `${apiBaseUrl}${urlApiOrganizationAdminOrganizationStructure}`;

    cy.fixture(responseFixture).then((adminOrganisationResponse) => {
      cy.intercept('GET', urlApiAdminOrganisationLocalized, {
        statusCode: httpSuccessfullStatus,
        body: adminOrganisationResponse,
      }).as('getAdminOrganisation');
    });
  },
);

/**
 * Wait for intercept admin organisation GET API calls and compare request/response object
 * Wait for `@getAdminOrganisation` and `@getAdminOrganisationNextPage` intercepts
 * Note: This command is never used with next page intercepts
 * @param {string} responseFixture - Fixture name for response data
 */
Cypress.Commands.add('waitForAdminOrganisationGetApi', (responseFixture) => {
  cy.fixture(responseFixture).then((adminOrganisationResponse) => {
    cy.wait('@getAdminOrganisation').then((getAdminOrganisation) => {
      // Verify authorization header
      expect(getAdminOrganisation.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      // Verify response
      if (getAdminOrganisation.response) {
        expect(getAdminOrganisation.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(getAdminOrganisation.response.body).to.deep.equal(
          adminOrganisationResponse,
        );
      }
    });
  });
});

/**
 * Intercept coordinator approve payments POST API call
 * Provides `@postCoordinatorApprovePayments` alias
 * @param {Object} config - App global config
 * @param {Object} responseData - Response data object
 */
Cypress.Commands.add(
  'interceptCoordinatorApprovePaymentsPostApi',
  (config, responseData) => {
    const { apiBase, apiDefaultLang, urlApiCoordinatorApprovePayments } =
      config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      defLocale,
    );
    const urlApiCoordinatorApprovePaymentsLocalized = `${apiBaseUrl}${urlApiCoordinatorApprovePayments}`;

    cy.intercept('POST', urlApiCoordinatorApprovePaymentsLocalized, {
      statusCode: httpSuccessfullStatus,
      body: responseData,
    }).as('postCoordinatorApprovePayments');
  },
);

/**
 * Wait for intercept coordinator approve payments POST API call and compare request/response object
 * Wait for `@postCoordinatorApprovePayments` intercept
 * @param {Object} requestData - Expected request data object
 * @param {Object} responseData - Expected response data object
 */
Cypress.Commands.add(
  'waitForCoordinatorApprovePaymentsPostApi',
  (requestData, responseData) => {
    cy.wait('@postCoordinatorApprovePayments').then(({ request, response }) => {
      // Verify authorization header
      expect(request.headers.authorization).to.include(bearerTokeAuth);
      // Verify request body
      expect(request.body).to.deep.equal(requestData);
      // Verify response
      if (response) {
        expect(response.statusCode).to.equal(httpSuccessfullStatus);
        expect(response.body).to.deep.equal(responseData);
      }
    });
  },
);

/**
 * Intercept coordinator invoices GET API call
 * Provides `@getCoordinatorInvoices` alias
 * @param {Object} config - App global config
 * @param {string} responseFixture - Fixture name for response data
 */
Cypress.Commands.add(
  'interceptCoordinatorInvoicesGetApi',
  (config, responseFixture) => {
    const { apiBase, apiDefaultLang, urlApiCoordinatorInvoices } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      defLocale,
    );
    const urlApiCoordinatorInvoicesLocalized = `${apiBaseUrl}${urlApiCoordinatorInvoices}`;

    cy.fixture(responseFixture).then((coordinatorInvoicesResponse) => {
      cy.intercept('GET', urlApiCoordinatorInvoicesLocalized, {
        statusCode: httpSuccessfullStatus,
        body: coordinatorInvoicesResponse,
      }).as('getCoordinatorInvoices');
    });
  },
);

/**
 * Wait for intercept coordinator invoices GET API calls and compare request/response object
 * Wait for `@getCoordinatorInvoices` intercept
 * @param {string} responseFixture - Fixture name for response data
 */
Cypress.Commands.add('waitForCoordinatorInvoicesGetApi', (responseFixture) => {
  cy.fixture(responseFixture).then((coordinatorInvoicesResponse) => {
    cy.wait('@getCoordinatorInvoices').then((getCoordinatorInvoices) => {
      // Verify authorization header
      expect(getCoordinatorInvoices.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      // Verify response
      if (getCoordinatorInvoices.response) {
        expect(getCoordinatorInvoices.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(getCoordinatorInvoices.response.body).to.deep.equal(
          coordinatorInvoicesResponse,
        );
      }
    });
  });
});

/**
 * Intercept coordinator make invoice POST API call
 * Provides `@postCoordinatorMakeInvoice` alias
 * @param {Object} config - App global config
 * @param {Object} responseData - Response data object
 */
Cypress.Commands.add(
  'interceptCoordinatorMakeInvoicePostApi',
  (config, responseData) => {
    const { apiBase, apiDefaultLang, urlApiCoordinatorMakeInvoice } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      defLocale,
    );
    const urlApiCoordinatorMakeInvoiceLocalized = `${apiBaseUrl}${urlApiCoordinatorMakeInvoice}`;

    cy.intercept('POST', urlApiCoordinatorMakeInvoiceLocalized, {
      statusCode: httpSuccessfullStatus,
      body: responseData,
    }).as('postCoordinatorMakeInvoice');
  },
);

/**
 * Wait for intercept coordinator make invoice POST API call and compare request/response object
 * Wait for `@postCoordinatorMakeInvoice` intercept
 * @param {Object} requestData - Expected request data object
 * @param {Object} responseData - Expected response data object
 */
Cypress.Commands.add(
  'waitForCoordinatorMakeInvoicePostApi',
  (requestData, responseData) => {
    cy.wait('@postCoordinatorMakeInvoice').then(({ request, response }) => {
      // Verify authorization header
      expect(request.headers.authorization).to.include(bearerTokeAuth);
      // Verify request body
      expect(request.body).to.deep.equal(requestData);
      // Verify response
      if (response) {
        expect(response.statusCode).to.equal(httpSuccessfullStatus);
        expect(response.body).to.deep.equal(responseData);
      }
    });
  },
);

/**
 * Verify coordinator invoices table row data
 * @param {number} index - Row index
 * @param {Object} tableRowData - Expected table row data object
 * @param {Object} i18n - Vue i18n instance for translations
 */
Cypress.Commands.add(
  'verifyCoordinatorInvoicesTableRow',
  (index, tableRowData, i18n) => {
    cy.dataCy('table-invoices-row')
      .eq(index)
      .within(() => {
        cy.dataCy('table-invoices-exposure-date').should(
          'contain',
          tableRowData.exposureDate,
        );
        cy.dataCy('table-invoices-order-number').should(
          'contain',
          tableRowData.orderNumber,
        );
        cy.dataCy('table-invoices-url')
          .find('.q-btn')
          .invoke('attr', 'href')
          .should('contain', tableRowData.invoiceUrl);
        cy.dataCy('table-invoices-payment-count').should(
          'contain',
          tableRowData.paymentCount,
        );
        cy.dataCy('table-invoices-total-amount').should(
          'contain',
          tableRowData.totalAmount,
        );
        if (tableRowData.paidDate) {
          cy.dataCy('table-invoices-paid-date').should(
            'contain',
            tableRowData.paidDate,
          );
        } else {
          cy.dataCy('table-invoices-paid-date').should(
            'contain',
            i18n.global.t('table.labelNotConfirmed'),
          );
        }
      });
  },
);

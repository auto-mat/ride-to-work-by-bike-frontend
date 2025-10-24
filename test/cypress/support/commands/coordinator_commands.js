/**
 * Admin API Commands for Cypress
 * Contains commands for intercepting and waiting for admin-related API calls
 */

import { httpSuccessfullStatus } from './commonTests';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';
import { bearerTokeAuth } from '../../../src/utils';
import { defLocale } from '../../../src/i18n/def_locale';

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
      // intercept initial admin organisation API call
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
      // Verify authorization header for initial request
      expect(getAdminOrganisation.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      // Verify initial response
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

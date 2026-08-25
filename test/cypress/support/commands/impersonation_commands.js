/**
 * Impersonation Commands
 * Contains commands for setting up mock impersonation.
 */

import { bearerTokeAuth } from '../../../../src/utils';
import { routesConf } from '../../../../src/router/routes_conf';
import { defLocale } from '../../../../src/i18n/def_locale';

/**
 * Build a mock JWT token with payload
 * @param {Object} payload - JWT payload object
 * @returns {string} mock JWT string
 */
export function createMockJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}

/**
 * Build impersonation access/refresh tokens
 * Provides `@impersonationTokens` alias with `{ accessToken, refreshToken, email, pk }`.
 * @param {Object} overrides - Override default pk / email / refreshToken / exp
 */
Cypress.Commands.add('getImpersonationTokens', (overrides = {}) => {
  const pk = overrides.pk ?? 123;
  const email = overrides.email ?? 'impersonated-user@example.com';
  const refreshToken = overrides.refreshToken ?? 'impersonated-refresh-token';
  const exp = overrides.exp ?? Math.floor(Date.now() / 1000) + 3600;
  const accessToken = createMockJWT({ user: { pk, email }, exp });
  const tokens = { accessToken, refreshToken, email, pk };

  cy.wrap(tokens).as('impersonationTokens');
});

/**
 * Intercept API calls triggered by `redirectHomeAfterLogin()`
 * @param {Object} config - App global config
 */
Cypress.Commands.add('interceptImpersonationRedirectHomeApis', (config) => {
  cy.fixture('loginRegisterResponseChallengeActive').then((loginResponse) => {
    cy.fixture('refreshTokensResponseChallengeActive').then(
      (refreshTokensResponse) => {
        cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
          config,
          defLocale,
          loginResponse,
          null,
          refreshTokensResponse,
          null,
          { has_user_verified_email_address: true },
        );
      },
    );
  });
  cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
    cy.interceptRegisterChallengeGetApi(config, defLocale, response);
  });
  cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then((response) => {
    cy.interceptIsUserOrganizationAdminGetApi(config, defLocale, response);
  });
});

/**
 * Wait for all API calls triggered by `redirectHomeAfterLogin()`
 */
Cypress.Commands.add('waitForImpersonationRedirectHomeApis', () => {
  cy.wait(['@verifyEmailRequest', '@thisCampaignRequest']);
  cy.wait(['@getRegisterChallenge', '@getIsUserOrganizationAdmin']).spread(
    (getRegisterChallenge, getIsUserOrganizationAdmin) => {
      [getRegisterChallenge, getIsUserOrganizationAdmin].forEach(
        (interception) => {
          expect(interception.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
        },
      );
    },
  );
});

/**
 * Visit the home route with impersonation tokens in the URL query string.
 * Simulates the redirect from Django admin.
 * @param {Object} tokens - `{ accessToken, refreshToken }`
 */
Cypress.Commands.add('startImpersonation', ({ accessToken, refreshToken }) => {
  cy.visit(
    '#' +
      routesConf['home']['path'] +
      `?refreshToken=${encodeURIComponent(refreshToken)}&accessToken=${encodeURIComponent(accessToken)}`,
  );
});

/**
 * Setup for impersonation test: build tokens, intercept APIs,
 * visit the impersonation URL, and wait for the user's data to load.
 * Provides the `@impersonationTokens` alias.
 * @param {Object} config - App global config
 */
Cypress.Commands.add('beginImpersonation', (config) => {
  cy.getImpersonationTokens();
  cy.interceptImpersonationRedirectHomeApis(config);
  cy.get('@impersonationTokens').then((tokens) => {
    cy.startImpersonation(tokens);
  });
  cy.waitForImpersonationRedirectHomeApis();
});

/**
 * Verify impersonation banner is visible and displays user email.
 * @param {string} email - Expected user email
 */
Cypress.Commands.add('assertImpersonationBannerVisible', (email) => {
  cy.dataCy('impersonation-banner').should('be.visible');
  cy.dataCy('impersonation-banner').should('contain', email);
});

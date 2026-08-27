import { defLocale } from '../../../../src/i18n/def_locale';
import { bearerTokeAuth } from '../../../../src/utils';

/**
 * Intercept login user with token register challenge or home page
 *
 * @param {object} config - App configuration object
 * @param {string} registerChallengeResponse - Register challenge response fixture
 *                                             file name
 *
 */
Cypress.Commands.add(
  'interceptLoginUserWithTokensRegisterChallengeOrHomePage',
  (config, registerChallengeResponse) => {
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
    cy.fixture('apiGetAgeGroupsResponse').then((response) => {
      cy.interceptAgeGroupsGetApi(config, defLocale, response);
    });
    cy.fixture('apiGetOccupationsResponse').then((response) => {
      cy.interceptOccupationsGetApi(config, defLocale, response);
    });
    cy.fixture(registerChallengeResponse).then((response) => {
      cy.interceptRegisterChallengeGetApi(config, defLocale, response);
    });
    cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
      (response) => {
        cy.interceptIsUserOrganizationAdminGetApi(config, defLocale, response);
      },
    );
  },
);

/**
 * Wait for intercepting login user with token register challenge or home page
 */
Cypress.Commands.add(
  'waitInterceptLoginUserWithTokensRegisterChallengeOrHomePage',
  () => {
    cy.wait(['@verifyEmailRequest', '@thisCampaignRequest']);
    cy.wait([
      '@getRegisterChallenge',
      '@getIsUserOrganizationAdmin',
      '@occupationsGetApi',
      '@ageGroupsGetApi',
    ]).spread(
      (
        getRegisterChallenge,
        getIsUserOrganizationAdmin,
        occupationsGetApi,
        ageGroupsGetApi,
      ) => {
        [
          getRegisterChallenge,
          getIsUserOrganizationAdmin,
          occupationsGetApi,
          ageGroupsGetApi,
        ].forEach((interception) => {
          expect(interception.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
        });
      },
    );
  },
);

/**
 * Check logged user notify message
 *
 * @param {object} user - User login object data
 *                        {
 *                           pk: pk,
 *                           first_name: first_name,
 *                           last_name: last_name,
 *                           email: email
 *                         }
 */
Cypress.Commands.add('checkLoggedUserNotifyMessage', (user) => {
  cy.window().should('have.property', 'i18n');
  cy.window().then((win) => {
    const notificationSelector = '[role="showUserNotifyMessage"]';
    cy.get(notificationSelector).should('be.visible');
    cy.get(`${notificationSelector} i:first`)
      .invoke('text')
      .should('contain', 'warning');
    cy.get(`${notificationSelector} i:last`)
      .invoke('text')
      .should('contain', 'close');
    cy.get(notificationSelector).then(($el) => {
      const translation = win.i18n.global.t(
        'login.showLoggedUserNotifyMessage',
        {
          user: `${user.first_name} ${user.last_name}, ${user.email}`,
        },
      );
      expect($el.text()).to.contain(translation);
    });
    cy.get(`${notificationSelector} i:last`).click();
    cy.get('[role="showUserNotifyMessage"]').should('not.be.visible');
  });
});

/**
 * Check logged user notify message
 *
 * @param {object} payload - Token expiration date time with user
 *                           login object data
 *                           {
 *                             user: {
 *                               pk: pk,
 *                               first_name: first_name,
 *                               last_name: last_name,
 *                               email: email
 *                              },
 *                             exp: token expiration date time
 *                           },
 */
Cypress.Commands.add('createFakeJwtToken', (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return cy.wrap(`${encodedHeader}.${encodedPayload}.mock-signature`);
});

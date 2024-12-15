// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// DO NOT REMOVE
// Imports Quasar Cypress AE predefined commands
import { registerCommands } from '@quasar/quasar-app-extension-testing-e2e-cypress';
registerCommands();

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from './commonTests';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';
import { bearerTokeAuth } from '../../../src/utils';

// Fix for ResizeObserver loop issue in Firefox
// see https://stackoverflow.com/questions/74947338/i-keep-getting-error-resizeobserver-loop-limit-exceeded-in-cypress
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
const resizeObserverLoopCompletedRe =
  /^[^(ResizeObserver loop completed with undelivered notifications)]/;
Cypress.on('uncaught:exception', (err) => {
  if (
    resizeObserverLoopErrRe.test(err.message) ||
    resizeObserverLoopCompletedRe.test(err.message)
  ) {
    return false;
  }
});

Cypress.Commands.add(
  'testLanguageStringsInContext',
  (translationStrings, translationContext, i18n) => {
    const translationKeyList = translationStrings.map(
      (item) => `${translationContext}.${item}`,
    );

    translationKeyList.forEach((translationKey) => {
      // set global locale to English
      i18n.global.locale = 'en';
      const defaultEnglishString = i18n.global.t(
        translationKey,
        {},
        { locale: 'en' },
      );

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          // set to the tested locale
          i18n.global.locale = locale;

          const translatedString = i18n.global.t(
            translationKey,
            {},
            { locale: locale },
          );

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .should('have.length.at.least', 1)
            .and('not.equal', defaultEnglishString);
        });
    });
  },
);

Cypress.Commands.add(
  'testElementPercentageWidth',
  ($element, expectedPercentage) => {
    $element.then(($el) => {
      // fix bug where scrollbar is modifying child width
      cy.wrap($el.parent())
        .invoke('attr', 'style', 'overflow: hidden')
        .then(() => {
          const actualWidth = $el.outerWidth();
          const parentWidth = $el.parent().outerWidth();
          const calculatedPercentage = (actualWidth / parentWidth) * 100;

          expect(calculatedPercentage).to.be.closeTo(
            Number(expectedPercentage),
            2,
          );
        });
    });
  },
);

Cypress.Commands.add('testImageHeight', ($img) => {
  cy.wrap($img[0]).should('have.prop', 'naturalHeight').should('be.gt', 0);
});

/**
 * Custom testImageSrcAlt command that provides a standardized test
 * for any image.
 *
 * @param {string} dataCySelector - data-cy-selector of the HTML element
 * @param {string} src - src attribute
 * @param {string} alt - alt attribute
 */
Cypress.Commands.add('testImageSrcAlt', (dataCySelector, src, alt) => {
  // test height
  cy.dataCy(dataCySelector).invoke('height').should('be.gt', 0);
  // test src and alt atributes
  cy.dataCy(dataCySelector)
    .find('img')
    .should('have.attr', 'src', src)
    .should('have.attr', 'alt', alt);
});

Cypress.Commands.add('testMessageLanguageSelect', (i18n) => {
  const locales = i18n.global.availableLocales;
  locales.forEach((locale) => {
    cy.dataCy('invite-language-input').select(
      i18n.global.t(`language.${locale}`),
    );
    cy.dataCy('title-message')
      .should('be.visible')
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage', locale)).then(
          (text) => {
            expect(textContent).to.contain(text);
          },
        );
      });
    cy.dataCy('text-message')
      .should('be.visible')
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(i18n.global.t('onboarding.textMessage', locale)).then(
          (text) => {
            expect(textContent).to.contain(text);
          },
        );
      });
  });
});

/**
 * Custom matchImageSnapshot command that disables the vertical and
 * horizontal scrollbar before the snaphost is taken and then enables
 * them after the snapshot is taken.
 *
 * It ensures the same size of the snaphot image during the creation of
 * the snaphot in different web browsers by disabling the scrollbar,
 * due different width which is the source of the different size of
 * the snapshot across web browsers e.g. Mozilla Firefox vs. Google
 * Chrome.
 *
 * @param {string} dataCySelector - data-cy-selector of the HTML element
                                    which hold scrollbar
 * @param {number} failureThreshold - matchImageSnapshot func failureThreshold
 *                                    param arg
 * @param {string} failureThresholdType - matchImageSnapshot func
 *                                        failureThresholdType param arg
 *
*/
Cypress.Commands.add(
  'matchImageSnapshotWithHiddenScrollbars',
  (dataCySelector, failureThreshold, failureThresholdType) => {
    cy.dataCy(dataCySelector)
      .invoke('attr', 'style', 'overflow: hidden')
      .find('img')
      .matchImageSnapshot({
        failureThreshold: failureThreshold,
        failureThresholdType: failureThresholdType,
      });
    cy.dataCy(dataCySelector).invoke('attr', 'style', 'overflow: auto');
  },
);

Cypress.Commands.add(
  'matchImageSnapshotNamed',
  (dataCySelector, name, failureThreshold = 0.1) => {
    cy.dataCy(dataCySelector).matchImageSnapshot({
      name,
      failureThreshold: failureThreshold,
      failureThresholdType: 'percent',
      customDiffConfig: { threshold: 0.4 },
      retries: 2,
    });
  },
);

Cypress.Commands.add('stripHtmlTags', (htmlString) => {
  cy.wrap(htmlString.replace(/<\/?[^>]+(>|$)/g, ''));
});

Cypress.Commands.add(
  'testElementsSideBySide',
  (elementSelector, siblingElementSelector) => {
    cy.dataCy(elementSelector).then((element) => {
      const offsetTop = element[0].offsetTop;
      const offsetHeight = element[0].offsetHeight;
      cy.dataCy(siblingElementSelector).then((sibling) => {
        const siblingOffsetTop = sibling[0].offsetTop;
        const siblingOffsetHeight = sibling[0].offsetHeight;
        expect(Math.round(offsetTop + offsetHeight / 2)).to.be.eq(
          Math.round(siblingOffsetTop + siblingOffsetHeight / 2),
        );
      });
    });
  },
);

Cypress.Commands.add(
  'testElementsStacked',
  (elementSelector, siblingElementSelector) => {
    cy.dataCy(elementSelector).then((element) => {
      const offsetTop = element[0].offsetTop;
      const offsetHeight = element[0].offsetHeight;
      cy.dataCy(siblingElementSelector).then((sibling) => {
        const siblingOffsetTop = sibling[0].offsetTop;
        expect(Math.round(offsetTop + offsetHeight)).to.be.lte(
          Math.round(siblingOffsetTop),
        );
      });
    });
  },
);

Cypress.Commands.add('testSoacialMediaUrlRequest', (rideToWorkByBikeConfig) => {
  cy.request({
    url: rideToWorkByBikeConfig.urlFacebook,
    failOnStatusCode: failOnStatusCode,
    headers: { ...userAgentHeader },
  }).then((resp) => {
    if (resp.status === httpTooManyRequestsStatus) {
      cy.log(httpTooManyRequestsStatusMessage);
      return;
    }
    expect(resp.status).to.eq(httpSuccessfullStatus);
  });
  cy.request({
    url: rideToWorkByBikeConfig.urlInstagram,
    failOnStatusCode: failOnStatusCode,
    headers: { ...userAgentHeader },
  }).then((resp) => {
    if (resp.status === httpTooManyRequestsStatus) {
      cy.log(httpTooManyRequestsStatusMessage);
      return;
    }
    expect(resp.status).to.eq(httpSuccessfullStatus);
  });
  cy.request({
    url: rideToWorkByBikeConfig.urlTwitter,
    failOnStatusCode: failOnStatusCode,
    headers: { ...userAgentHeader },
  }).then((resp) => {
    if (resp.status === httpTooManyRequestsStatus) {
      cy.log(httpTooManyRequestsStatusMessage);
      return;
    }
    expect(resp.status).to.eq(httpSuccessfullStatus);
  });
  cy.request({
    url: rideToWorkByBikeConfig.urlYoutube,
    failOnStatusCode: failOnStatusCode,
    headers: { ...userAgentHeader },
  }).then((resp) => {
    if (resp.status === httpTooManyRequestsStatus) {
      cy.log(httpTooManyRequestsStatusMessage);
      return;
    }
    expect(resp.status).to.eq(httpSuccessfullStatus);
  });
});

/**
 * Intercept cities GET API calls
 * Provides `@getCities` and `@getCitiesNextPage` aliases
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 */
Cypress.Commands.add('interceptCitiesGetApi', (config, i18n) => {
  const { apiBase, apiDefaultLang, urlApiCities } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiCitiesLocalized = `${apiBaseUrl}${urlApiCities}`;

  cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
    // intercept initial cities API call
    cy.intercept('GET', urlApiCitiesLocalized, {
      statusCode: httpSuccessfullStatus,
      body: citiesResponse,
    }).as('getCities');
    // if fixture has next property
    if (citiesResponse.next) {
      cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
        // intercept next page API call
        cy.intercept('GET', citiesResponse.next, {
          statusCode: httpSuccessfullStatus,
          body: citiesResponseNext,
        }).as('getCitiesNextPage');
      });
    }
  });
});

/**
 * Wait for intercept cities API calls and compare request/response object
 * Wait for `@getCities` and `@getCitiesNextPage` intercepts
 * @param {object} citiesResponse - Get cities API data response
 * @param {object} citiesResponseNext - Get cities API data response next page
 */
Cypress.Commands.add('waitForCitiesApi', () => {
  cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
    cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
      cy.wait(['@getCities', '@getCitiesNextPage']).spread(
        (getCities, getCitiesNextPage) => {
          expect(getCities.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
          if (getCities.response) {
            expect(getCities.response.statusCode).to.equal(
              httpSuccessfullStatus,
            );
            expect(getCities.response.body).to.deep.equal(citiesResponse);
          }
          expect(getCitiesNextPage.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
          if (getCitiesNextPage.response) {
            expect(getCitiesNextPage.response.statusCode).to.equal(
              httpSuccessfullStatus,
            );
            expect(getCitiesNextPage.response.body).to.deep.equal(
              citiesResponseNext,
            );
          }
        },
      );
    });
  });
});

/**
 * Intercept teams GET API calls
 * Provides `@getTeams` and `@getTeamsNextPage` aliases
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {number} subsidiaryId - Subsidiary ID
 * @param {object} teamsResponse - Optional override for teams response data
 * @param {object} teamsResponseNext - Optional override for teams next page response data
 */
Cypress.Commands.add(
  'interceptTeamsGetApi',
  (config, i18n, subsidiaryId, teamsResponse, teamsResponseNext) => {
    const { apiBase, apiDefaultLang, urlApiSubsidiaries, urlApiTeams } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiTeamsLocalized = `${apiBaseUrl}${urlApiSubsidiaries}${subsidiaryId}/${urlApiTeams}`;

    cy.fixture('apiGetTeamsResponse').then((defaultTeamsResponse) => {
      cy.fixture('apiGetTeamsResponseNext').then((defaultTeamsResponseNext) => {
        // intercept initial teams API call
        cy.intercept('GET', urlApiTeamsLocalized, {
          statusCode: httpSuccessfullStatus,
          body: teamsResponse || defaultTeamsResponse,
        }).as('getTeams');

        // intercept next page API call
        cy.intercept('GET', defaultTeamsResponse.next, {
          statusCode: httpSuccessfullStatus,
          body: teamsResponseNext || defaultTeamsResponseNext,
        }).as('getTeamsNextPage');
      });
    });
  },
);

/**
 * Intercept subsidiaries GET API calls
 * Provides `@getSubsidiaries` and `@getSubsidiariesNextPage` aliases
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Number} organizationId - Organization ID
 */
Cypress.Commands.add(
  'interceptSubsidiariesGetApi',
  (config, i18n, organizationId) => {
    const { apiBase, apiDefaultLang, urlApiOrganizations, urlApiSubsidiaries } =
      config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiSubsidiariesLocalized = `${apiBaseUrl}${urlApiOrganizations}${organizationId}/${urlApiSubsidiaries}`;

    cy.fixture('apiGetSubsidiariesResponse').then((subsidiariesResponse) => {
      cy.fixture('apiGetSubsidiariesResponseNext').then(
        (subsidiariesResponseNext) => {
          // intercept initial subsidiaries API call
          cy.intercept('GET', urlApiSubsidiariesLocalized, {
            statusCode: httpSuccessfullStatus,
            body: subsidiariesResponse,
          }).as('getSubsidiaries');

          // intercept next page API call
          cy.intercept('GET', subsidiariesResponse.next, {
            statusCode: httpSuccessfullStatus,
            body: subsidiariesResponseNext,
          }).as('getSubsidiariesNextPage');
        },
      );
    });
  },
);

/**
 * Wait for intercept subsidiaries API calls and compare request/response object
 * Wait for `@getSubsidiaries` and `@getSubsidiariesNextPage` intercepts
 * @param {object} subsidiariesResponse - Get subsidiaries API data response
 * @param {object} subsidiariesResponseNext - Get subsidiaries API data response next page
 */
Cypress.Commands.add(
  'waitForSubsidiariesApi',
  (subsidiariesResponse, subsidiariesResponseNext) => {
    cy.wait(['@getSubsidiaries', '@getSubsidiariesNextPage']).spread(
      (getSubsidiaries, getSubsidiariesNextPage) => {
        expect(getSubsidiaries.request.headers.authorization).to.include(
          bearerTokeAuth,
        );
        if (getSubsidiaries.response) {
          expect(getSubsidiaries.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getSubsidiaries.response.body).to.deep.equal(
            subsidiariesResponse,
          );
        }
        expect(
          getSubsidiariesNextPage.request.headers.authorization,
        ).to.include(bearerTokeAuth);
        if (getSubsidiariesNextPage.response) {
          expect(getSubsidiariesNextPage.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getSubsidiariesNextPage.response.body).to.deep.equal(
            subsidiariesResponseNext,
          );
        }
      },
    );
  },
);

/**
 * Intercept this campaign GET API call
 * Provides `@thisCampaignRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptThisCampaignGetApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiThisCampaign } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiThisCampaignLocalized = `${apiBaseUrl}${urlApiThisCampaign}`;

    cy.fixture('apiGetThisCampaign').then((thisCampaignResponse) => {
      cy.intercept('GET', urlApiThisCampaignLocalized, {
        statusCode: responseStatusCode
          ? responseStatusCode
          : httpSuccessfullStatus,
        body: responseBody ? responseBody : thisCampaignResponse,
      }).as('thisCampaignRequest');
    });
  },
);

/**
 * Wait for intercept this campaign API call and compare request/response object
 * Wait for `@thisCampaignRequest` intercept
 * @param {object} thisCampaignResponse - Get this campaign API data response
 */
Cypress.Commands.add('waitForThisCampaignApi', () => {
  cy.fixture('apiGetThisCampaign').then((thisCampaignResponse) => {
    cy.wait('@thisCampaignRequest').then((thisCampaignRequest) => {
      if (thisCampaignRequest.response) {
        expect(thisCampaignRequest.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(thisCampaignRequest.response.body).to.deep.equal(
          thisCampaignResponse,
        );
      }
    });
  });
});

/**
 * Intercept this register POST API call
 * Provides `@registerRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptRegisterApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiRegister } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    // intercept register API call
    const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
    cy.fixture('loginRegisterResponseChallengeInactive').then(
      (loginRegisterResponseChallengeInactive) => {
        cy.intercept('POST', apiRegisterUrl, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody
            ? responseBody
            : loginRegisterResponseChallengeInactive,
        }).as('registerRequest');
      },
    );
  },
);

/**
 * Intercept register POST API call,
 *           refresh auth toke POST API call
 * Provides `@registerRequest`,
 *          `@refreshAuthTokenRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} registerResponseBody - Override default response body
 * @param {Number} registerResponseStatusCode - Override default response HTTP status code
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Number} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      for refresh auth token intercept
 */
Cypress.Commands.add(
  'interceptRegisterRefreshAuthTokenApi',
  (
    config,
    i18n,
    registerResponseBody,
    registerResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
  ) => {
    // Intercept register API call
    cy.interceptRegisterApi(
      config,
      i18n,
      registerResponseBody,
      registerResponseStatusCode,
    );
    // Intercept refresh auth token API call
    cy.interceptRefreshAuthTokenApi(
      config,
      i18n,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
    );
  },
);

/**
 * Intercept this verify email GET API call
 * Provides `@verifyEmailRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptVerifyEmailApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiHasUserVerifiedEmail } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    // intercept verify email API call
    const apiEmailVerificationUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
    cy.fixture('apiGetVerifyEmailResponse.json').then(
      (apiGetVerifyEmailResponse) => {
        cy.intercept('GET', apiEmailVerificationUrl, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody ? responseBody : apiGetVerifyEmailResponse,
        }).as('verifyEmailRequest');
      },
    );
  },
);

/**
 * Intercept register POST API call,
 *           verify email GET API call
 * Provides `@registerRequest`,
 *          `@verifyEmailRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} registerResponseBody - Override default response body for
 *                                        register intercept
 * @param {Object} registerResponseStatusCode - Override default response HTTP status code
 *                                              register intercept
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Number} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      for refresh auth token intercept
 * @param {Object} verifyEmailResponseBody - Override default response body for
 *                                           verify email intercept
 * @param {Number} verifyEmailResponseStatusCode - Override default response HTTP status code
 *                                                 for verify email intercept
 */
Cypress.Commands.add(
  'interceptRegisterRefreshAuthTokenVerifyEmailApi',
  (
    config,
    i18n,
    registerResponseBody,
    registerResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
    verifyEmailResponseBody,
    verifyEmailResponseStatusCode,
  ) => {
    // Intercept register and refresh auth token API call
    cy.interceptRegisterRefreshAuthTokenApi(
      config,
      i18n,
      registerResponseBody,
      registerResponseStatusCode,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
    );
    // Intercept verify email API call
    cy.interceptVerifyEmailApi(
      config,
      i18n,
      verifyEmailResponseBody,
      verifyEmailResponseStatusCode,
    );
  },
);

/**
 * Intercept register POST API call and intercept verify,
 *           refresh auth token POST API call,
 *           email GET API call,
 *           this campaign GET API call
 * Provides `@registerRequest`,
 *          `@refreshAuthTokenRequest`,
 *          `@verifyEmailRequest`,
 *          `@thisCampaignRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} registerResponseBody - Override default response body for
 *                                        register intercept
 * @param {Object} registerResponseStatusCode - Override default response HTTP status code
 *                                              register intercept
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Number} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      for refresh auth token intercept
 * @param {Object} verifyEmailResponseBody - Override default response body for
 *                                           verify email intercept
 * @param {Number} verifyEmailResponseStatusCode - Override default response HTTP status code
 *                                                 for verify email intercept
 * @param {Object} verifyCampaignPhaseResponseBody - Override default response body for
 *                                                   verify campaign phase intercept
 * @param {Number} verifyCampaignPhaseResponseStatusCode - Override default response HTTP status code
 *                                                         for verify campaign phase intercept
 */
Cypress.Commands.add(
  'interceptRegisterRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi',
  (
    config,
    i18n,
    registerResponseBody,
    registerResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
    verifyEmailResponseBody,
    verifyEmailResponseStatusCode,
    verifyCampaignPhaseResponseBody,
    verifyCampaignPhaseResponseStatusCode,
  ) => {
    // Intercept register, refresh auth token, and verify email API call
    cy.interceptRegisterRefreshAuthTokenVerifyEmailApi(
      config,
      i18n,
      registerResponseBody,
      registerResponseStatusCode,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
      verifyEmailResponseBody,
      verifyEmailResponseStatusCode,
    );
    // Intercept this campaign API call
    cy.interceptThisCampaignGetApi(
      config,
      i18n,
      verifyCampaignPhaseResponseBody,
      verifyCampaignPhaseResponseStatusCode,
    );
  },
);

/**
 * Fill and submit register form
 *
 * Form fields: Email
 *              Password
 *              Confirm password
 *              Accept privacy policy
 * @param {Boolean} checkAcceptPrivacyPolicyCheckbox: do not check accept privacy
 *                                                    policy checkbox element if
 *                                                    this camapign competition phase
 *                                                    is not active, because element
 *                                                    is not visible, default value is
 *                                                    true
 */
Cypress.Commands.add(
  'fillAndSubmitRegisterForm',
  (checkAcceptPrivacyPolicyCheckbox = true) => {
    const selectorFormRegisterEmail = 'form-register-email';
    const selectorFormRegisterPasswordInput = 'form-register-password-input';
    const selectorFormRegisterPasswordConfirmInput =
      'form-register-password-confirm-input';
    const selectorFormRegisterPrivacyConsent = 'form-register-privacy-consent';
    const selectorFormRegisterSubmit = 'form-register-submit';
    // Fill form
    cy.fixture('registerRequest').then((registerRequest) => {
      cy.dataCy(selectorFormRegisterEmail)
        .find('input')
        .type(registerRequest.email);
      cy.dataCy(selectorFormRegisterPasswordInput).type(
        registerRequest.password1,
      );
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(
        registerRequest.password1,
      );
      if (checkAcceptPrivacyPolicyCheckbox === true)
        // Accept privacy policy
        cy.dataCy(selectorFormRegisterPrivacyConsent)
          .should('be.visible')
          .find('.q-checkbox__inner')
          .click();
      cy.dataCy(selectorFormRegisterSubmit).click();
    });
  },
);

/**
 * Intercept refresh auth token POST API call
 * Provides `@refreshTokenRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptRefreshAuthTokenApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiRefresh } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    // intercept register API call
    const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
    cy.fixture('refreshTokensResponseChallengeInactive').then(
      (refreshTokenResponse) => {
        cy.intercept('POST', apiRefreshUrl, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody ? responseBody : refreshTokenResponse,
        }).as('refreshAuthTokenRequest');
      },
    );
  },
);

/**
 * Intercept this login POST API call
 * Provides `@loginRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptLoginApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiLogin } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    // intercept register API call
    const apiRegisterUrl = `${apiBaseUrl}${urlApiLogin}`;
    cy.fixture('loginRegisterResponseChallengeInactive').then(
      (loginRegisterResponseChallengeInactive) => {
        cy.intercept('POST', apiRegisterUrl, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody
            ? responseBody
            : loginRegisterResponseChallengeInactive,
        }).as('loginRequest');
      },
    );
  },
);

/**
 * Intercept login POST API call,
 *           refresh auth token POST API call
 * Provides `@loginRequest`,
 *          `@refreshAuthTokenRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} loginResponseBody - Override default response body for
 *                                     register intercept
 * @param {Object} loginResponseStatusCode - Override default response HTTP status code
 *                                           register intercept
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Number} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      for refresh auth token intercept
 */
Cypress.Commands.add(
  'interceptLoginRefreshAuthTokenApi',
  (
    config,
    i18n,
    loginResponseBody,
    loginResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
  ) => {
    // Intercept login API call
    cy.interceptLoginApi(
      config,
      i18n,
      loginResponseBody,
      loginResponseStatusCode,
    );
    // Intercept refresh auth token API call
    cy.interceptRefreshAuthTokenApi(
      config,
      i18n,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
    );
  },
);

/**
 * Intercept login POST API call,
 *           refresh auth token POST API call,
 *           verify email GET API call
 * Provides `@loginRequest`,
 *          `@refreshAuthTokenRequest`,
 *          `@verifyEmailRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} loginResponseBody - Override default response body for
 *                                     login intercept
 * @param {Object} loginResponseStatusCode - Override default response HTTP status code
 *                                           login intercept
 * @param {Object} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      refresh auth token intercept
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Object} verifyEmailResponseBody - Override default response body for
 *                                           verify email intercept
 * @param {Number} verifyEmailResponseStatusCode - Override default response HTTP status code
 *                                                 for verify email intercept
 */
Cypress.Commands.add(
  'interceptLoginRefreshAuthTokenVerifyEmailApi',
  (
    config,
    i18n,
    loginResponseBody,
    loginResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
    verifyEmailResponseBody,
    verifyEmailResponseStatusCode,
  ) => {
    // Intercept login and refresh auth token API call
    cy.interceptLoginRefreshAuthTokenApi(
      config,
      i18n,
      loginResponseBody,
      loginResponseStatusCode,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
    );
    // Intercept verify email API call
    cy.interceptVerifyEmailApi(
      config,
      i18n,
      verifyEmailResponseBody,
      verifyEmailResponseStatusCode,
    );
  },
);

/**
 * Intercept login POST API call
 *           verify email GET API call,
 *           this campaign GET API call
 * Provides `@loginRequest`,
 *          `@verifyEmailRequest`,
 *          `@thisCampaignRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} loginResponseBody - Override default response body for
 *                                     login intercept
 * @param {Object} loginResponseStatusCode - Override default response HTTP status code
 *                                           login intercept
 * @param {Object} refreshAuthTokenResponseBody - Override default response body for
 *                                                refresh auth token intercept
 * @param {Object} refreshAuthTokenResponseStatusCode - Override default response HTTP status code
 *                                                      refresh auth token intercept
 * @param {Object} verifyEmailResponseBody - Override default response body for
 *                                           verify email intercept
 * @param {Number} verifyEmailResponseStatusCode - Override default response HTTP status code
 *                                                 for verify email intercept
 * @param {Object} verifyCampaignPhaseResponseBody - Override default response body for
 *                                                   verify campaign phase intercept
 * @param {Number} verifyCampaignPhaseResponseStatusCode - Override default response HTTP status code
 *                                                         for verify campaign phase intercept
 */
Cypress.Commands.add(
  'interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi',
  (
    config,
    i18n,
    loginResponseBody,
    loginResponseStatusCode,
    refreshAuthTokenResponseBody,
    refreshAuthTokenResponseStatusCode,
    verifyEmailResponseBody,
    verifyEmailResponseStatusCode,
    verifyCampaignPhaseResponseBody,
    verifyCampaignPhaseResponseStatusCode,
  ) => {
    // Intercept login, refresh auth token and verify email API call
    cy.interceptLoginRefreshAuthTokenVerifyEmailApi(
      config,
      i18n,
      loginResponseBody,
      loginResponseStatusCode,
      refreshAuthTokenResponseBody,
      refreshAuthTokenResponseStatusCode,
      verifyEmailResponseBody,
      verifyEmailResponseStatusCode,
    );
    // Intercept this campaign API call
    cy.interceptThisCampaignGetApi(
      config,
      i18n,
      verifyCampaignPhaseResponseBody,
      verifyCampaignPhaseResponseStatusCode,
    );
  },
);

/**
 * Fill and submit login form
 *
 * Form fields: Email
 *              Password
 */
Cypress.Commands.add('fillAndSubmitLoginForm', () => {
  cy.fixture('registerRequest').then((loginRequest) => {
    cy.dataCy('form-email-input').type(loginRequest.email);
    cy.dataCy('form-login-password-input').type(loginRequest.password1);
    cy.dataCy('form-login-submit-login').click();
  });
});

/**
 * Wait for intercept teams API calls and compare request/response object
 * Wait for `@getTeams` and `@getTeamsNextPage` intercepts
 */
Cypress.Commands.add('waitForTeamsGetApi', () => {
  cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
    cy.fixture('apiGetTeamsResponseNext').then((teamsResponseNext) => {
      cy.wait(['@getTeams', '@getTeamsNextPage']).spread(
        (getTeams, getTeamsNextPage) => {
          expect(getTeams.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
          if (getTeams.response) {
            expect(getTeams.response.statusCode).to.equal(
              httpSuccessfullStatus,
            );
            expect(getTeams.response.body).to.deep.equal(teamsResponse);
          }
          expect(getTeamsNextPage.request.headers.authorization).to.include(
            bearerTokeAuth,
          );
          if (getTeamsNextPage.response) {
            expect(getTeamsNextPage.response.statusCode).to.equal(
              httpSuccessfullStatus,
            );
            expect(getTeamsNextPage.response.body).to.deep.equal(
              teamsResponseNext,
            );
          }
        },
      );
    });
  });
});

/**
 * Intercept team POST API call
 * Provides `@postTeam` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Number} subsidiaryId - Subsidiary ID
 */
Cypress.Commands.add('interceptTeamPostApi', (config, i18n, subsidiaryId) => {
  const { apiBase, apiDefaultLang, urlApiSubsidiaries, urlApiTeams } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiTeamLocalized = `${apiBaseUrl}${urlApiSubsidiaries}${subsidiaryId}/${urlApiTeams}`;

  cy.fixture('apiPostTeamResponse').then((teamResponse) => {
    cy.intercept('POST', urlApiTeamLocalized, {
      statusCode: httpSuccessfullStatus,
      body: teamResponse,
    }).as('postTeam');
  });
});

/**
 * Wait for intercept team POST API call and compare request/response object
 * Wait for `@postTeam` intercept
 */
Cypress.Commands.add('waitForTeamPostApi', () => {
  cy.fixture('apiPostTeamRequest').then((teamRequest) => {
    cy.fixture('apiPostTeamResponse').then((teamResponse) => {
      cy.wait('@postTeam').then(({ request, response }) => {
        expect(request.headers.authorization).to.include(bearerTokeAuth);
        expect(request.body).to.deep.equal(teamRequest);
        if (response) {
          expect(response.statusCode).to.equal(httpSuccessfullStatus);
          expect(response.body).to.deep.equal(teamResponse);
        }
      });
    });
  });
});

/*
 * Intercept subsidiary POST API call
 * Provides `@postSubsidiary` alias
 * @param {object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {number} organizationId - Organization ID
 */
Cypress.Commands.add(
  'interceptSubsidiaryPostApi',
  (config, i18n, organizationId) => {
    const { apiBase, apiDefaultLang, urlApiOrganizations, urlApiSubsidiaries } =
      config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiSubsidiaryLocalized = `${apiBaseUrl}${urlApiOrganizations}${organizationId}/${urlApiSubsidiaries}`;
    cy.fixture('apiPostSubsidiaryResponse').then((subsidiaryResponse) => {
      cy.intercept('POST', urlApiSubsidiaryLocalized, {
        statusCode: httpSuccessfullStatus,
        body: subsidiaryResponse,
      }).as('postSubsidiary');
    });
  },
);

/*
 * Wait for intercept subsidiary POST API call and compare request/response object
 * Wait for `@postSubsidiary` intercept
 */
Cypress.Commands.add('waitForSubsidiaryPostApi', () => {
  cy.fixture('apiPostSubsidiaryRequest').then((subsidiaryRequest) => {
    cy.fixture('apiPostSubsidiaryResponse').then((subsidiaryResponse) => {
      cy.wait('@postSubsidiary').then(({ request, response }) => {
        expect(request.headers.authorization).to.include(bearerTokeAuth);
        expect(request.body).to.deep.equal(subsidiaryRequest);
        if (response) {
          expect(response.statusCode).to.equal(httpSuccessfullStatus);
          expect(response.body).to.deep.equal(subsidiaryResponse);
        }
      });
    });
  });
});

/**
 * Intercept merchandise GET API call
 * Provides `@getMerchandise` and `@getMerchandiseNextPage` aliases
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 */
Cypress.Commands.add('interceptMerchandiseGetApi', (config, i18n) => {
  const { apiBase, apiDefaultLang, urlApiMerchandise } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiMerchandiseLocalized = `${apiBaseUrl}${urlApiMerchandise}`;

  cy.fixture('apiGetMerchandiseResponse').then((merchandiseResponse) => {
    cy.fixture('apiGetMerchandiseResponseNext').then(
      (merchandiseResponseNext) => {
        // intercept initial merchandise API call
        cy.intercept('GET', urlApiMerchandiseLocalized, {
          statusCode: httpSuccessfullStatus,
          body: merchandiseResponse,
        }).as('getMerchandise');

        // intercept next page API call
        cy.intercept('GET', merchandiseResponse.next, {
          statusCode: httpSuccessfullStatus,
          body: merchandiseResponseNext,
        }).as('getMerchandiseNextPage');
      },
    );
  });
});

/**
 * Wait for intercept merchandise API calls and compare response object
 * Wait for `@getMerchandise` and `@getMerchandiseNextPage` intercepts
 */
Cypress.Commands.add('waitForMerchandiseApi', () => {
  cy.fixture('apiGetMerchandiseResponse').then((merchandiseResponse) => {
    cy.fixture('apiGetMerchandiseResponseNext').then(
      (merchandiseResponseNext) => {
        cy.wait(['@getMerchandise', '@getMerchandiseNextPage']).spread(
          (getMerchandise, getMerchandiseNextPage) => {
            expect(getMerchandise.request.headers.authorization).to.include(
              bearerTokeAuth,
            );
            if (getMerchandise.response) {
              expect(getMerchandise.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getMerchandise.response.body).to.deep.equal(
                merchandiseResponse,
              );
            }
            expect(
              getMerchandiseNextPage.request.headers.authorization,
            ).to.include(bearerTokeAuth);
            if (getMerchandiseNextPage.response) {
              expect(getMerchandiseNextPage.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getMerchandiseNextPage.response.body).to.deep.equal(
                merchandiseResponseNext,
              );
            }
          },
        );
      },
    );
  });
});

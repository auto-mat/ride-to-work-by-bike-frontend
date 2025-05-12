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

import { computed } from 'vue';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
  interceptOrganizationsApi,
  interceptedRequestResponseDelay,
  waitForOrganizationsApi,
} from './commonTests';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';
import { bearerTokeAuth } from '../../../src/utils';
import { OrganizationType } from '../../../src/components/types/Organization';
import { routesConf } from '../../../src/router/routes_conf';
import { getRadioOption, negativeColor, positiveColor } from '../utils';
import { PaymentSubject } from '../../../src/components/enums/Payment';
import { useMenu } from '../../../src/composables/useMenu';
import {
  getOffersFeedParamSet,
  getPrizesFeedParamSet,
} from '../../../src/utils/get_feed_param_set';

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
    // store original locale
    const originalLocale = i18n.global.locale;

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

    // restore original locale
    i18n.global.locale = originalLocale;
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

Cypress.Commands.add('decodeHtmlEntities', (htmlString) => {
  cy.wrap(htmlString).then((str) => {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  });
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

Cypress.Commands.add(
  'testElementsNoOverlap',
  (elementSelector, otherElementSelector) => {
    cy.dataCy(elementSelector).then((element) => {
      const rect1 = element[0].getBoundingClientRect();
      cy.dataCy(otherElementSelector).then((otherElement) => {
        const rect2 = otherElement[0].getBoundingClientRect();
        const noOverlap =
          rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom;
        cy.wrap(noOverlap).should('be.true');
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
 * Test payment total price with donation
 * @param {Object} i18n - i18n instance
 * @param {number} defaultPaymentAmountMin - Default payment amount min
 * @param {number} testAmountValue - Alternative payment amount value
 */
Cypress.Commands.add(
  'testPaymentTotalPriceWithDonation',
  (i18n, defaultPaymentAmountMin, testAmountValue) => {
    // add donation
    cy.dataCy('form-field-donation-checkbox').should('be.visible').click();
    // default donation amount
    cy.dataCy('total-price')
      .should('contain', i18n.global.t('global.total'))
      .and('contain', defaultPaymentAmountMin);
    // enter custom donation
    cy.dataCy('form-field-slider-number-input').should('be.visible').clear();
    cy.dataCy('form-field-slider-number-input').type(testAmountValue);
    cy.dataCy('total-price')
      .should('contain', i18n.global.t('global.total'))
      .and('contain', testAmountValue);
    // remove donation
    cy.dataCy('form-field-donation-checkbox').should('be.visible').click();
    cy.dataCy('total-price').should('not.exist');
  },
);

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
 * @param {Object} config - App global config
 * @param {Object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {number} subsidiaryId - Subsidiary ID
 * @param {Object} teamsResponse - Optional override for teams response data
 * @param {Object} teamsResponseNext - Optional override for teams next page response data
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
 * @param {number} organizationId - Organization ID
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
 * Intercept offers GET API calls
 * Provides `@getOffers` aliase
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 */
Cypress.Commands.add(
  'interceptOffersGetApi',
  (config, i18n, citySlug, offersResponse = null) => {
    const { apiBaseRtwbbFeed, apiDefaultLang } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBaseRtwbbFeed,
      apiDefaultLang,
      i18n,
    );
    const getOffersParams = getOffersFeedParamSet(
      citySlug,
      config.apiFeedMaxOffersNumber,
    );
    const objectToParams = (obj) => {
      return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join('&');
    };
    const urlEncodedParams = objectToParams(getOffersParams);
    const urlApiOffersLocalized = `${apiBaseUrl}?${urlEncodedParams}`;

    cy.fixture('apiGetOffersResponse.json').then((defaultOffersResponse) => {
      cy.intercept('GET', urlApiOffersLocalized, {
        statusCode: httpSuccessfullStatus,
        body: offersResponse || defaultOffersResponse,
      }).as('getOffers');
    });
  },
);

/**
 * Wait for intercept offers API call and compare request/response object
 * Wait for `@getOffers` intercept.
 */
Cypress.Commands.add('waitForOffersApi', (offersResponse = null) => {
  cy.fixture('apiGetOffersResponse').then((defaultOffersResponse) => {
    cy.wait('@getOffers').then((getOffers) => {
      expect(getOffers.response.statusCode).to.equal(httpSuccessfullStatus);
      expect(getOffers.response.body).to.deep.equal(
        offersResponse || defaultOffersResponse,
      );
    });
  });
});

/**
 * Intercept prizes GET API calls
 * Provides `@getPrizes` aliase
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 */
Cypress.Commands.add(
  'interceptPrizesGetApi',
  (config, i18n, citySlug, prizesResponse = null) => {
    const { apiBaseRtwbbFeed, apiDefaultLang } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBaseRtwbbFeed,
      apiDefaultLang,
      i18n,
    );
    const getPrizesParams = getPrizesFeedParamSet(
      citySlug,
      config.apiFeedMaxPrizesNumber,
    );
    const objectToParams = (obj) => {
      return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join('&');
    };
    const urlEncodedParams = objectToParams(getPrizesParams);
    const urlApiPrizesLocalized = `${apiBaseUrl}?${urlEncodedParams}`;

    cy.fixture('apiGetPrizesResponse.json').then((defaultPrizesResponse) => {
      cy.intercept('GET', urlApiPrizesLocalized, {
        statusCode: httpSuccessfullStatus,
        body: prizesResponse || defaultPrizesResponse,
      }).as('getPrizes');
    });
  },
);

/**
 * Wait for intercept prizes API call and compare request/response object
 * Wait for `@getPrizes` intercept.
 */
Cypress.Commands.add('waitForPrizesApi', (prizesResponse = null) => {
  cy.fixture('apiGetPrizesResponse').then((defaultPrizesResponse) => {
    cy.wait('@getPrizes').then((getPrizes) => {
      expect(getPrizes.response.statusCode).to.equal(httpSuccessfullStatus);
      expect(getPrizes.response.body).to.deep.equal(
        prizesResponse || defaultPrizesResponse,
      );
    });
  });
});

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
Cypress.Commands.add('waitForThisCampaignApi', (responseBody = null) => {
  cy.fixture('apiGetThisCampaign').then((thisCampaignResponse) => {
    cy.wait('@thisCampaignRequest').then((thisCampaignRequest) => {
      if (thisCampaignRequest.response) {
        expect(thisCampaignRequest.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(thisCampaignRequest.response.body).to.deep.equal(
          responseBody ? responseBody : thisCampaignResponse,
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
Cypress.Commands.add(
  'waitForTeamsGetApi',
  (teamsResponse = null, teamsResponseNext = null) => {
    cy.fixture('apiGetTeamsResponse').then((defaultTeamsResponse) => {
      cy.fixture('apiGetTeamsResponseNext').then((defaultTeamsResponseNext) => {
        cy.wait(['@getTeams', '@getTeamsNextPage']).spread(
          (getTeams, getTeamsNextPage) => {
            expect(getTeams.request.headers.authorization).to.include(
              bearerTokeAuth,
            );
            if (getTeams.response) {
              expect(getTeams.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getTeams.response.body).to.deep.equal(
                teamsResponse ? teamsResponse : defaultTeamsResponse,
              );
            }
            expect(getTeamsNextPage.request.headers.authorization).to.include(
              bearerTokeAuth,
            );
            if (getTeamsNextPage.response) {
              expect(getTeamsNextPage.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getTeamsNextPage.response.body).to.deep.equal(
                teamsResponseNext
                  ? teamsResponseNext
                  : defaultTeamsResponseNext,
              );
            }
          },
        );
      });
    });
  },
);

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
Cypress.Commands.add(
  'interceptMerchandiseGetApi',
  (
    config,
    i18n,
    merchandiseResponse = null,
    merchandiseResponseNext = null,
  ) => {
    const {
      apiBase,
      apiDefaultLang,
      iDontWantMerchandiseItemCode,
      urlApiMerchandise,
    } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiMerchandiseLocalized = `${apiBaseUrl}${urlApiMerchandise}`;
    // intercept call for all merchandise
    cy.fixture('apiGetMerchandiseResponse').then(
      (merchandiseResponseDefault) => {
        cy.fixture('apiGetMerchandiseResponseNext').then(
          (merchandiseResponseNextDefault) => {
            // intercept initial merchandise API call
            cy.intercept('GET', urlApiMerchandiseLocalized, {
              statusCode: httpSuccessfullStatus,
              body: merchandiseResponse
                ? merchandiseResponse
                : merchandiseResponseDefault,
            }).as('getMerchandise');

            // intercept next page API call
            cy.intercept('GET', merchandiseResponseDefault.next, {
              statusCode: httpSuccessfullStatus,
              body: merchandiseResponseNext
                ? merchandiseResponseNext
                : merchandiseResponseNextDefault,
            }).as('getMerchandiseNextPage');
          },
        );
      },
    );
    // intercept call for "I don't want merch ID"
    const urlApiMerchandiseNoneLocalized = `${apiBaseUrl}${urlApiMerchandise}${iDontWantMerchandiseItemCode}/`;
    cy.fixture('apiGetMerchandiseResponseNone').then(
      (merchandiseResponseNone) => {
        cy.intercept('GET', urlApiMerchandiseNoneLocalized, {
          statusCode: httpSuccessfullStatus,
          body: merchandiseResponseNone,
        }).as('getMerchandiseNone');
      },
    );
  },
);

/**
 * Wait for intercept merchandise API calls and compare response object
 * Wait for `@getMerchandise` and `@getMerchandiseNextPage` intercepts
 */
Cypress.Commands.add(
  'waitForMerchandiseApi',
  (merchandiseResponse = null, merchandiseResponseNext = null) => {
    cy.fixture('apiGetMerchandiseResponse').then(
      (merchandiseResponseDefault) => {
        cy.fixture('apiGetMerchandiseResponseNext').then(
          (merchandiseResponseNextDefault) => {
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
                    merchandiseResponse
                      ? merchandiseResponse
                      : merchandiseResponseDefault,
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
                    merchandiseResponseNext
                      ? merchandiseResponseNext
                      : merchandiseResponseNextDefault,
                  );
                }
              },
            );
          },
        );
      },
    );
  },
);

/**
 * Custom command to select a merchandise item from the list and interact with its dialog
 * @param {Object} item - The merchandise item to select
 * @param {Object} options - Additional options for the command
 * @param {boolean} options.closeDialog - Whether to close the dialog after selection (default: true)
 * @param {boolean} options.selectSize - Whether to select the size in the dialog (default: true)
 */
Cypress.Commands.add('listMerchSelectItem', (item, options = {}) => {
  const { closeDialog = true } = options;
  // click the item name to open dialog
  cy.contains(item.name).click();
  // verify dialog is visible and contains correct content
  cy.dataCy('dialog-merch')
    .should('be.visible')
    .within(() => {
      // select size if requested
      cy.dataCy('form-field-merch-size')
        .should('be.visible')
        .contains(item.size)
        .click();
      // check correct title and description
      cy.contains(item.name).should('be.visible');
      cy.contains(item.description).should('be.visible');
    });
  // close dialog if requested
  if (closeDialog) {
    cy.dataCy('dialog-close').click();
    cy.dataCy('dialog-merch').should('not.exist');
  }
});

/**
 * Intercept discount coupon GET API calls
 * Provides `@getDiscountCoupon` alias
 * @param {object} config - App global config
 * @param {object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {string} code - Coupon code to validate
 * @param {object} responseBody - Returned response body object
 */
Cypress.Commands.add(
  'interceptDiscountCouponGetApi',
  (config, i18n, code, responseBody) => {
    const { apiBase, apiDefaultLang, urlApiDiscountCoupon } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiDiscountCouponLocalized = `${apiBaseUrl}${urlApiDiscountCoupon}${code}`;

    cy.fixture('apiGetDiscountCouponResponseFull').then(
      (discountCouponResponse) => {
        cy.intercept('GET', urlApiDiscountCouponLocalized, {
          statusCode: httpSuccessfullStatus,
          body: responseBody ? responseBody : discountCouponResponse,
        }).as('getDiscountCoupon');
      },
    );
  },
);

/**
 * Wait for intercept discount coupon API call and compare response object
 * Wait for `@getDiscountCoupon` intercept
 * @param {object} responseBody - Returned response body object
 */
Cypress.Commands.add('waitForDiscountCouponApi', (responseBody) => {
  cy.fixture('apiGetDiscountCouponResponseFull').then(
    (discountCouponResponse) => {
      cy.wait('@getDiscountCoupon').then((getDiscountCoupon) => {
        expect(getDiscountCoupon.request.headers.authorization).to.include(
          bearerTokeAuth,
        );
        if (getDiscountCoupon.response) {
          expect(getDiscountCoupon.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getDiscountCoupon.response.body).to.deep.equal(
            responseBody ? responseBody : discountCouponResponse,
          );
        }
      });
    },
  );
});

/**
 * Apply HALF voucher and verify its effects
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 * @param {number} defaultPaymentAmountMin - Default minimum payment amount
 * @returns {Cypress.Chainable<number>} - Calculated discount amount
 */
Cypress.Commands.add(
  'applyHalfVoucher',
  (config, i18n, defaultPaymentAmountMin) => {
    return cy
      .fixture('apiGetDiscountCouponResponseHalf')
      .then((apiResponse) => {
        // intercept coupon endpoint
        cy.interceptDiscountCouponGetApi(
          config,
          i18n,
          apiResponse.results[0].name,
          apiResponse,
        );
        // submit voucher
        cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
        cy.dataCy('form-field-voucher-submit').click();
        // wait for API response
        cy.waitForDiscountCouponApi(apiResponse);
        // check success message
        cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
          'be.visible',
        );
        // calculate discount amount
        const discountAmountInt = Math.round(
          (defaultPaymentAmountMin * apiResponse.results[0].discount) / 100,
        );
        // verify banner content
        cy.dataCy('voucher-banner-code')
          .should('be.visible')
          .and('contain', apiResponse.results[0].name);
        cy.dataCy('voucher-banner-name')
          .should('be.visible')
          .and('contain', i18n.global.t('global.discount'))
          .and('contain', apiResponse.results[0].discount)
          .and('contain', discountAmountInt);
        // return discount amount as a chainable value
        return cy.wrap(discountAmountInt);
      });
  },
);

/**
 * Apply FULL voucher and verify its effects
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 */
Cypress.Commands.add('applyFullVoucher', (config, i18n) => {
  cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
    // intercept coupon endpoint
    cy.interceptDiscountCouponGetApi(
      config,
      i18n,
      apiResponse.results[0].name,
      apiResponse,
    );
    // submit voucher
    cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
    cy.dataCy('form-field-voucher-submit').click();
    // wait for API response
    cy.waitForDiscountCouponApi(apiResponse);
    // check success message
    cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
      'be.visible',
    );
    // verify banner content
    cy.dataCy('voucher-banner-code')
      .should('be.visible')
      .and('contain', apiResponse.results[0].name);
    cy.dataCy('voucher-banner-name')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
      );
  });
});

/**
 * Apply invalid voucher and verify error
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 */
Cypress.Commands.add('applyInvalidVoucher', (config, i18n) => {
  const invalid = 'INVALID TOKEN WITH SPACES';
  cy.fixture('apiGetDiscountCouponResponseEmpty').then((responseEmpty) => {
    // intercept coupon endpoint
    cy.interceptDiscountCouponGetApi(config, i18n, invalid, responseEmpty);
    // submit voucher
    cy.dataCy('form-field-voucher-input').type(invalid);
    cy.dataCy('form-field-voucher-submit').click();
    // verify error state
    cy.dataCy('voucher-banner').should('not.exist');
    cy.contains(i18n.global.t('notify.voucherApplyError')).should('be.visible');
    cy.dataCy('form-field-voucher-input')
      .should('be.visible')
      .find('input')
      .should('have.value', invalid);
  });
});

/**
 * Wait for intercept organization creation API call and compare request/response object
 * Wait for `@createOrganization` intercept
 */
Cypress.Commands.add('waitForOrganizationPostApi', () => {
  cy.fixture('formFieldCompanyCreateRequest').then(
    (formFieldCompanyCreateRequest) => {
      cy.fixture('formFieldCompanyCreate').then(
        (formFieldCompanyCreateResponse) => {
          cy.wait('@createOrganization').then(({ request, response }) => {
            expect(request.headers.authorization).to.include(bearerTokeAuth);
            expect(request.body).to.deep.equal({
              name: formFieldCompanyCreateRequest.name,
              vatId: formFieldCompanyCreateRequest.vatId,
              organization_type:
                formFieldCompanyCreateRequest.organization_type,
            });
            if (response) {
              expect(response.statusCode).to.equal(httpSuccessfullStatus);
              expect(response.body).to.deep.equal(
                formFieldCompanyCreateResponse,
              );
            }
          });
        },
      );
    },
  );
});

/**
 * Fill organization and subsidiary form with data
 * @param {Object} formFieldCompanyCreateRequest - Organization data
 * @param {Object} apiPostSubsidiaryRequest - Subsidiary data
 */
Cypress.Commands.add(
  'fillOrganizationSubsidiaryForm',
  (formFieldCompanyCreateRequest, apiPostSubsidiaryRequest) => {
    // fill organization data
    cy.dataCy('form-add-company-name')
      .find('input')
      .type(formFieldCompanyCreateRequest.name);
    cy.dataCy('form-add-company-vat-id')
      .find('input')
      .type(formFieldCompanyCreateRequest.vatId);
    // fill subsidiary address data
    cy.dataCy('form-add-subsidiary-street')
      .find('input')
      .type(apiPostSubsidiaryRequest.address.street);
    cy.dataCy('form-add-subsidiary-house-number')
      .find('input')
      .type(apiPostSubsidiaryRequest.address.street_number);
    cy.dataCy('form-add-subsidiary-city')
      .find('input')
      .type(apiPostSubsidiaryRequest.address.city);
    cy.dataCy('form-add-subsidiary-zip')
      .find('input')
      .type(apiPostSubsidiaryRequest.address.psc);
    cy.dataCy('form-add-subsidiary-department').type(
      apiPostSubsidiaryRequest.address.recipient,
    );
    // select city challenge
    cy.dataCy('form-add-subsidiary-city-challenge').click();
    cy.get('.q-menu').should('be.visible').find('.q-item').first().click();
  },
);

/**
 * Initiate state for register challenge summary
 * @param {object} loginStore - Login store instance
 * @param {object} registerChallengeStore - Register challenge strore instance
 * @param {object} registerChallengeStore - Register challenge strore instance
 * @param {string} apiGetMerchandiseResponse - API GET merchandise response data
 *                                             fixture JSON file name
 */
Cypress.Commands.add(
  'initiateRegisterChallengeSummaryState',
  (
    loginStore,
    registerChallengeStore,
    apiGetMerchandiseResponse = 'apiGetMerchandiseResponse.json',
  ) => {
    cy.fixture('loginResponse.json').then((loginData) => {
      loginStore.setUser(loginData.user);
    });
    cy.fixture('formPersonalDetails.json').then((formPersonalDetails) => {
      registerChallengeStore.setPersonalDetails({
        firstName: formPersonalDetails.firstName,
        lastName: formPersonalDetails.lastName,
        newsletter: [],
        nickname: formPersonalDetails.nickname,
        gender: formPersonalDetails.gender,
        terms: true,
      });
    });
    cy.fixture('formFieldCompany.json').then((formFieldCompany) => {
      registerChallengeStore.setOrganizations(formFieldCompany.results);
      registerChallengeStore.setOrganizationId(formFieldCompany.results[0].id);
    });
    cy.fixture('apiGetSubsidiariesResponse.json').then(
      (apiGetSubsidiariesResponse) => {
        registerChallengeStore.setSubsidiaries(
          apiGetSubsidiariesResponse.results,
        );
        registerChallengeStore.setSubsidiaryId(
          apiGetSubsidiariesResponse.results[0].id,
        );
      },
    );
    cy.fixture('apiGetTeamsResponse.json').then((apiGetTeamsResponse) => {
      registerChallengeStore.setTeams(apiGetTeamsResponse.results);
      registerChallengeStore.setTeamId(apiGetTeamsResponse.results[0].id);
    });
    cy.wrap(registerChallengeStore.loadMerchandiseToStore(null));
    cy.fixture('apiGetMerchandiseResponseUnavailable').then((response) => {
      cy.fixture('apiGetMerchandiseResponseUnavailableNext').then(
        (responseNext) => {
          cy.waitForMerchandiseApi(response, responseNext);
        },
      );
    });
    cy.fixture(apiGetMerchandiseResponse).then((apiGetMerchandiseResponse) => {
      registerChallengeStore.setMerchId(
        apiGetMerchandiseResponse.results[0].id,
      );
    });
  },
);

/**
 * Intercept has organization admin GET API call
 * Provides `@getHasOrganizationAdmin` alias
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 * @param {Number} organizationId - Organization ID to check
 * @param {Object} responseBody - Override default response body
 */
Cypress.Commands.add(
  'interceptHasOrganizationAdminGetApi',
  (config, i18n, organizationId, responseBody) => {
    const { apiBase, apiDefaultLang, urlApiHasOrganizationAdmin } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiHasOrganizationAdminLocalized = `${apiBaseUrl}${urlApiHasOrganizationAdmin}${organizationId}/`;

    cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
      (defaultResponse) => {
        cy.intercept('GET', urlApiHasOrganizationAdminLocalized, {
          statusCode: httpSuccessfullStatus,
          body: responseBody || defaultResponse,
        }).as('getHasOrganizationAdmin');
      },
    );
  },
);

/**
 * Wait for intercept has organization admin API call and compare response object
 * Wait for `@getHasOrganizationAdmin` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add('waitForHasOrganizationAdminApi', (expectedResponse) => {
  cy.wait('@getHasOrganizationAdmin').then((getHasOrganizationAdmin) => {
    expect(getHasOrganizationAdmin.request.headers.authorization).to.include(
      bearerTokeAuth,
    );
    if (getHasOrganizationAdmin.response) {
      expect(getHasOrganizationAdmin.response.statusCode).to.equal(
        httpSuccessfullStatus,
      );
      expect(getHasOrganizationAdmin.response.body).to.deep.equal(
        expectedResponse,
      );
    }
  });
});

/**
 * Intercept register challenge POST API call
 * Provides `@postRegisterChallenge` alias
 * @param {Config} config - App global config
 * @param {I18n|string} i18n - i18n instance
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptRegisterChallengePostApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiRegisterChallenge } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiRegisterChallengeLocalized = `${apiBaseUrl}${urlApiRegisterChallenge}`;

    cy.fixture('apiPostRegisterChallengeResponsePaymentDone').then(
      (registerChallengeResponse) => {
        cy.intercept('POST', urlApiRegisterChallengeLocalized, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody ? responseBody : registerChallengeResponse,
          delay: interceptedRequestResponseDelay,
        }).as('postRegisterChallenge');
      },
    );
  },
);

/**
 * Wait for intercept register challenge POST API call and compare request/response object
 * Wait for `@postRegisterChallenge` intercept
 * @param {Object} registerChallengeRequest - Request data
 * @param {Object} registerChallengeResponse - Response data
 */
Cypress.Commands.add(
  'waitForRegisterChallengePostApi',
  (registerChallengeRequest, registerChallengeResponse = null) => {
    cy.wait('@postRegisterChallenge').then(({ request, response }) => {
      expect(request.headers.authorization).to.include(bearerTokeAuth);
      expect(request.body).to.deep.equal(registerChallengeRequest);
      // allow to test only request
      if (response && registerChallengeResponse) {
        expect(response.statusCode).to.equal(httpSuccessfullStatus);
        expect(response.body).to.deep.equal(registerChallengeResponse);
      }
    });
  },
);

/**
 * Intercept register challenge GET API call
 * Provides `@getRegisterChallenge` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptRegisterChallengeGetApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiRegisterChallenge } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiRegisterChallengeLocalized = `${apiBaseUrl}${urlApiRegisterChallenge}`;

    cy.fixture('apiGetRegisterChallengeEmpty').then((emptyResponse) => {
      cy.intercept('GET', urlApiRegisterChallengeLocalized, {
        statusCode: responseStatusCode
          ? responseStatusCode
          : httpSuccessfullStatus,
        body: responseBody ? responseBody : emptyResponse,
      }).as('getRegisterChallenge');
    });
  },
);

/**
 * Wait for intercept register challenge GET API call and compare response object
 * Wait for `@getRegisterChallenge` intercept
 */
Cypress.Commands.add('waitForRegisterChallengeGetApi', (response) => {
  cy.wait('@getRegisterChallenge').then((getRegisterChallenge) => {
    expect(getRegisterChallenge.request.headers.authorization).to.include(
      bearerTokeAuth,
    );
    if (getRegisterChallenge.response) {
      expect(getRegisterChallenge.response.statusCode).to.equal(
        httpSuccessfullStatus,
      );
      expect(getRegisterChallenge.response.body).to.deep.equal(response);
    }
  });
});

/**
 * Intercept PayU create order API
 * Provides `@postPayuCreateOrder` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptPayuCreateOrderPostApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiPayuCreateOrder } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiPayuCreateOrderLocalized = `${apiBaseUrl}${urlApiPayuCreateOrder}`;

    cy.fixture('apiPostPayuCreateOrderResponse.json').then(
      (apiPostPayuCreateOrderResponse) => {
        cy.intercept('POST', urlApiPayuCreateOrderLocalized, {
          statusCode: responseStatusCode || httpSuccessfullStatus,
          body: responseBody || apiPostPayuCreateOrderResponse,
        }).as('postPayuCreateOrder');
      },
    );
  },
);

/**
 * Intercept "I don't want merchandise" GET API call
 * Provides `@getMerchandiseNone` alias
 * @param {Config} config - App global config
 * @param {I18n|string} i18n - i18n instance or locale lang string e.g. en
 */
Cypress.Commands.add('interceptMerchandiseNoneGetApi', (config, i18n) => {
  const {
    apiBase,
    apiDefaultLang,
    urlApiMerchandise,
    iDontWantMerchandiseItemCode,
  } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiMerchandiseNoneLocalized = `${apiBaseUrl}${urlApiMerchandise}${iDontWantMerchandiseItemCode}/`;

  cy.fixture('apiGetMerchandiseResponseNone').then(
    (merchandiseNoneResponse) => {
      cy.intercept('GET', urlApiMerchandiseNoneLocalized, {
        statusCode: httpSuccessfullStatus,
        body: merchandiseNoneResponse,
      }).as('getMerchandiseNone');
    },
  );
});

/**
 * Wait for intercept "I don't want merchandise" API call and compare response object
 * Wait for `@getMerchandiseNone` intercept
 */
Cypress.Commands.add('waitForMerchandiseNoneApi', () => {
  cy.fixture('apiGetMerchandiseResponseNone').then(
    (merchandiseNoneResponse) => {
      cy.wait('@getMerchandiseNone').then((getMerchandiseNone) => {
        expect(getMerchandiseNone.request.headers.authorization).to.include(
          bearerTokeAuth,
        );
        if (getMerchandiseNone.response) {
          expect(getMerchandiseNone.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getMerchandiseNone.response.body).to.deep.equal(
            merchandiseNoneResponse,
          );
        }
      });
    },
  );
});

/**
 * Wait for PayU create order API call and compare request/response object
 * Wait for `@postPayuCreateOrder` intercept
 * @param {Object} requestBody - Expected request body override
 * @param {Object} responseBody - Expected response body override
 */
Cypress.Commands.add(
  'waitForPayuCreateOrderPostApi',
  (requestBody = null, responseBody = null) => {
    cy.fixture('apiPostPayuCreateOrderRequest.json').then(
      (apiPostPayuCreateOrderRequest) => {
        cy.wait('@postPayuCreateOrder').then(({ request, response }) => {
          expect(request.headers.authorization).to.include(bearerTokeAuth);

          // verify request body
          if (requestBody) {
            expect(request.body).to.deep.equal(requestBody);
          } else {
            expect(request.body.amount).to.equal(
              apiPostPayuCreateOrderRequest.amount,
            );
            expect(request.body).to.haveOwnProperty('client_ip');
          }

          cy.fixture('apiPostPayuCreateOrderResponse.json').then(
            (apiPostPayuCreateOrderResponse) => {
              // verify response
              if (responseBody) {
                expect(response.statusCode).to.equal(httpSuccessfullStatus);
                expect(response.body).to.deep.equal(responseBody);
              } else {
                expect(response.statusCode).to.equal(httpSuccessfullStatus);
                expect(response.body).to.deep.equal(
                  apiPostPayuCreateOrderResponse,
                );
              }
            },
          );
        });
      },
    );
  },
);

Cypress.Commands.add(
  'interceptRegisterChallengeCoreApiRequests',
  (config, i18n) => {
    cy.fixture('formOrganizationOptions').then((formOrganizationOptions) => {
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        // intercept organizations API
        interceptOrganizationsApi(config, i18n, OrganizationType.company);
        interceptOrganizationsApi(config, i18n, OrganizationType.school);
        // for first organization, intercept API call with response true
        cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              config,
              i18n,
              formFieldCompanyResponse.results[0].id,
              response,
            );
          },
        );
        // for second organization, intercept API call with response false
        cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              config,
              i18n,
              formFieldCompanyResponse.results[1].id,
              response,
            );
          },
        );
        // intercept subsidiary API
        cy.interceptSubsidiariesGetApi(
          config,
          i18n,
          formOrganizationOptions[0].id,
        );
        // intercept teams for first subsidiary
        cy.interceptTeamsGetApi(
          config,
          i18n,
          formOrganizationOptions[0].subsidiaries[0].id,
        );
        cy.interceptMerchandiseGetApi(config, i18n);
      });
    });
  },
);

/**
 * Test that step 1 is loaded correctly
 * @param {I18n} i18n - i18n instance
 * @param {Object} registerChallengeResponse - Register challenge response
 */
Cypress.Commands.add(
  'testRegisterChallengeLoadedStepOne',
  (i18n, registerChallengeResponse) => {
    cy.waitForRegisterChallengeGetApi(registerChallengeResponse);
    // opens first step
    cy.dataCy('step-1').find('.q-stepper__step-content').should('be.visible');
    // form contains data from fixture
    cy.dataCy('form-firstName-input').should(
      'have.value',
      registerChallengeResponse.results[0].personal_details.first_name,
    );
    cy.dataCy('form-lastName-input').should(
      'have.value',
      registerChallengeResponse.results[0].personal_details.last_name,
    );
    cy.dataCy('form-nickname-input').should(
      'have.value',
      registerChallengeResponse.results[0].personal_details.nickname,
    );
    // male sex is selected
    cy.dataCy('form-personal-details-gender')
      .find('.q-radio__inner')
      .first()
      .should('have.class', 'q-radio__inner--truthy');
    // newsletter challenge is selected
    cy.dataCy('newsletter-options').within(() => {
      cy.get('.q-checkbox__inner')
        .first()
        .should('have.class', 'q-checkbox__inner--truthy');
    });
    // checkbox terms is checked
    cy.dataCy('form-terms-input')
      .find('.q-checkbox__inner')
      .should('have.class', 'q-checkbox__inner--truthy');
  },
);

/**
 * Test that steps 3 to 5 are loaded correctly
 * @param {I18n} i18n - i18n instance
 * @param {Object} registerChallengeResponse - Register challenge response
 */
Cypress.Commands.add(
  'testRegisterChallengeLoadedStepsThreeToFive',
  (i18n, registerChallengeResponse) => {
    // check that participation is selected
    cy.dataCy('form-field-option-group').within(() => {
      cy.get('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', i18n.global.t('form.participation.labelColleagues'));
    });
    // go to next step
    cy.dataCy('step-3-continue').should('be.visible').click();
    // debug component contains correct data
    cy.dataCy('debug-register-challenge-ids')
      .should('be.visible')
      .within(() => {
        cy.dataCy('debug-organization-id-value')
          .should('not.be.empty')
          .and('contain', registerChallengeResponse.results[0].organization_id);
        cy.dataCy('debug-subsidiary-id-value')
          .should('not.be.empty')
          .and('contain', registerChallengeResponse.results[0].subsidiary_id);
        cy.dataCy('debug-team-id-value')
          .should('not.be.empty')
          .and('contain', registerChallengeResponse.results[0].team_id);
      });
    // company is preselected
    cy.dataCy('form-select-table-company')
      .should('be.visible')
      .find('.q-radio__inner')
      .first()
      .should('have.class', 'q-radio__inner--truthy');
    // address is preselected
    cy.fixture('apiGetSubsidiariesResponse').then((subsidiariesResponse) => {
      cy.dataCy('form-company-address')
        .find('.q-field__input')
        .invoke('val')
        .should('contain', subsidiariesResponse.results[0].address.street)
        .and('contain', subsidiariesResponse.results[0].address.street_number)
        .and('contain', subsidiariesResponse.results[0].address.recipient)
        .and('contain', subsidiariesResponse.results[0].address.psc)
        .and('contain', subsidiariesResponse.results[0].address.city);
      // go to next step
      cy.dataCy('step-4-continue').should('be.visible').click();
      // first available team is preselected (2nd team in fixture results)
      cy.dataCy('form-select-table-team')
        .find('.q-radio:not(.disabled)')
        .first()
        .find('.q-radio__inner')
        .should('have.class', 'q-radio__inner--truthy');
      // go to next step
      cy.dataCy('step-5-continue').should('be.visible').click();
    });
  },
);

/**
 * Test that step 6 is loaded correctly
 * @param {I18n} i18n - i18n instance
 * @param {Object} registerChallengeResponse - Register challenge response
 */
Cypress.Commands.add(
  'testRegisterChallengeLoadedStepSix',
  (i18n, registerChallengeResponse) => {
    // correct merch card is preselected
    cy.dataCy('form-card-merch-female')
      .first()
      .find('[data-cy="button-selected"]')
      .should('be.visible');
    // correct size is preselected
    cy.fixture('apiGetMerchandiseResponse').then((merchandiseResponse) => {
      // select our test item (Triko 2024, female, size M)
      cy.wrap(
        merchandiseResponse.results.find(
          (item) =>
            item.id === registerChallengeResponse.results[0].t_shirt_size_id,
        ),
      ).then((item) => {
        // same size is selected
        cy.dataCy('form-field-merch-size')
          .find('.q-radio__inner.q-radio__inner--truthy')
          .siblings('.q-radio__label')
          .should('contain', item.size);
      });
    });
    // phone number is preselected
    cy.dataCy('form-phone-input').should(
      'have.value',
      registerChallengeResponse.results[0].personal_details.telephone,
    );
    // phone opt-in is preselected
    if (
      registerChallengeResponse.results[0].personal_details.telephone_opt_in
    ) {
      cy.dataCy('form-merch-phone-opt-in-input')
        .find('.q-checkbox__inner')
        .should('have.class', 'q-checkbox__inner--truthy');
    } else {
      cy.dataCy('form-merch-phone-opt-in-input')
        .find('.q-checkbox__inner')
        .should('have.class', 'q-checkbox__inner--falsy');
    }
    // go to next step
    cy.dataCy('step-6-continue').should('be.visible').click();
    // verify step 7 is active
    cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
  },
);

/**
 * Select paying company
 */
Cypress.Commands.add(
  'selectRegisterChallengePayingOrganization',
  (index = 0) => {
    cy.fixture('formFieldCompany').then((formFieldCompany) => {
      cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
        waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
        cy.dataCy('form-field-company').find('.q-field__append').click();
        // select option
        cy.get('.q-item__label')
          .should('be.visible')
          .and((opts) => {
            expect(
              opts.length,
              formFieldCompany.results.length +
                formFieldCompanyNext.results.length,
            );
          })
          .eq(index)
          .click();
        cy.get('.q-menu').should('not.exist');
      });
    });
  },
);

/**
 * Intercept IP address GET API call
 * Provides `@getIpAddress` alias
 * @param {Config} config - global configuration
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptIpAddressGetApi',
  (config, responseBody = null, responseStatusCode = null) => {
    const { apiBaseIpAddress } = config;
    cy.fixture('apiGetIpAddressResponse.json').then((ipAddressResponse) => {
      cy.intercept('GET', apiBaseIpAddress, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody || ipAddressResponse,
      }).as('getIpAddress');
    });
  },
);

/**
 * Wait for IP address API call and compare response object
 * Wait for `@getIpAddress` intercept
 */
Cypress.Commands.add('waitForIpAddressGetApi', () => {
  cy.fixture('apiGetIpAddressResponse.json').then((ipAddressResponse) => {
    cy.wait('@getIpAddress').then(({ response }) => {
      if (response) {
        expect(response.statusCode).to.equal(httpSuccessfullStatus);
        expect(response.body).to.deep.equal(ipAddressResponse);
      }
    });
  });
});

/**
 * Intercept this confirm email POST API call
 * Provides `@confirmEmailRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptConfirmEmailApi',
  (config, i18n, responseBody, responseStatusCode) => {
    const { apiBase, apiDefaultLang, urlApiConfirmEmail } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    // intercept confirm email API call
    const apiEmailConfirmationUrl = `${apiBaseUrl}${urlApiConfirmEmail}`;
    cy.fixture('apiGetConfirmEmailResponseOK.json').then(
      (apiGetConfirmEmailResponse) => {
        cy.intercept('POST', apiEmailConfirmationUrl, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody ? responseBody : apiGetConfirmEmailResponse,
        }).as('confirmEmailRequest');
      },
    );
  },
);

/**
 * Test that user cannot access any page except register-challenge
 */
Cypress.Commands.add('testAccessRegisterChallengeOnly', () => {
  // not allowed to access home page
  cy.visit('#' + routesConf['home']['path']);
  // test home page with title element because url `/` is included in all paths
  cy.dataCy('index-title').should('not.exist');
  cy.url().should('include', routesConf['register_challenge']['path']);
  // not allowed to access routes page
  cy.visit('#' + routesConf['routes']['path']);
  cy.url().should('not.include', routesConf['routes']['path']);
  cy.url().should('include', routesConf['register_challenge']['path']);
  // not allowed to access results page
  cy.visit('#' + routesConf['results']['path']);
  cy.url().should('not.include', routesConf['results']['path']);
  cy.url().should('include', routesConf['register_challenge']['path']);
  // not allowed to access prizes page
  cy.visit('#' + routesConf['prizes']['path']);
  cy.url().should('not.include', routesConf['prizes']['path']);
  cy.url().should('include', routesConf['register_challenge']['path']);
  // not allowed to access coordinator page
  cy.visit('#' + routesConf['coordinator']['path']);
  cy.url().should('not.include', routesConf['coordinator']['path']);
  cy.url().should('include', routesConf['register_challenge']['path']);
  // not allowed to access profile page
  cy.visit('#' + routesConf['profile']['path']);
  cy.url().should('not.include', routesConf['profile']['path']);
  cy.url().should('include', routesConf['register_challenge']['path']);
  // allowed to access register-coordinator page
  cy.visit('#' + routesConf['register_coordinator']['path']);
  cy.url().should('include', routesConf['register_coordinator']['path']);
});

/**
 * Wait for intercept register coordinator POST API call and compare request object
 * Wait for `@registerCoordinator` intercept
 * @returns {void}
 */
Cypress.Commands.add('waitForRegisterCoordinatorPostApi', () => {
  cy.fixture('apiPostRegisterCoordinatorRequest').then(
    (registerCoordinatorRequest) => {
      cy.wait('@registerCoordinator').then(({ request, response }) => {
        expect(request.headers.authorization).to.include(bearerTokeAuth);
        expect(request.body).to.deep.equal(registerCoordinatorRequest);
        if (response) {
          expect(response.statusCode).to.equal(httpSuccessfullStatus);
        }
      });
    },
  );
});

/**
 * Test that a specific message is displayed after loading register challenge data
 * @param {Object} response - Register challenge response data
 * @param {String} messageSelector - data-cy selector for the message element
 */
Cypress.Commands.add(
  'testRegisterChallengePaymentMessage',
  (response, messageSelector) => {
    cy.waitForRegisterChallengeGetApi(response);
    // verify step 2 is active
    cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
    // verify message is displayed
    cy.dataCy(messageSelector).should('be.visible');
  },
);

/**
 * Intercept is user organization admin GET API call
 * Provides `@getIsUserOrganizationAdmin` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptIsUserOrganizationAdminGetApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiIsUserOrganizationAdmin } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiIsUserOrganizationAdminLocalized = `${apiBaseUrl}${urlApiIsUserOrganizationAdmin}`;

    cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
      (defaultResponse) => {
        cy.intercept('GET', urlApiIsUserOrganizationAdminLocalized, {
          statusCode: responseStatusCode || httpSuccessfullStatus,
          body: responseBody || defaultResponse,
        }).as('getIsUserOrganizationAdmin');
      },
    );
  },
);

/**
 * Wait for intercept is user organization admin API call and compare response object
 * Wait for `@getIsUserOrganizationAdmin` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add(
  'waitForIsUserOrganizationAdminApi',
  (expectedResponse) => {
    cy.wait('@getIsUserOrganizationAdmin').then(
      (getIsUserOrganizationAdmin) => {
        expect(
          getIsUserOrganizationAdmin.request.headers.authorization,
        ).to.include(bearerTokeAuth);
        if (getIsUserOrganizationAdmin.response) {
          expect(getIsUserOrganizationAdmin.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getIsUserOrganizationAdmin.response.body).to.deep.equal(
            expectedResponse,
          );
        }
      },
    );
  },
);

Cypress.Commands.add('passToStep2', () => {
  cy.fixture('apiPostRegisterChallengePersonalDetailsRequest').then(
    (personalDetailsRequest) => {
      cy.dataCy('form-firstName-input').type(personalDetailsRequest.first_name);
      cy.dataCy('form-lastName-input').type(personalDetailsRequest.last_name);
      cy.dataCy('form-nickname-input').type(personalDetailsRequest.nickname);
      cy.dataCy('newsletter-option').each((newsletterOption) => {
        cy.wrap(newsletterOption).click();
      });
      cy.dataCy('form-personal-details-gender')
        .find('.q-radio__label')
        .first()
        .click();
      cy.dataCy('form-personal-details-terms')
        .find('.q-checkbox__inner')
        .first()
        .click();
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-1-continue').find('.q-spinner').should('be.visible');
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
    },
  );
});

Cypress.Commands.add('passToStep3', () => {
  cy.get('@config').then((config) => {
    cy.get('@i18n').then((i18n) => {
      cy.passToStep2();
      // payment - choose a free pass voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      cy.applyFullVoucher(config, i18n);
      // next step button should be visible and enabled
      cy.dataCy('step-2-continue').should('be.visible').click();
      cy.dataCy('step-2-continue').find('.q-spinner').should('be.visible');
      // on step 3
      cy.dataCy('step-3').find('.q-stepper__step-content').should('be.visible');

      // override POST register-challenge response (payment status "done")
      cy.fixture('apiPostRegisterChallengeResponsePaymentDone.json').then(
        (response) => {
          cy.interceptRegisterChallengePostApi(config, i18n, response);
        },
      );
    });
  });
});

Cypress.Commands.add('passToStep4', () => {
  cy.passToStep3();
  cy.dataCy('form-field-option').first().click();
  cy.dataCy('step-3-continue').should('be.visible').click();
  // step 3 skip check for loading spinner (not sending data to API)
  // on step 4
  cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
});

Cypress.Commands.add('passToStep5', () => {
  cy.passToStep4();
  // select company
  cy.dataCy('form-select-table-company')
    .should('be.visible')
    .find('.q-radio')
    .first()
    .click();
  cy.fixture('apiGetSubsidiariesResponse.json').then(
    (apiGetSubsidiariesResponse) => {
      cy.fixture('apiGetSubsidiariesResponseNext.json').then(
        (apiGetSubsidiariesResponseNext) => {
          cy.waitForSubsidiariesApi(
            apiGetSubsidiariesResponse,
            apiGetSubsidiariesResponseNext,
          );
        },
      );
    },
  );
  // select address
  cy.dataCy('form-company-address').find('.q-field__append').last().click();
  // select option
  cy.get('.q-menu')
    .should('be.visible')
    .within(() => {
      cy.get('.q-item').first().click();
    });
  cy.dataCy('step-4-continue').should('be.visible').click();
  // step 4 skip check for loading spinner (not sending data to API)
  // on step 5
  cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
});

Cypress.Commands.add('passToStep6', () => {
  cy.passToStep5();
  // select a team
  cy.dataCy('form-select-table-team')
    .should('be.visible')
    .find('.q-radio:not(.disabled)')
    .first()
    .click();
  cy.dataCy('step-5-continue').should('be.visible').click();
  cy.dataCy('step-5-continue').find('.q-spinner').should('be.visible');
  // on step 6
  cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
});

Cypress.Commands.add('passToStep7', () => {
  cy.passToStep6();
  cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then((request) => {
    // select merch
    cy.dataCy('form-card-merch-female')
      .first()
      .find('[data-cy="form-card-merch-link"]')
      .click();
    // close dialog
    cy.dataCy('dialog-close').click();
    // verify dialog is closed
    cy.dataCy('dialog-merch').should('not.exist');
    // fill phone number
    cy.dataCy('form-merch-phone-input')
      .should('be.visible')
      .find('input')
      .type(request.telephone);
    // opt in to info phone calls
    cy.dataCy('form-merch-phone-opt-in-input').should('be.visible').click();
    // go to next step
    cy.dataCy('step-6-continue').should('be.visible').click();
    cy.dataCy('step-6-continue').find('.q-spinner').should('be.visible');
    // on step 7
    cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
  });
});

/**
 * Intercept send registration confirmation email POST API call
 * Provides `@postSendRegistrationConfirmationEmail` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptSendRegistrationConfirmationEmailPostApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiSendRegistrationConfirmationEmail } =
      config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiSendRegistrationConfirmationEmailLocalized = `${apiBaseUrl}${urlApiSendRegistrationConfirmationEmail}`;

    cy.fixture(
      'apiPostSendRegistrationConfirmationEmailResponseTrue.json',
    ).then((defaultResponse) => {
      cy.intercept('POST', urlApiSendRegistrationConfirmationEmailLocalized, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody || defaultResponse,
      }).as('postSendRegistrationConfirmationEmail');
    });
  },
);

/**
 * Wait for intercept send registration confirmation email POST API call and compare response object
 * Wait for `@postSendRegistrationConfirmationEmail` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add(
  'waitForSendRegistrationConfirmationEmailPostApi',
  (expectedResponse = null) => {
    cy.fixture(
      'apiPostSendRegistrationConfirmationEmailResponseTrue.json',
    ).then((defaultResponse) => {
      cy.wait('@postSendRegistrationConfirmationEmail').then(
        ({ request, response }) => {
          expect(request.headers.authorization).to.include(bearerTokeAuth);
          if (response) {
            expect(response.statusCode).to.equal(httpSuccessfullStatus);
            expect(response.body).to.deep.equal(
              expectedResponse || defaultResponse,
            );
          }
        },
      );
    });
  },
);

/**
 * Intercept reset password confirm POST API call
 * Provides `@postResetPasswordConfirm` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptResetPasswordConfirmApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiResetPasswordConfirm } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiResetPasswordConfirmLocalized = `${apiBaseUrl}${urlApiResetPasswordConfirm}`;

    cy.fixture('apiPostResetPasswordConfirmResponseSuccess.json').then(
      (defaultResponseBody) => {
        cy.intercept('POST', urlApiResetPasswordConfirmLocalized, {
          statusCode: responseStatusCode
            ? responseStatusCode
            : httpSuccessfullStatus,
          body: responseBody ? responseBody : defaultResponseBody,
        }).as('postResetPasswordConfirm');
      },
    );
  },
);

/**
 * Wait for intercept reset password confirm POST API call and compare request/response object
 * Wait for `@postResetPasswordConfirm` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add(
  'waitForResetPasswordConfirmApi',
  (expectedResponse = null) => {
    cy.fixture('apiPostResetPasswordConfirmRequest.json').then(
      (requestFixture) => {
        cy.wait('@postResetPasswordConfirm').then(({ request, response }) => {
          // verify that request matches fixture
          expect(request.body).to.deep.equal(requestFixture);

          // verify that response if provided
          if (response && expectedResponse) {
            expect(response.statusCode).to.equal(httpSuccessfullStatus);
            expect(response.body).to.deep.equal(expectedResponse);
          }
        });
      },
    );
  },
);

/**
 * Check form field validation error color
 * @param {String} formField - Form field Cypress selector
 * @param {String} validationErrorColor - Form field validation error color RGB string
 *                                        e.g. 'rgb(160, 215, 196)'
 */
Cypress.Commands.add(
  'checkFormFieldValidationErrColor',
  (formField, validationErrorColor) => {
    // Activate form field validation
    cy.dataCy(formField).should('be.visible').find('.q-field__control').focus();
    cy.focused().blur();
    // Form field
    cy.dataCy(formField)
      .find('.q-field__control')
      .should('have.color', validationErrorColor);
    // Validation error message
    cy.dataCy(formField)
      .find('.q-field__messages')
      .should('have.color', validationErrorColor);
  },
);

/**
 * Intercept register challenge PUT API call
 * Provides `@putRegisterChallenge` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Number} primaryKeyId - Primary key ID of the registration
 * @param {Object} responseBody - Override response body
 * @param {Number} responseStatusCode - Override response HTTP status code
 */
Cypress.Commands.add(
  'interceptRegisterChallengePutApi',
  (
    config,
    i18n,
    primaryKeyId,
    responseBody = null,
    responseStatusCode = null,
  ) => {
    const { apiBase, apiDefaultLang, urlApiRegisterChallenge } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiRegisterChallengeLocalized = `${apiBaseUrl}${urlApiRegisterChallenge}${primaryKeyId}/`;

    cy.intercept('PUT', urlApiRegisterChallengeLocalized, {
      statusCode: responseStatusCode || httpSuccessfullStatus,
      body: responseBody,
      delay: interceptedRequestResponseDelay,
    }).as('putRegisterChallenge');
  },
);

/**
 * Wait for intercept register challenge PUT API call and compare request/response object
 * Wait for `@putRegisterChallenge` intercept
 * @param {Object} requestBody - Expected request body
 * @param {Object} responseBody - Expected response body
 */
Cypress.Commands.add(
  'waitForRegisterChallengePutApi',
  (requestBody, responseBody = null) => {
    cy.wait('@putRegisterChallenge').then(({ request, response }) => {
      expect(request.headers.authorization).to.include(bearerTokeAuth);
      expect(request.body).to.deep.equal(requestBody);
      // allow to test only request
      if (response && responseBody) {
        expect(response.statusCode).to.equal(httpSuccessfullStatus);
        expect(response.body).to.deep.equal(responseBody);
      }
    });
  },
);

/**
 * Checks the state of the mobile bottom panel menu and its slide-out dialog
 * @param {Config} config - The app configuration object
 * @param {boolean} isUserOrganizationAdmin - Whether the user is a coordinator
 */
Cypress.Commands.add(
  'checkMobileBottomPanel',
  ({
    config,
    i18n,
    defLocale,
    isUserOrganizationAdmin = false,
    isUserStaff = false,
  }) => {
    const { getMenuTop, getMenuBottom } = useMenu();
    const {
      urlRideToWorkByBikeOldFrontendDjangoApp,
      urlRideToWorkByBikeOldFrontendDjangoAppAdmin,
    } = config;
    const rtwbbOldFrontendDjangoAdminUrl = `${urlRideToWorkByBikeOldFrontendDjangoApp}/${urlRideToWorkByBikeOldFrontendDjangoAppAdmin}`;

    // get localized URL for menu admin link
    const urlAdmin = getApiBaseUrlWithLang(
      null,
      rtwbbOldFrontendDjangoAdminUrl,
      defLocale,
      i18n,
    );
    // get localized URL for menu donate link
    const urlDonate = getApiBaseUrlWithLang(
      null,
      config.urlDonate,
      defLocale,
      i18n,
    );
    const urlContact = getApiBaseUrlWithLang(
      null,
      config.urlContact,
      defLocale,
      i18n,
    );
    cy.wrap(
      getMenuTop({
        isUserOrganizationAdmin,
        isUserStaff,
        urlAdmin,
        isEntryEnabled: true,
        isResultsEnabled: true,
      }),
    ).then((menuTop) => {
      cy.wrap(getMenuBottom(urlDonate, urlContact)).then((menuBottom) => {
        // Check footer panel menu
        cy.dataCy('footer-panel-menu').should('be.visible');
        cy.dataCy('footer-panel-menu')
          .should('be.visible')
          .find('.q-item')
          // items shown in bottom bar are set to 3+1 for "show more"
          .should('have.length', config.mobileBottomPanelVisibleItems + 1);

        // Show and check slide-out dialog panel
        cy.dataCy('footer-panel-menu-hamburger').click();
        cy.dataCy('footer-panel-menu-dialog').should('be.visible');
        cy.dataCy('footer-panel-menu-dialog')
          .should('be.visible')
          .find('.q-item')
          .should(
            'have.length',
            // items in slide-out dialog panel are remaining items
            menuTop.length +
              menuBottom.length -
              config.mobileBottomPanelVisibleItems,
          );
        // check that menu contains donate link
        cy.dataCy('footer-panel-menu-dialog').within(() => {
          cy.get('.q-item')
            .contains('.q-item', i18n.global.t('drawerMenu.donate'))
            .should('be.visible')
            .and('have.attr', 'href', urlDonate)
            .should('have.attr', 'target', '_blank')
            .invoke('attr', 'href')
            .then((href) => {
              cy.request({
                url: href,
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
        });
        // check that menu contains contact link
        cy.dataCy('footer-panel-menu-dialog').within(() => {
          cy.get('.q-item')
            .contains('.q-item', i18n.global.t('drawerMenu.contact'))
            .should('be.visible')
            .and('have.attr', 'href', urlContact)
            .should('have.attr', 'target', '_blank')
            .invoke('attr', 'href')
            .then((href) => {
              cy.request({
                url: href,
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
        });
        if (isUserOrganizationAdmin) {
          // user is coordinator - menu should contain coordinator item
          cy.dataCy('footer-panel-menu-dialog').within(() => {
            cy.get('.q-item')
              .contains('.q-item', i18n.global.t('drawerMenu.coordinator'))
              .should('be.visible');
          });
        } else {
          // user is not coordinator - menu should not contain coordinator item
          cy.dataCy('footer-panel-menu-dialog').within(() => {
            cy.get('.q-item')
              .contains('.q-item', i18n.global.t('drawerMenu.coordinator'))
              .should('not.exist');
          });
        }
        if (isUserStaff) {
          // user is staff - menu should contain admin item
          cy.dataCy('footer-panel-menu-dialog').within(() => {
            cy.get('.q-item')
              .contains('.q-item', i18n.global.t('drawerMenu.admin'))
              .should('be.visible')
              .and('have.attr', 'href', urlAdmin)
              .should('have.attr', 'target', '_blank')
              .invoke('attr', 'href')
              .then((href) => {
                cy.request({
                  url: href,
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
          });
        } else {
          // user is not staff - menu should not contain admin item
          cy.dataCy('footer-panel-menu-dialog').within(() => {
            cy.get('.q-item')
              .contains('.q-item', i18n.global.t('drawerMenu.admin'))
              .should('not.exist');
          });
        }
      });
    });
  },
);

/**
 * Intercept my team GET API call
 * Provides `@getMyTeam` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptMyTeamGetApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiMyTeam } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiMyTeamLocalized = `${apiBaseUrl}${urlApiMyTeam}`;

    cy.fixture('apiGetMyTeamResponseApproved.json').then((defaultResponse) => {
      cy.intercept('GET', urlApiMyTeamLocalized, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody || defaultResponse,
      }).as('getMyTeam');
    });
  },
);

/**
 * Wait for intercept my team API call and compare response object
 * Wait for `@getMyTeam` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add('waitForMyTeamGetApi', (expectedResponse = null) => {
  cy.fixture('apiGetMyTeamResponseApproved.json').then((defaultResponse) => {
    cy.wait('@getMyTeam').then((getMyTeam) => {
      expect(getMyTeam.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      if (getMyTeam.response) {
        expect(getMyTeam.response.statusCode).to.equal(httpSuccessfullStatus);
        expect(getMyTeam.response.body).to.deep.equal(
          expectedResponse || defaultResponse,
        );
      }
    });
  });
});

/**
 * Intercept my organization admin API call
 * Creates `@getMyOrganizationAdmin` intercept
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptMyOrganizationAdminGetApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiMyOrganizationAdmin } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiMyOrganizationAdminLocalized = `${apiBaseUrl}${urlApiMyOrganizationAdmin}`;

    cy.fixture('apiGetMyOrganizationAdmin.json').then((defaultResponse) => {
      cy.intercept('GET', urlApiMyOrganizationAdminLocalized, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody || defaultResponse,
      }).as('getMyOrganizationAdmin');
    });
  },
);

/**
 * Wait for intercept my organization admin API call and compare response object
 * Wait for `@getMyOrganizationAdmin` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add(
  'waitForMyOrganizationAdminGetApi',
  (expectedResponse = null) => {
    cy.fixture('apiGetMyOrganizationAdmin.json').then((defaultResponse) => {
      cy.wait('@getMyOrganizationAdmin').then((getMyOrganizationAdmin) => {
        expect(getMyOrganizationAdmin.request.headers.authorization).to.include(
          bearerTokeAuth,
        );
        if (getMyOrganizationAdmin.response) {
          expect(getMyOrganizationAdmin.response.statusCode).to.equal(
            httpSuccessfullStatus,
          );
          expect(getMyOrganizationAdmin.response.body).to.deep.equal(
            expectedResponse || defaultResponse,
          );
        }
      });
    });
  },
);

/**
 * Intercept my team PUT API call
 * Provides `@putMyTeam` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {Number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptMyTeamPutApi',
  (config, i18n, teamId, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiMyTeam } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiMyTeamLocalized = `${apiBaseUrl}${urlApiMyTeam}${teamId}/`;

    cy.fixture('apiGetMyTeamResponseApproved.json').then((defaultResponse) => {
      cy.intercept('PUT', urlApiMyTeamLocalized, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody || defaultResponse,
      }).as('putMyTeam');
    });
  },
);

/**
 * Wait for intercept my team PUT API call and compare response object
 * Wait for `@putMyTeam` intercept
 * @param {Object} expectedResponse - Expected response body
 */
Cypress.Commands.add(
  'waitForMyTeamPutApi',
  (expectedRequest, expectedResponse = null) => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then((defaultResponse) => {
      cy.wait('@putMyTeam').then(({ request, response }) => {
        expect(request.headers.authorization).to.include(bearerTokeAuth);
        expect(request.body).to.deep.equal(expectedRequest);
        if (response) {
          expect(response.statusCode).to.equal(httpSuccessfullStatus);
          expect(response.body).to.deep.equal(
            expectedResponse || defaultResponse,
          );
        }
      });
    });
  },
);

// intercept send team membership invitation email API request
Cypress.Commands.add(
  'interceptSendTeamMembershipInvitationEmailApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiSendTeamMembershipInvitationEmail } =
      config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiSendTeamMembershipInvitationEmailLocalized = `${apiBaseUrl}${urlApiSendTeamMembershipInvitationEmail}`;

    cy.fixture('apiPostSendTeamMembershipInvitationEmailResponse.json').then(
      (defaultResponse) => {
        cy.intercept('POST', urlApiSendTeamMembershipInvitationEmailLocalized, {
          statusCode: responseStatusCode || httpSuccessfullStatus,
          body: responseBody || defaultResponse,
        }).as('sendTeamMembershipInvitationEmailApi');
      },
    );
  },
);

// wait for send team membership invitation email API request
Cypress.Commands.add(
  'waitForSendTeamMembershipInvitationEmailApi',
  (expectedRequest, expectedResponse = null) => {
    cy.fixture('apiPostSendTeamMembershipInvitationEmailResponse.json').then(
      (defaultResponse) => {
        cy.wait('@sendTeamMembershipInvitationEmailApi').then(
          ({ request, response }) => {
            expect(request.headers.authorization).to.include(bearerTokeAuth);
            expect(request.body).to.deep.equal(expectedRequest);
            if (response) {
              expect(response.statusCode).to.equal(httpSuccessfullStatus);
              expect(response.body).to.deep.equal(
                expectedResponse || defaultResponse,
              );
            }
          },
        );
      },
    );
  },
);

/**
 * Test banner team member "undecided" state
 */
Cypress.Commands.add('testBannerTeamMemberUndecidedState', () => {
  cy.get('@i18n').then((i18n) => {
    cy.waitForThisCampaignApi();
    cy.fixture('apiGetMyTeamResponseUndecided.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
    // it shows banner in "undecided" state
    cy.dataCy('banner-team-member-approve').should('be.visible');
    // title
    cy.dataCy('banner-team-member-approve-title').should(
      'contain',
      i18n.global.t('bannerTeamMemberApprove.textWaitingForApproval'),
    );
    // button
    cy.dataCy('banner-team-member-approve-button').should('not.exist');
  });
});

/**
 * Test banner team member "approved" state with member approval/denial
 */
Cypress.Commands.add('testBannerTeamMemberApprovedState', () => {
  cy.get('@i18n').then((i18n) => {
    cy.waitForThisCampaignApi();
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
    // it shows banner in "approved" state
    cy.dataCy('banner-team-member-approve').should('be.visible');
    // title
    cy.dataCy('banner-team-member-approve-title').should(
      'contain',
      i18n.global.t('bannerTeamMemberApprove.textMembersToApprove'),
    );
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // first member
    cy.dataCy('dialog-approve-members-member')
      .first()
      .within(() => {
        // approve member button
        cy.dataCy('dialog-approve-members-button-approve')
          .should('be.visible')
          .click();
        cy.dataCy('dialog-approve-members-button-approve').should(
          'have.backgroundColor',
          positiveColor,
        );
      });
    // second member
    cy.dataCy('dialog-approve-members-member')
      .eq(1)
      .within(() => {
        // deny member button
        cy.dataCy('dialog-approve-members-button-deny')
          .should('be.visible')
          .click();
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negativeColor,
        );
      });
  });
});

/**
 * Test approving a single team member
 */
Cypress.Commands.add('testApproveSingleTeamMember', () => {
  cy.get('@i18n').then((i18n) => {
    cy.waitForThisCampaignApi();
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // first member
    cy.dataCy('dialog-approve-members-member')
      .first()
      .within(() => {
        // approve member button
        cy.dataCy('dialog-approve-members-button-approve')
          .should('be.visible')
          .click();
        cy.dataCy('dialog-approve-members-button-approve').should(
          'have.backgroundColor',
          positiveColor,
        );
      });
    // submit approval
    cy.dataCy('dialog-button-submit').should('be.visible').click();
    // wait for API intercept
    cy.fixture('apiPutMyTeamRequestApproveFirst.json').then(
      (responsePutMyTeam) => {
        cy.waitForMyTeamPutApi(responsePutMyTeam);
      },
    );
    // check for success message
    cy.contains(i18n.global.t('putMyTeam.apiMessageSuccess')).should(
      'be.visible',
    );
    // wait for refreshing team via GET
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
  });
});

/**
 * Test approving maximum number of team members and rejecting the rest
 */
Cypress.Commands.add('testApproveMaxTeamMembers', () => {
  cy.get('@i18n').then((i18n) => {
    cy.waitForThisCampaignApi();
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // approve first 4 members
    cy.dataCy('dialog-approve-members-member').each((member, index) => {
      if (index < 4) {
        cy.wrap(member).within(() => {
          cy.dataCy('dialog-approve-members-button-approve')
            .should('be.visible')
            .click();
          // approve button selected
          cy.dataCy('dialog-approve-members-button-approve').should(
            'have.backgroundColor',
            positiveColor,
          );
        });
      }
    });

    cy.fixture('apiPutMyTeamRequestApproveAllRejectRest.json').then(
      (responsePutMyTeam) => {
        cy.fixture('apiGetThisCampaign').then((thisCampaignResponse) => {
          cy.fixture('apiGetMyTeamResponseApproved.json').then(
            (responseMyTeam) => {
              // check 5th member
              cy.dataCy('dialog-approve-members-member')
                .eq(4)
                .within(() => {
                  // deny button is selected
                  cy.dataCy('dialog-approve-members-button-deny').should(
                    'have.backgroundColor',
                    negativeColor,
                  );
                  // approve button is disabled
                  cy.dataCy('dialog-approve-members-button-approve').should(
                    'be.disabled',
                  );
                  // automatic denial reason
                  cy.dataCy('dialog-approve-members-member-reason')
                    .find('input')
                    .should(
                      'have.value',
                      i18n.global.t(
                        'bannerTeamMemberApprove.textReasonTeamFull',
                        {
                          maxTeamMembers:
                            thisCampaignResponse.results[0].max_team_members,
                          teamName: responseMyTeam.results[0].name,
                        },
                      ),
                    );
                });
              // submit approval
              cy.dataCy('dialog-button-submit').should('be.visible').click();
              // update reason message for the expected request
              responsePutMyTeam.members[3].reason = i18n.global.t(
                'bannerTeamMemberApprove.textReasonTeamFull',
                {
                  maxTeamMembers:
                    thisCampaignResponse.results[0].max_team_members,
                  teamName: responseMyTeam.results[0].name,
                },
              );
              // wait for API intercept
              cy.waitForMyTeamPutApi(responsePutMyTeam);
            },
          );
        });
      },
    );
    // check for success message
    cy.contains(i18n.global.t('putMyTeam.apiMessageSuccess')).should(
      'be.visible',
    );
    // wait for refreshing team via GET
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.waitForMyTeamGetApi(responseMyTeam);
    });
  });
});

/**
 * Intercept trips GET API calls
 * Provides `@getTrips` and `@getTripsNextPage` aliases
 * @param {Object} config - App global config
 * @param {Object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} response - Override default response body
 * @param {Object} responseNext - Override default response body for next page
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptTripsGetApi',
  (
    config,
    i18n,
    response = null,
    responseNext = null,
    responseStatusCode = null,
  ) => {
    const { apiBase, apiDefaultLang, urlApiTrips } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiTripsLocalized = `${apiBaseUrl}${urlApiTrips}`;

    cy.fixture('apiGetTripsResponse').then((defaultResponse) => {
      const responseBody = response || defaultResponse;
      // intercept initial trips API call
      cy.intercept('GET', urlApiTripsLocalized, {
        statusCode: responseStatusCode || httpSuccessfullStatus,
        body: responseBody,
        delay: interceptedRequestResponseDelay,
      }).as('getTrips');
      // if fixture has next property
      if (responseBody.next) {
        cy.fixture('apiGetTripsResponseNext').then((defaultResponseNext) => {
          const responseBodyNext = responseNext || defaultResponseNext;
          // intercept next page API call
          cy.intercept('GET', responseBody.next, {
            statusCode: responseStatusCode || httpSuccessfullStatus,
            body: responseBodyNext,
            delay: interceptedRequestResponseDelay,
          }).as('getTripsNextPage');
        });
      }
    });
  },
);

/**
 * Intercept commute mode GET API call
 * Provides `@commuteModeRequest` alias
 * @param {Object} config - App global config
 * @param {Object|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptCommuteModeGetApi',
  (config, i18n, responseBody = null, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiCommuteMode } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiCommuteModeLocalized = `${apiBaseUrl}${urlApiCommuteMode}`;

    cy.fixture('apiGetCommuteMode').then((defaultResponseBody) => {
      cy.intercept('GET', urlApiCommuteModeLocalized, {
        statusCode: responseStatusCode
          ? responseStatusCode
          : httpSuccessfullStatus,
        body: responseBody ? responseBody : defaultResponseBody,
      }).as('commuteModeRequest');
    });
  },
);

/**
 * Wait for intercept trips API calls and compare request/response object
 * Wait for `@getTrips` and `@getTripsNextPage` intercepts
 * @param {Object} response - Override default response body
 * @param {Object} responseNext - Override default response body for next page
 */
Cypress.Commands.add(
  'waitForTripsApi',
  (response = null, responseNext = null) => {
    cy.fixture('apiGetTripsResponse').then((defaultResponse) => {
      cy.fixture('apiGetTripsResponseNext').then((defaultResponseNext) => {
        cy.wait(['@getTrips', '@getTripsNextPage']).spread(
          (getTrips, getTripsNextPage) => {
            expect(getTrips.request.headers.authorization).to.include(
              bearerTokeAuth,
            );
            if (getTrips.response) {
              expect(getTrips.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getTrips.response.body).to.deep.equal(
                response || defaultResponse,
              );
            }
            expect(getTripsNextPage.request.headers.authorization).to.include(
              bearerTokeAuth,
            );
            if (getTripsNextPage.response) {
              expect(getTripsNextPage.response.statusCode).to.equal(
                httpSuccessfullStatus,
              );
              expect(getTripsNextPage.response.body).to.deep.equal(
                responseNext || defaultResponseNext,
              );
            }
          },
        );
      });
    });
  },
);

/**
 * Wait for intercept commute mode API call and compare request/response object
 * Wait for `@commuteModeRequest` intercept
 * @param {Object} responseBody - Override default response body from fixture
 */
Cypress.Commands.add('waitForCommuteModeApi', (responseBody = null) => {
  cy.fixture('apiGetCommuteMode').then((commuteModeResponse) => {
    cy.wait('@commuteModeRequest').then((commuteModeRequest) => {
      if (commuteModeRequest.response) {
        expect(commuteModeRequest.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(commuteModeRequest.response.body).to.deep.equal(
          responseBody ? responseBody : commuteModeResponse,
        );
      }
    });
  });
});

/**
 * Set up trips store with commute modes from fixture
 * @param {Object} store - Trips store instance
 * @param {Object} responseBody - Override default response body from fixture
 */
Cypress.Commands.add(
  'setupTripsStoreWithCommuteModes',
  (useTripsStore, responseBody = null) => {
    cy.fixture('apiGetCommuteMode').then((defaultResponseBody) => {
      const commuteModeResponse = responseBody
        ? responseBody
        : defaultResponseBody;
      cy.wrap(useTripsStore()).then((tripsStore) => {
        const commuteModes = computed(() => tripsStore.getCommuteModes);
        tripsStore.setCommuteModes(commuteModeResponse.results);
        // verify store state
        cy.wrap(commuteModes)
          .its('value')
          .should('deep.equal', commuteModeResponse.results);
      });
    });
  },
);

/**
 * Intercept post trips API
 * Provides `@postTrips` alias
 * @param {Config} config - App global config
 * @param {I18n|String} i18n - i18n instance or locale lang string e.g. en
 * @param {Object} responseBody - Override default response body
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptPostTripsApi',
  (config, i18n, responseBody, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiTrips } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiTripsLocalized = `${apiBaseUrl}${urlApiTrips}`;

    cy.intercept('POST', urlApiTripsLocalized, {
      statusCode: responseStatusCode || httpSuccessfullStatus,
      body: responseBody,
    }).as('postTrips');
  },
);

/**
 * Wait for post trips API call and compare request/response object
 * Wait for `@postTrips` intercept
 * @param {Object} requestBody - Expected request body to compare against
 * @param {Object} responseBody - Expected response body to compare against
 */
Cypress.Commands.add(
  'waitForPostTripsApi',
  (requestBody, responseBody = null) => {
    cy.wait('@postTrips').then(({ request, response }) => {
      // verify authorization header
      expect(request.headers.authorization).to.include(bearerTokeAuth);
      // request body comparison accepting different trips array order
      if (requestBody.trips && Array.isArray(requestBody.trips)) {
        expect(request.body.trips).to.have.deep.members(requestBody.trips);
      } else {
        expect(request.body).to.deep.equal(requestBody);
      }
      // verify response body
      if (responseBody) {
        expect(response.body).to.deep.equal(responseBody);
      }
    });
  },
);

/**
 * Intercept open app with rest token GET API call
 * Provides `@openAppWithRestTokenRequest` alias
 * @param {Object} config - App global config
 * @param {Object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {string} appId - App ID to fetch data for
 * @param {Object} responseBody - Override default response body
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptOpenAppWithRestTokenGetApi',
  (config, i18n, appId, responseBody, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiOpenAppWithRestToken } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiOpenAppWithRestTokenLocalized = `${apiBaseUrl}${urlApiOpenAppWithRestToken}${appId}`;

    cy.intercept('GET', urlApiOpenAppWithRestTokenLocalized, {
      statusCode: responseStatusCode
        ? responseStatusCode
        : httpSuccessfullStatus,
      body: responseBody,
    }).as('openAppWithRestTokenRequest');
  },
);

/**
 * Wait for intercept open app with rest token API call and compare request/response object
 * Wait for `@openAppWithRestTokenRequest` intercept
 * @param {object} responseBody - Override default response body from fixture
 */
Cypress.Commands.add('waitForOpenAppWithRestTokenApi', (responseBody) => {
  cy.wait('@openAppWithRestTokenRequest').then(
    (openAppWithRestTokenRequest) => {
      if (openAppWithRestTokenRequest.response) {
        expect(openAppWithRestTokenRequest.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(openAppWithRestTokenRequest.response.body).to.deep.equal(
          responseBody,
        );
      }
    },
  );
});

/**
 * Intercept GET urlApiStravaConnectAccount
 * @param {Object} config - App global config
 * @param {Object} i18n - i18n instance
 * @param {string} fixture - Fixture name
 */
Cypress.Commands.add(
  'interceptGetStravaConnectAccount',
  (config, i18n, fixture, scope) => {
    const { apiBase, apiDefaultLang, urlApiStravaConnectAccount } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiStravaConnect = `${apiBaseUrl}${urlApiStravaConnectAccount}${scope}`;

    cy.intercept('GET', urlApiStravaConnect, {
      fixture,
      delay: interceptedRequestResponseDelay,
    }).as('getStravaConnectAccount');
  },
);

/**
 * Intercept GET request to Strava auth endpoint with code parameter
 * @param {Object} config - App global config
 * @param {Object} i18n - i18n instance
 * @param {string} fixture - Fixture name
 * @param {string} code - Code parameter value
 */
Cypress.Commands.add(
  'interceptGetStravaAuthWithParam',
  (config, i18n, fixture, code) => {
    const { apiBase, apiDefaultLang, urlApiStravaAuthAccount } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiStravaAuth = `${apiBaseUrl}${urlApiStravaAuthAccount}${code}`;

    cy.intercept('GET', urlApiStravaAuth, {
      fixture,
      delay: interceptedRequestResponseDelay,
    }).as('getStravaAuthWithParam');
  },
);

/**
 * Intercept GET request to Strava account endpoint
 * @param {Object} config - App global config
 * @param {Object} i18n - i18n instance
 * @param {string} fixture - Fixture name
 */
Cypress.Commands.add('interceptGetStravaAccount', (config, i18n, fixture) => {
  const { apiBase, apiDefaultLang, urlApiStravaGetAccount } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiStravaAccountLocalized = `${apiBaseUrl}${urlApiStravaGetAccount}`;

  cy.intercept('GET', urlApiStravaAccountLocalized, {
    fixture,
  }).as('getStravaAccount');
});

/**
 * Intercept GET request to Strava SYNC account endpoint
 * @param {Object} config - App global config
 * @param {Object} i18n - i18n instance
 * @param {string} fixture - Fixture name
 */
Cypress.Commands.add(
  'interceptGetStravaSyncAccount',
  (config, i18n, fixture) => {
    const { apiBase, apiDefaultLang, urlApiStravaGetAccountSync } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiStravaSyncLocalized = `${apiBaseUrl}${urlApiStravaGetAccountSync}`;

    cy.intercept('GET', urlApiStravaSyncLocalized, {
      fixture,
      delay: interceptedRequestResponseDelay,
    }).as('getStravaSyncAccount');
  },
);

/**
 * Intercept GET request to Strava disconnect endpoint
 * @param {Object} config - App global config
 * @param {Object} i18n - i18n instance
 * @param {string} fixture - Fixture name
 */
Cypress.Commands.add(
  'interceptGetStravaDisconnect',
  (config, i18n, fixture) => {
    const { apiBase, apiDefaultLang, urlApiStravaDisconnectAccount } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiStravaDisconnectLocalized = `${apiBaseUrl}${urlApiStravaDisconnectAccount}`;

    cy.intercept('GET', urlApiStravaDisconnectLocalized, {
      fixture,
      delay: interceptedRequestResponseDelay,
    }).as('getStravaDisconnect');
  },
);

/**
 * Intercept get results GET API call
 * Provides `@getResultsRequest` alias
 * @param {Object} config - App global config
 * @param {Object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {string} reportType - Report type to fetch data for
 * @param {Object} responseBody - Override default response body
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptGetResultsApi',
  (config, i18n, reportType, responseBody, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiResults } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiResultsLocalized = `${apiBaseUrl}${urlApiResults}${reportType}/`;

    cy.intercept('GET', urlApiResultsLocalized, {
      statusCode: responseStatusCode
        ? responseStatusCode
        : httpSuccessfullStatus,
      body: responseBody,
    }).as('getResultsRequest');
  },
);

/**
 * Wait for intercept get results API call and compare request/response object
 * Wait for `@getResultsRequest` intercept
 * @param {object} responseBody - Override default response body from fixture
 */
Cypress.Commands.add('waitForGetResultsApi', (responseBody) => {
  cy.wait('@getResultsRequest').then((getResultsRequest) => {
    if (getResultsRequest.response) {
      expect(getResultsRequest.response.statusCode).to.equal(
        httpSuccessfullStatus,
      );
      expect(getResultsRequest.response.body).to.deep.equal(responseBody);
    }
  });
});

/**
 * Intercept get results by challenge GET API call
 * Provides `@getResultsByChallengeRequest` alias
 * @param {Object} config - App global config
 * @param {Object|string} i18n - i18n instance or locale lang string e.g. en
 * @param {string} reportType - Report type to fetch data for
 * @param {Object} responseBody - Override default response body
 * @param {number} responseStatusCode - Override default response HTTP status code
 */
Cypress.Commands.add(
  'interceptGetResultsByChallengeApi',
  (config, i18n, reportType, responseBody, responseStatusCode = null) => {
    const { apiBase, apiDefaultLang, urlApiResultsByChallenge } = config;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiResultsByChallengeLocalized = `${apiBaseUrl}${urlApiResultsByChallenge}${reportType}/`;

    cy.intercept('GET', urlApiResultsByChallengeLocalized, {
      statusCode: responseStatusCode
        ? responseStatusCode
        : httpSuccessfullStatus,
      body: responseBody,
    }).as('getResultsByChallengeRequest');
  },
);

/**
 * Wait for intercept get results by challenge API call and compare request/response object
 * Wait for `@getResultsByChallengeRequest` intercept
 * @param {object} responseBody - Override default response body from fixture
 */
Cypress.Commands.add('waitForGetResultsByChallengeApi', (responseBody) => {
  cy.wait('@getResultsByChallengeRequest').then(
    (getResultsByChallengeRequest) => {
      if (getResultsByChallengeRequest.response) {
        expect(getResultsByChallengeRequest.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(getResultsByChallengeRequest.response.body).to.deep.equal(
          responseBody,
        );
      }
    },
  );
});

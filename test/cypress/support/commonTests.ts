import { routesConf } from '../../../src/router/routes_conf';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';
import { bearerTokeAuth } from 'src/utils';
import { defaultLocale } from '../../../src/i18n/def_locale';
import { useMenu } from 'src/composables/useMenu';

const { getMenuTop, getMenuBottom } = useMenu();

// selectors
const layoutBackgroundImageSelector = 'layout-background-image';

// types
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Interception } from 'cypress/types/net-stubbing';
import type { I18n } from 'vue-i18n';
import type { ConfigGlobal } from '../../../src/components/types/Config';
import type {
  GetOrganizationsResponse,
  OrganizationType,
} from 'src/components/types/Organization';

type AUTWindow = Window & typeof globalThis & ApplicationWindow;

interface ApplicationWindow {
  i18n?: I18n;
}

/**
 * Basic tests for Language Switcher
 *
 * Used in `register_challenge.spec.cy.js` and `login.spec.cy.js`
 */
export const testLanguageSwitcher = (): void => {
  it('allows user to switch language', () => {
    let i18n: I18n | undefined;
    cy.window().should('have.property', 'i18n');
    cy.window()
      .then((win: AUTWindow): void => {
        i18n = win.i18n;
      })
      .then(() => {
        const locales = i18n?.global.availableLocales;
        const initialActiveLocale = defaultLocale;

        // active language has active class
        cy.dataCy('switcher-' + initialActiveLocale)
          .find('.q-btn')
          .should('have.class', 'bg-secondary');

        locales?.forEach((selectedLocale) => {
          cy.dataCy('switcher-button-' + selectedLocale).click();
          locales?.forEach((locale) => {
            if (locale !== selectedLocale) {
              // inactive language
              cy.dataCy('switcher-' + locale)
                .should('exist')
                .and('be.visible');
              cy.dataCy('switcher-button-' + locale).should(
                'have.class',
                'bg-white',
              );
            } else {
              // active language
              cy.dataCy('switcher-' + locale)
                .should('exist')
                .and('be.visible');
              cy.dataCy('switcher-button-' + locale).should(
                'have.class',
                'bg-secondary',
              );
            }
          });
        });
      });
  });
};

/**
 * Test the visibility of a background image
 * Note that it is a `fixed` image, so we cannot test `be.visible`
 */
export const testBackgroundImage = (): void => {
  it('should have a background image', () => {
    cy.task('getAppConfig', process).then((config) => {
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('width')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('height')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector).should('have.css', 'mask-image');
      cy.dataCy(layoutBackgroundImageSelector)
        .find('img')
        .should(
          'have.attr',
          'src',
          (config as ConfigGlobal).urlLoginRegisterBackgroundImage,
        );
      // test background image on different screen sizes
      cy.viewport('iphone-3');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('iphone-xr');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('macbook-11');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
      cy.viewport('macbook-16');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
    });
  });
};

export const testPasswordInputReveal = (identifier: string): void => {
  it('should allow user to reveal and hide password', () => {
    // password hidden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
    // reveal
    cy.dataCy(`${identifier}-icon`).click();
    // password revealed
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'text');
    // hide
    cy.dataCy(`${identifier}-icon`).click();
    // password hidden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
  });
};

const selectorUserSelectInput = 'user-select-input';

export const testDesktopSidebar = (): void => {
  const selectorDrawer = 'q-drawer';
  const selectorDrawerHeader = 'drawer-header';
  const selectorUserSelectDesktop = 'user-select-desktop';
  const selectorDrawerMenuTop = 'drawer-menu-top';
  const selectorDrawerMenuBottom = 'drawer-menu-bottom';
  const selectorAutomatLogoBanner = 'automat-logo-banner';

  it('renders left drawer', () => {
    cy.task('getAppConfig', process).then((config) => {
      cy.dataCy(selectorDrawer).should('be.visible');
      cy.dataCy(selectorDrawerHeader).should('be.visible');
      cy.dataCy(selectorUserSelectDesktop).should('be.visible');

      const {
        urlRideToWorkByBikeOldFrontendDjangoApp,
        urlRideToWorkByBikeOldFrontendDjangoAppAdmin,
      } = config as ConfigGlobal;
      const rtwbbOldFrontendDjangoAdminUrl = `${urlRideToWorkByBikeOldFrontendDjangoApp}/${urlRideToWorkByBikeOldFrontendDjangoAppAdmin}`;
      const urlAdmin = getApiBaseUrlWithLang(
        null,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        defaultLocale,
      );
      if (
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: false,
          urlAdmin,
        }).length > 0
      ) {
        cy.dataCy(selectorDrawerMenuTop).should('be.visible');
      }
      const urlDonate = getApiBaseUrlWithLang(
        null,
        (config as ConfigGlobal).urlDonate,
        defaultLocale,
        defaultLocale,
      );
      if (getMenuBottom(urlDonate).length > 0) {
        cy.dataCy(selectorDrawerMenuBottom).should('be.visible');
      }
      cy.dataCy(selectorAutomatLogoBanner).should('be.visible');
    });
  });

  testUserSelect(selectorUserSelectDesktop);

  it('renders user email in UserSelect after login', () => {
    cy.fixture('loginRegisterResponseChallengeActive.json').then(
      (loginResponse) => {
        cy.fixture('refreshTokensResponseChallengeActive.json').then(
          (refreshTokensResponse) => {
            cy.get('@config').then((config: unknown) => {
              cy.clock(systemTimeLoggedIn, ['Date']);
              let i18n: I18n | undefined;
              cy.window().should('have.property', 'i18n');
              cy.window()
                .then((win: AUTWindow) => {
                  i18n = win.i18n;
                })
                .then(() => {
                  cy.visit('#' + routesConf['login']['path']);
                  const {
                    apiBase,
                    apiDefaultLang,
                    urlApiLogin,
                    urlApiRefresh,
                  } = config as ConfigGlobal;
                  const apiBaseUrl = getApiBaseUrlWithLang(
                    null,
                    apiBase,
                    apiDefaultLang,
                    i18n as I18n,
                  );
                  const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
                  const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
                  // intercept API login request
                  cy.intercept('POST', apiLoginUrl, {
                    statusCode: httpSuccessfullStatus,
                    body: loginResponse,
                  }).as('loginRequest');
                  // intercept API refresh token request
                  cy.intercept('POST', apiRefreshUrl, {
                    statusCode: httpSuccessfullStatus,
                    body: refreshTokensResponse,
                  }).as('refreshTokens');
                  cy.dataCy('form-login-email')
                    .find('input')
                    .type('test@example.com');
                  cy.dataCy('form-login-password')
                    .find('input')
                    .type('password123');
                  // submit form
                  cy.dataCy('form-login-submit-login').click();
                  // check if user is redirected to the home page
                  cy.url().should('include', routesConf['home']['path']);
                  cy.dataCy(selectorUserSelectDesktop).within(() => {
                    cy.dataCy(selectorUserSelectInput)
                      .should('be.visible')
                      .and('contain', loginResponse.user.email);
                  });
                  // click on user select
                  cy.dataCy(selectorUserSelectDesktop).within(() => {
                    cy.dataCy(selectorUserSelectInput)
                      .should('be.visible')
                      .click();
                  });
                  // logout
                  cy.dataCy('menu-item')
                    .contains(i18n?.global.t('userSelect.logout'))
                    .click();
                  cy.dataCy(selectorUserSelectDesktop).should('not.exist');
                  // redirected to login page
                  cy.url().should('include', routesConf['login']['path']);
                });
            });
          },
        );
      },
    );
  });
};

export const testMobileHeader = (): void => {
  const selectorButtonHelp = 'button-help';
  const selectorUserSelect = 'user-select-mobile';

  it('renders mobile header', () => {
    // TODO: enable when help dialog is implemented
    cy.dataCy(selectorButtonHelp).should('not.exist');
    cy.dataCy(selectorUserSelect).should('be.visible');
  });

  testUserSelect(selectorUserSelect);
};

export const testUserSelect = (selector: string): void => {
  const classSelectorMenu = '.q-menu';
  const selectorMenuItem = 'menu-item';

  it('renders user select', () => {
    cy.dataCy(selector).should('be.visible');
  });

  it('checks navigation links in the menu', () => {
    const menuItems = [
      { url: routesConf['profile_details']['children']['fullPath'] },
      // { url: routesConf['profile_newsletter']['children']['fullPath'] },
      // { url: routesConf['routes_app']['children']['fullPath'] },
      // {
      //   url: routesConf['profile_notifications']['children']['fullPath'],
      // },
      // { url: routesConf['coordinator']['children']['fullPath'] },
    ];

    cy.dataCy(selector).within(() => {
      cy.dataCy(selectorUserSelectInput).should('be.visible').click();
    });
    cy.get(classSelectorMenu)
      .should('be.visible')
      .within(() => {
        menuItems.forEach((item, index) => {
          cy.dataCy(selectorMenuItem)
            .eq(index)
            .invoke('attr', 'href')
            .should('contain', item.url);
        });
      });
    cy.dataCy(selector).click();
  });
};

/**
 * Test styles for title in route list
 * Used in `RouteListDisplay.cy.js` and `RouteListEdit.cy.js`
 */
export const testRouteListDayDate = (color: string): void => {
  it('renders route list day and date', () => {
    cy.dataCy('route-list-day-date')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', color);
  });
};

export const setupApiChallengeActive = (
  config: ConfigGlobal,
  i18n: I18n,
  verifiedEmail: boolean,
): void => {
  const {
    apiBase,
    apiDefaultLang,
    urlApiLogin,
    urlApiRefresh,
    urlApiRegister,
    urlApiHasUserVerifiedEmail,
  } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  // intercept register API call
  const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
  cy.fixture('loginRegisterResponseChallengeActive.json').then(
    (registerResponse) => {
      cy.intercept('POST', apiRegisterUrl, {
        statusCode: httpSuccessfullStatus,
        body: registerResponse,
      }).as('registerRequest');
    },
  );
  // intercept login API call
  const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
  cy.fixture('loginRegisterResponseChallengeActive.json').then(
    (loginResponse) => {
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpSuccessfullStatus,
        body: loginResponse,
      }).as('loginRequest');
    },
  );
  // intercept refresh token API call
  const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
  cy.fixture('refreshTokensResponseChallengeActive.json').then(
    (refreshTokensResponse) => {
      cy.intercept('POST', apiRefreshUrl, {
        statusCode: httpSuccessfullStatus,
        body: refreshTokensResponse,
      }).as('refreshTokens');
    },
  );
  // intercept verify email API call
  const apiHasUserVerifiedEmailUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
  cy.intercept('GET', apiHasUserVerifiedEmailUrl, {
    statusCode: httpSuccessfullStatus,
    body: { has_user_verified_email_address: verifiedEmail },
  }).as('verifyEmail');
  // set system time to "during challenge"
  cy.clock(systemTimeLoggedIn, ['Date']);
};

export const setupApiChallengeInactive = (
  config: ConfigGlobal,
  i18n: I18n,
  verifiedEmail: boolean,
): void => {
  const {
    apiBase,
    apiDefaultLang,
    urlApiLogin,
    urlApiRefresh,
    urlApiRegister,
    urlApiHasUserVerifiedEmail,
  } = config;
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  // intercept register API call
  const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
  cy.fixture('loginRegisterResponseChallengeInactive.json').then(
    (registerResponse) => {
      cy.intercept('POST', apiRegisterUrl, {
        statusCode: httpSuccessfullStatus,
        body: registerResponse,
      }).as('registerRequest');
    },
  );
  // intercept login API call
  const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
  cy.fixture('loginRegisterResponseChallengeInactive.json').then(
    (loginResponse) => {
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpSuccessfullStatus,
        body: loginResponse,
      }).as('loginRequest');
    },
  );
  // intercept refresh token API call
  const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
  cy.fixture('refreshTokensResponseChallengeInactive.json').then(
    (refreshTokensResponse) => {
      cy.intercept('POST', apiRefreshUrl, {
        statusCode: httpSuccessfullStatus,
        body: refreshTokensResponse,
      }).as('refreshTokens');
    },
  );
  // intercept verify email API call
  const apiHasUserVerifiedEmailUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
  cy.intercept('GET', apiHasUserVerifiedEmailUrl, {
    statusCode: httpSuccessfullStatus,
    body: { has_user_verified_email_address: verifiedEmail },
  }).as('verifyEmail');
  // set system time to "before challenge"
  cy.clock(systemTimeRegistrationPhaseInactive, ['Date']);
};

/**
 * Intercept organizations API call
 * Provides a `@getOrganizations`, `@getOrganizationsNextPage`
 * `@createOrganization` alias for the intercepted request.
 * @param {ConfigGlobal} config - App global config
 * @param {I18n} i18n - i18n instance
 * @returns {void}
 */
export const interceptOrganizationsApi = (
  config: ConfigGlobal,
  i18n: I18n,
  type: OrganizationType,
) => {
  const { apiBase, apiDefaultLang, urlApiOrganizations } = config;
  // get API base URL
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiOrganizationsLocalized = `${apiBaseUrl}${urlApiOrganizations}`;
  const urlApiOrganizationsLocalizedWithType = `${urlApiOrganizationsLocalized}${type}/`;
  cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
    cy.fixture('formFieldCompanyNext').then((formFieldCompanyNextResponse) => {
      // intercept organizations API call (before mounting component)
      cy.intercept('GET', urlApiOrganizationsLocalizedWithType, {
        statusCode: httpSuccessfullStatus,
        body: formFieldCompanyResponse,
      }).as('getOrganizations');
      // intercept next page API call
      cy.intercept('GET', formFieldCompanyResponse.next, {
        statusCode: httpSuccessfullStatus,
        body: formFieldCompanyNextResponse,
      }).as('getOrganizationsNextPage');
      // alias all organizations
      cy.wrap([
        ...formFieldCompanyResponse.results,
        ...formFieldCompanyNextResponse.results,
      ]).as('allOrganizations');
    });
  });
  // intercept create organization API call (before mounting component)
  cy.fixture('formFieldCompanyCreate').then(
    (formFieldCompanyCreateResponse) => {
      cy.intercept('POST', urlApiOrganizationsLocalized, {
        statusCode: httpSuccessfullStatus,
        body: formFieldCompanyCreateResponse,
      }).as('createOrganization');
    },
  );
};

/**
 * Wait for intercept organizations API calls and
 * comparing request/response object
 * Wait for a `@getOrganizations`, `@getOrganizationsNextPage`
 * intercept request.
 * @param {GetOrganizationsResponse} formFieldCompany - Get organizations API data response
 * @param {GetOrganizationsRespons} formFieldCompanyNext - Get organizations API data response
 * @returns {void}
 */
export const waitForOrganizationsApi = (
  formFieldCompany: GetOrganizationsResponse,
  formFieldCompanyNext: GetOrganizationsResponse,
) => {
  cy.wait(['@getOrganizations', '@getOrganizationsNextPage']).spread(
    (
      getOrganizations: Interception<
        AxiosRequestConfig,
        AxiosResponse<GetOrganizationsResponse>
      >,
      getOrganizationsNextPage: Interception<
        AxiosRequestConfig,
        AxiosResponse<GetOrganizationsResponse>
      >,
    ) => {
      expect(getOrganizations.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      if (getOrganizations.response) {
        expect(getOrganizations.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(getOrganizations.response.body).to.deep.equal(formFieldCompany);
      }
      expect(getOrganizationsNextPage.request.headers.authorization).to.include(
        bearerTokeAuth,
      );
      if (getOrganizationsNextPage.response) {
        expect(getOrganizationsNextPage.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(getOrganizationsNextPage.response.body).to.deep.equal(
          formFieldCompanyNext,
        );
      }
    },
  );
};

export const interceptRegisterCoordinatorApi = (
  config: ConfigGlobal,
  i18n: I18n,
) => {
  const { apiBase, apiDefaultLang, urlApiRegisterCoordinator } = config;
  // get API base URL
  const apiBaseUrl = getApiBaseUrlWithLang(null, apiBase, apiDefaultLang, i18n);
  const urlApiRegisterCoordinatorLocalized = `${apiBaseUrl}${urlApiRegisterCoordinator}`;
  // intercept register coordinator API call (before mounting component)
  cy.intercept('POST', urlApiRegisterCoordinatorLocalized, {
    statusCode: httpSuccessfullStatus,
  }).as('registerCoordinator');
};

/**
 * Intercept Google login API call
 * It uses the same response data as the login API call.
 * Provides a `@loginGoogle` alias for the intercepted request.
 * @param {ConfigGlobal} config - App global config
 * @param {I18n} i18n - i18n instance
 * @returns {void}
 */
export const interceptGoogleLoginApi = (
  config: ConfigGlobal,
  i18n: I18n,
): void => {
  cy.fixture('loginRegisterResponseChallengeActive.json').then(
    (loginResponse) => {
      const { apiBase, apiDefaultLang, urlApiLoginGoogle } = config;
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const urlApiLoginGoogleLocalized = `${apiBaseUrl}${urlApiLoginGoogle}`;
      // intercept google login API call (before mounting component)
      cy.intercept('POST', urlApiLoginGoogleLocalized, {
        statusCode: httpSuccessfullStatus,
        body: loginResponse,
      }).as('loginGoogle');
    },
  );
};

/**
 * Intercept Facebook login API call
 * It uses the same response data as the login API call.
 * Provides a `@loginFacebook` alias for the intercepted request.
 * @param {ConfigGlobal} config - App global config
 * @param {I18n} i18n - i18n instance
 * @returns {void}
 */
export const interceptFacebookLoginApi = (
  config: ConfigGlobal,
  i18n: I18n,
): void => {
  cy.fixture('loginRegisterResponseChallengeActive.json').then(
    (loginResponse) => {
      const { apiBase, apiDefaultLang, urlApiLoginFacebook } = config;
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const urlApiLoginFacebookLocalized = `${apiBaseUrl}${urlApiLoginFacebook}`;
      // intercept facebook login API call (before mounting component)
      cy.intercept('POST', urlApiLoginFacebookLocalized, {
        statusCode: httpSuccessfullStatus,
        body: loginResponse,
      }).as('loginFacebook');
    },
  );
};

export const fillFormRegisterCoordinator = (): void => {
  cy.fixture('apiPostRegisterCoordinatorRequest').then(
    (formRegisterCoordinatorData) => {
      // fill in first name
      cy.dataCy('form-register-coordinator-first-name')
        .find('input')
        .type(formRegisterCoordinatorData.firstName);
      // fill in last name
      cy.dataCy('form-register-coordinator-last-name')
        .find('input')
        .type(formRegisterCoordinatorData.lastName);
      // select all newsletter options
      cy.dataCy('newsletter-option').each((newsletterOption) => {
        cy.wrap(newsletterOption).click();
      });
      // select company option #2
      cy.dataCy('form-register-coordinator-company')
        .find('.q-field__append')
        .click();
      cy.get('.q-menu .q-item').eq(1).click();
      // fill in job title
      cy.dataCy('form-register-coordinator-job-title')
        .find('input')
        .type(formRegisterCoordinatorData.jobTitle);
      // fill in phone
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .type(formRegisterCoordinatorData.phone);
    },
  );
};

export const httpSuccessfullStatus = 200;
export const httpInternalServerErrorStatus = 500;
export const httpTooManyRequestsStatus = 429;
export const httpTooManyRequestsStatusMessage = `HTTP status code ${httpTooManyRequestsStatus} Too Many Requests ("rate limiting").`;
export const failOnStatusCode = false;
export const userAgentHeader = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Sec-Fetch-Mode': 'navigate',
};
export const interceptedRequestResponseDelay = 300;

// access token expiration time: Tuesday 24. September 2024 22:36:03
const fixtureTokenExpiration = new Date('2024-09-24T20:36:03Z');
const timeUntilRefresh = 60 * 1000; // miliseconds (because used in cy.tick)
export const fixtureTokenExpirationTime = fixtureTokenExpiration.getTime();
export const timeUntilExpiration = timeUntilRefresh * 2;
// 2 min before JWT expires
export const systemTimeLoggedIn =
  fixtureTokenExpirationTime - timeUntilExpiration;
/**
 * Time before `registration` phase starts
 * Registration phase allows users to register for challenge
 * even when `challenge` phase is not yet active.
 * The `challenge` phase overlaps is typically contained within
 * the `registration` phase.
 * @see apiGetThisCampaign.json fixture for example
 */
export const systemTimeRegistrationPhaseInactive = new Date(
  '2024-07-14T23:59:00.000Z',
);
/**
 * Time after `challenge` phase starts
 * @see apiGetThisCampaign.json fixture for example
 */
export const systemTimeChallengeActive = new Date('2024-09-16T00:01:00.000Z');
/**
 * Time after `registration` phase starts for May campaign
 * 1st registration phase starts on 28th January 2025
 * @see apiGetThisCampaignMay.json fixture for example
 */
export const systemTimeRegistrationPhase1May = new Date(
  '2025-01-28T00:01:00.000Z',
);

import {
  testLanguageSwitcher,
  testBackgroundImage,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { httpSuccessfullStatus } from '../support/commonTests';
import { getApiBaseUrlWithLang } from '../../../src/composables/useApi';

// variables
// access token expiration time: Tuesday 24. September 2024 22:36:03
const fixtureTokenExpiration = new Date('2024-09-24T22:36:03');
const fixtureTokenExpirationTime = fixtureTokenExpiration.getTime() / 1000;
// refresh token expiration time: Tuesday 24. September 2024 22:37:41
// const fixtureTokenRefreshExpiration = new Date('2024-09-24T22:37:41');
// const fixtureTokenRefreshExpirationTime = fixtureTokenRefreshExpiration.getTime() / 1000;
const timeUntilRefresh = 60;
const timeUntilExpiration = timeUntilRefresh * 2;
const systemTime = fixtureTokenExpirationTime - timeUntilExpiration; // 2 min before JWT expires

describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    testBackgroundImage();

    it('renders page header', () => {
      cy.dataCy('login-register-header').should('be.visible');
    });

    it('allows user to display and submit contact form', () => {
      cy.dataCy('button-help').last().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      cy.dataCy('dialog-body').scrollTo(0, 1200, { ensureScrollable: false });
      cy.dataCy('button-contact').should('be.visible').click();
      cy.dataCy('dialog-header').find('h3').should('be.visible');
      cy.dataCy('contact-form-subject')
        .find('input')
        .should('be.visible')
        .type('question');
      cy.dataCy('contact-form-message-input')
        .should('be.visible')
        .type('what is the minimum distance to ride to work?');
      cy.dataCy('contact-form-email')
        .find('input')
        .should('be.visible')
        .type('P7LlQ@example.com');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      // TODO: test successful submission
    });

    it('validates contact form if there are errors', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('button-help').last().should('be.visible').click();
        cy.dataCy('dialog-header').should('be.visible');
        cy.dataCy('dialog-body').scrollTo(0, 1200, {
          ensureScrollable: false,
        });
        cy.dataCy('button-contact').should('be.visible').click();
        cy.dataCy('dialog-header').find('h3').should('be.visible');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('contact-form-submit').should('be.visible').click();
        cy.dataCy('contact-form-subject')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(i18n.global.t('index.contact.subject')).then(
              (fieldName) => {
                cy.wrap(
                  i18n.global.t('form.messageFieldRequired', {
                    fieldName,
                  }),
                ).then((translation) => {
                  expect($el.text()).to.contain(translation);
                });
              },
            );
          });
        cy.dataCy('contact-form-subject')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
        cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
        cy.dataCy('contact-form-subject')
          .find('input')
          .should('be.visible')
          .type('question');
        cy.dataCy('contact-form-subject').find('input').blur();
        cy.dataCy('contact-form-subject')
          .find('.q-field__messages')
          .should('be.empty');
        cy.dataCy('contact-form-subject')
          .find('.q-field__control')
          .should('not.have.class', 'text-negative');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('contact-form-submit').should('be.visible').click();
        cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
        cy.dataCy('contact-form-message')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(i18n.global.t('index.contact.messageRequired')).then(
              (translation) => {
                expect($el.text()).to.contain(translation);
              },
            );
          });
        cy.dataCy('contact-form-message')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
        cy.dataCy('contact-form-message-input')
          .should('be.visible')
          .type('what is the minimum distance to ride to work?');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('contact-form-submit').should('be.visible').click();
        cy.dataCy('contact-form-email')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(
              i18n.global.t('form.messageFieldRequired', {
                fieldName: i18n.global.t('form.labelEmail'),
              }),
            ).then((translation) => {
              expect($el.text()).to.contain(translation);
            });
          });
        cy.dataCy('contact-form-email')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
      });
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();
  });

  context('login user flow', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');

      // load clock, config and i18n objects as aliases
      cy.clock().then((clock) => {
        cy.wrap(clock).as('clock');
      });
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('renders form title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('form-title-login')
          .should('be.visible')
          .and('have.class', 'grey-10')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('login.form.titleLogin')).then(
              (translation) => {
                expect($el.text()).to.contain(translation);
              },
            );
          });
      });
    });

    it('renders login form', () => {
      cy.dataCy('form-login-email').should('be.visible');
      cy.dataCy('form-login-password').should('be.visible');
      cy.dataCy('form-login-forgotten-password').should('be.visible');
      cy.dataCy('form-login-submit-login').should('be.visible');
    });

    it('allows user to login and refreshes token 1 min before expiration', () => {
      cy.get('@clock').then((clock) => {
        clock.setSystemTime(systemTime);
        cy.get('@config').then((config) => {
          const { apiBase, apiDefaultLang, urlApiLogin, urlApiRefresh } =
            config;
          const apiBaseUrl = getApiBaseUrlWithLang(
            null,
            apiBase,
            apiDefaultLang,
          );
          const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
          const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;

          cy.fixture('loginResponse.json').then((loginResponse) => {
            // intercept API call
            cy.intercept('POST', apiLoginUrl, {
              statusCode: httpSuccessfullStatus,
              body: loginResponse,
            }).as('loginRequest');
            // intercept refresh token API call
            cy.fixture('refreshTokensResponse.json').then(
              (refreshTokensResponse) => {
                cy.intercept('POST', apiRefreshUrl, {
                  statusCode: httpSuccessfullStatus,
                  body: refreshTokensResponse,
                }).as('refreshTokens');
                // fill in form
                cy.dataCy('form-login-email')
                  .find('input')
                  .type('test@example.com');
                cy.dataCy('form-login-password')
                  .find('input')
                  .type('password123');
                // submit form
                cy.dataCy('form-login-submit-login').click();
                // wait for login API call
                cy.wait('@loginRequest').then(() => {
                  // check that we are on homepage
                  cy.testRoute(routesConf['home']['path']);
                  // go to refresh time
                  clock.tick(timeUntilExpiration);
                  // refresh tokens should be called on load
                  cy.wait('@refreshTokens').then((interception) => {
                    expect(interception.response.statusCode).to.equal(
                      httpSuccessfullStatus,
                    );
                  });
                  // reload page
                  cy.reload();
                  // check that we are on homepage
                  cy.testRoute(routesConf['home']['path']);
                  // refresh tokens should be called on load
                  cy.wait('@refreshTokens').then((interception) => {
                    expect(interception.response.statusCode).to.equal(
                      httpSuccessfullStatus,
                    );
                  });
                });
              },
            );
          });
        });
      });
    });
  });
});

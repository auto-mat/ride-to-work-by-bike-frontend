import { colors } from 'quasar';
import { HttpStatusCode } from 'axios';

import { rgbaColorObjectToString } from 'src/utils';
import {
  testLanguageSwitcher,
  testBackgroundImage,
  timeUntilExpiration,
  setupApiChallengeActive,
  systemTimeLoggedIn,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { httpSuccessfullStatus } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

const { hexToRgb } = colors;
const selectorFormLoginEmail = 'form-login-email';
const selectorFormLoginPassword = 'form-login-password';
const selectorFormPasswordReset = 'form-password-reset';

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

    it('check custom form field validation error color', () => {
      cy.task('getAppConfig', process).then((config) => {
        const customFormFieldValidationErrColor = rgbaColorObjectToString(
          hexToRgb(config.colorCustomFormFieldValidationErr),
          true,
        );
        [selectorFormLoginEmail, selectorFormLoginPassword].forEach(
          (formField) => {
            cy.checkFormFieldValidationErrColor(
              formField,
              customFormFieldValidationErrColor,
            );
          },
        );
        cy.dataCy('form-login-forgotten-password').should('be.visible').click();
        cy.dataCy(selectorFormPasswordReset).should('be.visible');
        [selectorFormPasswordReset].forEach((formField) => {
          cy.checkFormFieldValidationErrColor(
            formField,
            customFormFieldValidationErrColor,
          );
        });
      });
    });

    it.skip('allows user to display and submit contact form', () => {
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

    it.skip('validates contact form if there are errors', () => {
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
      /**
       * In this test, we need to extend the scope of the clock effect to
       * the `setTimeout` function since we use it in
       * the `scheduleTokenRefresh` in login store.
       */
      cy.clock(systemTimeLoggedIn, ['Date', 'setTimeout']).then((clock) => {
        cy.wrap(clock).as('clock');
      });
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
          // intercept login API call
          setupApiChallengeActive(config, win.i18n, true);
          // intercept campaign get API call
          cy.interceptThisCampaignGetApi(config, defLocale);
          // intercept register-challenge get API call
          cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            },
          );
          cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
            (responseIsUserOrganizationAdmin) => {
              cy.interceptIsUserOrganizationAdminGetApi(
                config,
                defLocale,
                responseIsUserOrganizationAdmin,
              );
            },
          );
          // intercept my team API
          cy.fixture('apiGetMyTeamResponseUndecided.json').then(
            (responseMyTeam) => {
              cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
            },
          );
          cy.interceptCommuteModeGetApi(config, defLocale);
          cy.interceptTripsGetApi(config, defLocale);
        });
      });
    });

    it('renders form title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('form-title-login')
          .should('be.visible')
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

    it('loads this_campaign and register-challenge after login', () => {
      // fill in and submit form
      cy.fillAndSubmitLoginForm();
      // wait for login API call
      cy.wait('@loginRequest');
      // wait for this_campaign
      cy.wait('@thisCampaignRequest');
      // wait for register-challenge
      cy.wait('@getRegisterChallenge');
      // wait for is-user-organization-admin
      cy.wait('@getIsUserOrganizationAdmin');
      // above requests run while still on login page
      cy.url().should('include', routesConf['login']['path']);
    });

    it('reload trips after logout and login', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fillAndSubmitLoginForm();
        // wait for login API call
        cy.dataCy('index-title').should('be.visible');
        // go to trips page
        cy.visit('#' + routesConf['routes']['path']);
        // wait for trips API call
        cy.wait('@getTrips');
        cy.wait('@getTripsNextPage');
        // click on user select
        cy.dataCy('user-select-desktop').within(() => {
          cy.dataCy('user-select-input').should('be.visible').click();
        });
        // logout
        cy.dataCy('menu-item')
          .contains(i18n?.global.t('userSelect.logout'))
          .click();
        // redirected to login page
        cy.url().should('include', routesConf['login']['path']);
        // login
        cy.fillAndSubmitLoginForm();
        // wait for login API call
        cy.url().should('include', routesConf['home']['path']);
        // go to trips page
        cy.visit('#' + routesConf['routes']['path']);
        // wait for trips API call refresh
        cy.wait('@getTrips');
        cy.wait('@getTripsNextPage');
      });
    });

    it('allows user to login and refreshes token 1 min before expiration', () => {
      cy.get('@clock').then((clock) => {
        // fill in and submit form
        cy.fillAndSubmitLoginForm();
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
        });
      });
    });
  });

  context('incorrect login details', () => {
    beforeEach(() => {
      /**
       * In this test, we need to extend the scope of the clock effect to
       * the `setTimeout` function since we use it in
       * the `scheduleTokenRefresh` in login store.
       */
      cy.clock(systemTimeLoggedIn, ['Date', 'setTimeout']).then((clock) => {
        cy.wrap(clock).as('clock');
      });
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.visit('#' + routesConf['login']['path']);
        cy.viewport('macbook-16');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('shows error message on incorrect login details', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('loginResponseIncorrect.json').then((responseLogin) => {
            cy.interceptLoginApi(
              config,
              defLocale,
              responseLogin,
              HttpStatusCode.BadRequest,
            );
          });
          // fill in and submit form with incorrect details
          cy.fillAndSubmitLoginForm();
          // wait for login API call
          cy.wait(['@loginRequest']);
          cy.contains(i18n.global.t('login.apiMessageErrorWithMessage'))
            .should('exist')
            .and('be.visible');
        });
      });
    });
  });
});

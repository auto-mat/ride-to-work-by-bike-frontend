import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

import { useLoginStore } from 'src/stores/login';
import FormLogin from '../login/FormLogin.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  fixtureTokenExpirationTime,
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
  systemTime,
  timeUntilExpiration,
} from '../../../test/cypress/support/commonTests';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');
const whiteOpacity = changeAlpha(
  white,
  rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
);

// selectors
const classSelectorQNotificationMessage = '.q-notification__message';
const selectorLoginPromptNoAccount = 'login-prompt-no-account';
const selectorLoginLinkRegister = 'login-link-register';
const selectorFormLoginSeparator = 'form-login-separator';

// variables
const {
  apiBase,
  apiDefaultLang,
  urlApiLogin,
  urlApiRefresh,
  urlApiResetPassword,
} = rideToWorkByBikeConfig;
const resetPasswordResponse = {
  detail: 'Request to reset password was successful.',
};
const resetPasswordEmail = 'qw123@qw.com';

const username = 'test@example.com';
const password = 'example123';

// access token expiration time: Tuesday 24. September 2024 22:36:03
const fixtureTokenExpirationTimeSeconds = fixtureTokenExpirationTime / 1000;
// refresh token expiration time: Tuesday 24. September 2024 22:37:41
const fixtureTokenRefreshExpiration = new Date('2024-09-24T20:37:41Z');
const fixtureTokenRefreshExpirationTime =
  fixtureTokenRefreshExpiration.getTime() / 1000;
const timeUntilExpirationSeconds = timeUntilExpiration / 1000;

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // not testing form labels since they are the same in all languages
    cy.testLanguageStringsInContext(
      [
        'titleLogin',
        'titlePasswordReset',
        'descriptionPasswordReset',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messagePasswordRequired',
        'messagePasswordResetReqired',
        'forgottenPassword',
        'submitLogin',
        'submitPasswordReset',
      ],
      'login.form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'resetPassword',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
      // get API base URL
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      // intercept login API call
      const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).as('loginRequest');
      // intercept reset password API call
      const apiResetPasswordUrl = `${apiBaseUrl}${urlApiResetPassword}`;
      cy.intercept('POST', apiResetPasswordUrl, {
        statusCode: httpSuccessfullStatus,
        body: resetPasswordResponse,
      }).as('resetPasswordRequest');
    });

    it('renders title', () => {
      cy.dataCy('form-title-login')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titleLogin'));
    });

    it('renders email field', () => {
      cy.dataCy('form-login-email').should('be.visible');
      cy.dataCy('form-login-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password field', () => {
      cy.dataCy('form-login-password')
        .should('be.visible')
        .find('label[for="form-login-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('login.form.labelPassword'));
      cy.dataCy('form-login-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password show/hide icon', () => {
      cy.dataCy('form-login-password-icon')
        .should('contain', 'visibility')
        .and('have.color', white);
      cy.dataCy('form-login-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-login-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('should allow user to reveal and hide password', () => {
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'text');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
    });

    it('renders separator', () => {
      cy.dataCy(selectorFormLoginSeparator)
        .should('be.visible')
        .and('have.backgroundColor', whiteOpacity);
    });

    it('renders forgotten password link', () => {
      cy.dataCy('form-login-forgotten-password')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'text-decoration-line', 'underline')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.text', i18n.global.t('login.form.forgottenPassword'));
    });

    it('renders a submit button', () => {
      cy.dataCy('form-login-submit-login')
        .should('be.visible')
        .and('have.color', primary)
        .and('have.backgroundColor', secondary)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitLogin'));
    });

    it('renders a no account prompt and a link to register', () => {
      cy.dataCy(selectorLoginPromptNoAccount)
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', white)
        .then(($el) => {
          const content = $el.text();
          cy.stripHtmlTags(i18n.global.t('login.form.promptNoAccount')).then(
            (text) => {
              expect(content).to.contain(text);
            },
          );
        });
      // register
      cy.dataCy(selectorLoginLinkRegister)
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', white)
        .then(($el) => {
          const content = $el.text();
          cy.stripHtmlTags(i18n.global.t('login.form.linkRegister')).then(
            (text) => {
              expect(content).to.contain(text);
            },
          );
        });
    });

    it('allows to navigate between states', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-button-back').should('be.visible').click();
      cy.dataCy('form-login').should('be.visible');
    });

    it('renders password reset form title', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-title')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titlePasswordReset'));
    });

    it('renders password reset form description', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-description')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.descriptionPasswordReset'));
    });

    it('renders password reset form email input', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
    });

    it('renders password reset form submit button', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-submit')
        .should('be.visible')
        .and('have.color', primary)
        .and('have.backgroundColor', secondary)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitPasswordReset'));
    });

    it('renders final screen on password reset', () => {
      // click on forgotten password
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      // type email
      cy.dataCy('form-password-reset-email')
        .find('input')
        .should('be.visible')
        .type(resetPasswordEmail);
      // click on submit
      cy.dataCy('form-password-reset-submit').should('be.visible').click();
      // wait for reset password API call
      cy.wait('@resetPasswordRequest').then((interception) => {
        expect(interception.request.body.email).to.equal(resetPasswordEmail);
        expect(interception.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(interception.response.body).to.deep.equal(resetPasswordResponse);
      });
      // final screen
      cy.dataCy('form-reset-finished').should('be.visible');
      // icon wrapper
      cy.dataCy('form-reset-finished-icon-wrapper')
        .should('be.visible')
        .and('have.backgroundColor', whiteOpacity)
        .and('have.css', 'border-radius', '50%');
      // icon
      cy.dataCy('form-reset-finished-icon')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon')
        .invoke('width')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon').should('have.color', white);
      // title
      cy.dataCy('form-reset-finished-title')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('login.form.titleResetFinished'));
      // description
      cy.dataCy('form-reset-finished-description')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and(
          'contain',
          i18n.global.t('login.form.descriptionResetFinished', {
            contactEmail: resetPasswordEmail,
          }),
        );
      // final screen prompt
      cy.dataCy('form-reset-finished-prompt')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.promptWrongEmail'));
      // final screen button
      cy.dataCy('form-reset-finished-submit')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitNewPassword'));
      // click on submit new password button
      cy.dataCy('form-reset-finished-submit').click();
      // moves back to "reset password" form
      cy.dataCy('form-password-reset-email').should('be.visible');
    });

    it('validates login form user inputs', () => {
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      // validate password required
      // first make email pass
      cy.dataCy('form-login-email').find('input').type('test@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-password')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messagePasswordRequired'));
    });

    it('allows to save tokens and user into store', () => {
      cy.fixture('loginResponse.json').then((loginResponse) => {
        const store = useLoginStore();
        store.setAccessToken(loginResponse.access);
        store.setRefreshToken(loginResponse.refresh);
        store.setUser(loginResponse.user);
        expect(store.getAccessToken).to.equal(loginResponse.access);
        expect(store.getRefreshToken).to.equal(loginResponse.refresh);
        expect(store.getUser).to.deep.equal(loginResponse.user);
      });
    });

    it('shows error if login is called and username is not set', () => {
      const store = useLoginStore();
      cy.wrap(store.login({ username: '', password })).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      });
    });

    it('shows error if login is called and password is not set', () => {
      const store = useLoginStore();
      cy.wrap(store.login({ username, password: '' })).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      });
    });

    it('shows error if API call fails (error has message)', () => {
      const store = useLoginStore();
      cy.wrap(store.login({ username, password })).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.apiMessageErrorWithMessage'));
      });
    });

    it('calls API and shows error if login fails', () => {
      const store = useLoginStore();
      // intercept login API call
      cy.wrap(store.login({ username, password })).then(() => {
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.apiMessageError'));
      });
    });
  });

  context('desktop - timed login', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
      cy.clock().then((clock) => {
        cy.wrap(clock).as('clock');
        clock.setSystemTime(systemTime);
      });
      // intercept login API call
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
      cy.fixture('loginResponse.json').then((loginResponse) => {
        cy.intercept('POST', apiLoginUrl, {
          statusCode: httpSuccessfullStatus,
          body: loginResponse,
        }).as('loginRequest');
      });
    });

    it('performs login and refreshes token 1 min before expiration', () => {
      cy.fixture('loginResponse.json').then((loginResponse) => {
        cy.get('@clock').then((clock) => {
          const store = useLoginStore();
          cy.wrap(store.login({ username, password })).then((response) => {
            expect(response).to.deep.equal(loginResponse);
            expect(store.getAccessToken).to.equal(loginResponse.access);
            expect(store.getRefreshToken).to.equal(loginResponse.refresh);
            expect(store.getUser).to.deep.equal(loginResponse.user);
            expect(store.getJwtExpiration).to.equal(
              fixtureTokenExpirationTimeSeconds,
            );
            expect(store.getTimeUntilExpiration()).to.equal(
              timeUntilExpirationSeconds, // time until expiration in seconds
            );
            expect(store.isJwtExpired()).to.equal(false);
            cy.fixture('refreshTokensResponse.json').then(
              (refreshTokensResponse) => {
                // intercept refresh token API call
                const apiBaseUrl = getApiBaseUrlWithLang(
                  null,
                  apiBase,
                  apiDefaultLang,
                  i18n,
                );
                const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
                cy.intercept('POST', apiRefreshUrl, {
                  statusCode: httpSuccessfullStatus,
                  body: refreshTokensResponse,
                })
                  .as('refreshTokens')
                  .then(() => {
                    // set time to when JWT should be expired + 1 second
                    clock.tick(timeUntilExpiration);
                    // intercepted function apiRefreshUrl should be called
                    cy.wait('@refreshTokens')
                      .its('response.statusCode')
                      .should('eq', httpSuccessfullStatus)
                      .then(() => {
                        // new JWT
                        expect(store.getAccessToken).to.equal(
                          refreshTokensResponse.access,
                        );
                        // JWT not be expired
                        expect(store.isJwtExpired()).to.equal(false);
                        expect(store.getJwtExpiration).to.equal(
                          fixtureTokenRefreshExpirationTime,
                        );
                      });
                  });
              },
            );
          });
        });
      });
    });

    it('performs login and sets token and expiration time', () => {
      cy.fixture('loginResponse.json').then((loginResponse) => {
        cy.get('@clock').then((clock) => {
          const store = useLoginStore();
          cy.wrap(store.login({ username, password })).then((response) => {
            expect(response).to.deep.equal(loginResponse);
            expect(store.getAccessToken).to.equal(loginResponse.access);
            expect(store.getRefreshToken).to.equal(loginResponse.refresh);
            expect(store.getUser).to.deep.equal(loginResponse.user);
            expect(store.getJwtExpiration).to.equal(
              fixtureTokenExpirationTimeSeconds,
            );
            expect(store.getTimeUntilExpiration()).to.equal(
              timeUntilExpirationSeconds,
            );
            expect(store.isJwtExpired()).to.equal(false);
            cy.fixture('refreshTokensResponse.json').then(
              (refreshTokensResponse) => {
                // intercept refresh token API call
                const apiBaseUrl = getApiBaseUrlWithLang(
                  null,
                  apiBase,
                  apiDefaultLang,
                  i18n,
                );
                const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
                cy.intercept('POST', apiRefreshUrl, {
                  statusCode: httpSuccessfullStatus,
                  body: refreshTokensResponse,
                }).then(() => {
                  // set time to when JWT should be expired + 1 second
                  clock.tick(timeUntilExpiration + 1000);
                  expect(store.getTimeUntilExpiration()).to.be.lessThan(0);
                  expect(store.isJwtExpired()).to.equal(true);
                  // refresh tokens
                  cy.wrap(store.refreshTokens()).then(() => {
                    // new JWT
                    expect(store.getAccessToken).to.equal(
                      refreshTokensResponse.access,
                    );
                    // JWT not be expired
                    expect(store.isJwtExpired()).to.equal(false);
                    expect(store.getJwtExpiration).to.equal(
                      fixtureTokenRefreshExpirationTime,
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

import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

import { useLoginStore } from 'src/stores/login';
import FormLogin from '../login/FormLogin.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
} from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;
const contactEmail = rideToWorkByBikeConfig.contactEmail;

// selectors
const classSelectorQNotificationMessage = '.q-notification__message';

// variables
const { apiBase, urlApiLogin, urlApiRefresh } = rideToWorkByBikeConfig;
const apiLoginUrl = `${apiBase}${urlApiLogin}`;
const apiRefreshUrl = `${apiBase}${urlApiRefresh}`;

const username = 'test@example.com';
const password = 'example123';

const tokenAccess =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MjEwMTYzLCJqdGkiOiJiMzY5M2I1ZTU3OWE0MDZhOWUyNWE0ZTQ3YzFmMjQ4NiIsInVzZXJfaWQiOjE4OTc2MX0.jAfrS_1R2FnoNcZmYUEoOqPq7evNLP7KzPAOFmuHu88';
const tokenAccessExpiration = 1727210163;
const tokenAccessTimeUntilExpiration = 5220003;
const tokenRefresh =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzI5NjI2MywianRpIjoiNzYzNGIxYzBiYTdiNDQ0Zjk0ZTZmNTA5M2E1MDM3MDYiLCJ1c2VyX2lkIjoxODk3NjF9.6J_L4wVjPN3bKAOU-UcvxhrIBirqLVrgi5AZefsqrt0';
const tokenAccessNew =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MjEwMjYxLCJqdGkiOiIzYjRmNTMzNGRiZmE0OGRhOGQxZjU0YTg2NDA5NDA3MCIsInVzZXJfaWQiOjE4OTc2MX0.SD-Ltv7W68KY9xnJ8iJVuMlkwvg18SMRmnadj43dtgQ';
const tokenAccessNewExpiration = '2024-09-16T11:46:48.551800';

const user = {
  pk: 1,
  username: 'foobar',
  email: 'foo@bar.org',
  first_name: 'Foo',
  last_name: 'Bar',
};

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // Not testing form labels since they are the same in all languages
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
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('form-title-login')
        .should('be.visible')
        .and('have.color', grey10)
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
        .and('have.color', `${colorPrimary}`);
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

    it('renders forgotten password link', () => {
      cy.dataCy('form-login-forgotten-password')
        .should('be.visible')
        .and('have.color', `${colorPrimary}`)
        .and('have.css', 'text-decoration-line', 'underline')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.text', i18n.global.t('login.form.forgottenPassword'));
    });

    it('renders a submit button', () => {
      cy.dataCy('form-login-submit-login')
        .should('be.visible')
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitLogin'));
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
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titlePasswordReset'));
    });

    it('renders password reset form description', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-description')
        .should('be.visible')
        .and('have.color', grey10)
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
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitPasswordReset'));
    });

    it('renders final screen on password reset', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset-email')
        .find('input')
        .should('be.visible')
        .type('qw123@qw.com');
      cy.dataCy('form-password-reset-submit').should('be.visible').click();
      cy.dataCy('form-reset-finished').should('be.visible');
      // icon wrapper
      cy.dataCy('form-reset-finished-icon-wrapper')
        .should('be.visible')
        .and('have.backgroundColor', 'rgba(255, 255, 255, 0.5)')
        .and('have.css', 'border-radius', '9999px');
      // icon
      cy.dataCy('form-reset-finished-icon')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon')
        .invoke('width')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon').should('have.color', colorPrimary);
      // title
      cy.dataCy('form-reset-finished-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('login.form.titleResetFinished'));
      // description
      cy.dataCy('form-reset-finished-description')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and(
          'contain',
          i18n.global.t('login.form.descriptionResetFinished', {
            contactEmail,
          }),
        );
      // prompt
      cy.dataCy('form-reset-finished-prompt')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.promptWrongEmail'));
      // button
      cy.dataCy('form-reset-finished-submit')
        .should('be.visible')
        .and('have.color', colorPrimary)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitNewPassword'));
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
  });

  context('desktop - login store', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
      cy.clock().then((clock) => {
        cy.wrap(clock).as('clock');
      });
    });

    it('allows to save tokens and user into store', () => {
      const store = useLoginStore();
      store.setAccessToken(tokenAccess);
      store.setRefreshToken(tokenRefresh);
      store.setUser(user);
      expect(store.getAccessToken).to.equal(tokenAccess);
      expect(store.getRefreshToken).to.equal(tokenRefresh);
      expect(store.getUser).to.deep.equal(user);
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
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).then(() => {
        cy.wrap(store.login({ username, password })).then((result) => {
          expect(result).to.equal(null);
          cy.get(classSelectorQNotificationMessage)
            .should('be.visible')
            .and('contain', i18n.global.t('login.apiMessageErrorWithMessage'))
            .and('contain', httpInternalServerErrorStatus);
        });
      });
    });

    it('calls API and set token on successful login', () => {
      cy.get('@clock').then((clock) => {
        // set time to 24. Sep 2024 21:56:00
        clock.setSystemTime(1721990160000);
        // intercept login API call
        cy.intercept('POST', apiLoginUrl, {
          statusCode: httpSuccessfullStatus,
          body: {
            access_token: tokenAccess,
            refresh_token: tokenRefresh,
            user,
          },
        }).then(() => {
          const store = useLoginStore();
          cy.wrap(store.login({ username, password })).then((response) => {
            expect(response).to.deep.equal({
              access_token: tokenAccess,
              refresh_token: tokenRefresh,
              user,
            });
            expect(store.getAccessToken).to.equal(tokenAccess);
            expect(store.getRefreshToken).to.equal(tokenRefresh);
            expect(store.getUser).to.deep.equal(user);
            expect(store.getJwtExpiration).to.equal(tokenAccessExpiration);
            expect(store.getTimeUntilExpiration()).to.equal(
              tokenAccessTimeUntilExpiration,
            );
            expect(store.isJwtExpired()).to.equal(false);
            // set time to when JWT should be expired + 1 second
            clock.tick(tokenAccessTimeUntilExpiration * 1000 + 1000);
            expect(store.getTimeUntilExpiration()).to.be.lessThan(0);
            expect(store.isJwtExpired()).to.equal(true);
            // refresh tokens
            cy.intercept('POST', apiRefreshUrl, {
              statusCode: httpSuccessfullStatus,
              body: {
                access: tokenAccessNew,
                access_token_expiration: tokenAccessNewExpiration,
              },
            }).then(() => {
              cy.wrap(store.refreshTokens()).then(() => {
                // new JWT
                expect(store.getAccessToken).to.equal(tokenAccessNew);
                // JWT not be expired
                expect(store.isJwtExpired()).to.equal(false);
              });
            });
          });
        });
      });
    });

    it('calls API and shows error if login fails', () => {
      const store = useLoginStore();
      // intercept login API call
      cy.intercept('POST', apiLoginUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).then(() => {
        cy.wrap(store.login({ username, password })).then(() => {
          cy.get(classSelectorQNotificationMessage)
            .should('be.visible')
            .and('contain', i18n.global.t('login.apiMessageError'));
        });
      });
    });
  });
});

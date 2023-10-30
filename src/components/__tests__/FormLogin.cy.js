import { colors } from 'quasar';

import FormLogin from '../FormLogin.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // Not testing form labels since they are the same in all languages
    cy.testLanguageStringsInContext(
      [
        'titleLogin',
        'titlePasswordReset',
        'descriptionPasswordReset',
        'messageEmailReqired',
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
        .should('have.color', grey10)
        .should('have.css', 'font-size', '24px')
        .should('have.css', 'font-weight', '700')
        .should('contain', i18n.global.t('login.form.titleLogin'));
    });

    it('renders email field', () => {
      cy.dataCy('form-login-email')
        .should('be.visible')
        .find('label[for="form-login-email"]')
        .should('be.visible')
        .should('have.text', i18n.global.t('login.form.labelEmail'));
      cy.dataCy('form-login-email')
        .find('.q-field__control')
        .should('be.visible')
        .should('have.css', 'border-radius', '8px');
    });

    it('renders password field', () => {
      cy.dataCy('form-login-password')
        .should('be.visible')
        .find('label[for="form-login-password"]')
        .should('be.visible')
        .should('have.text', i18n.global.t('login.form.labelPassword'));

      cy.dataCy('form-login-password')
        .find('.q-field__control')
        .should('be.visible')
        .should('have.css', 'border-radius', '8px');
    });

    it('renders password show/hide icon', () => {
      cy.dataCy('form-login-password-icon')
        .should('contain', 'visibility')
        .should('have.color', `${colorPrimary}`);
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
        .should('have.color', `${colorPrimary}`)
        .should('have.css', 'text-decoration-line', 'underline')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.text', i18n.global.t('login.form.forgottenPassword'));
    });

    it('renders a submit button', () => {
      cy.dataCy('form-login-submit-login')
        .should('be.visible')
        .should('have.color', white)
        .should('have.backgroundColor', `${colorPrimary}`)
        .should('have.css', 'border-radius', '28px')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.text', i18n.global.t('login.form.submitLogin'));
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
        .should('have.color', grey10)
        .should('have.css', 'font-size', '24px')
        .should('have.css', 'font-weight', '700')
        .should('contain', i18n.global.t('login.form.titlePasswordReset'));
    });

    it('renders password reset form description', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-description')
        .should('be.visible')
        .should('have.color', grey10)
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should(
          'contain',
          i18n.global.t('login.form.descriptionPasswordReset'),
        );
    });

    it('renders password reset form email input', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-input')
        .should('be.visible')
        .find('label[for="form-login-password-reset"]')
        .should('be.visible')
        .should('have.text', i18n.global.t('login.form.labelPasswordReset'));
    });

    it('renders password reset form submit button', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-submit')
        .should('be.visible')
        .should('have.color', white)
        .should('have.backgroundColor', `${colorPrimary}`)
        .should('have.css', 'border-radius', '28px')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.text', i18n.global.t('login.form.submitPasswordReset'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});

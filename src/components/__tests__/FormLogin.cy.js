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
const contactEmail = rideToWorkByBikeConfig.contactEmail;

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
      cy.dataCy('form-login-email')
        .should('be.visible')
        .find('label[for="form-login-email"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('login.form.labelEmail'));
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
      cy.dataCy('form-password-reset-email')
        .should('be.visible')
        .find('label[for="form-login-password-reset"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('login.form.labelPasswordReset'));
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
      cy.dataCy('form-password-reset-email-input')
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
      // validate email required
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      // validate email format
      cy.dataCy('form-login-email-input').type('qw123@qw');
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      // validate password required
      // first make email pass
      cy.dataCy('form-login-email-input').type('.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-password')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messagePasswordRequired'));
    });

    it('validates password reset form user inputs', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset-submit').should('be.visible').click();
      // validate email required
      cy.dataCy('form-password-reset-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('login.form.messagePasswordResetReqired'),
        );
      // validate email format
      cy.dataCy('form-password-reset-email-input').type('qw123@qw');
      cy.dataCy('form-password-reset-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
    });

    it('validates emails correctly', () => {
      // invalid email abc.exam-ple.com
      cy.dataCy('form-login-email-input').type('abc.example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email a@b@c@example.com
      cy.dataCy('form-login-email-input').type('a@b@c@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type(
        'a"b(c)d,e:f;g<h>i[jk]l@example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type('just"not"right@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type(
        'this is"notallowed@example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type(
        'this still"not\\allowed@example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type(
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // invalid email
      cy.dataCy('form-login-email-input').type(
        'i.like.underscores@but_they_are_not_allowed_in_this_part',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('simple@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('very.common@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('x@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type(
        'long.email-address-with-hyphens@and.subdomains.example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type(
        'user.name+tag+sorting@example.com',
      );
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('name/surname@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('mailhost!username@example.org');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('user%example.com@example.org');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
      // valid email
      cy.dataCy('form-login-email-input').type('user-@example.org');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.get(
        '*[data-cy="form-login-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-login-email-input').clear();
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

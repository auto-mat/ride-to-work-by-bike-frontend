import { colors } from 'quasar';

import FormRegister from 'components/FormRegister.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormRegister>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleRegister',
        'hintPassword',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messagePasswordRequired',
        'messagePasswordStrong',
        'messagePasswordConfirmRequired',
        'messagePasswordConfirmNotMatch',
      ],
      'register.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('form-register-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('register.form.titleRegister'));
    });

    it('renders email field', () => {
      cy.dataCy('form-register-email')
        .should('be.visible')
        .find('label[for="form-register-email"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelEmail'));
      cy.dataCy('form-register-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password field', () => {
      cy.dataCy('form-register-password')
        .should('be.visible')
        .find('label[for="form-register-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPassword'));
      cy.dataCy('form-register-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password confirm field', () => {
      cy.dataCy('form-register-password-confirm')
        .should('be.visible')
        .find('label[for="form-register-password-confirm"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPasswordConfirm'));
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders show/hide icons for password inputs', () => {
      // password
      cy.dataCy('form-register-password-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-register-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-password-icon')
        .invoke('width')
        .should('be.equal', 18);
      // password confirm
      cy.dataCy('form-register-password-confirm-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-register-password-confirm-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-password-confirm-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('should allow user to reveal and hide password', () => {
      cy.dataCy('form-register-password')
        .find('input')
        .should('have.attr', 'type', 'password');
      cy.dataCy('form-register-password-icon').click();
      cy.dataCy('form-register-password')
        .find('input')
        .should('have.attr', 'type', 'text');
      cy.dataCy('form-register-password-icon').click();
      cy.dataCy('form-register-password')
        .find('input')
        .should('have.attr', 'type', 'password');
    });

    it('should allow user to reveal and hide password confirmation', () => {
      cy.dataCy('form-register-password-confirm')
        .find('input')
        .should('have.attr', 'type', 'password');
      cy.dataCy('form-register-password-confirm-icon').click();
      cy.dataCy('form-register-password-confirm')
        .find('input')
        .should('have.attr', 'type', 'text');
      cy.dataCy('form-register-password-confirm-icon').click();
      cy.dataCy('form-register-password-confirm')
        .find('input')
        .should('have.attr', 'type', 'password');
    });

    it('validates registration form inputs', () => {
      cy.dataCy('form-register-submit').should('be.visible').click();
      // validate email required
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('register.form.messageEmailReqired'));
      // validate email format
      cy.dataCy('form-register-email-input').type('qw123@qw');
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('register.form.messageEmailInvalid'));
    });

    it('validates emails correctly', () => {
      // invalid email
      cy.dataCy('form-register-email-input').type('abc.example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type('a@b@c@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type(
        'a"b(c)d,e:f;g<h>i[jk]l@example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type('just"not"right@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type(
        'this is"notallowed@example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type(
        'this still"not\\allowed@example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type(
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // invalid email
      cy.dataCy('form-register-email-input').type(
        'i.like.underscores@but_they_are_not_allowed_in_this_part',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('login.form.messageEmailInvalid'));
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type('simple@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type('very.common@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type('x@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type(
        'long.email-address-with-hyphens@and.subdomains.example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type(
        'user.name+tag+sorting@example.com',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type('name/surname@example.com');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type(
        'mailhost!username@example.org',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type(
        'user%example.com@example.org',
      );
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
      // valid email
      cy.dataCy('form-register-email-input').type('user-@example.org');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.get(
        '*[data-cy="form-register-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-email-input').clear();
    });

    it('validates password correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy('form-register-email-input').type('qw123@qw.com');
      // test password
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordRequired'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('12345');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('123456789');
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('12345a');
      cy.get(
        '*[data-cy="form-register-password"] .q-field__messages [role="alert"]',
      ).should('not.exist');
    });

    it.only('validates password confirm correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy('form-register-email-input').type('qw123@qw.com');
      // fill in password input to be able to test password confirm
      cy.dataCy('form-register-password-input').type('12345a');
      // test password confirm empty
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmRequired'),
        );
      cy.dataCy('form-register-password-confirm-input').clear();
      // test password confirm not matching
      cy.dataCy('form-register-password-confirm-input').type('12345b');
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmNotMatch'),
        );
      cy.dataCy('form-register-password-confirm-input').clear();
      // test password confirm matching
      cy.dataCy('form-register-password-confirm-input').type('12345a');
      cy.get(
        '*[data-cy="form-register-password-confirm"] .q-field__messages [role="alert"]',
      ).should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});

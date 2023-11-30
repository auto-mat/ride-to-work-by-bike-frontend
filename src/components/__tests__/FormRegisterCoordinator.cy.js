import { colors } from 'quasar';

import FormRegisterCoordinator from 'components/FormRegisterCoordinator.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormRegisterCoordinator>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'labelFirstName',
        'labelLastName',
        'labelJobTitle',
        'labelJobTitleShort',
        'labelEmail',
        'labelPhone',
        'labelPassword',
        'labelPasswordConfirm',
        'labelResponsibility',
        'labelTerms',
        'linkTerms',
        'buttonSubmit',
        'messageFieldRequired',
        'messageEmailInvalid',
        'messagePhoneInvalid',
        'messagePasswordStrong',
        'messagePasswordConfirmNotMatch',
        'hintPassword',
      ],
      'register.coordinator.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('register-coordinator-form-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', i18n.global.t('register.coordinator.form.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('register.coordinator.form.title'),
            );
          });
      });
    });

    it('renders first name field', () => {
      // input label
      cy.dataCy('form-register-coordinator-first-name')
        .should('be.visible')
        .find('label[for="form-register-coordinator-first-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelFirstName'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-first-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-first-name-input').should(
        'be.visible',
      );
    });

    it('renders last name field', () => {
      // input label
      cy.dataCy('form-register-coordinator-last-name')
        .should('be.visible')
        .find('label[for="form-register-coordinator-last-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelLastName'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-last-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-last-name-input').should(
        'be.visible',
      );
    });

    it('renders job title field', () => {
      // input label
      cy.dataCy('form-register-coordinator-job-title')
        .should('be.visible')
        .find('label[for="form-register-coordinator-job-title"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelJobTitle'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-job-title')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-job-title-input').should(
        'be.visible',
      );
    });

    it('renders email field', () => {
      // input label
      cy.dataCy('form-register-coordinator-email')
        .should('be.visible')
        .find('label[for="form-register-coordinator-email"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelEmail'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-email-input').should('be.visible');
    });

    it('renders phone field', () => {
      // input label
      cy.dataCy('form-register-coordinator-phone')
        .should('be.visible')
        .find('label[for="form-register-coordinator-phone"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPhone'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-phone-input').should('be.visible');
    });

    it('renders password field', () => {
      // input label
      cy.dataCy('form-register-coordinator-password')
        .should('be.visible')
        .find('label[for="form-register-coordinator-password"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPassword'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-password-input').should(
        'be.visible',
      );
      // icon
      cy.dataCy('form-register-coordinator-password-icon')
        .should('contain', 'visibility')
        .and('have.color', colorPrimary);
      cy.dataCy('form-register-coordinator-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-coordinator-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders password confirm field', () => {
      // input label
      cy.dataCy('form-register-coordinator-password-confirm')
        .should('be.visible')
        .find('label[for="form-register-coordinator-password-confirm"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPasswordConfirm'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-password-confirm')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-password-confirm-input').should(
        'be.visible',
      );
      // icon
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .should('contain', 'visibility')
        .and('have.color', colorPrimary);
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders checkbox responsibility', () => {
      cy.dataCy('form-register-coordinator-responsibility')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.labelResponsibility'),
        );
      // checkbox border
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .should('have.css', 'border-radius', '4px');
      // checkbox height
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .invoke('height')
        .should('be.equal', 18);
      // checkbox width
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-register-coordinator-terms')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('register.coordinator.form.labelTerms'));
      // checkbox border
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .should('have.css', 'border-radius', '4px');
      // checkbox height
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .invoke('height')
        .should('be.equal', 18);
      // checkbox width
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('should allow user to reveal and hide password', () => {
      testPasswordInputReveal({
        identifierPassword: 'form-register-coordinator-password',
      });
    });

    it('should allow user to reveal and hide password confirm', () => {
      testPasswordInputReveal({
        identifierPassword: 'form-register-coordinator-password-confirm',
      });
    });

    it('validates email correctly', () => {
      // fill in other parts of the form to be able to test email
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      cy.dataCy('form-register-coordinator-job-title-input').type('IT');
      // empty email
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageFieldRequired', {
            fieldName: i18n.global.t('register.coordinator.form.labelEmail'),
          }),
        );
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type('qw123@qw');
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'abc.example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'a@b@c@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'a"b(c)d,e:f;g<h>i[jk]l@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'just"not"right@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'this is"notallowed@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'this still"not\\allowed@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'i.like.underscores@but_they_are_not_allowed_in_this_part',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__messages')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageEmailInvalid'),
        );
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'simple@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'very.common@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type('x@example.com');
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'long.email-address-with-hyphens@and.subdomains.example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'user.name+tag+sorting@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'name/surname@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'mailhost!username@example.org',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'user%example.com@example.org',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
      // valid email
      cy.dataCy('form-register-coordinator-email-input').type(
        'user-@example.org',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-email-input').clear();
    });

    it('validates phone number correctly', () => {
      // fill in other parts of the form to be able to test phone
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      cy.dataCy('form-register-coordinator-job-title-input').type('IT');
      cy.dataCy('form-register-coordinator-email-input').type(
        'simple@example.com',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      // invalid email
      cy.dataCy('form-register-coordinator-phone-input').type('12345');
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
        );
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-phone-input').type(
        '12345678901234567890',
      );
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
        );
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420 ABC 123 456',
      );
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
        );
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+421 12#34 5678',
      );
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
        );
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // invalid email
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420-123.456/789',
      );
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
        );
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420 123 456 789',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type('123 456 789');
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420 (543) 123 456',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420-123-456-789',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type(
        '+420.123.456.789',
      );
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
      // valid phone
      cy.dataCy('form-register-coordinator-phone-input').type('+420 543123456');
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.get(
        '*[data-cy="form-register-coordinator-phone"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-register-coordinator-phone-input').clear();
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});

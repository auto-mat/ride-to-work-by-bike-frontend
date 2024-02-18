import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldPhone>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageFieldRequired', 'messagePhoneInvalid'],
      'form',
      i18n,
    );
  });

  context('desktop (required)', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldPhone',
        },
      });
      cy.viewport('macbook-16');
    });

    it('requires a value', () => {
      cy.dataCy('form-phone-input').focus();
      cy.dataCy('form-phone-input').blur();
      cy.dataCy('form-phone')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelPhone'),
          }),
        );
      cy.dataCy('form-phone-input').clear();
    });

    testInvalidPhoneNumberValidation();
    testValidPhoneNumberValidation();
  });

  context('desktop (optional)', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldPhone',
        },
      });
      cy.viewport('macbook-16');
    });

    it('allows empty value', () => {
      cy.dataCy('form-phone-input').focus();
      cy.dataCy('form-phone-input').blur();
      cy.get('.q-field__messages').should('not.be.visible');
    });

    testInvalidPhoneNumberValidation();
    testValidPhoneNumberValidation();
  });
});

function testInvalidPhoneNumberValidation() {
  it('validates incorrect phone number', () => {
    cy.dataCy('form-phone-input').clear();
    cy.dataCy('form-phone-input').blur();
    // invalid phone
    cy.dataCy('form-phone-input').type('12345');
    // first blur triggers validation
    cy.dataCy('form-phone-input').blur();
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('00 00 00');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('12345678901234567890');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('+420 ABC 123 456');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('+420 #23 456 789');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('+420 609 234 567');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('+420 500 234 567');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('123 456 789');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('+420 6012 34567');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    // invalid phone
    cy.dataCy('form-phone-input').type('602 3456 78');
    cy.dataCy('form-phone')
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.messagePhoneInvalid'),
      );
    cy.dataCy('form-phone-input').clear();
    cy.dataCy('form-phone-input').blur();
  });
}

function testValidPhoneNumberValidation() {
  it('validates correct phone number', () => {
    cy.dataCy('form-phone-input').clear();
    cy.dataCy('form-phone-input').blur();
    // valid phone
    cy.dataCy('form-phone-input').type('+420 736 123 456');
    cy.dataCy('form-phone-input').blur();
    cy.get('.q-field__messages').should('not.be.visible');
    cy.dataCy('form-phone-input').clear();
    // valid phone
    cy.dataCy('form-phone-input').type('+420736123456');
    cy.dataCy('form-phone-input').blur();
    cy.get('.q-field__messages').should('not.be.visible');
    cy.dataCy('form-phone-input').clear();
    // valid phone
    cy.dataCy('form-phone-input').type('736123456');
    cy.dataCy('form-phone-input').blur();
    cy.get('.q-field__messages').should('not.be.visible');
  });
}

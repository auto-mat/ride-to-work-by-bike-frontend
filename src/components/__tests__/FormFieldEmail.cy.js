import { ref } from 'vue';
import { colors, getCssVar } from 'quasar';
import FormFieldEmail from '../global/FormFieldEmail.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

const { getPaletteColor } = colors;

const customFormFieldValidationErrColor = getCssVar(
  'custom-form-field-validation-err',
);
const negative = getPaletteColor('negative');

const selectorFormFieldEmail = 'form-email';
const model = ref('');
const setModelValue = (value) => {
  model.value = value;
};

describe('<FormFieldEmail>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageEmailInvalid', 'messageFieldRequired'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(''));
      cy.mount(FormFieldEmail, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('check default form field validation error color', () => {
      cy.viewport('macbook-16');
      [selectorFormFieldEmail].forEach((formField) => {
        cy.checkFormFieldValidationErrColor(formField, negative);
      });
    });

    it('check custom form field validation error color', () => {
      cy.mount(FormFieldEmail, {
        props: {
          ...vModelAdapter(model),
          useFormFieldValidationErrorCssClass: true,
        },
      });
      [selectorFormFieldEmail].forEach((formField) => {
        cy.checkFormFieldValidationErrColor(
          formField,
          customFormFieldValidationErrColor,
        );
      });
    });
  });

  context('desktop (optional)', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(''));
      cy.mount(FormFieldEmail, {
        props: {
          ...vModelAdapter(model),
          required: false,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('validates email correctly (optional)', () => {
      // enter invalid email to show messages
      cy.dataCy('form-email-input').type('invalidemail');
      cy.dataCy('form-email-input').blur();
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      // clear input
      cy.dataCy('form-email-input').clear();
      cy.dataCy('form-email-input').blur();
      // no validation error is shown
      cy.get('.q-field__messages').should(
        'not.contain',
        i18n.global.t('form.messageEmailInvalid'),
      );
      cy.get('.q-field__messages').should(
        'not.contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelEmail'),
        }),
      );
    });
  });
});

function coreTests() {
  it('validates email correctly', () => {
    // invalid email
    cy.dataCy('form-email-input').type('qw123@qw');
    // first blur triggers validation
    cy.dataCy('form-email-input').blur();
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .should('be.visible')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('abc.example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('a@b@c@example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('a"b(c)d,e:f;g<h>i[jk]l@example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('just"not"right@example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('this is"notallowed@example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type('this still"not\\allowed@example.com');
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type(
      '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
    );
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // invalid email
    cy.dataCy('form-email-input').type(
      'i.like.underscores@but_they_are_not_allowed_in_this_part',
    );
    cy.dataCy('form-email')
      .find('.q-field__messages')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('simple@example.com');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('very.common@example.com');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('x@example.com');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type(
      'long.email-address-with-hyphens@and.subdomains.example.com',
    );
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('user.name+tag+sorting@example.com');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('name/surname@example.com');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('mailhost!username@example.org');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('user%example.com@example.org');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
    // valid email
    cy.dataCy('form-email-input').type('user-@example.org');
    cy.dataCy('form-email-input').blur();
    cy.get('.q-field__messages').should('be.empty');
    cy.dataCy('form-email-input').clear();
  });
}

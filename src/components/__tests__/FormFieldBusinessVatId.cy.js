import { ref } from 'vue';
import FormFieldBusinessVatId from 'components/form/FormFieldBusinessVatId.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

const model = ref('');
const setModelValue = (value) => {
  model.value = value;
};

describe('<FormFieldBusinessVatId>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'messageFieldRequired',
        'messageBusinessVatIdInvalid',
        'labelBusinessVatId',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(''));
      cy.mount(FormFieldBusinessVatId, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    it('validates business VAT ID correctly', () => {
      // invalid - missing CZ prefix
      cy.dataCy('form-business-vat-id-input').type('12345678');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.dataCy('form-business-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessVatIdInvalid'));
      cy.dataCy('form-business-vat-id-input').clear();
      // invalid - contains letters in number part
      cy.dataCy('form-business-vat-id-input').type('CZ1234567a');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.dataCy('form-business-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessVatIdInvalid'));
      cy.dataCy('form-business-vat-id-input').clear();
      // invalid - contains special characters
      cy.dataCy('form-business-vat-id-input').type('CZ12345678$');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.dataCy('form-business-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessVatIdInvalid'));
      cy.dataCy('form-business-vat-id-input').clear();

      // valid - 8 digits (legal entity)
      cy.dataCy('form-business-vat-id-input').type('CZ12345678');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
      cy.dataCy('form-business-vat-id-input').clear();
      // valid - 9 digits (individual)
      cy.dataCy('form-business-vat-id-input').type('CZ123456789');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
      cy.dataCy('form-business-vat-id-input').clear();
      // valid - 10 digits (individual)
      cy.dataCy('form-business-vat-id-input').type('CZ1234567890');
      cy.dataCy('form-business-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
      // valid - any length with SK prefix
      cy.dataCy('form-business-vat-id-input').clear();
      cy.dataCy('form-business-vat-id-input').type(
        'SK1122334455667788991122334455',
      );
      cy.dataCy('form-business-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
    });
  });
});

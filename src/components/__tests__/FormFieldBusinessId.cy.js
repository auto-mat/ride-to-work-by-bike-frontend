import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldBusinessId>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageFieldRequired', 'messageBusinessIdInvalid'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldBusinessId',
        },
      });
      cy.viewport('macbook-16');
    });

    it('validates registration number correctly', () => {
      // invalid registration number
      cy.dataCy('form-vat-id-input').type('8765432');
      cy.dataCy('form-vat-id-input').blur();
      cy.dataCy('form-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessIdInvalid'));
      cy.dataCy('form-vat-id-input').clear();
      // invalid registration number
      cy.dataCy('form-vat-id-input').type('1234567890');
      cy.dataCy('form-vat-id-input').blur();
      cy.dataCy('form-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessIdInvalid'));
      cy.dataCy('form-vat-id-input').clear();
      // invalid registration number
      cy.dataCy('form-vat-id-input').type('8765432a');
      cy.dataCy('form-vat-id-input').blur();
      cy.dataCy('form-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessIdInvalid'));
      cy.dataCy('form-vat-id-input').clear();
      // invalid registration number
      cy.dataCy('form-vat-id-input').type('8765432$');
      cy.dataCy('form-vat-id-input').blur();
      cy.dataCy('form-vat-id')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageBusinessIdInvalid'));
      cy.dataCy('form-vat-id-input').clear();

      // valid registration number
      cy.dataCy('form-vat-id-input').type('08765432');
      cy.dataCy('form-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
      cy.dataCy('form-vat-id-input').clear();
      // valid registration number
      cy.dataCy('form-vat-id-input').type('87654321');
      cy.dataCy('form-vat-id-input').blur();
      cy.get('.q-field__messages').should('be.empty');
    });
  });
});

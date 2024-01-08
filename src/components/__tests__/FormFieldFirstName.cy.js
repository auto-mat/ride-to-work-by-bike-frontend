import FormFieldFirstNameTest from 'components/global/FormFieldFirstNameTest.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldFirstName>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldFirstNameTest, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders first name field', () => {
      // input label
      cy.dataCy('form-first-name')
        .should('be.visible')
        .find('label[for="form-first-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.labelFirstName'));
      // input wrapper
      cy.dataCy('form-first-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-first-name-input').should('be.visible');
    });

    it('validates required rule', () => {
      cy.dataCy('form-first-name-input').focus();
      cy.dataCy('form-first-name-input').blur();
      cy.dataCy('form-first-name')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelFirstName'),
          }),
        );
    });
  });
});

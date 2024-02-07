import FormFieldCompanyAddress from 'components/form/FormFieldCompanyAddress.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldCompanyAddress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldCompanyAddress, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-field-company-address').should('be.visible');
    });
  });
});

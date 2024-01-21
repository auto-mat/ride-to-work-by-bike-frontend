import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldOptionGroup>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldOptionGroup',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-field-option-group').should('be.visible');
    });
  });
});

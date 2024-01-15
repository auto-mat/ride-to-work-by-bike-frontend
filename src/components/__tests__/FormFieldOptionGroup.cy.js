import FormFieldOptionGroup from 'components/form/FormFieldOptionGroup.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldOptionGroup>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldOptionGroup, {
        props: {
          modelValue: 'option-1',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-field-option-group').should('be.visible');
    });
  });
});

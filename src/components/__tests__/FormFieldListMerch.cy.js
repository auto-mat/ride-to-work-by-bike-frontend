import FormFieldListMerch from 'components/form/FormFieldListMerch.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldListMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-field-list-merch').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});

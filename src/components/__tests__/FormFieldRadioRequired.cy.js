import FormFieldTestWrapper from 'components/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldTestWrapper>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldRadioRequired',
        },
      });
      cy.viewport('macbook-16');
    });
  });
});

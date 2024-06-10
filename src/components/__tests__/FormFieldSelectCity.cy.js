import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldSelectCity>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelCity'], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldSelectCity',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldSelectCity',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-select-label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelCity'));
    // click select
    cy.dataCy('form-select-city').click();
    cy.get('.q-menu .q-item__label')
      .should('be.visible')
      .and('have.length', 10);
  });
}

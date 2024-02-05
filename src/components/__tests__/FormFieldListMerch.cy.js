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
      // component is visible
      cy.dataCy('list-merch').should('be.visible');
      // cards are visible
      cy.dataCy('form-card-merch').should('be.visible');
      // tabs are visible
      cy.dataCy('list-merch-tab')
        // male and female tabs
        .should('have.length', 2);
    });

    it('should render 3 cards in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        33,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('should render 1 card in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        100,
      );
    });
  });
});

import { colors } from 'quasar';
import FormFieldListMerch from 'components/form/FormFieldListMerch.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldListMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelNoMerch', 'hintNoMerch'],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(['male', 'female'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('no-merch-label')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10);
      cy.dataCy('no-merch-hint')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey8);
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

    it('allows to disable merch options', () => {
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('not.be.visible');
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('be.visible');
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

import { colors } from 'quasar';
import LinearProgressNumbers from '@/components/global/LinearProgressNumbers.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');

// selectors
const selectorLinearProgressNumbers = 'linear-progress-numbers';
const selectorLinearProgressNumbersLabel = 'linear-progress-numbers-label';
const selectorLinearProgressNumbersNumbers = 'linear-progress-numbers-numbers';

// variables
const value = 10;
const max = 100;
const label = 'days';

describe('<LinearProgressNumbers>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(LinearProgressNumbers, {
        props: {
          value,
          max,
          label,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LinearProgressNumbers, {
        props: {
          value,
          max,
          label,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorLinearProgressNumbers)
      .should('be.visible')
      .and('contain', value)
      .and('contain', max)
      .and('contain', label);
    // timeline label
    cy.dataCy(selectorLinearProgressNumbersLabel)
      .should('be.visible')
      .and('contain', label)
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', white);
    // timeline numbers
    cy.dataCy(selectorLinearProgressNumbersNumbers)
      .should('be.visible')
      .and('contain', value)
      .and('contain', max)
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', white);
  });
}

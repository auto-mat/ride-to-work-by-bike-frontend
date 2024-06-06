import ResultsList from 'components/results/ResultsList.vue';
import { i18n } from '../../boot/i18n';

describe('<ResultsList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelCo2Saved', 'labelRegularity', 'labelSustainableRoutes'],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ResultsList, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders routes in 4 col grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('result-item'), 25);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ResultsList, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders routes in stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('result-item'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('results-list').should('be.visible');
    // title
    cy.dataCy('section-heading-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleYourResultsSince'));
    // button
    cy.dataCy('results-list-button')
      .should('be.visible')
      .and('contain', i18n.global.t('global.buttonShare'));
    // item list
    cy.dataCy('results-list-inner').should('be.visible');
  });
}

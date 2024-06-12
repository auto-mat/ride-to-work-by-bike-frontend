import ListCardSlider from 'components/global/ListCardSlider.vue';
import { i18n } from '../../boot/i18n';

describe('<ListCardSlider>', () => {
  it('has translation for all strings', () => {
    // Used in `ResultsDetailPage`
    cy.testLanguageStringsInContext(
      ['buttonAllPrizes', 'textListPrizes', 'titleListPrizes'],
      'listCardSlider',
      i18n,
    );
  });

  context('desktop - list results prizes', () => {
    beforeEach(() => {
      cy.fixture('listResultsPrizes').then((listResultsPrizes) => {
        cy.mount(ListCardSlider, {
          props: {
            button: { title: listResultsPrizes.button.title },
            cards: listResultsPrizes.cards,
            cardType: 'CardPrize',
            perex: listResultsPrizes.perex,
            title: listResultsPrizes.title,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile - list results prizes', () => {
    beforeEach(() => {
      cy.fixture('listResultsPrizes').then((listResultsPrizes) => {
        cy.mount(ListCardSlider, {
          props: {
            button: { title: listResultsPrizes.button.title },
            cards: listResultsPrizes.cards,
            cardType: 'CardPrize',
            perex: listResultsPrizes.perex,
            title: listResultsPrizes.title,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders full size button', () => {
      cy.testElementPercentageWidth(cy.dataCy('list-card-slider-button'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('listResultsPrizes').then((listResultsPrizes) => {
      // component
      cy.dataCy('list-card-slider').should('be.visible');
      // title
      cy.dataCy('list-card-slider-title').should('be.visible');
      cy.dataCy('section-heading-title')
        .should('be.visible')
        .and('contain', listResultsPrizes.title);
      // perex
      cy.dataCy('section-heading-perex')
        .should('be.visible')
        .and('contain', listResultsPrizes.perex);
      // swiper
      cy.dataCy('swiper-container').should('be.visible');
      // cards
      cy.dataCy('list-card-slider-item')
        .should('be.visible')
        .and('have.length', 5);
      // buttons
      cy.dataCy('list-card-slider-buttons').should('be.visible');
      cy.dataCy('list-card-slider-button')
        .should('be.visible')
        .and('contain', listResultsPrizes.button.title);
    });
  });
}

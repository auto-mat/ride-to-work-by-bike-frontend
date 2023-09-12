import ListCardChallenge from '../ListCardChallenge.vue';
import { i18n } from '../../boot/i18n';

// mocks
import { cardsChallenge } from 'src/mocks/homepage';

describe('<ListCardChallenge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.cardListChallenge', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListCardChallenge, {
        props: {
          cards: cardsChallenge
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-title')
          .should('be.visible')
          .should('contain', i18n.global.t('index.cardListChallenge.title'));
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-item').should('have.length', 5);
      });
    });

    it('renders cards in a responsive grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 33);
    });
  });

  context('tablet', () => {
    beforeEach(() => {
      cy.mount(ListCardChallenge, {
        props: {
          cards: cardsChallenge
        },
      });
      cy.viewport('macbook-13');
    });

    it('renders cards in a responsive grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListCardChallenge, {
        props: {
          cards: cardsChallenge
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders cards in a responsive grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 100);
    });
  });
});

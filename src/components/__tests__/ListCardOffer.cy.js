import ListCardOffer from 'components/ListCardOffer.vue';
import { i18n } from '../../boot/i18n';

// mocks
import { cardsOffer } from 'src/mocks/homepage';
const title = i18n.global.t('cardListOffer.title');
const cards = cardsOffer;

describe('<ListCardOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListOffer',
      i18n
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListCardOffer, {
        props: {
          title,
          cards,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-item').should('have.length', 6);
      });
    });

    it('renders items in a 3 col grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('list-card-offer-item'), 33);
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-button')
          .should('be.visible')
          .should(
            'contain',
            i18n.global.t('index.cardListOffer.button', {
              count: cards.length,
            })
          );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListCardOffer, {
        props: {
          title,
          cards,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-item').should('have.length', 6);
      });
    });

    it('renders items in a 1 col grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('list-card-offer-item'), 100);
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-button')
          .should('be.visible')
          .should(
            'contain',
            i18n.global.t('index.cardListOffer.button', {
              count: cards.length,
            })
          );
      });
    });
  });
});

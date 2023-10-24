import ListCardFollow from '../ListCardFollow.vue';
import { i18n } from '../../boot/i18n';

// mocks
import { cardsFollow } from 'src/mocks/homepage';

describe('<ListCardFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.cardListFollow', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListCardFollow, {
        props: {
          cards: cardsFollow,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.cardListFollow.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.cardListFollow.title'),
            );
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-item').should('have.length', 2);
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('card-list-follow-col-title'),
          33,
        );

        cy.testElementPercentageWidth(cy.dataCy('card-list-follow-item'), 33);
      });
    });

    it('aligns items center', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow').should(
          'have.css',
          'align-items',
          'center',
        );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListCardFollow, {
        props: {
          cards: cardsFollow,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('card-list-follow-col-title'),
          100,
        );

        cy.testElementPercentageWidth(cy.dataCy('card-list-follow-item'), 100);
      });
    });
  });
});

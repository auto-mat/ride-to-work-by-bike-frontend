import VueCardListChallenge from '../VueCardListChallenge.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardListChallenge>', () => {
  beforeEach(() => {
    cy.mount(VueCardListChallenge, {
      props: {
        cards: [
          {
            title: 'Challenge 1',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 2',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 3',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 4',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 5',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
        ],
      },
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.cardListChallenge', i18n);
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
    cy.dataCy('card-list')
      .should('have.css', 'display', 'flex')
      .should('have.css', 'flex-wrap', 'wrap');

    cy.viewport('iphone-6');

    cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 100);

    cy.viewport('macbook-13');

    cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 50);

    cy.viewport('macbook-15');

    cy.testElementPercentageWidth(cy.dataCy('card-list-item'), 33);
  });
});

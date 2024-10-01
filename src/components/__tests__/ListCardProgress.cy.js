import ListCardProgress from '../homepage/ListCardProgress.vue';
import { i18n } from '../../boot/i18n';

describe('<ListCardProgress>', () => {
  let cards;
  let stats;

  before(() => {
    cy.fixture('cardsProgress').then((cardsData) => {
      cards = cardsData;
    });
    cy.fixture('statsBar').then((statsData) => {
      stats = statsData;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListProgress',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListCardProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats,
          cards,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('section-heading-title')
          .should('contain', i18n.global.t('index.progressSlider.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.progressSlider.title'),
            );
          });
      });
    });

    it('renders list of stats', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-stats').should('be.visible');
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-progress-item').should('have.length', 3);
      });
    });

    it('renders cards in a 3 col grid', () => {
      cy.dataCy('card-list-progress-wrapper')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap');
      cy.viewport('iphone-6');
      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 100);
      cy.viewport('macbook-15');
      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 33);
    });
  });

  context('tablet', () => {
    beforeEach(() => {
      cy.mount(ListCardProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats,
          cards,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('macbook-13');
    });

    it('renders cards in a 2 col grid', () => {
      cy.dataCy('card-list-progress-wrapper')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap');
      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListCardProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats,
          cards,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders cards in a 1 col grid', () => {
      cy.dataCy('card-list-progress-wrapper')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap');
      cy.viewport('iphone-6');
      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 100);
    });
  });
});

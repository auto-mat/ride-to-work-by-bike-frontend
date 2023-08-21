import VueCardListProgress from 'components/VueCardListProgress.vue';
import { i18n } from '../../boot/i18n';
import { progressStats, cardsProgress } from 'src/mocks/homepage';

describe('<VueCardListProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListProgress',
      i18n
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardListProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats: progressStats,
          cards: cardsProgress,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-progress-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000')
          .should('contain', i18n.global.t('index.progressSlider.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.progressSlider.title')
            );
          });
      });
    });

    it('renders list of stats', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-progress-stats-item').should('have.length', 3);

        cy.dataCy('card-list-progress-stats-item').each(($item, index) => {
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('have.color', '#212121');

          cy.wrap($item)
            .find('.q-icon')
            .should('contain', progressStats[index].icon)
            .should('have.color', '#b0bec5')
            .should('have.css', 'width', '18px')
            .should('have.css', 'height', '18px');

          cy.wrap($item)
            .find('span')
            .should('contain', progressStats[index].label)
            .should('have.color', '#212121');

          cy.wrap($item)
            .find('strong')
            .should('contain', progressStats[index].value)
            .should('have.color', '#212121')
            .should('have.css', 'font-weight', '700');
        });
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
        .should('have.css', 'flex-wrap', 'wrap');

      cy.viewport('iphone-6');

      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 100);

      cy.viewport('macbook-15');

      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 33);
    });
  });

  context('tablet', () => {
    beforeEach(() => {
      cy.mount(VueCardListProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats: progressStats,
          cards: cardsProgress,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('macbook-13');
    });

    it('renders cards in a 2 col grid', () => {
      cy.dataCy('card-list-progress-wrapper')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-wrap', 'wrap');

      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardListProgress, {
        props: {
          title: i18n.global.t('index.cardListProgress.title'),
          stats: progressStats,
          cards: cardsProgress,
          button: { title: i18n.global.t('index.cardListProgress.button') },
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders cards in a 1 col grid', () => {
      cy.dataCy('card-list-progress-wrapper')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-wrap', 'wrap');

      cy.viewport('iphone-6');

      cy.testElementPercentageWidth(cy.dataCy('card-list-progress-item'), 100);
    });
  });
});

import ListCardOffer from '../homepage/ListCardOffer.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// mocks
const title = i18n.global.t('index.cardListOffer.title');

describe('<ListCardOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListOffer',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.mount(ListCardOffer, {
          props: {
            title,
            cards: listCardsPrizes,
          },
        });
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('section-heading-title')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-item').should(
          'have.length',
          rideToWorkByBikeConfig.indexPageVisibleOfferCount,
        );
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
          cy.dataCy('list-card-offer-button')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('index.cardListOffer.button', {
                count: listCardsPrizes.length,
              }),
            );
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.mount(ListCardOffer, {
          props: {
            title,
            cards: listCardsPrizes,
          },
        });
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('section-heading-title')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('list-card-offer-item').should(
          'have.length',
          rideToWorkByBikeConfig.indexPageVisibleOfferCount,
        );
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
          cy.dataCy('list-card-offer-button')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('index.cardListOffer.button', {
                count: listCardsPrizes.length,
              }),
            );
        });
      });
    });
  });
});

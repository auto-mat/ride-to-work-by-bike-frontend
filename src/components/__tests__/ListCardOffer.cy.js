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
      cy.interceptOffersGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(ListCardOffer, {
        props: {
          title,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.dataCy('section-heading-title')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.dataCy('list-card-offer-item').should(
          'have.length',
          rideToWorkByBikeConfig.indexPageVisibleOfferCount,
        );
      });
    });

    it('renders items in a 3 col grid', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.testElementPercentageWidth(cy.dataCy('list-card-offer-item'), 33);
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.fixture('apiGetOffersResponse.json').then((offers) => {
          cy.waitForOffersApi();
          cy.dataCy('list-card-offer-button')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('index.cardListOffer.button', {
                count: offers.filter((offer) => offer.start_date === '').length,
              }),
            );
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptOffersGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(ListCardOffer, {
        props: {
          title,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.dataCy('section-heading-title')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.dataCy('list-card-offer-item').should(
          'have.length',
          rideToWorkByBikeConfig.indexPageVisibleOfferCount,
        );
      });
    });

    it('renders items in a 1 col grid', () => {
      cy.window().then(() => {
        cy.waitForOffersApi();
        cy.testElementPercentageWidth(cy.dataCy('list-card-offer-item'), 100);
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.fixture('apiGetOffersResponse.json').then((offers) => {
          cy.waitForOffersApi();
          cy.dataCy('list-card-offer-button')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('index.cardListOffer.button', {
                count: offers.filter((offer) => offer.start_date === '').length,
              }),
            );
        });
      });
    });
  });
});

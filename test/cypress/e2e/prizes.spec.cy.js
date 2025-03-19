import { routesConf } from '../../../src/router/routes_conf';
import {
  testDesktopSidebar,
  testMobileHeader,
  systemTimeOffersInvalid,
  systemTimeOffersValid,
} from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { isOfferValidMoreThanOneDay } from 'src/utils/get_offer_valid';

describe('Prizes page', () => {
  beforeEach(() => {
    // load config an i18n objects as aliases
    cy.task('getAppConfig', process).then((config) => {
      // alias config
      cy.wrap(config).as('config');
      cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
        cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        cy.interceptOffersGetApi(
          config,
          defLocale,
          response.results[0].city_wp_slug,
        );
        cy.interceptPrizesGetApi(
          config,
          defLocale,
          response.results[0].city_wp_slug,
        );
        cy.interceptCitiesGetApi(config, defLocale);
      });
      // intercept different response for first selectable city
      cy.fixture('apiGetCitiesResponse.json').then((citiesResponse) => {
        cy.fixture('apiGetOffersResponseAlternative.json').then(
          (offersResponse) => {
            cy.interceptOffersGetApi(
              config,
              defLocale,
              citiesResponse.results[0].slug,
              offersResponse,
            );
          },
        );
        cy.fixture('apiGetPrizesResponseAlternative.json').then(
          (prizesResponse) => {
            cy.interceptPrizesGetApi(
              config,
              defLocale,
              citiesResponse.results[0].slug,
              prizesResponse,
            );
          },
        );
      });
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['prizes']['path']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('desktop - empty offers and prizes', () => {
    beforeEach(() => {
      cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
        cy.fixture('apiGetOffersOrPrizesResponseEmpty.json').then(
          (responseEmpty) => {
            cy.get('@config').then((config) => {
              cy.interceptOffersGetApi(
                config,
                defLocale,
                response.results[0].city_wp_slug,
                responseEmpty,
              );
              cy.interceptPrizesGetApi(
                config,
                defLocale,
                response.results[0].city_wp_slug,
                responseEmpty,
              );
            });
          },
        );
      });
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['prizes']['path']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    it('renders empty state for offers and prizes', () => {
      cy.get('@i18n').then((i18n) => {
        // empty offers
        cy.dataCy('discount-offers-title').should('be.visible');
        cy.dataCy('discount-offers-list').should('not.exist');
        cy.dataCy('discount-offers-item').should('not.exist');
        cy.contains(i18n.global.t('prizes.textOffersEmpty')).should(
          'be.visible',
        );
        // empty prizes
        cy.dataCy('available-prizes').should('be.visible');
        cy.dataCy('available-prizes-list').should('not.exist');
        cy.dataCy('available-prizes-item').should('not.exist');
        cy.contains(i18n.global.t('prizes.textPrizesEmpty')).should(
          'be.visible',
        );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.visit('#' + routesConf['prizes']['path']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    coreTests();
    testMobileHeader();
  });
});

function coreTests() {
  it('renders page heading section', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('prizes-page-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('prizes.titlePrizes')).then((translation) => {
            cy.wrap($el).should('contain', translation);
          });
        });
      cy.dataCy('form-field-select-city').should('be.visible');
    });
  });

  it('renders a list of offers', () => {
    cy.get('@i18n').then((i18n) => {
      cy.waitForOffersApi();
      cy.dataCy('discount-offers-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('prizes.titleSpecialOffers')).then(
            (translation) => {
              expect($el.text()).to.contain(translation);
            },
          );
        });
      // display list of offers
      cy.dataCy('discount-offers-list').should('be.visible');
      cy.fixture('apiGetOffersResponse.json').then((offers) => {
        // check if list has correct number of items
        cy.wrap(offers.filter(isOfferValidMoreThanOneDay)).then(
          (displayedOffers) => {
            cy.dataCy('discount-offers-item')
              .should('be.visible')
              .and('have.length', displayedOffers.length);
            // check that each item has correct data
            cy.dataCy('discount-offers-item').each((item, index) => {
              cy.wrap(item).should('contain', displayedOffers[index].title);
            });
          },
        );
      });
    });
  });

  it('allows to filter the list of offers by selecting a city', () => {
    cy.waitForOffersApi();
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-field-select-city').find('.q-field__append').click();
    cy.get('.q-menu')
      .should('be.visible')
      .within(() => {
        cy.get('.q-item').first().click();
      });
    cy.fixture('apiGetOffersResponseAlternative.json').then((offers) => {
      cy.waitForOffersApi(offers);
      // display list of offers
      cy.dataCy('discount-offers-list').should('be.visible');
      // check if list has correct number of items
      cy.wrap(offers.filter(isOfferValidMoreThanOneDay)).then(
        (displayedOffers) => {
          cy.dataCy('discount-offers-item')
            .should('be.visible')
            .and('have.length', displayedOffers.length);
          // check that each item has correct data
          cy.dataCy('discount-offers-item').each((item, index) => {
            cy.wrap(item).should('contain', displayedOffers[index].title);
          });
        },
      );
    });
  });

  it('renders offers as invalid (dimmed) when not currently valid', () => {
    cy.clock(new Date(systemTimeOffersInvalid), ['Date']).then(() => {
      cy.waitForOffersApi();
      cy.dataCy('discount-offers-item').should('have.class', 'light-dimmed');
    });
  });

  it('renders offers as valid (not dimmed) when currently valid', () => {
    cy.clock(new Date(systemTimeOffersValid), ['Date']).then(() => {
      cy.waitForOffersApi();
      cy.dataCy('discount-offers-item').should(
        'not.have.class',
        'light-dimmed',
      );
    });
  });

  it('renders a list of available prizes', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('available-prizes')
        .find('[data-cy="section-heading-title"]')
        .should('be.visible')
        .then(($el) => {
          cy.stripHtmlTags(i18n.global.t('prizes.titleAvailablePrizes')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
      cy.dataCy('available-prizes')
        .find('[data-cy="section-heading-perex"]')
        .should('be.visible')
        .then(($el) => {
          cy.stripHtmlTags(i18n.global.t('prizes.textAvailablePrizes')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
      cy.fixture('apiGetPrizesResponse.json').then((prizes) => {
        cy.waitForPrizesApi(prizes);
        cy.dataCy('available-prizes-list').should('be.visible');
        cy.dataCy('available-prizes-item').should('be.visible');
        cy.dataCy('available-prizes-item').and('have.length', prizes.length);
        // check that cards show titles
        cy.dataCy('available-prizes-item').each((item, index) => {
          cy.wrap(item).should('contain', prizes[index].title);
        });
      });
    });
  });

  it('allows to filter the list of prizes by selecting a city', () => {
    cy.waitForPrizesApi();
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-field-select-city').find('.q-field__append').click();
    cy.get('.q-menu')
      .should('be.visible')
      .within(() => {
        cy.get('.q-item').first().click();
      });
    cy.fixture('apiGetPrizesResponseAlternative.json').then((prizes) => {
      cy.waitForPrizesApi(prizes);
      // display list of prizes
      cy.dataCy('available-prizes-list').should('be.visible');
      // check that each item has correct data
      cy.dataCy('available-prizes-item').each((item, index) => {
        cy.wrap(item).should('contain', prizes[index].title);
      });
    });
  });

  it.skip('renders a list of partners', () => {
    cy.dataCy('list-partners').should('be.visible');
  });
}

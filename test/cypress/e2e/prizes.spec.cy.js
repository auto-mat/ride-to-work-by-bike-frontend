import { routesConf } from '../../../src/router/routes_conf';
import {
  testDesktopSidebar,
  testMobileHeader,
  systemTimeOffersInvalid,
  systemTimeOffersValid,
} from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { isOfferValidMoreThanOneDay } from '../../../src/utils/get_offer_valid';

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

    it('renders empty state for offers, prizes and events', () => {
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
        // empty events
        cy.dataCy('events-title').should('be.visible');
        cy.dataCy('events-list').should('not.exist');
        cy.dataCy('events-item').should('not.exist');
        cy.contains(i18n.global.t('prizes.textEventsEmpty')).should(
          'be.visible',
        );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport(320, 2000);
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
              cy.wrap(item).click();
              cy.dataCy('dialog-offer').should('be.visible');
              if (displayedOffers[index].content) {
                cy.dataCy('dialog-content')
                  .should('be.visible')
                  .then(($el) => {
                    const textContent = $el.text();
                    cy.stripHtmlTags(displayedOffers[index].content).then(
                      (text) => {
                        cy.decodeHtmlEntities(text).then((elementText) => {
                          expect(textContent).to.contain(elementText);
                        });
                      },
                    );
                  });
              }
              if (displayedOffers[index].mobileapppopismista) {
                cy.dataCy('dialog-description')
                  .should('be.visible')
                  .then(($el) => {
                    const textContent = $el.text();
                    cy.stripHtmlTags(
                      displayedOffers[index].mobileapppopismista,
                    ).then((text) => {
                      cy.decodeHtmlEntities(text).then((elementText) => {
                        expect(textContent).to.contain(elementText);
                      });
                    });
                  });
              }
              // validation
              if (parseInt(displayedOffers[index].akce_na_triko)) {
                cy.dataCy('offer-validation').should('be.visible');
              } else {
                cy.dataCy('offer-validation').should('not.exist');
              }
              cy.dataCy('dialog-close').should('be.visible').click();
            });
          },
        );
        // check first offer - example without link
        cy.dataCy('discount-offers-item').first().click();
        cy.dataCy('dialog-offer').should('be.visible');
        // has title
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('contain', offers[0].title);
        // has no link
        cy.dataCy('dialog-offer-link').should('not.exist');
        // close dialog
        cy.dataCy('dialog-close').should('be.visible').click();
        // check second offer - example with link
        cy.dataCy('discount-offers-item').eq(1).click();
        cy.dataCy('dialog-offer').should('be.visible');
        // has title
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('contain', offers[1].title);
        // has link
        cy.dataCy('dialog-offer-link')
          .should('be.visible')
          .and('have.attr', 'href', offers[1].voucher_url);
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
          cy.wrap(item).click();
          // content
          if (prizes[index].content) {
            cy.dataCy('dialog-content')
              .should('be.visible')
              .then(($el) => {
                const textContent = $el.text();
                cy.stripHtmlTags(prizes[index].content).then((text) => {
                  cy.decodeHtmlEntities(text).then((elementText) => {
                    expect(textContent).to.contain(elementText);
                  });
                });
              });
          }
          // description
          if (prizes[index].mobileapppopismista) {
            cy.dataCy('dialog-description')
              .should('be.visible')
              .then(($el) => {
                const textContent = $el.text();
                cy.stripHtmlTags(prizes[index].mobileapppopismista).then(
                  (text) => {
                    cy.decodeHtmlEntities(text).then((elementText) => {
                      expect(textContent).to.contain(elementText);
                    });
                  },
                );
              });
          }
          cy.dataCy('dialog-close').should('be.visible').click();
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

  it('renders a list of events', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('events-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('prizes.titleEvents')).then((translation) => {
            expect($el.text()).to.equal(translation);
          });
        });
      cy.dataCy('events-list').should('be.visible');
      cy.fixture('apiGetOffersResponse.json').then((offers) => {
        // check if list has correct number of items
        cy.wrap(
          offers.filter((offer) => !isOfferValidMoreThanOneDay(offer)),
        ).then((displayedOffers) => {
          cy.dataCy('events-item')
            .should('be.visible')
            .and('have.length', displayedOffers.length);
          // check that each item has correct data
          cy.dataCy('events-item').each((item, index) => {
            cy.wrap(item).should('contain', displayedOffers[index].title);
          });
        });
      });
    });
  });

  it('allows to filter the list of events by selecting a city', () => {
    cy.waitForOffersApi();
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-field-select-city').find('.q-field__append').click();
    cy.get('.q-menu')
      .should('be.visible')
      .within(() => {
        cy.get('.q-item').first().click();
      });
    cy.fixture('apiGetOffersResponseAlternative.json').then((posts) => {
      cy.waitForOffersApi(posts);
      // display list of events
      cy.dataCy('events-list').should('be.visible');
      // check if list has correct number of items
      cy.wrap(posts.filter((post) => !isOfferValidMoreThanOneDay(post))).then(
        (displayedEvents) => {
          cy.dataCy('events-item')
            .should('be.visible')
            .and('have.length', displayedEvents.length);
          // check that each item has correct data
          cy.dataCy('events-item').each((item, index) => {
            cy.wrap(item).should('contain', displayedEvents[index].title);
          });
        },
      );
    });
  });

  it.skip('renders a list of partners', () => {
    cy.dataCy('list-partners').should('be.visible');
  });
}

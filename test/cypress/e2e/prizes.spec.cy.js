import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar, testMobileHeader } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Prizes page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.interceptOffersGetApi(config, defLocale);
      });
      cy.visit('#' + routesConf['prizes']['path']);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['prizes']['path']);
      cy.viewport('iphone-6');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
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

  it('renders a list of special events', () => {
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
      cy.dataCy('discount-offers-list').should('be.visible');
      cy.dataCy('discount-offers-item')
        .should('be.visible')
        .and('have.length', 7);
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
      cy.dataCy('available-prizes-list').should('be.visible');

      cy.dataCy('available-prizes-item')
        .should('be.visible')
        .and('have.length', 5);
    });
  });

  it('renders a list of partners', () => {
    cy.dataCy('list-partners').should('be.visible');
  });
}

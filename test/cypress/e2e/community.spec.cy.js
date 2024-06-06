import { routesConf } from '../../../src/router/routes_conf';

describe('Community page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['community']['path']);
      cy.viewport('macbook-16');

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

    it('renders left drawer', () => {
      cy.dataCy('q-drawer').should('be.visible');
      cy.dataCy('drawer-header').should('be.visible');
      cy.dataCy('user-select').should('be.visible');
      cy.dataCy('drawer-toggle-buttons').should('be.visible');
      cy.dataCy('drawer-menu').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['community']['path']);
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
  });
});

function coreTests() {
  it('renders page heading section', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('community-page-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('community.titleCommunity')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
      // cy.dataCy('community-select-city').should('be.visible');
    });
  });

  it('renders a list of local events', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('local-events-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('community.titleLocalEvents')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
      cy.dataCy('local-events-list').should('be.visible');
      cy.dataCy('local-events-item').should('be.visible').and('have.length', 2);
    });
  });

  it('renders a list of locations', () => {
    cy.dataCy('locations-slider').should('be.visible');
  });

  it('renders a list of new posts', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('list-card-post').should('be.visible');
      cy.dataCy('card-list-post-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('index.cardListPost.title')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
      cy.dataCy('card-list-post-button')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('index.cardListPost.button')).then(
            (translation) => {
              expect($el.text()).to.equal(translation);
            },
          );
        });
    });
  });
}

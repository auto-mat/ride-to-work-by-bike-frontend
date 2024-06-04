import { routesConf } from '../../../src/router/routes_conf';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results_detail']['path']);
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
      cy.visit('#' + routesConf['results_detail']['path']);
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
      // TODO: Add results detail heading (breadcrumb variant)
      cy.dataCy('results-detail-page-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('results.titleResults')).then((translation) => {
            expect($el.text()).to.equal(translation);
          });
        });
    });
  });

  it('renders upcoming challenges section', () => {
    // upcoming challenges
    cy.dataCy('results-list').should('be.visible');
    cy.dataCy('results-tabs').should('be.visible');
  });
}

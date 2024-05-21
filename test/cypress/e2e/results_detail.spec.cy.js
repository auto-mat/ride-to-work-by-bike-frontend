import { routesConf } from '../../../src/router/routes_conf';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results_detail']['path']);
      cy.viewport('macbook-16');
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
    });

    coreTests();
  });
});

function coreTests() {
  it('renders page heading section', () => {
    let i18n;
    cy.window().should('have.property', 'i18n');
    cy.window()
      .then((win) => {
        i18n = win.i18n;
      })
      .then(() => {
        // title
        // TODO: Add results detail heading (breadcrumb variant)
        cy.dataCy('results-detail-page-title')
          .should('be.visible')
          .and('contain', i18n.global.t('results.titleResults'));
      });
  });

  it('renders upcoming challenges section', () => {
    // upcoming challenges
    cy.dataCy('results-list').should('be.visible');
    cy.dataCy('results-tabs').should('be.visible');
  });
}

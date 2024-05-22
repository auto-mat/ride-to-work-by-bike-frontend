import { routesConf } from '../../../src/router/routes_conf';

describe('Routes page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['routes']['path']);
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
      cy.visit('#' + routesConf['routes']['path']);
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
        cy.dataCy('routes-page-title')
          .should('be.visible')
          .and('contain', i18n.global.t('routes.titleRoutes'));
        cy.dataCy('routes-page-instructions')
          .should('be.visible')
          .and('contain', i18n.global.t('routes.instructionRouteLogTimeframe'))
          .and('contain', i18n.global.t('routes.instructionRouteCombination'));
      });
  });

  it('renders route tabs', () => {
    cy.dataCy('route-tabs').should('be.visible');
    cy.dataCy('route-tabs-button-calendar').click();
    cy.dataCy('route-tabs-panel-calendar').should('be.visible');
  });
}

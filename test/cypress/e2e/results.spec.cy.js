import { routesConf } from '../../../src/router/routes_conf';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results']['path']);
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
      cy.visit('#' + routesConf['results']['path']);
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
        cy.dataCy('results-page-title')
          .should('be.visible')
          .and('contain', i18n.global.t('results.titleResults'));
      });
  });

  it('renders upcoming challenges section', () => {
    cy.dataCy('upcoming-challenges-title').should('be.visible');
    cy.dataCy('upcoming-challenges').should('be.visible');
  });
}

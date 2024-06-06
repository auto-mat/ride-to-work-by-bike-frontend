import { routesConf } from '../../../src/router/routes_conf';

describe('Routes page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['routes_calendar']['path']);
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
      cy.visit('#' + routesConf['routes_calendar']['path']);
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
      cy.dataCy('routes-page-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('routes.titleRoutes')).then((translation) => {
            expect($el.text()).to.contain(translation);
          });
        });
      cy.dataCy('routes-page-instructions')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('routes.instructionRouteLogTimeframe')).then(
            (translation) => {
              expect($el.text()).to.contain(translation);
            },
          );
        });
      cy.dataCy('routes-page-instructions').then(($el) => {
        cy.wrap(i18n.global.t('routes.instructionRouteCombination')).then(
          (translation) => {
            expect($el.text()).to.contain(translation);
          },
        );
      });
    });
  });

  it('renders route tabs', () => {
    cy.window().then(() => {
      cy.dataCy('route-tabs').should('be.visible');
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');
    });
  });
}

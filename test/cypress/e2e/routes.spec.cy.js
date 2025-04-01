import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar, testMobileHeader } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Routes page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
      });
      cy.visit('#' + routesConf['routes']['children']['fullPath']);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
      cy.waitForCommuteModeApi();
    });

    coreTests();
    testDesktopSidebar();

    it('reroutes correctly on large screens', () => {
      cy.waitForTripsApi();
      cy.dataCy('route-tabs').should('be.visible');
      // initial access to routes page - defaults to calendar view
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');
      // click on list view button
      cy.dataCy('route-tabs-button-list').click();
      // list view is visible
      cy.dataCy('route-tabs-panel-list').should('be.visible');
      // calendar view is not visible
      cy.dataCy('route-tabs-panel-calendar').should('not.exist');
      // go to home page
      cy.visit('#' + routesConf['home']['children']['fullPath']);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
      });
      cy.visit('#' + routesConf['routes']['children']['fullPath']);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
      cy.waitForCommuteModeApi();
    });

    coreTests();
    testMobileHeader();

    it('correctly shows list view on mobile', () => {
      cy.waitForTripsApi();
      cy.dataCy('route-tabs').should('be.visible');
      // initial access to routes page - defaults to list view
      cy.dataCy('route-tabs-panel-list').should('be.visible');
      // calendar view is not visible
      cy.dataCy('route-tabs-panel-calendar').should('not.exist');
    });
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
}

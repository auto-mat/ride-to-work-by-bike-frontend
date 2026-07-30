import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeLoggedIn } from '../support/commonTests';

describe('Logout functionality', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
      });
      // mock system time
      cy.clock(systemTimeLoggedIn, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
      // login
      cy.fillAndSubmitLoginForm();
      cy.dataCy('index-title').should('be.visible');
    });

    it('logs out user when clicking logout in drawer menu', () => {
      cy.get('@i18n').then((i18n) => {
        // verify user is logged in
        cy.url().should('include', routesConf['home']['path']);
        // click logout in drawer menu
        cy.dataCy('drawer-menu-item')
          .contains(i18n.global.t('drawerMenu.logout'))
          .should('be.visible')
          .click();
        // verify redirect to login page
        cy.url().should('include', routesConf['login']['path']);
        // verify login form is visible
        cy.dataCy('form-login-email').should('be.visible');
      });
    });

    it('clears user data after logout', () => {
      cy.get('@i18n').then((i18n) => {
        // verify user is logged in
        cy.url().should('include', routesConf['home']['path']);
        // click logout in drawer menu
        cy.dataCy('drawer-menu-item')
          .contains(i18n.global.t('drawerMenu.logout'))
          .click();
        // verify redirect to login page
        cy.url().should('include', routesConf['login']['path']);
        // try to navigate to protected route
        cy.visit('#' + routesConf['routes']['path']);
        // should be redirected back to login
        cy.url().should('include', routesConf['login']['path']);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
      });
      // mock system time
      cy.clock(systemTimeLoggedIn, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
      // login
      cy.fillAndSubmitLoginForm();
      cy.dataCy('index-title').should('be.visible');
    });

    it('logs out user when clicking logout in mobile more dialog', () => {
      cy.get('@i18n').then((i18n) => {
        // verify user is logged in
        cy.url().should('include', routesConf['home']['path']);
        // open mobile more dialog
        cy.dataCy('mobile-bottom-panel-button-more')
          .should('be.visible')
          .click();
        // wait for dialog to open
        cy.dataCy('mobile-more-menu-bottom').should('be.visible');
        // click logout in more dialog
        cy.dataCy('drawer-menu-item')
          .contains(i18n.global.t('drawerMenu.logout'))
          .should('be.visible')
          .click();
        // verify redirect to login page
        cy.url().should('include', routesConf['login']['path']);
        // verify login form is visible
        cy.dataCy('form-login-email').should('be.visible');
      });
    });
  });
});

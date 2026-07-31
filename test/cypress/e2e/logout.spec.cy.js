import { routesConf } from '../../../src/router/routes_conf';
import {
  setupApiChallengeActive,
  systemTimeLoggedIn,
} from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Logout', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.clock(systemTimeLoggedIn, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');
      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          // setup API intercepts
          setupApiChallengeActive(config, win.i18n, true);
          cy.interceptThisCampaignGetApi(config, defLocale);
          cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            },
          );
          cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
            (responseIsUserOrganizationAdmin) => {
              cy.interceptIsUserOrganizationAdminGetApi(
                config,
                defLocale,
                responseIsUserOrganizationAdmin,
              );
            },
          );
          cy.fixture('apiGetMyTeamResponseUndecided.json').then(
            (responseMyTeam) => {
              cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
            },
          );
          cy.interceptCommuteModeGetApi(config, defLocale);
        });
      });
      // login
      cy.fillAndSubmitLoginForm();
      cy.wait('@loginRequest');
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
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.clock(systemTimeLoggedIn, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('iphone-6');
      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          // setup API intercepts
          setupApiChallengeActive(config, win.i18n, true);
          cy.interceptThisCampaignGetApi(config, defLocale);
          cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            },
          );
          cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
            (responseIsUserOrganizationAdmin) => {
              cy.interceptIsUserOrganizationAdminGetApi(
                config,
                defLocale,
                responseIsUserOrganizationAdmin,
              );
            },
          );
          cy.fixture('apiGetMyTeamResponseUndecided.json').then(
            (responseMyTeam) => {
              cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
            },
          );
          cy.interceptCommuteModeGetApi(config, defLocale);
        });
      });
      // login
      cy.fillAndSubmitLoginForm();
      cy.wait('@loginRequest');
      cy.dataCy('index-title').should('be.visible');
    });

    it('logs out user when clicking logout in mobile menu dialog', () => {
      cy.get('@i18n').then((i18n) => {
        // verify user is logged in
        cy.url().should('include', routesConf['home']['path']);
        // open mobile menu dialog
        cy.dataCy('footer-panel-menu-hamburger').should('be.visible').click();
        cy.dataCy('footer-panel-menu-dialog')
          .should('be.visible')
          .within(() => {
            // click logout in mobile menu dialog
            cy.contains(i18n.global.t('drawerMenu.logout'))
              .should('be.visible')
              .click();
          });
        // verify redirect to login page
        cy.url().should('include', routesConf['login']['path']);
        // verify login form is visible
        cy.dataCy('form-login-email').should('be.visible');
      });
    });
  });
});

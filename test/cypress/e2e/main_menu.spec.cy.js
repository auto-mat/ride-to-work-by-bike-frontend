import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import testData from '../fixtures/mainMenuDisplayTest.json';
import mobileTestData from '../fixtures/mobileMenuDisplayTest.json';

describe('Profile page', () => {
  context('desktop - challenge may', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.task('getAppConfig', process).then((config) => {
        // intercept this campaign API
        cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
        });
        cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
          (responseIsUserOrganizationAdmin) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              responseIsUserOrganizationAdmin,
            );
          },
        );
      });
    });

    testData.forEach((test) => {
      it(`renders main menu - ${test.description}`, () => {
        // set clock to entry enabled phase start date
        cy.clock(new Date(test.currentDate), ['Date']);
        // visit home page
        cy.visit('#' + routesConf['home']['children']['fullPath']);
        // alias i18n
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // check if correct items are disabled
          test.menuItems.forEach((item) => {
            cy.dataCy('q-drawer').within(() => {
              if (item.disabled) {
                cy.dataCy('drawer-menu-item')
                  .contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                  .should('be.visible')
                  .and('have.class', 'disabled');
              } else {
                cy.dataCy('drawer-menu-item')
                  .contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
              }
            });
          });
        });
      });
    });
  });

  context('mobile - challenge may', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.task('getAppConfig', process).then((config) => {
        // intercept this campaign API
        cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
        });
      });
    });

    mobileTestData.forEach((test) => {
      it(`renders main menu - ${test.description}`, () => {
        // set clock to entry enabled phase start date
        cy.clock(new Date(test.currentDate), ['Date']);
        // visit home page
        cy.visit('#' + routesConf['home']['children']['fullPath']);
        // alias i18n
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // check if correct items are disabled
          test.menuItems.forEach((item) => {
            cy.dataCy('footer-panel').within(() => {
              if (item.disabled) {
                cy.contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                  .closest('.q-item')
                  .should('be.visible')
                  .and('have.class', 'disabled');
              } else {
                cy.contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                  .closest('.q-item')
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
              }
            });
          });
          // open pop up menu
          cy.dataCy('footer-panel-menu-hamburger').click();
          // check if correct items are disabled
          test.popUpItems.forEach((item) => {
            if (item.disabled) {
              cy.contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                .closest('.q-item')
                .should('exist')
                .and('have.class', 'disabled');
            } else {
              cy.contains(win.i18n.global.t(`drawerMenu.${item.title}`))
                .closest('.q-item')
                .should('exist')
                .and('not.have.class', 'disabled');
            }
          });
        });
      });
    });
  });
});

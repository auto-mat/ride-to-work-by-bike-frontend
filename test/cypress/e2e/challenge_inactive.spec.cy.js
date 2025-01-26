import {
  testLanguageSwitcher,
  testBackgroundImage,
  systemTimeChallengeInactive,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

/**
 * Required for localization REST API URL during e2e tests for
 * intercepting API before visiting app URL page when i18n locale
 * instance is not available for getting current lang
 */
import { defLocale } from '../../../src/i18n/def_locale';

// selectors
const selectorLoginRegisterHeader = 'login-register-header';
const selectorButtonHelp = 'button-help';
const selectorLanguageSwitcher = 'language-switcher';
const selectorChallengeInactiveInfo = 'challenge-inactive-info';
const selectorListCardPost = 'list-card-post';
const selectorSocialBar = 'social-bar';

describe('Challenge Inactive page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeInactive, ['Date']).then(() => {
        cy.viewport('macbook-16');
        cy.task('getAppConfig', process).then((config) => {
          cy.interceptThisCampaignGetApi(config, defLocale);
          // Visit the challenge inactive page
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          // alias config
          cy.wrap(config).as('config');
          // load config an i18n objects as aliases
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
          });
        });
      });
    });

    coreTests();
    testBackgroundImage();
    testLanguageSwitcher();

    it('renders login register header component', () => {
      cy.waitForThisCampaignApi();
      cy.dataCy(selectorLoginRegisterHeader).should('be.visible');
      // TODO: enable when help dialog is implemented
      cy.dataCy(selectorButtonHelp).should('not.exist');
      cy.dataCy(selectorLanguageSwitcher).should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeInactive, ['Date']).then(() => {
        cy.viewport('iphone-6');
        cy.task('getAppConfig', process).then((config) => {
          cy.interceptThisCampaignGetApi(config, defLocale);
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.wrap(config).as('config');
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
          });
        });
      });
    });

    coreTests();
  });

  function coreTests() {
    it('renders challenge inactive info component', () => {
      cy.waitForThisCampaignApi();
      cy.dataCy(selectorChallengeInactiveInfo).should('be.visible');
    });

    it('renders list card post component', () => {
      cy.waitForThisCampaignApi();
      cy.dataCy(selectorListCardPost).should('be.visible');
    });

    it('renders social bar component', () => {
      cy.waitForThisCampaignApi();
      cy.dataCy(selectorSocialBar).should('be.visible');
    });
  }
});

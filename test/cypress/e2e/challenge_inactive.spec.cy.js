import {
  testLanguageSwitcher,
  testBackgroundImage,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

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
      // Visit the challenge inactive page
      cy.visit('#' + routesConf['challenge_inactive']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testBackgroundImage();
    testLanguageSwitcher();

    it('renders login register header component', () => {
      cy.dataCy(selectorLoginRegisterHeader).should('be.visible');
      cy.dataCy(selectorButtonHelp).should('be.visible');
      cy.dataCy(selectorLanguageSwitcher).should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['challenge_inactive']['path']);
      cy.viewport('iphone-6');

      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
  });

  function coreTests() {
    it('renders challenge inactive info component', () => {
      cy.dataCy(selectorChallengeInactiveInfo).should('be.visible');
    });

    it('renders list card post component', () => {
      cy.dataCy(selectorListCardPost).should('be.visible');
    });

    it('renders social bar component', () => {
      cy.dataCy(selectorSocialBar).should('be.visible');
    });
  }
});

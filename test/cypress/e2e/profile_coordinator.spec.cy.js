import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Register Challenge - Payment step', () => {
  beforeEach(() => {
    // set system time to be in the correct active token window
    cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // visit the login page to initialize i18n
        cy.visit('#' + routesConf['login']['path']);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
          cy.interceptMyTeamGetApi(config, defLocale);
        });
      });
    });
  });

  it('renders banner for coordinator without registration', () => {
    cy.get('@config').then((config) => {
      cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            config,
            defLocale,
            response,
          );
        },
      );
      cy.fixture('apiGetRegisterChallengeProfileMissingOrganizationId').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            config,
            defLocale,
            responseRegisterChallenge,
          );
        },
      );
      cy.performAuthenticatedLogin(config, defLocale);
      // visit profile page
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.dataCy('profile-page-title').should('be.visible');
      cy.dataCy('coordinator-registration-link')
        .should('exist')
        .and('be.visible');
    });
  });

  it('does not render banner for coordinator with registration', () => {
    cy.get('@config').then((config) => {
      cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            config,
            defLocale,
            response,
          );
        },
      );
      cy.fixture('apiGetRegisterChallengeProfile').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            config,
            defLocale,
            responseRegisterChallenge,
          );
        },
      );
      cy.performAuthenticatedLogin(config, defLocale);
      // visit profile page
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.dataCy('profile-page-title').should('be.visible');
      cy.dataCy('coordinator-registration-link').should('not.exist');
    });
  });

  it('does not render banner for non-coordinator without registration', () => {
    cy.get('@config').then((config) => {
      cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            config,
            defLocale,
            response,
          );
        },
      );
      cy.fixture('apiGetRegisterChallengeProfileMissingOrganizationId').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            config,
            defLocale,
            responseRegisterChallenge,
          );
        },
      );
      cy.performAuthenticatedLogin(config, defLocale);
      // visit profile page
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.dataCy('profile-page-title').should('be.visible');
      cy.dataCy('coordinator-registration-link').should('not.exist');
    });
  });
});

import { routesConf } from '../../../src/router/routes_conf';
import {
  systemTimeChallengeActive,
  testDesktopSidebar,
  testMobileHeader,
} from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Diplomas page', () => {
  context('with diplomas available', () => {
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
            cy.fixture('apiGetRegisterChallengeProfile').then((response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
              cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                (responseIsUserOrganizationAdmin) => {
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    defLocale,
                    responseIsUserOrganizationAdmin,
                  );
                },
              );
              cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
                (responseHasOrganizationAdmin) => {
                  cy.interceptHasOrganizationAdminGetApi(
                    config,
                    defLocale,
                    response.results[0].organization_id,
                    responseHasOrganizationAdmin,
                  );
                },
              );
            });
            cy.interceptMyTeamGetApi(config, defLocale);
          });
        });
      });
    });

    context('desktop', () => {
      beforeEach(() => {
        cy.viewport('macbook-16');
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.performAuthenticatedLogin(config, i18n);
            cy.visit('#' + routesConf['diplomas']['path']);
          });
        });
      });

      coreTests();
      testDesktopSidebar();
    });

    context('mobile', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.performAuthenticatedLogin(config, i18n);
            cy.visit('#' + routesConf['diplomas']['path']);
          });
        });
      });

      coreTests();
      testMobileHeader();
    });
  });

  context('no diplomas available', () => {
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
            cy.fixture('apiGetRegisterChallengeProfile').then((response) => {
              cy.fixture('apiGetRegisterChallengeProfile.json').then(
                (response) => {
                  response.results[0].personal_details.diplomas = [];
                  cy.interceptRegisterChallengeGetApi(
                    config,
                    defLocale,
                    response,
                  );
                },
              );
              cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                (responseIsUserOrganizationAdmin) => {
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    defLocale,
                    responseIsUserOrganizationAdmin,
                  );
                },
              );
              cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
                (responseHasOrganizationAdmin) => {
                  cy.interceptHasOrganizationAdminGetApi(
                    config,
                    defLocale,
                    response.results[0].organization_id,
                    responseHasOrganizationAdmin,
                  );
                },
              );
            });
            cy.interceptMyTeamGetApi(config, defLocale);
          });
        });
      });
    });

    context('desktop', () => {
      beforeEach(() => {
        cy.viewport('macbook-16');
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.performAuthenticatedLogin(config, i18n);
            cy.visit('#' + routesConf['diplomas']['path']);
          });
        });
      });

      it('renders empty state', () => {
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('diplomas-list-empty-state')
            .should('be.visible')
            .and('contain', i18n.global.t('diplomas.textEmptyState'));
          cy.dataCy('diplomas-list-cards').should('not.exist');
        });
      });
    });
  });
});

function coreTests() {
  it('renders page heading and diploma cards with a working download link', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('diplomas-page-title')
        .should('be.visible')
        .and('contain', i18n.global.t('diplomas.titleDiplomas'));
      cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
        const diplomas = response.results[0].personal_details.diplomas;
        cy.dataCy('diplomas-list-card')
          .should('be.visible')
          .and('have.length', diplomas.length);
        cy.dataCy('diplomas-list-card').each((card, index) => {
          cy.wrap(card).should('contain', diplomas[index].name);
          cy.wrap(card).should('contain', diplomas[index].year);
        });
        // download opens diploma URL in a new tab
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen');
        });
        cy.dataCy('diplomas-list-card-button-download').first().click();
        cy.get('@windowOpen').should(
          'have.been.calledWith',
          diplomas[0].url,
          '_blank',
        );
      });
    });
  });
}

import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar, testMobileHeader } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Results page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results_detail']['children']['fullPath']);
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
        cy.interceptVerifyEmailApi(config, defLocale, {
          has_user_verified_email_address: true,
        });
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
        cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
          resultsResponses.forEach((resultsResponse) => {
            cy.interceptGetResultsApi(
              config,
              defLocale,
              resultsResponse.key,
              resultsResponse.response,
            );
          });
        });
        cy.fixture('apiGetResultsByChallengeResponses').then(
          (resultsByChallengeResponses) => {
            resultsByChallengeResponses.forEach(
              (resultsByChallengeResponse) => {
                cy.interceptGetResultsByChallengeApi(
                  config,
                  defLocale,
                  resultsByChallengeResponse.key,
                  resultsByChallengeResponse.response,
                );
              },
            );
          },
        );
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['results_detail']['children']['fullPath']);
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
    testMobileHeader();
  });
});

function coreTests() {
  it('renders page heading section', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('breadcrumb-title');
      cy.dataCy('breadcrumb-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('results.titleResults')).then((translation) => {
            expect($el.text()).to.contain(translation);
          });
        });
      cy.dataCy('breadcrumb-title-current')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(i18n.global.t('results.titleResultsYou')).then(
            (translation) => {
              expect($el.text()).to.contain(translation);
            },
          );
        });
    });
  });

  it('renders upcoming challenges section', () => {
    // upcoming challenges
    cy.dataCy('results-list').should('be.visible');
    cy.dataCy('results-tabs').should('be.visible');
  });
}

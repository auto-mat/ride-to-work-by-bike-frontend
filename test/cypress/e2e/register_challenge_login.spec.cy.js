import { systemTimeChallengeActive } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Register Challenge registration with login', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // intercept register challenge API
        cy.fixture('refreshTokensResponseChallengeActive').then(
          (refreshTokensResponseChallengeActive) => {
            cy.fixture('loginRegisterResponseChallengeActive').then(
              (loginRegisterResponseChallengeActive) => {
                cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                  config,
                  defLocale,
                  loginRegisterResponseChallengeActive,
                  null,
                  refreshTokensResponseChallengeActive,
                  null,
                  { has_user_verified_email_address: true },
                );
              },
            );
          },
        );
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        cy.fixture('apiGetDiscountCouponResponseFull.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
      });
    });
  });

  context('login and registration', () => {
    it('allows register from blank state and redirect to homepage', () => {
      // go to login page
      cy.visit('#' + routesConf['login']['children']['fullPath']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
      // log in
      cy.fillAndSubmitLoginForm();
      // wait for register challenge page to load
      cy.url().should(
        'include',
        routesConf['register_challenge']['children']['fullPath'],
      );
      // wait for register challenge GET API
      cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
        cy.waitForRegisterChallengeGetApi(response);
      });
      // fill in register challenge form
      cy.passToStep7();
      cy.dataCy('step-7-continue').should('be.visible').click();
      // get redirected to homepage
      cy.dataCy('index-title').should('be.visible');
    });

    it('should not be redirected to homepage after refreshing on step merch', () => {
      cy.get('@config').then((config) => {
        // go to login page
        cy.visit('#' + routesConf['login']['children']['fullPath']);
        // alias i18n
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
        // log in
        cy.fillAndSubmitLoginForm();
        // wait for register challenge page to load
        cy.url().should(
          'include',
          routesConf['register_challenge']['children']['fullPath'],
        );
        // wait for register challenge GET API
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.waitForRegisterChallengeGetApi(response);
        });
        // intercept register challenge GET API based on filled data
        cy.fixture('apiGetRegisterChallengeMissingMerch.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.passToStep6();
        // select merch
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="form-card-merch-link"]')
          .click();
        // close dialog
        cy.dataCy('dialog-close').click();
        // verify dialog is closed
        cy.dataCy('dialog-merch').should('not.exist');
        // add phone details
        cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then(
          (request) => {
            // fill phone number
            cy.dataCy('form-merch-phone-input')
              .should('be.visible')
              .find('input')
              .type(request.telephone);
            // opt in to info phone calls
            cy.dataCy('form-merch-phone-opt-in-input')
              .should('be.visible')
              .click();
          },
        );
        // verify registration in progress local flag is true
        cy.dataCy('debug-is-registration-in-progress-local-flag-value')
          .should('be.visible')
          .should('have.text', 'true');
        // trigger router rules
        cy.visit('#' + routesConf['home']['children']['fullPath']);
        // verify we are on register challenge page
        cy.url().should(
          'include',
          routesConf['register_challenge']['children']['fullPath'],
        );
        // go to next step
        cy.dataCy('step-6-continue').should('be.visible').click();
        // verify registration in progress local flag is false
        cy.dataCy('debug-is-registration-in-progress-local-flag-value')
          .should('be.visible')
          .should('have.text', 'false');
      });
    });

    it('should redirect user to homepage if registration is complete', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeComplete.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        // go to login page
        cy.visit('#' + routesConf['login']['children']['fullPath']);
        // log in
        cy.fillAndSubmitLoginForm();
        // wait for register challenge GET API request
        cy.fixture('apiGetRegisterChallengeComplete.json').then((response) => {
          cy.waitForRegisterChallengeGetApi(response);
        });
        // get redirected to homepage
        cy.dataCy('index-title').should('be.visible');
      });
    });

    it('should redirect user back to register challenge if registration status changes (e.g. denied as a team member)', () => {
      cy.get('@config').then((config) => {
        // override intercept register challenge GET API to challenge complete
        cy.fixture('apiGetRegisterChallengeComplete.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        // go to login page
        cy.visit('#' + routesConf['login']['children']['fullPath']);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // log in
          cy.fillAndSubmitLoginForm();
          // wait for register challenge GET API request
          cy.fixture('apiGetRegisterChallengeComplete.json').then(
            (response) => {
              cy.waitForRegisterChallengeGetApi(response);
            },
          );
          // get redirected to homepage
          cy.dataCy('index-title').should('be.visible');
          // wait for register challenge GET API request
          cy.fixture('apiGetRegisterChallengeComplete.json').then(
            (response) => {
              cy.waitForRegisterChallengeGetApi(response);
            },
          );
          // click on user select
          cy.dataCy('user-select-desktop').within(() => {
            cy.dataCy('user-select-input').should('be.visible').click();
          });
          // logout
          cy.dataCy('menu-item')
            .contains(win.i18n.global.t('userSelect.logout'))
            .click();
          // check that we are on login page
          cy.url().should('include', routesConf['login']['path']);
          // override intercept register challenge GET API to missing team
          cy.fixture('apiGetRegisterChallengeMissingTeam.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            },
          );
          // log in
          cy.fillAndSubmitLoginForm();
          // wait for register challenge GET API request
          cy.fixture('apiGetRegisterChallengeMissingTeam.json').then(
            (response) => {
              cy.waitForRegisterChallengeGetApi(response);
            },
          );
          // check that we are on register challenge page
          cy.url().should(
            'include',
            routesConf['register_challenge']['children']['fullPath'],
          );
          cy.dataCy('debug-is-registration-in-progress-local-flag-value')
            .should('be.visible')
            .should('have.text', 'true');
        });
      });
    });
  });
});

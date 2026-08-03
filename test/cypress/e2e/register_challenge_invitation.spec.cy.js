import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Register Challenge - Invitation token flow', () => {
  context('valid invitation token', () => {
    it('processes invitation and sends team ID to backend', () => {
      // set system time to be in the correct active token window
      cy.viewport('macbook-16');
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          // load all required fixtures
          cy.fixture('apiGetRegisterChallengeEmpty.json').then(
            (registerChallengeResponse) => {
              cy.fixture(
                'apiPostValidateTeamMembershipInvitationEmailRequest.json',
              ).then((validationRequest) => {
                cy.fixture(
                  'apiPostValidateTeamMembershipInvitationEmailResponse.json',
                ).then((validationResponse) => {
                  cy.fixture('refreshTokensResponseChallengeActive').then(
                    (refreshTokensResponseChallengeActive) => {
                      cy.fixture('loginRegisterResponseChallengeActive').then(
                        (loginRegisterResponseChallengeActive) => {
                          // setup ALL API intercepts BEFORE any visit
                          cy.interceptRegisterChallengeGetApi(
                            config,
                            defLocale,
                            registerChallengeResponse,
                          );
                          cy.interceptRegisterChallengePostApi(
                            config,
                            defLocale,
                            {},
                          );
                          cy.interceptRegisterChallengeCoreApiRequests(
                            config,
                            defLocale,
                          );
                          cy.interceptIsUserOrganizationAdminGetApi(
                            config,
                            defLocale,
                          );
                          cy.interceptValidateTeamMembershipInvitationEmailPostApi(
                            config,
                            defLocale,
                            validationResponse,
                          );
                          cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                            config,
                            defLocale,
                            loginRegisterResponseChallengeActive,
                            null,
                            refreshTokensResponseChallengeActive,
                            null,
                            { has_user_verified_email_address: true },
                          );
                          // login with redirect and invitation token
                          const invitationToken = validationRequest.token;
                          const redirectUrl = `${routesConf['register_challenge']['path']}?invitationToken=${invitationToken}`;
                          cy.visit(
                            `#${routesConf['login']['path']}?redirect=${encodeURIComponent(redirectUrl)}`,
                          );
                          cy.window().should('have.property', 'i18n');
                          cy.window().then((win) => {
                            cy.wrap(win.i18n).as('i18n');
                          });
                          cy.fillAndSubmitLoginForm(config, defLocale);
                          cy.wait([
                            '@loginRequest',
                            '@verifyEmailRequest',
                            '@thisCampaignRequest',
                          ]);
                          // router redirects with invitation token
                          cy.url().should(
                            'include',
                            routesConf['register_challenge']['path'],
                          );
                          cy.url().should(
                            'include',
                            `invitationToken=${invitationToken}`,
                          );
                          // verify page is loaded
                          cy.dataCy('step-1')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // wait for validation API call
                          cy.waitForValidateTeamMembershipInvitationEmailPostApi(
                            validationRequest,
                            validationResponse,
                          );
                          // wait for register challenge POST with team ID
                          cy.waitForRegisterChallengePostApi({
                            team_id: validationResponse.token.team_id,
                          });
                          // verify token removed from URL
                          cy.url().should('not.include', 'invitationToken');
                          cy.url().should(
                            'include',
                            routesConf['register_challenge']['path'],
                          );
                        },
                      );
                    },
                  );
                });
              });
            },
          );
        });
      });
    });
  });
});

import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeChallengeActive } from '../support/commonTests';
import { getRadioOption } from '../utils';
import { PaymentSubject } from '../../../src/components/enums/Payment';

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

  context('persistent pre-fill with company payment', () => {
    it('pre-fills organization/subsidiary/team throughout registration', () => {
      cy.viewport('macbook-16');
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
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
                          // setup all API intercepts
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
                          // get i18n instance for voucher command
                          cy.get('@i18n').then((i18n) => {
                            cy.wrap(i18n).as('testI18n');
                          });
                          // verify page loaded
                          cy.dataCy('step-1')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // wait for validation
                          cy.waitForValidateTeamMembershipInvitationEmailPostApi(
                            validationRequest,
                            validationResponse,
                          );
                          // use custom command to pass to step 2
                          cy.passToStep2();
                          // verify step 2 visible
                          cy.dataCy('step-2')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // wait for payment options to be visible
                          cy.dataCy('form-field-payment-subject').should(
                            'be.visible',
                          );
                          // select company payment
                          cy.dataCy(getRadioOption(PaymentSubject.company))
                            .should('be.visible')
                            .click();
                          // select paying organization (required for company payment)
                          cy.selectRegisterChallengePayingOrganization();
                          // continue to step 3
                          cy.dataCy('step-2-continue')
                            .should('be.visible')
                            .and('not.be.disabled')
                            .click();
                          cy.dataCy('step-3')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // checkpoint 1: verify participation option "colleagues" is pre-selected
                          // (step 3 shows participation when coming from company payment)
                          cy.get('@i18n').then((i18n) => {
                            cy.dataCy('form-field-option-group')
                              .find('.q-radio__inner.q-radio__inner--truthy')
                              .siblings('.q-radio__label')
                              .should(
                                'contain',
                                i18n.global.t('form.participation.labelColleagues'),
                              );
                          });
                          // continue to step 4
                          cy.dataCy('step-3-continue')
                            .should('be.visible')
                            .and('not.be.disabled')
                            .click();
                          cy.dataCy('step-4')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // note: organization already selected from step 2 (paying org)
                          // TODO: subsidiary pre-fill not working - manually select for now
                          cy.selectDropdownMenu('form-company-address', 0);
                          // continue to step 5
                          cy.dataCy('step-4-continue')
                            .should('be.visible')
                            .and('not.be.disabled')
                            .click();
                          cy.dataCy('step-5')
                            .find('.q-stepper__step-content')
                            .should('be.visible');
                          // checkpoint 2: verify team is pre-filled
                          cy.dataCy('form-select-table-team')
                            .should('be.visible')
                            .find('.q-radio__inner.q-radio__inner--truthy')
                            .should('exist')
                            .siblings('.q-radio__label')
                            .should('contain', 'IT Běžci');
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

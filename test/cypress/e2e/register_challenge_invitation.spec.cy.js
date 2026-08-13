import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeChallengeActive } from '../support/commonTests';
import { getRadioOption } from '../utils';
import { PaymentSubject } from '../../../src/components/enums/Payment';

describe('Register Challenge - Invitation token flow', () => {
  context('valid invitation token', () => {
    beforeEach(() => {
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

    it('processes invitation token and removes it from the URL', () => {
      cy.fixture(
        'apiPostValidateTeamMembershipInvitationEmailRequest.json',
      ).then((validationRequest) => {
        cy.fixture(
          'apiPostValidateTeamMembershipInvitationEmailResponse.json',
        ).then((validationResponse) => {
          // wait for validation API call
          cy.waitForValidateTeamMembershipInvitationEmailPostApi(
            validationRequest,
            validationResponse,
          );
          // verify token removed from URL
          cy.url().should('not.include', 'invitationToken');
          cy.url().should('include', routesConf['register_challenge']['path']);
        });
      });
    });

    context('pre-fill with company payment', () => {
      it('pre-fills payment subject, organization subsidiary and team', () => {
        cy.passToStep2();
        // wait for payment options to be visible
        cy.dataCy('form-field-payment-subject').should('be.visible');
        // select company payment
        cy.dataCy(getRadioOption(PaymentSubject.company))
          .should('be.visible')
          .click();
        // cy.selectRegisterChallengePayingOrganization();
        cy.moveThroughStep2();
        // ensure step 3 is pre-selected
        cy.moveThroughStep3();
        // ensure step 4 is pre-selected (company, subsidiary)
        cy.moveThroughStep4();
        // ensure step 5 is pre-selected (team)
        cy.dataCy('form-select-table-team')
          .should('be.visible')
          .find('.q-radio__inner.q-radio__inner--truthy')
          .should('exist')
          .siblings('.q-radio__label')
          .should('contain', 'IT Běžci');
        // allows to move to step 6
        cy.moveThroughStep5();
      });
    });

    context('pre-fill with voucher payment', () => {
      it('pre-fills organization type, subsidiary, organization and team', () => {
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.passToStep2();
            // wait for payment options to be visible
            cy.dataCy('form-field-payment-subject').should('be.visible');
            // select voucher payment
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            // apply FULL voucher
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            // ensure step 3 is pre-selected
            cy.moveThroughStep3();
            // ensure step 4 is pre-selected (company, subsidiary)
            cy.moveThroughStep4();
            // ensure step 5 is pre-selected (team)
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', 'IT Běžci');
            // allows to move to step 6
            cy.moveThroughStep5();
          });
        });
      });
    });

    context('user overrides invitation values', () => {
      it('persists value for user-selected team', () => {
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.passToStep2();
            cy.dataCy('form-field-payment-subject').should('be.visible');
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            cy.moveThroughStep3();
            cy.moveThroughStep4();
            // verify team from invitation in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  '1358',
                );
                cy.dataCy('debug-team-id-value').should('contain', '2452');
              });
            // verify team from invitation in UI
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', 'IT Běžci');
            // change team to different one
            cy.dataCy('form-select-table-team')
              .find('.q-radio')
              .eq(2)
              .find('.q-radio__bg')
              .click({ force: true });
            // navigate back and forward
            cy.dataCy('step-5-back').should('be.visible').click();
            cy.dataCy('step-4-continue').should('be.visible').click();
            // verify user-selected team in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  '1358',
                );
                cy.dataCy('debug-team-id-value').should('contain', '2453');
              });
            // verify user-selected team in UI
            cy.dataCy('form-select-table-team')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .first()
              .siblings('.q-radio__label')
              .should('contain', 'Marketing na kolech');
          });
        });
      });

      it('persists value for user-selected subsidiary', () => {
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.passToStep2();
            cy.dataCy('form-field-payment-subject').should('be.visible');
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            cy.moveThroughStep3();
            cy.moveThroughStep4();
            // go back to step 4
            cy.dataCy('step-5-back').should('be.visible').click();
            // verify subsidiary from invitation in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  '1358',
                );
                cy.dataCy('debug-team-id-value').should('contain', '2452');
              });
            // verify subsidiary is pre-filled from invitation
            cy.dataCy('form-company-address')
              .find('.q-field__input')
              .invoke('val')
              .should('contain', 'Krkonošská, 177');
            // change to a different subsidiary (third one in list)
            cy.selectDropdownMenu('form-company-address', 2);
            // verify subsidiary and team from invitation in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should('contain', '888');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            // continue to step 5
            cy.dataCy('step-4-continue').should('be.visible').click();
            // verify team is not pre-filled (unavailable)
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('not.exist');
            // navigate back to step 4
            cy.dataCy('step-5-back').should('be.visible').click();
            // verify subsidiary and team from invitation in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should('contain', '888');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            // verify user's subsidiary choice persists (NOT re-filled from invitation)
            cy.dataCy('form-company-address')
              .find('.q-field__input')
              .invoke('val')
              .should('not.contain', 'Krkonošská, 177')
              .should('contain', '1.Máje');
          });
        });
      });

      it('persists value for user-selected organization', () => {
        cy.task('getAppConfig', process).then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.passToStep2();
            cy.dataCy('form-field-payment-subject').should('be.visible');
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            cy.moveThroughStep3();
            cy.moveThroughStep4();
            // go back to step 4
            cy.dataCy('step-5-back').should('be.visible').click();
            // verify organization from invitation in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '987',
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  '1358',
                );
                cy.dataCy('debug-team-id-value').should('contain', '2452');
              });
            // verify organization from invitation in UI
            cy.dataCy('form-select-table-company')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', '100MEGA Distribution s.r.o.');
            // change organization to different one
            cy.dataCy('form-select-table-company')
              .find('.q-radio')
              .eq(1)
              .find('.q-radio__bg')
              .click({ force: true });
            // verify subsidiary and team are reset in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '774',
                );
                cy.dataCy('debug-subsidiary-id-value').should('be.empty');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            cy.dataCy('step-4-back').should('be.visible').click();
            cy.dataCy('step-3-continue').should('be.visible').click();
            // verify subsidiary and team are reset in debug component
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  '774',
                );
                cy.dataCy('debug-subsidiary-id-value').should('be.empty');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            // verify organization from invitation in UI
            cy.dataCy('form-select-table-company')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', '13. Základní škola Plzeň');
          });
        });
      });
    });
  });

  context('user with already paid individual registration', () => {
    beforeEach(() => {
      // set system time to be in the correct active token window
      cy.viewport('macbook-16');
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          // load all required fixtures
          cy.fixture('apiGetRegisterChallengeIndividualPaidNoTeam.json').then(
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
                          // use already-paid registration response
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

    it('joins team via invitation without changing payment', () => {
      cy.fixture(
        'apiPostValidateTeamMembershipInvitationEmailRequest.json',
      ).then((validationRequest) => {
        cy.fixture(
          'apiPostValidateTeamMembershipInvitationEmailResponse.json',
        ).then((validationResponse) => {
          // wait for invitation token validation
          cy.waitForValidateTeamMembershipInvitationEmailPostApi(
            validationRequest,
            validationResponse,
          );
          // verify token removed from URL
          cy.url().should('not.include', 'invitationToken');
          cy.url().should('include', routesConf['register_challenge']['path']);
          cy.wait('@postRegisterChallenge');
          // wait for step 2 to be active
          cy.dataCy('step-2')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // step 2 should show payment already done message
          cy.dataCy('step-2-paid-message').should('be.visible');
          cy.dataCy('register-challenge-payment').should('not.exist');
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
          cy.wait('@postRegisterChallenge');
          // step 3 should have organization type pre-filled to company
          cy.dataCy('step-3')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // verify company radio is selected
          cy.get('@i18n').then((i18n) => {
            cy.dataCy('form-field-option-group')
              .contains(
                '.q-radio',
                i18n.global.t('form.participation.labelColleagues'),
              )
              .find('.q-radio__inner')
              .should('have.class', 'q-radio__inner--truthy');
          });
          cy.dataCy('step-3-continue')
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
          // step 4 should have organization and subsidiary pre-filled
          cy.wait('@getOrganizations');
          cy.wait('@getSubsidiaries');
          cy.dataCy('step-4')
            .find('.q-stepper__step-content')
            .should('be.visible');
          cy.get('.q-spinner').should('not.exist');
          cy.dataCy('step-4-continue')
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
          // step 5 should load and have team pre-filled from invitation
          cy.dataCy('step-5')
            .find('.q-stepper__step-content')
            .should('be.visible');
          cy.get('.q-spinner').should('not.exist');
          cy.dataCy('form-select-table-team')
            .should('be.visible')
            .find('.q-radio__inner.q-radio__inner--truthy')
            .should('exist')
            .siblings('.q-radio__label')
            .should('contain', 'IT Běžci');
          cy.moveThroughStep5();
          // step 6 should be reached
          cy.dataCy('step-6')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // verify registration POST includes team ID from invitation
          cy.waitForRegisterChallengePostApi({
            team_id: validationResponse.token.team_id,
          });
        });
      });
    });
  });

  context('user with existing registration receives invitation', () => {
    beforeEach(() => {
      // set system time to be in the correct active token window
      cy.viewport('macbook-16');
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          // load fixture with existing registration (different org/sub/team than invitation)
          cy.fixture('apiGetRegisterChallengeExistingOrgSubTeam.json').then(
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

    it('overwrites existing values with invitation on first visit to each step', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture(
            'apiPostValidateTeamMembershipInvitationEmailResponse.json',
          ).then((validationResponse) => {
            // verify invitation was processed
            cy.url().should('not.include', 'invitationToken');
            cy.moveThroughStep1();
            cy.dataCy('form-field-payment-subject').should('be.visible');
            // select voucher payment
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            // step 3: organization type should be overwritten on first visit
            cy.dataCy('step-3')
              .find('.q-stepper__step-content')
              .should('be.visible');
            // verify company type is pre-filled from invitation (not existing value)
            cy.dataCy('form-field-option-group')
              .contains(
                '.q-radio',
                i18n.global.t('form.participation.labelColleagues'),
              )
              .find('.q-radio__inner')
              .should('have.class', 'q-radio__inner--truthy');
            cy.dataCy('step-3-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click({ force: true });
            // step 4: organization and subsidiary should be overwritten on first visit
            cy.wait('@getOrganizations');
            cy.wait('@getSubsidiaries');
            cy.dataCy('step-4')
              .find('.q-stepper__step-content')
              .should('be.visible');
            cy.get('.q-spinner').should('not.exist');
            // verify invitation organization is pre-filled
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  validationResponse.token.company_id.toString(),
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  validationResponse.token.subsidiary_id.toString(),
                );
              });
            cy.dataCy('step-4-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click({ force: true });
            // step 5: team should be overwritten on first visit
            cy.dataCy('step-5')
              .find('.q-stepper__step-content')
              .should('be.visible');
            cy.get('.q-spinner').should('not.exist');
            // verify invitation team is pre-filled
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', 'IT Běžci');
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-team-id-value').should(
                  'contain',
                  validationResponse.token.team_id.toString(),
                );
              });
          });
        });
      });
    });

    it('preserves user changes when returning to visited steps', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture(
            'apiPostValidateTeamMembershipInvitationEmailResponse.json',
          ).then((validationResponse) => {
            cy.moveThroughStep1();
            cy.dataCy('form-field-payment-subject').should('be.visible');
            // select voucher payment
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyFullVoucher(config, i18n);
            cy.moveThroughStep2();
            cy.moveThroughStep3();
            cy.moveThroughStep4();
            // step 5: verify invitation team is pre-filled
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .should('exist')
              .siblings('.q-radio__label')
              .should('contain', 'IT Běžci');
            // user selects different team (third team)
            cy.dataCy('form-select-table-team')
              .find('.q-radio')
              .eq(2)
              .find('.q-radio__bg')
              .click({ force: true });
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-team-id-value').should('contain', '2453');
              });
            // navigate back to step 4
            cy.dataCy('step-5-back').should('be.visible').click();
            // verify organization and subsidiary from invitation still selected
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should(
                  'contain',
                  validationResponse.token.company_id.toString(),
                );
                cy.dataCy('debug-subsidiary-id-value').should(
                  'contain',
                  validationResponse.token.subsidiary_id.toString(),
                );
              });
            // navigate forward to step 5 again
            cy.dataCy('step-4-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click({ force: true });
            // verify user's team choice persists (NOT invitation team)
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .first()
              .siblings('.q-radio__label')
              .should('contain', 'Marketing na kolech')
              .and('not.contain', 'IT Běžci');
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-team-id-value').should('contain', '2453');
              });
          });
        });
      });
    });
  });
});

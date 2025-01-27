import { routesConf } from '../../../src/router/routes_conf';
import {
  fillFormRegisterCoordinator,
  httpSuccessfullStatus,
  interceptOrganizationsApi,
  interceptRegisterCoordinatorApi,
  systemTimeChallengeActive,
  systemTimeRegistrationPhaseInactive,
  waitForOrganizationsApi,
} from '../support/commonTests';
import { OrganizationType } from '../../../src/components/types/Organization';

describe('Router rules', () => {
  context('challenge inactive', () => {
    beforeEach(() => {
      cy.clock(systemTimeRegistrationPhaseInactive, ['Date']);
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['login']['path']);

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('refreshTokensResponseChallengeInactive').then(
            (refreshTokensResponseChallengeInactive) => {
              cy.fixture('loginRegisterResponseChallengeInactive').then(
                (loginRegisterResponseChallengeInactive) => {
                  cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                    config,
                    win.i18n,
                    loginRegisterResponseChallengeInactive,
                    null,
                    refreshTokensResponseChallengeInactive,
                    null,
                    { has_user_verified_email_address: true },
                  );
                },
              );
            },
          );
        });
      });
    });

    it('before login, allows to access registration-related changes', () => {
      // access login
      cy.visit('#' + routesConf['login']['path']);
      // verify that we are on login page
      cy.url().should('include', routesConf['login']['path']);
      cy.dataCy('form-login').should('be.visible');
      // access register
      cy.visit('#' + routesConf['register']['path']);
      // verify that we are on register page
      cy.url().should('include', routesConf['register']['path']);
      cy.dataCy('form-register').should('be.visible');
      // access confirm email
      cy.visit('#' + routesConf['confirm_email']['path']);
      // verify that we are on confirm email page
      cy.fixture('confirmEmailAddressParams.json').then((params) => {
        cy.visit(
          '#' +
            routesConf['confirm_email']['path'] +
            `?key=${encodeURIComponent(params.key)}&email=${encodeURIComponent(params.email)}`,
        );
      });
      cy.dataCy('email-confirmation').should('be.visible');
      // access reset password
      cy.fixture('apiPostResetPasswordConfirmRequest.json').then((request) => {
        cy.visit(
          '#' +
            routesConf['reset_password']['path'] +
            `?uid=${encodeURIComponent(request.uid)}&token=${encodeURIComponent(request.token)}`,
        );
      });
      // verify that we are on reset password page
      cy.url().should('include', routesConf['reset_password']['path']);
      cy.dataCy('reset-password').should('be.visible');
    });

    it('after login, redirects to challenge inactive page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // try to access other pages
      cy.visit('#' + routesConf['prizes']['path']);
      cy.url().should('not.include', routesConf['prizes']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
    });

    it('after login, does not allow to access registration-related pages', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // login
      cy.visit('#' + routesConf['login']['path']);
      // verify that access is not allowed
      cy.url().should('not.include', routesConf['login']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // register
      cy.visit('#' + routesConf['register']['path']);
      // verify that access is not allowed
      cy.url().should('not.include', routesConf['register']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // confirm email
      cy.visit('#' + routesConf['confirm_email']['path']);
      // verify that access is not allowed
      cy.url().should('not.include', routesConf['confirm_email']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
      // reset password
      cy.fixture('apiPostResetPasswordConfirmRequest.json').then((request) => {
        cy.visit(
          '#' +
            routesConf['reset_password']['path'] +
            `?uid=${encodeURIComponent(request.uid)}&token=${encodeURIComponent(request.token)}`,
        );
      });
      // verify that access is not allowed
      cy.url().should('not.include', routesConf['reset_password']['path']);
      cy.url().should('include', routesConf['challenge_inactive']['path']);
    });
  });

  context('challenge active', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['login']['path']);

      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponseChallengeActive) => {
              cy.fixture('loginRegisterResponseChallengeActive').then(
                (loginRegisterResponseChallengeActive) => {
                  cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                    config,
                    win.i18n,
                    loginRegisterResponseChallengeActive,
                    null,
                    refreshTokensResponseChallengeActive,
                    null,
                    { has_user_verified_email_address: true },
                  );
                  interceptRegisterCoordinatorApi(config, win.i18n);
                  interceptOrganizationsApi(
                    config,
                    win.i18n,
                    OrganizationType.company,
                  );
                },
              );
            },
          );
        });
      });
    });

    it('after login, redirects to register-challenge page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['login']['path']);
      cy.url().should('not.include', routesConf['verify_email']['path']);
      cy.url().should('not.include', routesConf['challenge_inactive']['path']);
      cy.url().should('include', routesConf['register_challenge']['path']);
    });

    it('allows to navigate to register coordinator page', () => {
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['login']['path']);
      cy.url().should('not.include', routesConf['verify_email']['path']);
      cy.url().should('not.include', routesConf['challenge_inactive']['path']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      // shows link register as coordinator
      cy.dataCy('form-personal-details-register-as-coordinator').should(
        'be.visible',
      );
      // click link
      cy.dataCy('form-personal-details-register-as-coordinator-link')
        .should('be.visible')
        .click();
      // redirects to register coordinator page
      cy.url().should('not.include', routesConf['register_challenge'].path);
      cy.url().should('include', routesConf['register_coordinator'].path);
      // show link register as participant
      cy.dataCy('info-link-register-as-participant')
        .should('be.visible')
        .click();
      // redirects to register challenge page
      cy.url().should('not.include', routesConf['register_coordinator'].path);
      cy.url().should('include', routesConf['register_challenge'].path);
    });

    it('when coordinator registration is complete, allows to access all pages but not register-challenge', () => {
      // fill login form
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
      // go to register-coordinator page
      cy.visit('#' + routesConf['register_coordinator']['path']);
      // fill in the register-coordinator form
      cy.fixture('formFieldCompany').then((formFieldCompany) => {
        cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
          waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
          // fill in the form
          fillFormRegisterCoordinator();
          // check responsibility checkbox
          cy.dataCy('form-register-coordinator-responsibility')
            .find('.q-checkbox')
            .click();
          // prevent action on link to avoid accidental redirect
          cy.dataCy('form-register-coordinator-terms')
            .find('a')
            .then(($el) => {
              $el[0].addEventListener('click', (event) => {
                event.preventDefault();
              });
            });
          // check terms checkbox
          cy.dataCy('form-register-coordinator-terms')
            .find('.q-checkbox')
            .click();
          // reset the action on link
          cy.dataCy('form-register-coordinator-terms')
            .find('a')
            .then(($el) => {
              $el[0].removeEventListener('click', (event) => {
                event.preventDefault();
              });
            });
          // intercept isUserOrganizationAdmin API check "true"
          cy.get('@config').then((config) => {
            cy.get('@i18n').then((i18n) => {
              cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
                (response) => {
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    i18n,
                    response,
                  );
                },
              );
              // submit form
              cy.dataCy('form-register-coordinator-submit').click();
              // wait for the API call to complete
              cy.wait('@registerCoordinator').then((interception) => {
                cy.fixture('apiPostRegisterCoordinatorRequest').then(
                  (registerRequestBody) => {
                    expect(interception.request.body).to.deep.equal(
                      registerRequestBody,
                    );
                    expect(interception.response.statusCode).to.equal(
                      httpSuccessfullStatus,
                    );
                  },
                );
              });
              // check if redirected to homepage
              cy.dataCy('index-title').should('be.visible');
              // `register_coordinator` URL is no longer accessible
              cy.visit('#' + routesConf['register_coordinator']['path']);
              cy.url().should(
                'not.include',
                routesConf['register_coordinator']['path'],
              );
              // redirects to home page
              cy.dataCy('index-title').should('be.visible');
              // `routes` URL is not accessible
              cy.visit('#' + routesConf['routes']['path']);
              cy.url().should('not.include', routesConf['routes']['path']);
              // redirects to home page
              cy.dataCy('index-title').should('be.visible');
              // click on user select
              cy.dataCy('user-select-desktop').within(() => {
                cy.dataCy('user-select-input').should('be.visible').click();
              });
              // logout
              cy.dataCy('menu-item')
                .contains(i18n?.global.t('userSelect.logout'))
                .click();
              // redirected to login page
              cy.url().should('include', routesConf['login']['path']);
              // login
              cy.fillAndSubmitLoginForm();
              cy.wait([
                '@loginRequest',
                '@verifyEmailRequest',
                '@thisCampaignRequest',
              ]);
              cy.url().should(
                'not.include',
                routesConf['register_challenge']['path'],
              );
              cy.dataCy('index-title').should('be.visible');
            });
          });
        });
      });
    });

    it('when registration is empty (not started), does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeEmpty').then((emptyResponse) => {
            // intercept register-challenge GET request with incomplete registration
            cy.interceptRegisterChallengeGetApi(
              config,
              i18n,
              emptyResponse,
              null,
            );
          });
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when company registration with no admission, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
            (response) => {
              // intercept register-challenge GET request with incomplete registration
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when company registration waiting for payment, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when individual registration is not paid, does not allow to access any pages except register-challenge', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('include', routesConf['register_challenge']['path']);
      cy.testAccessRegisterChallengeOnly();
    });

    it('when individual registration is complete, allows to access all pages but not register-challenge nor register-coordinator', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetRegisterChallengeIndividualPaidComplete').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, i18n, response, null);
            },
          );
        });
      });
      cy.fillAndSubmitLoginForm();
      cy.wait(['@loginRequest', '@verifyEmailRequest', '@thisCampaignRequest']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // test that we are on home page
      cy.dataCy('index-title').should('be.visible');
      // try accessing register-challenge page
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // redirects to home page
      cy.dataCy('index-title').should('be.visible');
      // go to profile page
      cy.visit('#' + routesConf['profile']['path']);
      cy.url().should('include', routesConf['profile']['path']);
      cy.dataCy('profile-page-title').should('be.visible');
      // try accessing register-challenge page again
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.url().should('not.include', routesConf['register_challenge']['path']);
      // redirects to home page
      cy.dataCy('index-title').should('be.visible');
      // try accessing register-coordinator page
      cy.visit('#' + routesConf['register_coordinator']['path']);
      cy.url().should(
        'not.include',
        routesConf['register_coordinator']['path'],
      );
      // redirects to home page
      cy.dataCy('index-title').should('be.visible');
    });
  });
});

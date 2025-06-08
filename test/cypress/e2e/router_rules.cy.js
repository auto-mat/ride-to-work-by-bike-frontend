import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
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
import loginTokensTestData from '../../../test/cypress/fixtures/loginTokensTestData.json';
import AppAccessTestData from '../../../test/cypress/fixtures/appAccessTestData.json';

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
              cy.fixture('apiGetRegisterChallengeEmpty.json').then(
                (response) => {
                  cy.interceptRegisterChallengeGetApi(
                    config,
                    win.i18n,
                    response,
                  );
                },
              );
              cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                (response) => {
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    win.i18n,
                    response,
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
          cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
            cy.interceptRegisterChallengeGetApi(config, win.i18n, response);
          });
          cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
            (response) => {
              cy.interceptIsUserOrganizationAdminGetApi(
                config,
                win.i18n,
                response,
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

  AppAccessTestData.forEach((test) => {
    test.dates.forEach((date) => {
      it(`Access: ${test.description}; ${date}`, () => {
        cy.viewport('macbook-16');
        cy.clock(new Date(date), ['Date']);
        cy.task('getAppConfig', process).then((config) => {
          if (loginTokensTestData[date]) {
            cy.fixture(test.fixtureCampaign).then((campaignResponse) => {
              cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                config,
                defLocale,
                loginTokensTestData[date].loginResponse,
                null,
                loginTokensTestData[date].refreshResponse,
                null,
                { has_user_verified_email_address: true },
                null,
                campaignResponse,
                null,
              );
            });
            cy.fixture(test.fixtureRegisterChallenge).then(
              (registerChallengeResponse) => {
                cy.interceptRegisterChallengeGetApi(
                  config,
                  defLocale,
                  registerChallengeResponse,
                );
              },
            );
            cy.fixture(test.fixtureOrganizationAdmin).then(
              (organizationAdminResponse) => {
                cy.interceptIsUserOrganizationAdminGetApi(
                  config,
                  defLocale,
                  organizationAdminResponse,
                );
              },
            );
            cy.interceptMyTeamGetApi(config, defLocale);
            cy.interceptCitiesGetApi(config, defLocale);

            cy.visit('#' + routesConf['login']['path']);
            cy.fillAndSubmitLoginForm();
            cy.wait([
              '@loginRequest',
              '@verifyEmailRequest',
              '@thisCampaignRequest',
            ]);

            // test access
            if (test.access === 'challenge_inactive') {
              // test that we are on challenge inactive page
              cy.url().should(
                'include',
                routesConf['challenge_inactive']['path'],
              );
              // test access to other pages
              cy.verifyRouteAccessDeniedFromInitial(
                'login',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'register',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'verify_email',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'reset_password',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'register_challenge',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'register_coordinator',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'routes_list',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'results',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'prizes',
                'challenge_inactive',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'profile_details',
                'challenge_inactive',
              );
            }
            if (test.access === 'app_full') {
              // home page title
              cy.dataCy('index-title').should('be.visible');
              cy.verifyRouteAccessDeniedFromInitial('login', 'home');
              cy.verifyRouteAccessDeniedFromInitial('register', 'home');
              cy.verifyRouteAccessDeniedFromInitial('verify_email', 'home');
              cy.verifyRouteAccessDeniedFromInitial('reset_password', 'home');
              cy.verifyRouteAccessDeniedFromInitial(
                'register_challenge',
                'home',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'register_coordinator',
                'home',
              );
              cy.verifyRouteAccessAllowedFromInitial('prizes', 'home');
              cy.verifyRouteAccessAllowedFromInitial('profile', 'prizes');
            }
            if (test.access === 'register_challenge') {
              // test that we are on register challenge page
              cy.url().should(
                'include',
                routesConf['register_challenge']['path'],
              );
              // test access to other pages
              cy.verifyRouteAccessDeniedFromInitial(
                'login',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'register',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'verify_email',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'reset_password',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'routes_list',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'results',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'prizes',
                'register_challenge',
              );
              cy.verifyRouteAccessDeniedFromInitial(
                'profile_details',
                'register_challenge',
              );
              cy.verifyRouteAccessAllowedFromInitial(
                'register_coordinator',
                'register_challenge',
              );
            }
            if (test.access === 'app_full_register-challenge') {
              // home page title
              cy.dataCy('index-title').should('be.visible');
              cy.verifyRouteAccessDeniedFromInitial('login', 'home');
              cy.verifyRouteAccessDeniedFromInitial('register', 'home');
              cy.verifyRouteAccessDeniedFromInitial('verify_email', 'home');
              cy.verifyRouteAccessDeniedFromInitial(
                'register_coordinator',
                'home',
              );
              cy.verifyRouteAccessAllowedFromInitial('prizes', 'home');
              cy.verifyRouteAccessAllowedFromInitial('profile', 'prizes');
            }
            // test access to routes via checking menu item disabled state
            if (
              ['app_full', 'app_full_register-challenge'].includes(test.access)
            ) {
              cy.window().should('have.property', 'i18n');
              cy.window().then((win) => {
                if (test.accessRoutes) {
                  cy.dataCy('drawer-menu-item')
                    .contains(win.i18n.global.t('drawerMenu.routes'))
                    .should('be.visible')
                    .and('not.have.class', 'disabled');
                } else {
                  cy.dataCy('drawer-menu-item')
                    .contains(win.i18n.global.t('drawerMenu.routes'))
                    .should('be.visible')
                    .and('have.class', 'disabled');
                }
              });
            }
          }
        });
      });
    });
  });
});

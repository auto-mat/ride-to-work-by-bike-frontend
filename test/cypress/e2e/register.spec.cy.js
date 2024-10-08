import {
  testLanguageSwitcher,
  testBackgroundImage,
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
  systemTime,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';

// selectors
const selectorFormRegisterPrivacyConsent = 'form-register-privacy-consent';
const selectorFormRegisterEmail = 'form-register-email';
const selectorFormRegisterPasswordInput = 'form-register-password-input';
const selectorFormRegisterPasswordConfirmInput =
  'form-register-password-confirm-input';
const selectorFormRegisterSubmit = 'form-register-submit';
const selectorFormLoginEmail = 'form-login-email';
const selectorFormLoginPasswordInput = 'form-login-password-input';
const selectorFormLoginSubmit = 'form-login-submit-login';
const selectorIndexTitle = 'index-title';
const selectorRoutesPageTitle = 'routes-page-title';
const selectorResultsPageTitle = 'results-page-title';
const selectorCommunityPageTitle = 'community-page-title';
const selectorPrizesPageTitle = 'prizes-page-title';
const selectorProfilePageTitle = 'profile-page-title';

// variables
const testEmail = 'test@example.com';
const testPassword = 'validPassword123';

describe('Register page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['register']['path']);
      cy.viewport('macbook-16');
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

    testBackgroundImage();

    it('renders page header', () => {
      cy.dataCy('login-register-header').should('be.visible');
    });

    testLanguageSwitcher();

    it('renders register form', () => {
      cy.dataCy('form-register').should('be.visible');
    });

    it('renders page title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('form-register-title')
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.titleRegister')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
      });
    });

    it('renders coordinator registration link', () => {
      cy.dataCy('form-register-coordinator-link')
        .should('be.visible')
        .invoke('attr', 'href')
        .should('contain', routesConf['register_coordinator']['path']);
    });

    it('renders login link', () => {
      cy.dataCy('form-register-login-link')
        .should('be.visible')
        .invoke('attr', 'href')
        .should('contain', routesConf['login']['path']);
    });

    it('shows error message on registration failure', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // variables
          const { apiBase, apiDefaultLang, urlApiRegister } = config;
          const apiBaseUrl = getApiBaseUrlWithLang(
            null,
            apiBase,
            apiDefaultLang,
            i18n,
          );
          const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpInternalServerErrorStatus,
            body: { message: 'Registration failed' },
          }).as('registerRequest');
          // fill form
          cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
          cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
          cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(
            testPassword,
          );
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          cy.dataCy(selectorFormRegisterSubmit).click();
          // wait for request to complete
          cy.wait('@registerRequest');
          // check error message
          cy.get('@i18n').then((i18n) => {
            cy.contains(
              i18n.global.t('register.apiMessageErrorWithMessage'),
            ).should('be.visible');
          });
        });
      });
    });

    // ! router redirection rules are enabled for this file in /router/index.ts
    it('allows user to register with valid credentials and requires email verification to access other pages', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // variables
          const {
            apiBase,
            apiDefaultLang,
            urlApiHasUserVerifiedEmail,
            urlApiLogin,
            urlApiRefresh,
            urlApiRegister,
          } = config;
          const apiBaseUrl = getApiBaseUrlWithLang(
            null,
            apiBase,
            apiDefaultLang,
            i18n,
          );
          const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
          const apiEmailVerificationUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpSuccessfullStatus,
            body: { email: testEmail },
          }).as('registerRequest');
          // intercept email verification request
          cy.intercept('POST', apiEmailVerificationUrl, {
            statusCode: httpSuccessfullStatus,
            body: { validated: false },
          }).as('emailVerificationRequest');
          // fill form
          cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
          cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
          cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(
            testPassword,
          );
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          cy.dataCy(selectorFormRegisterSubmit).click();
          // wait for request to complete
          cy.wait('@registerRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
              password: testPassword,
            });
            expect(interception.response.body).to.deep.equal({
              email: testEmail,
            });
          });
          // check success message
          cy.get('@i18n').then((i18n) => {
            cy.contains(i18n.global.t('register.apiMessageSuccess')).should(
              'be.visible',
            );
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          cy.wait('@emailVerificationRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
            });
            expect(interception.response.body).to.deep.equal({
              validated: false,
            });
          });

          // test navigating to app pages (not logged in and email not verified)
          // routes page
          cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
          cy.url().should(
            'not.contain',
            routesConf['routes_calendar']['children']['fullPath'],
          );
          cy.url().should('contain', routesConf['login']['path']);
          // results page
          cy.visit('#' + routesConf['results']['path']);
          cy.url().should('not.contain', routesConf['results']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          // community page
          cy.visit('#' + routesConf['community']['path']);
          cy.url().should('not.contain', routesConf['community']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          // prizes page
          cy.visit('#' + routesConf['prizes']['path']);
          cy.url().should('not.contain', routesConf['prizes']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          // profile page
          cy.visit('#' + routesConf['profile_details']['path']);
          cy.url().should('not.contain', routesConf['profile_details']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          // test navigating to login and register page (this is allowed when email not verified and not logged in)
          cy.visit('#' + routesConf['login']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          cy.visit('#' + routesConf['register']['path']);
          cy.url().should('contain', routesConf['register']['path']);
          // test navigating to verify email page (this is allowed when email not verified)
          cy.visit('#' + routesConf['verify_email']['path']);
          cy.url().should('contain', routesConf['verify_email']['path']);

          // test email not verified state after logging in
          cy.visit('#' + routesConf['login']['path']);
          cy.url().should('contain', routesConf['login']['path']);
          // intercept login request
          cy.fixture('loginResponse.json').then((loginResponse) => {
            // intercept API call
            const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
            cy.intercept('POST', apiLoginUrl, {
              statusCode: httpSuccessfullStatus,
              body: loginResponse,
            }).as('loginRequest');
            cy.fixture('refreshTokensResponse.json').then(
              (refreshTokensResponse) => {
                // intercept refresh tokens request
                const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
                cy.intercept('POST', apiRefreshUrl, {
                  statusCode: httpSuccessfullStatus,
                  body: refreshTokensResponse,
                }).as('refreshTokens');
                cy.clock().then((clock) => {
                  clock.setSystemTime(systemTime);
                  // login
                  cy.dataCy(selectorFormLoginEmail)
                    .find('input')
                    .type(testEmail);
                  cy.dataCy(selectorFormLoginPasswordInput).type(testPassword);
                  cy.dataCy(selectorFormLoginSubmit).click();
                  // wait for login request to complete
                  cy.wait('@loginRequest').then(() => {
                    // redirected to verify email page
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );

                    // test navigating to app pages (logged in and email not verified)
                    cy.visit(
                      '#' +
                        routesConf['routes_calendar']['children']['fullPath'],
                    );
                    cy.url().should(
                      'not.contain',
                      routesConf['routes_calendar']['children']['fullPath'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // results page
                    cy.visit('#' + routesConf['results']['path']);
                    cy.url().should(
                      'not.contain',
                      routesConf['results']['path'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // community page
                    cy.visit('#' + routesConf['community']['path']);
                    cy.url().should(
                      'not.contain',
                      routesConf['community']['path'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // prizes page
                    cy.visit('#' + routesConf['prizes']['path']);
                    cy.url().should(
                      'not.contain',
                      routesConf['prizes']['path'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // profile page
                    cy.visit('#' + routesConf['profile_details']['path']);
                    cy.url().should(
                      'not.contain',
                      routesConf['profile_details']['path'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // test navigating to login and register page (this is NOT allowed when email not verified and logged in)
                    cy.visit('#' + routesConf['login']['path']);
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    cy.visit('#' + routesConf['register']['path']);
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    // test navigating to verify email page (this is allowed when email not verified)
                    cy.visit('#' + routesConf['verify_email']['path']);
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                  });
                });
              },
            );
          });
        });
      });
    });

    it('redirects to login page after registering and verifying email', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // variables
          const {
            apiBase,
            apiDefaultLang,
            urlApiHasUserVerifiedEmail,
            urlApiRegister,
          } = config;
          const apiBaseUrl = getApiBaseUrlWithLang(
            null,
            apiBase,
            apiDefaultLang,
            i18n,
          );
          const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
          const apiEmailVerificationUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpSuccessfullStatus,
            body: { email: testEmail },
          }).as('registerRequest');
          // intercept email verification request
          cy.intercept('POST', apiEmailVerificationUrl, {
            statusCode: httpSuccessfullStatus,
            body: { validated: false },
          }).as('emailVerificationRequest');
          // fill form
          cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
          cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
          cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(
            testPassword,
          );
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          cy.dataCy(selectorFormRegisterSubmit).click();
          // wait for request to complete
          cy.wait('@registerRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
              password: testPassword,
            });
            expect(interception.response.body).to.deep.equal({
              email: testEmail,
            });
          });
          // check success message
          cy.get('@i18n').then((i18n) => {
            cy.contains(i18n.global.t('register.apiMessageSuccess')).should(
              'be.visible',
            );
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          // wait for email verification request to complete
          cy.wait('@emailVerificationRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
            });
            expect(interception.response.body).to.deep.equal({
              validated: false,
            });
          });
          // update email verification request
          // intercept email verification request
          cy.intercept('POST', apiEmailVerificationUrl, {
            statusCode: httpSuccessfullStatus,
            body: { validated: true },
          }).as('emailVerificationRequest');
          cy.reload();
          cy.wait('@emailVerificationRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
            });
            expect(interception.response.body).to.deep.equal({
              validated: true,
            });
          });
          // redirected to login page
          cy.url().should('contain', routesConf['login']['path']);
        });
      });
    });

    it('redirects to home after registering, logging in and verifying email', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // variables
          const {
            apiBase,
            apiDefaultLang,
            urlApiHasUserVerifiedEmail,
            urlApiLogin,
            urlApiRefresh,
            urlApiRegister,
          } = config;
          const apiBaseUrl = getApiBaseUrlWithLang(
            null,
            apiBase,
            apiDefaultLang,
            i18n,
          );
          const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
          const apiEmailVerificationUrl = `${apiBaseUrl}${urlApiHasUserVerifiedEmail}`;
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpSuccessfullStatus,
            body: { email: testEmail },
          }).as('registerRequest');
          // intercept email verification request
          cy.intercept('POST', apiEmailVerificationUrl, {
            statusCode: httpSuccessfullStatus,
            body: { validated: false },
          }).as('emailVerificationRequest');
          // fill form
          cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
          cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
          cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(
            testPassword,
          );
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          // submit register form
          cy.dataCy(selectorFormRegisterSubmit).click();
          // wait for request to complete
          cy.wait('@registerRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
              password: testPassword,
            });
            expect(interception.response.body).to.deep.equal({
              email: testEmail,
            });
          });
          // redirect to verify email page
          cy.url().should('contain', routesConf['verify_email']['path']);
          // wait for email verification request to complete
          cy.wait('@emailVerificationRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
            });
            expect(interception.response.body).to.deep.equal({
              validated: false,
            });
          });
          // login
          cy.visit('#' + routesConf['login']['path']);
          // update email verification request
          // intercept email verification request
          cy.intercept('POST', apiEmailVerificationUrl, {
            statusCode: httpSuccessfullStatus,
            body: { validated: true },
          }).as('emailVerificationRequest');
          cy.fixture('loginResponse.json').then((loginResponse) => {
            // intercept login request
            const apiLoginUrl = `${apiBaseUrl}${urlApiLogin}`;
            cy.intercept('POST', apiLoginUrl, {
              statusCode: httpSuccessfullStatus,
              body: loginResponse,
            }).as('loginRequest');
            cy.fixture('refreshTokensResponse.json').then(
              (refreshTokensResponse) => {
                // intercept refresh tokens request
                const apiRefreshUrl = `${apiBaseUrl}${urlApiRefresh}`;
                cy.intercept('POST', apiRefreshUrl, {
                  statusCode: httpSuccessfullStatus,
                  body: refreshTokensResponse,
                }).as('refreshTokens');
                cy.clock().then((clock) => {
                  clock.setSystemTime(systemTime);
                  // login
                  cy.dataCy(selectorFormLoginEmail)
                    .find('input')
                    .type(testEmail);
                  cy.dataCy(selectorFormLoginPasswordInput).type(testPassword);
                  cy.dataCy(selectorFormLoginSubmit).click();
                  // wait for login request to complete
                  cy.wait('@loginRequest').then(() => {
                    // redirected to email verification page
                    cy.url().should(
                      'contain',
                      routesConf['verify_email']['path'],
                    );
                    cy.reload();
                    cy.wait('@emailVerificationRequest').then(
                      (interception) => {
                        expect(interception.request.body).to.deep.equal({
                          email: testEmail,
                        });
                        expect(interception.response.body).to.deep.equal({
                          validated: true,
                        });
                      },
                    );
                    // redirected to home page
                    cy.url().should('contain', routesConf['home']['path']);
                    cy.dataCy(selectorIndexTitle).should('be.visible');
                    // test navigating to app pages (logged in and verified email)
                    cy.visit(
                      '#' +
                        routesConf['routes_calendar']['children']['fullPath'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['routes_calendar']['children']['fullPath'],
                    );
                    cy.dataCy(selectorRoutesPageTitle).should('be.visible');
                    // results page
                    cy.visit('#' + routesConf['results']['path']);
                    cy.url().should('contain', routesConf['results']['path']);
                    cy.dataCy(selectorResultsPageTitle).should('be.visible');
                    // community page
                    cy.visit('#' + routesConf['community']['path']);
                    cy.url().should('contain', routesConf['community']['path']);
                    cy.dataCy(selectorCommunityPageTitle).should('be.visible');
                    // prizes page
                    cy.visit('#' + routesConf['prizes']['path']);
                    cy.url().should('contain', routesConf['prizes']['path']);
                    cy.dataCy(selectorPrizesPageTitle).should('be.visible');
                    // profile page
                    cy.visit(
                      '#' +
                        routesConf['profile_details']['children']['fullPath'],
                    );
                    cy.url().should(
                      'contain',
                      routesConf['profile_details']['children']['fullPath'],
                    );
                    cy.dataCy(selectorProfilePageTitle).should('be.visible');
                    // test navigating to login and register page (this is NOT allowed when logged in and verified email)
                    cy.visit('#' + routesConf['login']['path']);
                    cy.url().should('contain', routesConf['home']['path']);
                    cy.dataCy(selectorIndexTitle).should('be.visible');
                    cy.visit('#' + routesConf['register']['path']);
                    cy.url().should('contain', routesConf['home']['path']);
                    cy.dataCy(selectorIndexTitle).should('be.visible');
                    // test navigating to verify email page (this is NOT allowed when logged in and verified email)
                    cy.visit('#' + routesConf['verify_email']['path']);
                    cy.url().should('contain', routesConf['home']['path']);
                    cy.dataCy(selectorIndexTitle).should('be.visible');
                  });
                });
              },
            );
          });
        });
      });
    });
  });
});

import {
  fillFormRegisterCoordinator,
  httpSuccessfullStatus,
  interceptOrganizationsApi,
  interceptRegisterCoordinatorApi,
  testLanguageSwitcher,
  testBackgroundImage,
  waitForOrganizationsApi,
  systemTimeChallengeActive,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { OrganizationType } from '../../../src/components/types/Organization';

describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['register_coordinator']['path']);
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
    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      // TODO: enable when help dialog is implemented
      cy.dataCy('button-help').should('not.exist');
      cy.dataCy('language-switcher').should('be.visible');
    });

    it('renders page title', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('register-coordinator-title')
            .should('be.visible')
            .and('have.color', config.colorWhite)
            .and('have.css', 'font-size', '24px')
            .and('have.css', 'font-weight', '700')
            .then(($el) => {
              cy.wrap(
                i18n.global.t(
                  `register.coordinator.title.${config.challengeMonth}`,
                ),
              ).then((translation) => {
                // test v-html content
                const htmlContent = $el.html();
                expect(htmlContent).to.equal(translation);
              });
            });
        });
      });
    });

    it('renders info card', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('info-card')
            .should('be.visible')
            .and('have.backgroundColor', config.colorSecondary)
            .and('have.css', 'border-radius', config.borderRadiusCard);
          cy.dataCy('info-title')
            .should('be.visible')
            .and('have.css', 'font-size', '16px')
            .and('have.css', 'font-weight', '700')
            .then(($el) => {
              cy.wrap(i18n.global.t('register.coordinator.titleInfo')).then(
                (translation) => {
                  expect($el.text()).to.equal(translation);
                },
              );
            });
          cy.dataCy('info-content')
            .should('be.visible')
            .and('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .then(($el) => {
              cy.wrap(i18n.global.t('register.coordinator.info')).then(
                (translation) => {
                  // test v-html content
                  const htmlContent = $el.html();
                  expect(htmlContent).to.equal(translation);
                },
              );
            });
          cy.dataCy('info-link-register-as-participant')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('register.form.linkRegisterAsParticipant'),
            )
            .invoke('attr', 'href')
            .should('contain', routesConf['register_challenge'].path);
        });
      });
    });
  });

  context('desktop with API intercepts', () => {
    beforeEach(() => {
      /**
       * Visit login page so that we can setup the API intercepts.
       * The setup needs config and i18n objects to be initialized.
       */
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // Visit the login page to initialize i18n
        cy.visit('#' + routesConf['login']['path']);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponseChallengeActive) => {
              cy.fixture('loginRegisterResponseChallengeActive').then(
                (loginRegisterResponseChallengeActive) => {
                  // Set up API intercepts
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
                  cy.interceptIsUserOrganizationAdminGetApi(config, win.i18n);
                  cy.fillAndSubmitLoginForm(config, win.i18n);
                  cy.wait([
                    '@loginRequest',
                    '@refreshAuthTokenRequest',
                    '@verifyEmailRequest',
                    '@thisCampaignRequest',
                    '@getIsUserOrganizationAdmin',
                  ]);
                  cy.visit('#' + routesConf['register_coordinator']['path']);
                },
              );
            },
          );
        });
      });
    });

    it('fills in the form, submits it, and redirects to homepage on success', () => {
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
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
                  // check if redirected to homepage
                  cy.url().should('include', routesConf['home']['path']);
                },
              );
            });
          });
        });
      });
    });
  });
});

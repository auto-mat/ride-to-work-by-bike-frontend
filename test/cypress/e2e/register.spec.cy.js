import {
  testLanguageSwitcher,
  testBackgroundImage,
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';

const selectorFormRegisterPrivacyConsent = 'form-register-privacy-consent';

describe('Register page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['register']['path']);
      cy.viewport('macbook-16');

      // load config and i18n objects as aliases
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

    it('allows user to register with valid credentials', () => {
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
          const testEmail = 'test@example.com';
          const testPassword = 'validPassword123';
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpSuccessfullStatus,
            body: { email: testEmail },
          }).as('registerRequest');
          // fill form
          cy.dataCy('form-register-email').find('input').type(testEmail);
          cy.dataCy('form-register-password-input').type(testPassword);
          cy.dataCy('form-register-password-confirm-input').type(testPassword);
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          cy.dataCy('form-register-submit').click();
          // wait for request to complete
          cy.wait('@registerRequest').then((interception) => {
            expect(interception.request.body).to.deep.equal({
              email: testEmail,
              password: testPassword,
            });
          });
          // check success message
          cy.get('@i18n').then((i18n) => {
            cy.contains(i18n.global.t('register.apiMessageSuccess')).should(
              'be.visible',
            );
          });
          // email confirmation
          cy.dataCy('email-confirmation').should('be.visible');
        });
      });
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
          const testEmail = 'test@example.com';
          const testPassword = 'validPassword123';
          // intercept register request
          cy.intercept('POST', apiRegisterUrl, {
            statusCode: httpInternalServerErrorStatus,
            body: { message: 'Registration failed' },
          }).as('registerRequest');
          // fill form
          cy.dataCy('form-register-email').find('input').type(testEmail);
          cy.dataCy('form-register-password-input').type(testPassword);
          cy.dataCy('form-register-password-confirm-input').type(testPassword);
          // accept privacy policy
          cy.dataCy(selectorFormRegisterPrivacyConsent)
            .should('be.visible')
            .click('topLeft');
          cy.dataCy('form-register-submit').click();
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
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['register']['path']);
      cy.viewport('iphone-6');
    });

    // Add mobile-specific tests if needed
  });
});

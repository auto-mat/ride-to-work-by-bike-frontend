import { testBackgroundImage } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { HttpStatusCode } from 'axios';

const selectorResetPassword = 'reset-password';
const selectorResetPasswordTitle = 'reset-password-title';
const selectorResetPasswordText = 'reset-password-text';
const selectorFormResetPassword = 'form-reset-password-input';
const selectorFormResetPasswordConfirm = 'form-reset-password-confirm-input';
const selectorFormResetPasswordSubmit = 'form-reset-password-submit';

describe('Reset Password', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('apiPostResetPasswordConfirmRequest.json').then((request) => {
        cy.visit(
          '#' +
            routesConf['reset_password']['path'] +
            `?uid=${encodeURIComponent(request.uid)}&token=${encodeURIComponent(request.token)}`,
        );
      });
      cy.viewport('macbook-16');

      // load config and i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
          // intercept the reset password API call
          cy.interceptResetPasswordConfirmApi(config, win.i18n);
        });
      });
    });

    testBackgroundImage();

    it('renders page container', () => {
      cy.dataCy(selectorResetPassword).should('be.visible');
    });

    it('renders page title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy(selectorResetPasswordTitle)
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.titleResetPassword')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
      });
    });

    it('renders reset password text', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy(selectorResetPasswordText)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.textResetPassword')).then(
              (translation) => {
                expect($el.text().trim()).to.equal(translation);
              },
            );
          });
      });
    });

    it('renders password input fields and submit button', () => {
      cy.dataCy(selectorFormResetPassword).should('be.visible');
      cy.dataCy(selectorFormResetPasswordConfirm).should('be.visible');
      cy.dataCy(selectorFormResetPasswordSubmit).should('be.visible');
    });

    it('submits form successfully and redirects to login', () => {
      cy.fixture('apiPostResetPasswordConfirmRequest').then((request) => {
        // fill in the form
        cy.dataCy(selectorFormResetPassword).type(request.new_password1);
        cy.dataCy(selectorFormResetPasswordConfirm).type(request.new_password2);
        // submit form
        cy.dataCy(selectorFormResetPasswordSubmit).click();
        // wait for API call and verify request
        cy.waitForResetPasswordConfirmApi();
        // verify form is cleared
        cy.dataCy(selectorFormResetPassword).should('have.value', '');
        cy.dataCy(selectorFormResetPasswordConfirm).should('have.value', '');
        // verify success notification
        cy.fixture('apiPostResetPasswordConfirmResponseSuccess.json').then(
          (responseBody) => {
            cy.contains(responseBody.detail).should('be.visible');
          },
        );
        // verify redirect to login page
        cy.url().should('contain', routesConf['login']['path']);
      });
    });

    it('displays error message on API failure', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.interceptResetPasswordConfirmApi(
            config,
            i18n,
            null,
            HttpStatusCode.BadRequest,
          );
          cy.fixture('apiPostResetPasswordConfirmRequest').then((request) => {
            // fill in the form
            cy.dataCy(selectorFormResetPassword).type(request.new_password1);
            cy.dataCy(selectorFormResetPasswordConfirm).type(
              request.new_password2,
            );
            // submit form
            cy.dataCy(selectorFormResetPasswordSubmit).click();
            // wait for API call
            cy.waitForResetPasswordConfirmApi();
            // verify error notification
            cy.contains(
              i18n.global.t('resetPasswordConfirm.apiMessageErrorWithMessage'),
            ).should('be.visible');
            // verify URL hasn't changed
            cy.url().should('contain', routesConf['reset_password']['path']);
          });
        });
      });
    });
  });
});

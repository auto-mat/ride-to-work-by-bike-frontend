import { testBackgroundImage } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

describe('Email confirmation', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['verify_email']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
          // intercept send registration confirmation email POST API
          cy.interceptSendRegistrationConfirmationEmailPostApi(
            config,
            win.i18n,
          );
        });
      });
    });

    testBackgroundImage();

    it('renders page header', () => {
      cy.dataCy('login-register-header').should('be.visible');
    });

    it('renders page text content', () => {
      cy.get('@i18n').then((i18n) => {
        // title
        cy.dataCy('email-verification-title')
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.titleEmailVerification')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
        // text
        cy.dataCy('email-verification-text')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.textEmailVerification')).then(
              (translation) => {
                expect($el.html()).to.contain(translation);
              },
            );
          });
        // wrong email hint
        cy.dataCy('email-verification-wrong-email-hint')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.hintWrongEmail')).then(
              (translation) => {
                expect($el.html()).to.contain(translation);
              },
            );
          });
      });
    });

    it('renders email resend button and shows success message on successful submit', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('email-verification-resend-button')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('register.form.buttonResendConfirmationEmail'),
          )
          .click();
        // wait for API response
        cy.waitForSendRegistrationConfirmationEmailPostApi();
        // success message is visible
        cy.contains(
          i18n.global.t('sendRegistrationConfirmationEmail.apiMessageSuccess'),
        ).should('be.visible');
      });
    });

    it('show info message when email already confirmed', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // override registration confirmation email POST API intercept
          cy.fixture(
            'apiPostSendRegistrationConfirmationEmailResponseFalse.json',
          ).then((response) => {
            cy.interceptSendRegistrationConfirmationEmailPostApi(
              config,
              i18n,
              response,
            );
            cy.dataCy('email-verification-resend-button')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t('register.form.buttonResendConfirmationEmail'),
              )
              .click();
            // wait for API response
            cy.waitForSendRegistrationConfirmationEmailPostApi(response);
            // info message is visible
            cy.contains(
              i18n.global.t(
                'sendRegistrationConfirmationEmail.apiMessageAlreadyConfirmed',
              ),
            ).should('be.visible');
          });
        });
      });
    });
  });
});

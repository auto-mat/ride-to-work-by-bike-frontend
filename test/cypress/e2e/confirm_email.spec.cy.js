import { testBackgroundImage } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { HttpStatusCode } from 'axios';

describe('Email confirmation', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('confirmEmailAddressParams.json').then((params) => {
        cy.visit(
          '#' +
            routesConf['confirm_email']['path'] +
            `?key=${encodeURIComponent(params.key)}&email=${encodeURIComponent(params.email)}`,
        );
      });
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
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

    it('renders page title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('email-confirmation-title')
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.titleEmailConfirmation')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
      });
    });

    it('renders email confirmation message', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('confirmEmailAddressParams.json').then((params) => {
          cy.dataCy('email-confirmation-text')
            .should('be.visible')
            .and('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .then(($el) => {
              cy.wrap(
                i18n.global.t('register.form.textEmailConfirmation', {
                  email: params.email,
                }),
              ).then((translation) => {
                expect($el.html()).to.equal(translation);
              });
            });
        });
      });
    });

    it('renders email confirmation button', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('email-confirmation-submit')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '500')
          .then(($el) => {
            cy.wrap(i18n.global.t('register.form.submitConfirmation')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
      });
    });

    it('button click should send request and redirect to register challenge page', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('confirmEmailAddressParams.json').then((params) => {
            cy.interceptConfirmEmailApi(config, i18n);
            cy.dataCy('email-confirmation-submit').click();
            cy.wait('@confirmEmailRequest').then((interception) => {
              expect(interception.request.body).to.have.property(
                'key',
                params.key,
              );
              cy.fixture('apiGetConfirmEmailResponseOK').then(
                (apiGetConfirmEmailResponse) => {
                  expect(interception.response.body).to.deep.equal(
                    apiGetConfirmEmailResponse,
                  );
                  cy.url().should(
                    'contain',
                    routesConf['confirm_email']['path'],
                  );
                },
              );
            });
          });
        });
      });
    });

    it('button click should display error message if response fails', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetConfirmEmailResponseFail').then(
            (apiGetConfirmEmailResponseFail) => {
              cy.fixture('confirmEmailAddressParams.json').then((params) => {
                cy.interceptConfirmEmailApi(
                  config,
                  i18n,
                  apiGetConfirmEmailResponseFail,
                  HttpStatusCode.NotFound,
                );
                cy.dataCy('email-confirmation-submit').click();
                cy.wait('@confirmEmailRequest').then((interception) => {
                  expect(interception.request.body).to.have.property(
                    'key',
                    params.key,
                  );
                  expect(interception.response.body).to.deep.equal(
                    apiGetConfirmEmailResponseFail,
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

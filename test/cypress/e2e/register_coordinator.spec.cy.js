import { testLanguageSwitcher } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      // config is defined without hash in the URL
      cy.visit('#' + routesConf['register-coordinator']['path']);
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

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('language-switcher').should('be.visible');
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

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
        });
      });
    });
  });
});

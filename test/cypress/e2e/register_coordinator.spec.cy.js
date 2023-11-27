describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('/#/register-coordinator');
      cy.viewport('macbook-16');
    });

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('language-switcher').should('be.visible');
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

    it('renders page title', () => {
      let i18n;
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window()
          .then((win) => {
            i18n = win.i18n;
          })
          .then(() => {
            cy.dataCy('register-coordinator-title')
              .should('be.visible')
              .and('have.color', config.colorWhite)
              .and('have.css', 'font-size', '24px')
              .and('have.css', 'font-weight', '700')
              .then(($el) => {
                // test v-html content
                const htmlContent = $el.html();
                expect(htmlContent).to.equal(
                  i18n.global.t(
                    `register.coordinator.title.${config.challengeMonth}`,
                  ),
                );
              });
          });
      });
    });

    it('renders info card', () => {
      let i18n;
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window()
          .then((win) => {
            i18n = win.i18n;
          })
          .then(() => {
            cy.dataCy('info-card')
              .should('be.visible')
              .and('have.backgroundColor', config.colorSecondary)
              .and('have.css', 'border-radius', config.borderRadiusCard);
            cy.dataCy('info-title')
              .should('be.visible')
              .and('have.css', 'font-size', '16px')
              .and('have.css', 'font-weight', '700')
              .and('contain', i18n.global.t('register.coordinator.titleInfo'));
            cy.dataCy('info-content')
              .should('be.visible')
              .and('have.css', 'font-size', '14px')
              .and('have.css', 'font-weight', '400')
              .then(($el) => {
                // test v-html content
                const htmlContent = $el.html();
                expect(htmlContent).to.equal(
                  i18n.global.t('register.coordinator.info'),
                );
              });
          });
      });
    });
  });
});

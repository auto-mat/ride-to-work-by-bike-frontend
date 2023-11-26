/**
 * Basic tests for Language Switcher
 *
 * Used in `register_challenge.spec.cy.js` and `login.spec.cy.js`
 */
export const testLanguageSwitcher = () => {
  it('allows user to switch language', () => {
    let i18n;
    cy.window().should('have.property', 'i18n');
    cy.window()
      .then((win) => {
        i18n = win.i18n;
      })
      .then(() => {
        const locales = i18n.global.availableLocales;
        const initialActiveLocale = i18n.global.locale;

        // active language has active class
        cy.dataCy('switcher-' + initialActiveLocale)
          .find('.q-btn')
          .should('have.class', 'bg-secondary');

        locales.forEach((locale) => {
          if (locale !== initialActiveLocale) {
            // changing the language
            cy.dataCy('switcher-' + locale)
              .should('exist')
              .should('be.visible')
              .find('.q-btn')
              .click();
            // old language becomes inactive
            cy.dataCy('switcher-' + initialActiveLocale)
              .find('.q-btn')
              .should('have.class', 'bg-white');
            // new language becomes active
            cy.dataCy('switcher-' + locale)
              .find('.q-btn')
              .should('have.class', 'bg-secondary');
          }
        });
      });
  });

  it('renders title', () => {
    let i18n;
    cy.task('getAppConfig', process).then((config) => {
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('login-register-title')
            .should('be.visible')
            .and('have.color', config.colorWhite)
            .and('have.css', 'font-size', '24px')
            .and('have.css', 'font-weight', '700')
            .and(
              'contain',
              i18n.global.t(
                `register.challenge.titleRegisterToChallenge.${config.challengeMonth}`,
              ),
            );
        });
    });
  });
};

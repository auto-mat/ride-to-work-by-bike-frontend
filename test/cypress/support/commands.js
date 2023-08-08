// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// DO NOT REMOVE
// Imports Quasar Cypress AE predefined commands
import { registerCommands } from '@quasar/quasar-app-extension-testing-e2e-cypress';
registerCommands();

// Fix for ResizeObserver loop issue in Firefox
// see https://stackoverflow.com/questions/74947338/i-keep-getting-error-resizeobserver-loop-limit-exceeded-in-cypress
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add(
  'testLanguageStringsInContext',
  (translationStrings, translationContext, i18n) => {
    const translationKeyList = translationStrings.map(
      (item) => `${translationContext}.${item}`
    );

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          i18n.global.locale = locale;
          const translatedString = i18n.global.t(translationKey);

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .should('have.length.at.least', 1)
            .and('not.equal', defaultEnglishString);
        });
    });
  }
);

Cypress.Commands.add(
  'testElementPercentageWidth',
  ($element, expectedPercentage) => {
    $element.then(($el) => {
      const actualWidth = $el.outerWidth();
      const parentWidth = $el.parent().outerWidth();
      const calculatedPercentage = (actualWidth / parentWidth) * 100;

      expect(calculatedPercentage).to.be.closeTo(Number(expectedPercentage), 1);
    });
  }
);

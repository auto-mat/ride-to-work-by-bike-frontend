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
const resizeObserverLoopCompletedRe =
  /^[^(ResizeObserver loop completed with undelivered notifications)]/;
Cypress.on('uncaught:exception', (err) => {
  if (
    resizeObserverLoopErrRe.test(err.message) ||
    resizeObserverLoopCompletedRe.test(err.message)
  ) {
    return false;
  }
});

Cypress.Commands.add(
  'testLanguageStringsInContext',
  (translationStrings, translationContext, i18n) => {
    const translationKeyList = translationStrings.map(
      (item) => `${translationContext}.${item}`,
    );

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(
        translationKey,
        {},
        { locale: 'en' },
      );

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          const translatedString = i18n.global.t(
            translationKey,
            {},
            { locale: locale },
          );

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .should('have.length.at.least', 1)
            .and('not.equal', defaultEnglishString);
        });
    });
  },
);

Cypress.Commands.add(
  'testElementPercentageWidth',
  ($element, expectedPercentage) => {
    $element.then(($el) => {
      // fix bug where scrollbar is modifying child width
      cy.wrap($el.parent())
        .invoke('attr', 'style', 'overflow: hidden')
        .then(() => {
          const actualWidth = $el.outerWidth();
          const parentWidth = $el.parent().outerWidth();
          const calculatedPercentage = (actualWidth / parentWidth) * 100;

          expect(calculatedPercentage).to.be.closeTo(
            Number(expectedPercentage),
            2,
          );
        });
    });
  },
);

Cypress.Commands.add('testImageHeight', ($img) => {
  cy.wrap($img[0]).should('have.prop', 'naturalHeight').should('be.gt', 0);
});

/**
 * Custom testImageSrcAlt command that provides a standardized test
 * for any image.
 *
 * @param {string} dataCySelector - data-cy-selector of the HTML element
 * @param {string} src - src attribute
 * @param {string} alt - alt attribute
 */
Cypress.Commands.add('testImageSrcAlt', (dataCySelector, src, alt) => {
  // test height
  cy.dataCy(dataCySelector).invoke('height').should('be.gt', 0);
  // test src and alt atributes
  cy.dataCy(dataCySelector)
    .find('img')
    .should('have.attr', 'src', src)
    .should('have.attr', 'alt', alt);
});

Cypress.Commands.add('testMessageLanguageSelect', (i18n) => {
  const locales = i18n.global.availableLocales;
  locales.forEach((locale) => {
    cy.dataCy('invite-language-input').select(
      i18n.global.t(`language.${locale}`),
    );
    cy.dataCy('title-message')
      .should('be.visible')
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage', locale)).then(
          (text) => {
            expect(textContent).to.contain(text);
          },
        );
      });
    cy.dataCy('text-message')
      .should('be.visible')
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(i18n.global.t('onboarding.textMessage', locale)).then(
          (text) => {
            expect(textContent).to.contain(text);
          },
        );
      });
  });
});

/**
 * Custom matchImageSnapshot command that disables the vertical and
 * horizontal scrollbar before the snaphost is taken and then enables
 * them after the snapshot is taken.
 *
 * It ensures the same size of the snaphot image during the creation of
 * the snaphot in different web browsers by disabling the scrollbar,
 * due different width which is the source of the different size of
 * the snapshot across web browsers e.g. Mozilla Firefox vs. Google
 * Chrome.
 *
 * @param {string} dataCySelector - data-cy-selector of the HTML element
                                    which hold scrollbar
 * @param {number} failureThreshold - matchImageSnapshot func failureThreshold
 *                                    param arg
 * @param {string} failureThresholdType - matchImageSnapshot func
 *                                        failureThresholdType param arg
 *
*/
Cypress.Commands.add(
  'matchImageSnapshotWithHiddenScrollbars',
  (dataCySelector, failureThreshold, failureThresholdType) => {
    cy.dataCy(dataCySelector)
      .invoke('attr', 'style', 'overflow: hidden')
      .find('img')
      .matchImageSnapshot({
        failureThreshold: failureThreshold,
        failureThresholdType: failureThresholdType,
      });
    cy.dataCy(dataCySelector).invoke('attr', 'style', 'overflow: auto');
  },
);

Cypress.Commands.add(
  'matchImageSnapshotNamed',
  (dataCySelector, name, failureThreshold = 0.1) => {
    cy.dataCy(dataCySelector).matchImageSnapshot({
      name,
      failureThreshold: failureThreshold,
      failureThresholdType: 'percent',
      customDiffConfig: { threshold: 0.4 },
      retries: 2,
    });
  },
);

Cypress.Commands.add('stripHtmlTags', (htmlString) => {
  cy.wrap(htmlString.replace(/<\/?[^>]+(>|$)/g, ''));
});

Cypress.Commands.add(
  'testElementsSideBySide',
  (elementSelector, siblingElementSelector) => {
    cy.dataCy(elementSelector).then((element) => {
      const offsetTop = element[0].offsetTop;
      const offsetHeight = element[0].offsetHeight;
      cy.dataCy(siblingElementSelector).then((sibling) => {
        const siblingOffsetTop = sibling[0].offsetTop;
        const siblingOffsetHeight = sibling[0].offsetHeight;
        expect(Math.round(offsetTop + offsetHeight / 2)).to.be.eq(
          Math.round(siblingOffsetTop + siblingOffsetHeight / 2),
        );
      });
    });
  },
);

Cypress.Commands.add(
  'testElementsStacked',
  (elementSelector, siblingElementSelector) => {
    cy.dataCy(elementSelector).then((element) => {
      const offsetTop = element[0].offsetTop;
      const offsetHeight = element[0].offsetHeight;
      cy.dataCy(siblingElementSelector).then((sibling) => {
        const siblingOffsetTop = sibling[0].offsetTop;
        expect(Math.round(offsetTop + offsetHeight)).to.be.lte(
          Math.round(siblingOffsetTop),
        );
      });
    });
  },
);

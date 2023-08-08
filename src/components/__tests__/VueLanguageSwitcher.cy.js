import VueLanguageSwitcher from 'components/VueLanguageSwitcher.vue';
import { i18n } from '../../../src/boot/i18n';

describe('<VueLanguageSwitcher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.vueLanguageSwitcher', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueLanguageSwitcher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale).should('exist').should('be.visible');
      })
    })

    it('renders links with correct formatting', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .find('a')
          .should('have.css', 'text-decoration-line', 'none')
          .should('have.color', '#fff');
      })
    })

    it('highlights the active language', () => {
      const activeLocale = i18n.global.locale;
      cy.dataCy('switcher-' + activeLocale)
        .find('a')
        .should('be.visible')
        .should('have.css', 'font-weight', '700');
    })
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueLanguageSwitcher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale).should('exist').should('be.visible');
      })
    })

    it('renders links with correct formatting', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .find('a')
          .should('have.css', 'text-decoration-line', 'none')
          .should('have.color', '#fff');
      })
    })

    it('highlights the active language', () => {
      const activeLocale = i18n.global.locale;
      cy.dataCy('switcher-' + activeLocale)
        .should('be.visible')
        .find('a')
        .should('have.css', 'font-weight', '700');
    })
  });
});

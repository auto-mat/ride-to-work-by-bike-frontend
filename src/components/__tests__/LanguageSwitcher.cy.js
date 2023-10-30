import { colors } from 'quasar';
import LanguageSwitcher from '../LanguageSwitcher.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');

describe('<LanguageSwitcher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.vueLanguageSwitcher', i18n);
  });

  context('desktop dark', () => {
    beforeEach(() => {
      cy.mount(LanguageSwitcher, {
        props: {
          variant: 'dark',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders a link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('exist')
          .should('be.visible');
      });
    });

    it('renders a wrapper with transparent background', () => {
      cy.get('.language-list').should('have.backgroundColor', 'transparent');
    });

    it('renders links with correct font', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400');
      });
    });

    it('highlights the active language', () => {
      const locales = i18n.global.availableLocales;
      const initialActiveLocale = i18n.global.locale;
      cy.dataCy('switcher-' + initialActiveLocale)
        .find('.q-btn')
        .should('be.visible')
        .should('have.class', 'bg-grey-10')
        .should('have.class', 'text-white')
        .should('have.class', 'text-bold');

      locales.forEach((locale) => {
        if (locale !== initialActiveLocale) {
          // other languages have inactive classes
          cy.dataCy('switcher-' + locale)
            .find('.q-btn')
            .should('have.class', 'bg-grey-10')
            .should('have.class', 'text-white')
            .should('not.have.class', 'text-bold');
        }
      });
    });
  });

  context('desktop light', () => {
    beforeEach(() => {
      cy.mount(LanguageSwitcher, {
        props: {
          variant: 'light',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders a link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('exist')
          .should('be.visible');
      });
    });

    it('renders a wrapper with white background', () => {
      cy.get('.language-list')
        .should('have.backgroundColor', white)
        .should('have.css', 'border-radius', '999px');
    });

    it('renders links with correct font', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400');
      });
    });

    it('renders active link for current language', () => {
      const locales = i18n.global.availableLocales;
      const initialActiveLocale = i18n.global.locale;

      // active language has active classes
      cy.dataCy('switcher-' + initialActiveLocale)
        .find('.q-btn')
        .should('have.class', 'bg-secondary')
        .should('have.class', 'text-primary')
        .should('have.class', 'text-bold');

      locales.forEach((locale) => {
        if (locale !== initialActiveLocale) {
          // other languages have inactive classes
          cy.dataCy('switcher-' + locale)
            .find('.q-btn')
            .should('have.class', 'bg-white')
            .should('have.class', 'text-primary')
            .should('have.class', 'text-bold');
        }
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LanguageSwitcher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('exist')
          .should('be.visible');
      });
    });

    it('renders links with correct font', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400');
      });
    });

    it('highlights the active language', () => {
      const activeLocale = i18n.global.locale;
      cy.dataCy('switcher-' + activeLocale).should('be.visible');
    });
  });
});

import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import LanguageSwitcher from '../global/LanguageSwitcher.vue';
import { i18n } from '../../boot/i18n';
import { defaultLocale } from '@/i18n/def_locale';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

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
          .and('be.visible');
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
          .and('have.css', 'font-weight', '400');
      });
    });

    it('highlights the active language', () => {
      const locales = i18n.global.availableLocales;
      const initialActiveLocale = defaultLocale;
      cy.dataCy('switcher-' + initialActiveLocale)
        .find('.q-btn')
        .should('be.visible')
        .and('have.class', 'bg-grey-10')
        .and('have.class', 'text-white')
        .and('have.class', 'text-bold');

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
          .and('be.visible');
      });
    });

    it('renders a wrapper with white background', () => {
      cy.get('.language-list')
        .should('have.backgroundColor', white)
        .and('have.css', 'border-radius', '999px');
    });

    it('renders links with correct font', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400');
      });
    });

    it('renders active link for current language', () => {
      const locales = i18n.global.availableLocales;
      const initialActiveLocale = defaultLocale;

      // active language has active classes
      cy.dataCy('switcher-' + initialActiveLocale)
        .find('.q-btn')
        .should('have.class', 'bg-secondary')
        .and('have.class', 'text-primary')
        .and('have.class', 'text-bold');

      locales.forEach((locale) => {
        if (locale !== initialActiveLocale) {
          // other languages have inactive classes
          cy.dataCy('switcher-' + locale)
            .find('.q-btn')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-primary')
            .and('have.class', 'text-bold');
        }
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LanguageSwitcher, {
        props: {
          variant: 'light',
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders link for each locale', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('exist')
          .and('be.visible');
      });
    });

    it('renders links with correct font', () => {
      const locales = i18n.global.availableLocales;
      locales.forEach((locale) => {
        cy.dataCy('switcher-' + locale)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400');
      });
    });

    it('highlights the active language', () => {
      const activeLocale = defaultLocale;
      cy.dataCy('switcher-' + activeLocale).should('be.visible');
    });
  });

  context('api integration', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
        cy.interceptRegisterChallengeGetApi(
          rideToWorkByBikeConfig,
          defaultLocale,
          response,
        );
      });
      cy.mount(LanguageSwitcher, {
        props: {
          variant: 'light',
        },
      });
    });

    it('sends correct API requests when switching language', () => {
      cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
        cy.fixture('apiGetRegisterChallengeProfileLanguageEn.json').then(
          (responseEn) => {
            cy.fixture('apiGetRegisterChallengeProfileLanguageSk.json').then(
              (responseSk) => {
                cy.fixture('apiPostRegisterChallengeLanguageEn.json').then(
                  (requestPostEn) => {
                    cy.fixture('apiPostRegisterChallengeLanguageSk.json').then(
                      (requestPostSk) => {
                        // set manually as data will be loaded by other components
                        cy.wrap(useRegisterChallengeStore()).then((store) => {
                          store.setRegisterChallengeFromApi(
                            response.results[0],
                          );
                        });
                        // wait for initial GET request
                        const personalDetails =
                          response.results[0].personal_details;
                        // switch to English
                        // intercept PUT request for English
                        cy.interceptRegisterChallengePutApi(
                          rideToWorkByBikeConfig,
                          responseEn.results[0].personal_details.language,
                          personalDetails.id,
                          responseEn,
                        );
                        // override intercept GET request for English
                        cy.interceptRegisterChallengeGetApi(
                          rideToWorkByBikeConfig,
                          responseEn.results[0].personal_details.language,
                          responseEn,
                        );
                        cy.dataCy('switcher-button-en').click();
                        cy.waitForRegisterChallengePutApi(requestPostEn);
                        cy.waitForRegisterChallengeGetApi(responseEn);
                        // switch to Slovak
                        // intercept PUT request for Slovak
                        cy.interceptRegisterChallengePutApi(
                          rideToWorkByBikeConfig,
                          responseSk.results[0].personal_details.language,
                          personalDetails.id,
                          responseSk,
                        );
                        // override intercept GET request for Slovak
                        cy.interceptRegisterChallengeGetApi(
                          rideToWorkByBikeConfig,
                          responseSk.results[0].personal_details.language,
                          responseSk,
                        );
                        cy.dataCy('switcher-button-sk').click();
                        cy.waitForRegisterChallengePutApi(requestPostSk);
                        // wait for GET request for Slovak
                        cy.waitForRegisterChallengeGetApi(responseSk);
                      },
                    );
                  },
                );
              },
            );
          },
        );
      });
    });
  });
});

import DrawerHeader from '../global/DrawerHeader.vue';
import { i18n } from '../../boot/i18n';

describe('<DrawerHeader>', () => {
  beforeEach(() => {
    cy.mount(DrawerHeader, {});
  });

  it('has translation for all strings', () => {
    const translationStrings = [
      'titleStateDefault',
      'titleStateContact',
      'titleParticipants',
      'titleCoordinators',
      'titleGuide',
      'buttonGuide',
      'titleContact',
      'buttonContact',
      'titleLinks',
      'titleSocials',
    ];

    const translationKeyList = translationStrings.map(
      (item) => `index.help.${item}`,
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
            .and('not.equal', defaultEnglishString);
        });
    });
  });

  it('renders logo', () => {
    cy.window().then(() => {
      cy.dataCy('logo').should('be.visible').and('have.css', 'height', '40px');
    });
  });

  it('renders help button', () => {
    cy.dataCy('help-button').should('be.visible');
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('drawer-header-notification-icon').then((element) => {
        cy.testIcon({ element, name: 'drawer-header-notification', size: 24 });
      });
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

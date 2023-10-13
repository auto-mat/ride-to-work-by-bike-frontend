import DrawerHeader from '../DrawerHeader.vue';
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
      (item) => `index.help.${item}`
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
      cy.dataCy('logo')
        .should('be.visible')
        .should('have.css', 'height', '40px');
    });
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-notification')
        .should('be.visible')
        .should('have.color', '#000000')
        .should('have.css', 'width', '24px')
        .should('contain.text', 'notifications');
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

import { colors } from 'quasar';

import DrawerHeader from '../DrawerHeader.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;

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
      cy.dataCy('logo')
        .should('be.visible')
        .should('have.css', 'height', '40px');
    });
  });

  it('renders help button', () => {
    cy.dataCy('button-help')
      .should('be.visible')
      .should('have.css', 'font-size', '8px')
      .should('have.css', 'font-weight', '500')
      .should('have.backgroundColor', getPaletteColor('grey-10'))
      .should('have.css', 'border-radius', '50%'); // round
    cy.dataCy('button-help').should('contain', 'question_mark');
  });

  it('renders help button with correct size', () => {
    cy.dataCy('button-help').should('be.visible');
    cy.dataCy('button-help').invoke('height').should('be.equal', 24);
    cy.dataCy('button-help').invoke('width').should('be.equal', 24);
  });

  it('renders help icon', () => {
    cy.dataCy('icon-help')
      .should('contain', 'question_mark')
      .should('have.color', '#fff');
    cy.dataCy('icon-help')
      .invoke('height')
      .should('be.gt', 12)
      .should('be.lt', 14);
    cy.dataCy('icon-help')
      .invoke('width')
      .should('be.gt', 12)
      .should('be.lt', 14);
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-notification')
        .should('be.visible')
        .should('have.color', '#000')
        .should('have.css', 'width', '24px')
        .should('contain.text', 'notifications');
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

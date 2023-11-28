import { colors } from 'quasar';

import DrawerHeader from '../global/DrawerHeader.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

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
    cy.dataCy('button-help')
      .should('be.visible')
      .and('have.css', 'font-size', '8px')
      .and('have.css', 'font-weight', '500')
      .and('have.backgroundColor', grey10)
      .and('have.css', 'border-radius', '50%'); // round
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
      .and('have.color', white);
    cy.dataCy('icon-help')
      .invoke('height')
      .should('be.gt', 12)
      .and('be.lt', 14);
    cy.dataCy('icon-help').invoke('width').should('be.gt', 12).and('be.lt', 14);
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-notification')
        .should('be.visible')
        .and('have.color', black)
        .and('have.css', 'width', '24px')
        .and('contain.text', 'notifications');
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

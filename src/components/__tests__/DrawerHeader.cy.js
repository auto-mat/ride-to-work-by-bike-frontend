import { colors } from 'quasar';
import DrawerHeader from '../global/DrawerHeader.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');

// selectors
const selectorButtonHelp = 'button-help';
const selectorIconHelp = 'icon-help';
const selectorIconNotification = 'icon-notification';

// variables
const buttonSize = 24;
const iconSize = 18;

describe('<DrawerHeader>', () => {
  beforeEach(() => {
    cy.mount(DrawerHeader, {});
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
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
      ],
      'index.help',
      i18n,
    );
  });

  it('renders logo', () => {
    cy.window().then(() => {
      cy.dataCy('logo').should('be.visible').and('have.css', 'height', '40px');
    });
  });

  it('renders help button', () => {
    // button
    cy.dataCy(selectorButtonHelp)
      .should('be.visible')
      .and('have.css', 'font-weight', '500')
      .and('have.backgroundColor', primary)
      .and('have.css', 'border-radius', '50%');
    // button size
    cy.dataCy(selectorButtonHelp)
      .invoke('height')
      .should('be.equal', buttonSize);
    cy.dataCy(selectorButtonHelp)
      .invoke('width')
      .should('be.equal', buttonSize);
  });

  it('renders help icon', () => {
    cy.dataCy(selectorIconHelp).and('have.color', white);
    cy.dataCy(selectorIconHelp).invoke('height').should('be.equal', iconSize);
    cy.dataCy(selectorIconHelp).invoke('width').should('be.equal', iconSize);
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy(selectorIconNotification)
        .should('be.visible')
        .and('have.color', black)
        .and('contain.text', 'notifications');
      cy.dataCy(selectorIconNotification)
        .invoke('height')
        .should('be.equal', iconSize);
      cy.dataCy(selectorIconNotification)
        .invoke('width')
        .should('be.equal', iconSize);
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

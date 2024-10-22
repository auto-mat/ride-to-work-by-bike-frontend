import { colors } from 'quasar';
import DrawerHeader from '../global/DrawerHeader.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const red = getPaletteColor('red');
// selectors
const selectorButtonHelp = 'button-help';
const selectorButtonNotifications = 'button-notifications';
const selectorIconHelp = 'icon-help';
const selectorHeaderLogo = 'header-logo';

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
      cy.dataCy(selectorHeaderLogo)
        .should('be.visible')
        .and('have.css', 'height', '40px');
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
      cy.dataCy(selectorButtonNotifications).should('be.visible');
      cy.dataCy(selectorButtonNotifications)
        .invoke('height')
        .should('be.equal', buttonSize);
      cy.dataCy(selectorButtonNotifications)
        .invoke('width')
        .should('be.equal', buttonSize);
      cy.dataCy(selectorButtonNotifications).within(() => {
        cy.dataCy('notifications-icon')
          .should('be.visible')
          .and('have.color', white);
        cy.dataCy('notifications-icon')
          .invoke('height')
          .should('be.equal', iconSize);
        cy.dataCy('notifications-icon')
          .invoke('width')
          .should('be.equal', iconSize);
      });
      cy.dataCy(selectorButtonNotifications).within(() => {
        cy.dataCy('notifications-count-badge')
          .should('be.visible')
          .and('have.backgroundColor', red);
      });
    });
  });

  // Run E2E tests to ensure that the interaction with dialog works as expected
});

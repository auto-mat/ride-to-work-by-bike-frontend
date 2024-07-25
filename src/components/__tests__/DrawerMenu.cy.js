import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';

const menuItems = [
  { icon: 'home', name: 'home' },
  { icon: 'route', name: 'routes' },
  { icon: 'emoji_events', name: 'results' },
  { icon: 'people', name: 'community' },
  { icon: 'verified', name: 'discounts' },
  { icon: 'business', name: 'coordinator' },
  { icon: 'account_circle', name: 'profile' },
  {
    icon: 'email',
    name: 'inviteFriends',
  },
  {
    icon: 'volunteer_activism',
    name: 'donate',
  },
];

describe('DrawerMenu', () => {
  beforeEach(() => {
    cy.mount(DrawerMenu, {});
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      menuItems.map((item) => item.name),
      'drawerMenu',
      i18n,
    );
  });

  it('should render the list with the correct number of items', () => {
    cy.window().then(() => {
      cy.get('.q-item').should('have.length', 9);
    });
  });

  it('should render each item with the expected icon and text content', () => {
    cy.window().then(() => {
      const drawerMenuIcon = 'drawer-menu-icon';
      const drawerBottomMenuIcon = 'drawer-bottom-menu-icon';
      const drawerMenuIconSize = 18;

      cy.viewport(500, 500).then(() => {
        cy.dataCy(drawerMenuIcon).then(() => {
          cy.dataCy(drawerMenuIcon)
            .should('be.visible')
            .each((element, index) => {
              if (index === 0) cy.get(element).click();
              cy.testIcon({
                element: element,
                name: `${Cypress.currentTest.titlePath}-drawer-menu-${index}`,
                size: drawerMenuIconSize,
                click: false,
              });
            });
        });

        cy.dataCy(drawerBottomMenuIcon).then(() => {
          cy.dataCy(drawerBottomMenuIcon)
            .should('be.visible')
            .each((element, index) => {
              cy.testIcon({
                element: element,
                name: `${Cypress.currentTest.titlePath}-drawer-bottom-menu${index}`,
                size: drawerMenuIconSize,
                click: false,
              });
            });
        });
      });
    });
  });
});

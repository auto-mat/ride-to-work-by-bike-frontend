import DrawerMenu from '../DrawerMenu.vue';
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
      menuItems.forEach((item, index) => {
        cy.get('.q-item')
          .eq(index)
          .within(() => {
            cy.get('.q-icon')
              .should('be.visible')
              .and('contain.text', item.icon);
          });
      });
    });
  });
});

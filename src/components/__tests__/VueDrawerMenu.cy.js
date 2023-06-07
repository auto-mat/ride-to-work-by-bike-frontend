import VueDrawerMenu from '../VueDrawerMenu.vue';

describe('VueDrawerMenu', () => {
  beforeEach(() => {
    cy.mount(VueDrawerMenu, {});
  });

  it('should render the list with the correct number of items', () => {
    cy.window().then(() => {
      cy.get('.q-item').should('have.length', 9);
    });
  });

  it('should render each item with the expected icon and text content', () => {
    // TODO: Add dynamic translations tests
    const items = [
      { icon: 'home', name: 'Home' },
      { icon: 'route', name: 'Routes' },
      { icon: 'emoji_events', name: 'Results' },
      { icon: 'people', name: 'Community' },
      { icon: 'verified', name: 'Discounts' },
      { icon: 'business', name: 'Coordinator' },
      { icon: 'account_circle', name: 'Profile' },
    ];

    cy.window().then(() => {
      items.forEach((item, index) => {
        cy.get('.q-item')
          .eq(index)
          .within(() => {
            cy.get('.q-icon').should('contain.text', item.icon);
            cy.contains(item.name);
          });
      });
    });
  });
});

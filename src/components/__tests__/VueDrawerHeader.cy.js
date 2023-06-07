import VueDrawerHeader from '../VueDrawerHeader.vue';

describe('<VueDrawerHeader>', () => {
  beforeEach(() => {
    cy.mount(VueDrawerHeader, {});
  });

  it('renders logo', () => {
    cy.window().then(() => {
      cy.get('.logo').should('be.visible');
    });
  });

  it('renders help icon', () => {
    cy.window().then(() => {
      cy.get('.q-icon').should('be.visible').should('contain.text', 'help');
    });
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.get('.q-icon')
        .should('be.visible')
        .should('contain.text', 'notifications');
    });
  });
});

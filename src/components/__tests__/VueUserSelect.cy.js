import UserSelect from '../UserSelect.vue';

describe('<UserSelect>', () => {
  beforeEach(() => {
    cy.mount(UserSelect, {});
  });

  it('renders select', () => {
    cy.mount(UserSelect, {}).then(() => {
      cy.get('.q-select')
        .should('be.visible')
        .and('have.css', 'height', '56px');
    });
  });
});

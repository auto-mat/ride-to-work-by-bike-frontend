import CardListEvent from 'components/CardListEvent.vue';

describe('<CardListEvent>', () => {
  const heading = 'Budoucí výzvy';

  beforeEach(() => {
    cy.mount(CardListEvent, {
      props: {
        cards: [
          {
            title: 'Challenge 1',
          },
          {
            title: 'Challenge 2',
          },
          {
            title: 'Challenge 3',
          },
          {
            title: 'Challenge 4',
          },
          {
            title: 'Challenge 5',
          },
        ],
      },
    });
  });

  it('renders heading', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-list-heading"]')
        .should('be.visible')
        .should('contain', heading);
    });
  });

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-list-item"]').should('have.length', 5);
    });
  });
});

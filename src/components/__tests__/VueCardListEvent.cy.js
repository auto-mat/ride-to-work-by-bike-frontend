import VueCardListEvent from 'components/VueCardListEvent.vue';

describe('<VueCardListEvent>', () => {
  beforeEach(() => {
    cy.mount(VueCardListEvent, {
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

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.dataCy('card-list-item').should('have.length', 5);
    });
  });
});

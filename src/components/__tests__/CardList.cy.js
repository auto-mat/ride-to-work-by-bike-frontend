import CardList from '../CardList.vue';

describe('<CardList>', () => {
  beforeEach(() => {
    cy.mount(CardList, {
      props: {
        cards: [
          {
            title: 'Challenge 1',
            url: '#',
            dates: '1. říj.–31. říj. 2022',
          },
          {
            title: 'Challenge 2',
            url: '#',
            dates: '1. říj.–31. říj. 2022',
          },
          {
            title: 'Challenge 3',
            url: '#',
            dates: '1. říj.–31. říj. 2022',
          },
          {
            title: 'Challenge 4',
            url: '#',
            dates: '1. říj.–31. říj. 2022',
          },
          {
            title: 'Challenge 5',
            url: '#',
            dates: '1. říj.–31. říj. 2022',
          },
        ],
      },
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-list-title"]')
        .should('be.visible')
        // TODO: Add dynamic translations tests
        .should('contain', 'Future challenges');
    });
  });

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-list-item"]').should('have.length', 5);
    });
  });

  it('renders cards in a grid', () => {
    cy.get('[data-testid="card-list"]')
      .should('have.css', 'display', 'flex')
      .should('have.css', 'flex-wrap', 'wrap');
  });
});

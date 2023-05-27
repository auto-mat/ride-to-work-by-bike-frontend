import VueCardChallenge from 'components/VueCardChallenge.vue';

describe('<VueCardChallenge>', () => {
  const title = 'Challenge 1';
  const url = '#';
  const dates = '1. říj.–31. říj. 2022';
  const company = true;

  beforeEach(() => {
    cy.mount(VueCardChallenge, {
      props: {
        card: {
          title,
          url,
          dates,
          company,
        },
      },
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-title"]')
        .should('be.visible')
        .should('contain', title);
    });
  });

  it('renders link', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-link"]')
        .should('be.visible')
        .should('have.attr', 'href', url);
    });
  });

  it('renders dates', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-dates"]')
        .should('be.visible')
        .should('contain', dates);
    });
  });

  it('renders company badge', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-company"]')
        .should('be.visible')
        .should('have.css', 'border-radius', '9999px')
        .should('have.css', 'color', '#fff')
        .should('have.css', 'height', '24px')
        .should('have.css', 'position', 'absolute')
        .should('have.css', 'top', '-12px')
        .should('contain', 'Company challange');
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card"]')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });
});

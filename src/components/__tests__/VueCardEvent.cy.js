import VueCardChallenge from 'components/VueCardChallenge.vue';

describe('<VueCardChallenge>', () => {
  const title = 'Opening Ceremony Bike to Work 2022';
  const thumbnail = 'https://picsum.photos/340/200';
  const image = 'https://picsum.photos/380/380';
  const dates = new Date();
  const location = 'Prague';
  const content =
    'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!';
  const links = [
    'meet.google.com/anr-pvfs-opf',
    'meet.google.com/anr-pvfs-opf',
  ];

  beforeEach(() => {
    cy.mount(VueCardChallenge, {
      props: {
        card: {
          title,
          thumbnail,
          image,
          dates,
          location,
          content,
          links,
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

  it('renders image', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-image"]')
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

  it('renders dates with icon', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-dates"]')
        .should('be.visible')
        .should('contain', dates);
    });
  });

  it('renders location with icon', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card-location"]')
        .should('be.visible')
        .should('contain', dates);
    });
  });

  it('renders calendar button with an icon', () => {
    cy.window().then(() => {
      cy.get('[data-testid="calendar-button"]').should('be.visible');
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card"]')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.get('[data-testid="card"]')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });
});

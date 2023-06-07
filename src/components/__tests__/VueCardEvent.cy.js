import { hexToRgb } from 'app/test/cypress/utils';
import VueCardEvent from 'components/VueCardEvent.vue';

describe('<VueCardEvent>', () => {
  const title = 'Opening Ceremony Bike to Work 2022';
  const thumbnail = 'https://picsum.photos/340/200';
  const image = 'https://picsum.photos/380/380';
  const dates = new Date('Sun Oct 01 2023 12:00:00 GMT+0200');
  const location = 'Prague';
  const content =
    'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!';
  const links = [
    'meet.google.com/anr-pvfs-opf',
    'meet.google.com/anr-pvfs-opf',
  ];

  beforeEach(() => {
    cy.mount(VueCardEvent, {
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

  it('renders title with link', () => {
    cy.window().then(() => {
      cy.dataCy('card-title')
        .should('be.visible')
        .should('have.css', 'font-size', '16px')
        .should('have.css', 'font-weight', '700')
        .should('contain', title);

      cy.dataCy('card-link')
        .should('be.visible')
        .should('have.attr', 'href', '#');
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.dataCy('card-image')
        .should('be.visible')
        .find('img')
        .then(($img) => {
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(thumbnail);
        });
    });
  });

  it('renders date with icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-dates')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('contain', 'Sun 1. Oct. 2023, 12:00');

      cy.dataCy('card-dates')
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#cfd8dc'))
        .should('contain', 'event');
    });
  });

  it('renders location with icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-location')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('contain', location);

      cy.dataCy('card-location')
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#cfd8dc'))
        .should('contain', 'place');
    });
  });

  it('renders calendar button with an icon', () => {
    cy.window().then(() => {
      cy.dataCy('calendar-button')
        .should('be.visible')
        .should('have.css', 'height', '42px')
        .should('have.css', 'width', '42px');

      cy.dataCy('calendar-button')
      .find('i')
      .should('be.visible')
      .should('have.css', 'color', hexToRgb('#000000'))
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .click()
        .then(() => {
          cy.dataCy('card-dialog')
            .should('be.visible');
        })
    });
  });
});

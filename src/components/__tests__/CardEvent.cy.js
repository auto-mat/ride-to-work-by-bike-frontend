import { colors } from 'quasar';

import CardEvent from '../homepage/CardEvent.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const blueGrey2 = getPaletteColor('blue-grey-2');
const blueGrey3 = getPaletteColor('blue-grey-3');
const blueGrey7 = getPaletteColor('blue-grey-7');

const title = 'Opening Ceremony Bike to Work 2022';
const thumbnail = {
  src: 'https://picsum.photos/id/70/340/200',
  alt: 'road lined with trees',
};
const image = {
  src: 'https://picsum.photos/id/70/380/380',
  alt: 'road lined with trees',
};
const dates = new Date('2023-10-01T12:00:00');
const location = 'Prague';
const content =
  'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!';
const links = ['meet.google.com/anr-pvfs-opf', 'meet.google.com/anr-pvfs-opf'];
// const icons = ['event', 'place'];

describe('<CardEvent>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardEvent, {
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
      cy.viewport('macbook-16');
    });

    it('has translation for all strings', () => {
      cy.testLanguageStringsInContext(
        ['addToCalendar'],
        'index.cardEvent',
        i18n,
      );
    });

    it('renders title with link', () => {
      cy.window().then(() => {
        cy.dataCy('card-title')
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
        cy.dataCy('card-link')
          .should('be.visible')
          .and('have.attr', 'href', '#');
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('card')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(thumbnail.src);
          });
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('card')
          .should('be.visible')
          .and('have.backgroundColor', white);
      });
    });

    it('renders date with icon', () => {
      cy.window().then(() => {
        cy.dataCy('card-dates')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('contain', '1.')
          .and('contain', '2023')
          .and('contain', '12:00');
        cy.dataCy('card-dates')
          .find('i')
          .should('be.visible')
          .and('have.color', blueGrey2)
          .and('contain', 'event');
      });
    });

    it('renders location with icon', () => {
      cy.window().then(() => {
        cy.dataCy('card-location')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('contain', location);
        cy.dataCy('card-location')
          .find('i')
          .should('be.visible')
          .and('have.color', blueGrey2)
          .and('contain', 'place');
      });
    });

    it('renders calendar button with an icon', () => {
      cy.window().then(() => {
        cy.dataCy('calendar-button')
          .should('be.visible')
          .and('have.css', 'height', '42px')
          .and('have.css', 'width', '42px');
        cy.dataCy('calendar-button')
          .find('i')
          .should('be.visible')
          .and('have.color', black);
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card')
          .should('be.visible')
          .and('have.css', 'border-radius', '20px');
      });
    });

    it('renders modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy('card-link').click();
        cy.dataCy('dialog-card-event').should('be.visible');
      });
    });

    it('renders modal title, location and date', () => {
      cy.window().then(() => {
        cy.dataCy('card-link').click();
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
        cy.dataCy('dialog-meta')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', blueGrey7)
          .each(($el, index) => {
            if (index === 0) {
              cy.wrap($el)
                .should('contain', '1.')
                .and('contain', '2023')
                .and('contain', '12:00');
              const $icon = $el.find('i');
              if ($icon.length) {
                cy.wrap($icon)
                  .should('be.visible')
                  .and('have.color', blueGrey3)
                  .and('have.css', 'width', '18px')
                  .and('have.css', 'height', '18px');
              }
            }
            if (index === 1) {
              cy.wrap($el).should('contain', location);
              const $icon = $el.find('i');
              if ($icon.length) {
                cy.wrap($icon)
                  .should('be.visible')
                  .and('have.color', blueGrey3)
                  .and('have.css', 'width', '18px')
                  .and('have.css', 'height', '18px');
              }
            }
          });
      });
    });

    it('renders dialog content', () => {
      cy.dataCy('card-link').click();
      cy.dataCy('dialog-content')
        .should('be.visible')
        .and('contain', 'We want to reward you for your support')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400');
    });

    it('renders dialog image', () => {
      cy.dataCy('card-link').click();
      cy.dataCy('dialog-image')
        .should('be.visible')
        .find('img')
        .then(($img) => {
          // Updated version of the test valid for Firefox
          cy.testImageHeight($img);
          expect($img.attr('src')).to.equal(image.src);
        });
    });

    it('shows modal with two columns', () => {
      cy.dataCy('card-link').click();
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 50);
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardEvent, {
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
      cy.viewport('iphone-6');
    });

    it('shows modal with one column', () => {
      cy.dataCy('card-link').click();
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 95);
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 95);
    });
  });
});

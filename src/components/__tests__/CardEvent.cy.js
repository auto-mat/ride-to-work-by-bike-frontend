import { colors } from 'quasar';

import CardEvent from '../homepage/CardEvent.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const white = getPaletteColor('white');
const blueGrey2 = getPaletteColor('blue-grey-2');
const blueGrey3 = getPaletteColor('blue-grey-3');
const blueGrey7 = getPaletteColor('blue-grey-7');

const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CardEvent>', () => {
  const iconSize24 = 24;
  const iconSize18 = 18;
  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('cardEvent').then((cardEvent) => {
        cy.mount(CardEvent, {
          props: {
            card: cardEvent,
          },
        });
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
        cy.fixture('cardEvent').then((cardEvent) => {
          cy.dataCy('card-title')
            .should('be.visible')
            .and('have.css', 'font-size', '16px')
            .and('have.css', 'font-weight', '700')
            .and('contain', cardEvent.title)
            .then(($title) => {
              expect($title.text()).to.equal(cardEvent.title);
            });
          cy.dataCy('card-link')
            .should('be.visible')
            .and('have.attr', 'href', '#');
        });
      });
    });

    it('renders image', () => {
      cy.fixture('cardEvent').then((cardEvent) => {
        cy.window().then(() => {
          cy.dataCy('card')
            .find('img')
            .should('be.visible')
            .then(($img) => {
              cy.testImageHeight($img);
              expect($img.attr('src')).to.equal(cardEvent.thumbnail.src);
            });
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
        cy.fixture('cardEvent').then((cardEvent) => {
          // get event date
          const dateObject = new Date(cardEvent.dates);
          const date = dateObject.getDate();
          const year = dateObject.getFullYear();
          const hour = dateObject.getHours();
          // check event dates being displayed
          cy.dataCy('card-dates')
            .should('be.visible')
            .and('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .and('contain', date)
            .and('contain', year)
            .and('contain', hour);
          cy.dataCy('card-event-date-icon')
            .should('have.color', blueGrey2)
            .then((element) => {
              cy.testIcon({
                element: element,
                name: 'card-event-event',
                size: iconSize24,
              });
            });
        });
      });
    });

    it('renders location with icon', () => {
      cy.window().then(() => {
        cy.fixture('cardEvent').then((cardEvent) => {
          cy.dataCy('card-location')
            .should('be.visible')
            .and('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .and('contain', cardEvent.location);
          cy.dataCy('card-event-location-icon')
            .should('have.color', blueGrey2)
            .then((element) => {
              cy.testIcon({
                element: element,
                name: 'card-event-location',
                size: iconSize24,
              });
            });
        });
      });
    });

    it('renders calendar button with an icon', () => {
      cy.window().then(() => {
        // button
        cy.dataCy('calendar-button')
          .should('be.visible')
          .and('have.css', 'height', '42px')
          .and('have.css', 'width', '42px');
        // icon
        /*
         * Change viewport fix: `The "target" argument must be an instance
         * of Buffer or Uint8Array. Received null` error
         */
        cy.viewport(500, 500).then(() => {
          cy.dataCy('card-event-calendar-icon')
            .and('have.color', grey10)
            .then((element) => {
              cy.testIcon({
                element: element,
                name: 'card-event-calendar',
                size: iconSize18,
              });
            });
        });
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card')
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadiusCard);
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
        cy.fixture('cardEvent').then((cardEvent) => {
          cy.dataCy('card-link').click();
          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .and('have.css', 'font-size', '20px')
            .and('have.css', 'font-weight', '500')
            .and('contain', cardEvent.title)
            .then(($title) => {
              expect($title.text()).to.equal(cardEvent.title);
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
              }
              if (index === 1) {
                cy.wrap($el).should('contain', cardEvent.location);
              }
            });
          cy.dataCy('dialog-event-date-icon')
            .should('have.color', blueGrey3)
            .then((element) => {
              cy.testIcon({
                element: element,
                name: 'card-event-dialog-event',
                size: iconSize18,
              });
            });
          cy.dataCy('dialog-event-location-icon')
            .should('have.color', blueGrey3)
            .then((element) => {
              cy.testIcon({
                element: element,
                name: 'card-event-dialog-location',
                size: iconSize18,
              });
            });
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
      cy.dataCy('button-add-to-calendar').should('be.visible');
      cy.dataCy('button-add-to-calendar')
        .find('i')
        .first()
        .invoke('width')
        .should('be.eq', 18);
      cy.dataCy('button-add-to-calendar')
        .find('i')
        .first()
        .invoke('height')
        .should('be.eq', 18);
      cy.dataCy('button-add-to-calendar').click();
      cy.get('.q-menu')
        .should('be.visible')
        .find('.q-item')
        .should('have.length', 6);
    });

    it('renders dialog image', () => {
      cy.fixture('cardEvent').then((cardEvent) => {
        cy.dataCy('card-link').click();
        cy.dataCy('dialog-image')
          .should('be.visible')
          .find('img')
          .then(($img) => {
            // Updated version of the test valid for Firefox
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(cardEvent.image.src);
          });
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
      cy.fixture('cardEvent').then((cardEvent) => {
        cy.mount(CardEvent, {
          props: {
            card: cardEvent,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    it('shows modal with one column', () => {
      cy.dataCy('card-link').click();
      cy.dataCy('dialog-body')
        .should('be.visible')
        .invoke('css', 'overflow', 'hidden');
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 100);
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 100);
    });
  });
});

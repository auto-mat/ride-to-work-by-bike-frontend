import { colors } from 'quasar';
import CardEvent from '../homepage/CardEvent.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';
import { hexToRgb } from '@/../test/cypress/utils';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey5 = getPaletteColor('grey-5');
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorCard = 'card';
const selectorCardTitle = 'card-title';
const selectorCardLink = 'card-link';
const selectorCardDates = 'card-dates';
const selectorCardLocation = 'card-location';
const selectorCardDatesIcon = 'card-dates-icon';
const selectorCardLocationIcon = 'card-location-icon';
const selectorCalendarButton = 'calendar-button';
const selectorCalendarButtonIcon = 'calendar-button-icon';
const selectorDialogCardEvent = 'dialog-card-event';
const selectorDialogHeader = 'dialog-header';
const selectorDialogMeta = 'dialog-meta';
const selectorDialogMetaDateIcon = 'dialog-meta-date-icon';
const selectorDialogMetaLocationIcon = 'dialog-meta-location-icon';
const selectorDialogContent = 'dialog-content';
const selectorButtonAddToCalendar = 'button-add-to-calendar';
const selectorDialogImage = 'dialog-image';
const selectorDialogColLeft = 'dialog-col-left';
const selectorDialogColRight = 'dialog-col-right';
const selectorDialogBody = 'dialog-body';

// variables
const iconSize = 18;
const calendarButtonSize = '42px';
const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CardEvent>', () => {
  let cardEvent;

  before(() => {
    cy.fixture('cardEvent').then((cardEventFixture) => {
      cardEvent = cardEventFixture;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['addToCalendar'], 'index.cardEvent', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardEvent, {
        props: {
          card: cardEvent,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows modal with two columns', () => {
      cy.dataCy(selectorCardLink).click();
      cy.testElementPercentageWidth(cy.dataCy(selectorDialogColLeft), 50);
      cy.testElementPercentageWidth(cy.dataCy(selectorDialogColRight), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardEvent, {
        props: {
          card: cardEvent,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('shows modal with one column', () => {
      cy.dataCy(selectorCardLink).click();
      cy.dataCy(selectorDialogBody)
        .should('be.visible')
        .invoke('css', 'overflow', 'hidden');
      cy.testElementPercentageWidth(cy.dataCy(selectorDialogColLeft), 100);
      cy.testElementPercentageWidth(cy.dataCy(selectorDialogColRight), 100);
    });
  });

  function coreTests() {
    it('renders card with correct styling', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCard)
          .should('be.visible')
          .and('have.backgroundColor', white)
          .and('have.css', 'border', `1px solid ${hexToRgb(grey5)}`)
          .and('have.css', 'border-radius', borderRadiusCard);
      });
    });

    it('renders title with link', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardTitle)
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', cardEvent.title)
          .then(($title) => {
            expect($title.text()).to.equal(cardEvent.title);
          });
        cy.dataCy(selectorCardLink)
          .should('be.visible')
          .and('have.attr', 'href', '#');
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCard)
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(cardEvent.thumbnail.src);
          });
      });
    });

    it('renders date with icon', () => {
      cy.window().then(() => {
        // get event date
        const dateObject = new Date(cardEvent.dates);
        const date = dateObject.getDate();
        const year = dateObject.getFullYear();
        const hour = dateObject.getHours();
        // check event dates being displayed
        cy.dataCy(selectorCardDates)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8)
          .and('contain', date)
          .and('contain', year)
          .and('contain', hour);
        cy.dataCy(selectorCardDatesIcon)
          .should('be.visible')
          .and('have.color', primary)
          .invoke('width')
          .should('be.eq', iconSize);
        cy.dataCy(selectorCardDatesIcon)
          .invoke('height')
          .should('be.eq', iconSize);
      });
    });

    it('renders location with icon', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardLocation)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8)
          .and('contain', cardEvent.location);
        cy.dataCy(selectorCardLocationIcon)
          .should('be.visible')
          .and('have.color', primary)
          .invoke('width')
          .should('be.eq', iconSize);
        cy.dataCy(selectorCardLocationIcon)
          .invoke('height')
          .should('be.eq', iconSize);
      });
    });

    it('renders calendar button with an icon', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCalendarButton)
          .should('be.visible')
          .and('have.css', 'height', calendarButtonSize)
          .and('have.css', 'width', calendarButtonSize);
        cy.dataCy(selectorCalendarButtonIcon)
          .should('be.visible')
          .and('have.color', primary);
      });
    });

    it('renders modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardLink).click();
        cy.dataCy(selectorDialogCardEvent).should('be.visible');
      });
    });

    it('renders modal title, location and date', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardLink).click();
        cy.dataCy(selectorDialogHeader)
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', cardEvent.title)
          .then(($title) => {
            expect($title.text()).to.equal(cardEvent.title);
          });
        cy.dataCy(selectorDialogMeta)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8)
          .each(($el, index) => {
            if (index === 0) {
              cy.wrap($el)
                .should('contain', '1.')
                .and('contain', '2023')
                .and('contain', '12:00');
              cy.dataCy(selectorDialogMetaDateIcon)
                .should('be.visible')
                .and('have.color', primary)
                .invoke('width')
                .should('be.eq', iconSize);
              cy.dataCy(selectorDialogMetaDateIcon)
                .invoke('height')
                .should('be.eq', iconSize);
            }
            if (index === 1) {
              cy.wrap($el).should('contain', cardEvent.location);
              cy.dataCy(selectorDialogMetaLocationIcon)
                .should('be.visible')
                .and('have.color', primary)
                .invoke('width')
                .should('be.eq', iconSize);
              cy.dataCy(selectorDialogMetaLocationIcon)
                .invoke('height')
                .should('be.eq', iconSize);
            }
          });
      });
    });

    it('renders dialog content', () => {
      cy.dataCy(selectorCardLink).click();
      cy.dataCy(selectorDialogContent)
        .should('be.visible')
        .and('contain', 'We want to reward you for your support')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400');
      cy.dataCy(selectorButtonAddToCalendar).should('be.visible');
      cy.dataCy(selectorButtonAddToCalendar)
        .find('i')
        .first()
        .invoke('width')
        .should('be.eq', iconSize);
      cy.dataCy(selectorButtonAddToCalendar)
        .find('i')
        .first()
        .invoke('height')
        .should('be.eq', iconSize);
      cy.dataCy(selectorButtonAddToCalendar).click();
      cy.get('.q-menu')
        .should('be.visible')
        .find('.q-item')
        .should('have.length', 6);
    });

    it('renders dialog image', () => {
      cy.dataCy(selectorCardLink).click();
      cy.dataCy(selectorDialogBody).scrollTo('bottom', {
        ensureScrollable: false,
      });
      cy.dataCy(selectorDialogImage)
        .should('be.visible')
        .find('img')
        .then(($img) => {
          cy.testImageHeight($img);
          expect($img.attr('src')).to.equal(cardEvent.image.src);
        });
    });
  }
});

import { colors } from 'quasar';

import CardProgress from '../homepage/CardProgress.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgress } from '../../mocks/homepage';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const blueGrey1 = getPaletteColor('blue-grey-1');
const blueGrey5 = getPaletteColor('blue-grey-5');
const blueGrey7 = getPaletteColor('blue-grey-7');

const cardFirst = cardsProgress[0];
const card = cardsProgress[1];

describe('<CardProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardProgress', i18n);
  });

  context('desktop: dark', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card: cardFirst,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders white title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', white)
          .and('contain', cardFirst.title)
          .then(($title) => {
            expect($title.text()).to.equal(cardFirst.title);
          });
      });
    });

    it('renders prize icon', () => {
      cy.dataCy('card-progress-prizes-icon')
        .should('contain', cardFirst.prizes[0].icon)
        .and('have.color', white)
        .and('have.css', 'width', '24px')
        .and('have.css', 'height', '24px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', cardFirst.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', '220px')
        .and('have.css', 'height', '220px');
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', '48px');
    });

    it('renders larger placement number', () => {
      cy.dataCy('card-progress-prize-placement')
        .should('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white);
      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', white);
    });

    it('renders dark separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        blueGrey7,
      );
    });

    it('renders white share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', white)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-weight', '700');
    });

    it('renders white share link icon', () => {
      cy.dataCy('card-progress-share-icon')
        .should('have.color', white)
        .and('have.css', 'width', '18px')
        .and('have.css', 'height', '18px')
        .and('contain', 'share');
    });
  });

  context('desktop: light', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders dark title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .and('have.color', blueGrey5)
        .and('have.css', 'width', '18px')
        .and('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', card.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', '220px')
        .and('have.css', 'height', '220px');
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', '48px');
    });

    it('renders smaller placement number', () => {
      cy.dataCy('card-progress-prize-placement')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10);
    });

    it('renders light separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        blueGrey1,
      );
    });

    it('renders dark share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', grey10)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-weight', '700');
    });

    it('renders dark share link icon', () => {
      cy.dataCy('card-progress-share-icon')
        .should('have.color', grey10)
        .and('have.css', 'width', '18px')
        .and('have.css', 'height', '18px')
        .and('contain', 'share');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .and('have.color', blueGrey5)
        .and('have.css', 'width', '18px')
        .and('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .and('contain', card.progress);
      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .and('have.css', 'width', '128px')
        .and('have.css', 'height', '128px');
      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .and('have.css', 'font-size', '40px');
    });
  });
});

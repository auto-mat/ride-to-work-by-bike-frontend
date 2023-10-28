import { colors } from 'quasar';

import CardProgress from '../CardProgress.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgress } from '../../mocks/homepage';

const { getPaletteColor } = colors;

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
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', cardFirst.title)
          .then(($title) => {
            expect($title.text()).to.equal(cardFirst.title);
          });
      });
    });

    it('renders prize icon', () => {
      cy.dataCy('card-progress-prizes-icon')
        .should('contain', cardFirst.prizes[0].icon)
        .should('have.color', '#fff')
        .should('have.css', 'width', '24px')
        .should('have.css', 'height', '24px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', cardFirst.progress);

      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .should('have.css', 'width', '220px')
        .should('have.css', 'height', '220px');

      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .should('have.css', 'font-size', '48px');
    });

    it('renders larger placement number', () => {
      cy.dataCy('card-progress-prize-placement')
        .should('have.css', 'font-size', '24px')
        .should('have.css', 'font-weight', '700')
        .should('have.color', '#fff');

      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#fff');
    });

    it('renders dark separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        getPaletteColor('blue-grey-7'),
      );
    });

    it('renders white share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-weight', '700');
    });

    it('renders white share link icon', () => {
      cy.dataCy('card-progress-share-icon')
        .should('have.color', '#fff')
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px')
        .should('contain', 'share');
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
          .should('have.css', 'font-weight', '700')
          .should('have.color', getPaletteColor('grey-10'))
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .should('have.color', getPaletteColor('blue-grey-5'))
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress);

      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .should('have.css', 'width', '220px')
        .should('have.css', 'height', '220px');

      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .should('have.css', 'font-size', '48px');
    });

    it('renders smaller placement number', () => {
      cy.dataCy('card-progress-prize-placement')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '700')
        .should('have.color', getPaletteColor('grey-10'));

      cy.dataCy('card-progress-prize-label')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', getPaletteColor('grey-10'));
    });

    it('renders light separator', () => {
      cy.dataCy('card-progress-separator').should(
        'have.backgroundColor',
        getPaletteColor('blue-grey-1'),
      );
    });

    it('renders dark share link', () => {
      cy.dataCy('card-progress-share')
        .should('have.color', getPaletteColor('grey-10'))
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-weight', '700');
    });

    it('renders dark share link icon', () => {
      cy.dataCy('card-progress-share-icon')
        .should('have.color', getPaletteColor('grey-10'))
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px')
        .should('contain', 'share');
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
          .should('have.css', 'font-weight', '700')
          .should('have.color', getPaletteColor('grey-10'))
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .should('have.color', getPaletteColor('blue-grey-5'))
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress);

      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .should('have.css', 'width', '128px')
        .should('have.css', 'height', '128px');

      cy.dataCy('circular-progress-number')
        .should('be.visible')
        .should('have.css', 'font-size', '40px');
    });
  });
});

import { colors } from 'quasar';

import CardProgressSlider from '../CardProgressSlider.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgressSlider } from '../../mocks/homepage';

const { getPaletteColor } = colors;

const card = cardsProgressSlider[0];

describe('<CardProgressSlider>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['timeline', 'toDate'],
      'index.cardProgressSlider',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardProgressSlider, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
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
        .should('have.color', getPaletteColor('blue-grey-1'))
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders timeline', () => {
      cy.dataCy('card-progress-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('contain', i18n.global.t('index.cardProgressSlider.timeline'))
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('card-progress-timeline')
        .find('.q-linear-progress')
        .first()
        .should('be.visible');

      cy.dataCy('card-progress-timeline')
        .find('.q-linear-progress')
        .last()
        .should('not.be.visible');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress)
        .should('contain', i18n.global.t('index.cardProgressSlider.toDate'));

      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .should('have.css', 'width', '220px')
        .should('have.css', 'height', '220px');

      cy.dataCy('card-progress-percentage')
        .find('.circular-progress-number')
        .should('be.visible')
        .should('have.css', 'font-size', '48px');
    });

    it('renders stats', () => {
      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .should('have.color', '#fff')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-size', '12px');

      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].items[0].text)
        .should('have.color', '#fff')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'font-size', '14px');
    });

    it('does not render card footer with timeline', () => {
      cy.dataCy('card-progress-footer-mobile').should('not.be.visible');
    });

    // layout
    it('renders card header horizontally', () => {
      cy.dataCy('card-progress-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'justify-content', 'space-between')
        .should('have.css', 'align-items', 'center')
        .should('have.css', 'gap', '16px');
    });

    it('renders card content horizontally', () => {
      cy.dataCy('card-progress-content')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'align-items', 'center');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardProgressSlider, {
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
          .should('have.color', '#fff')
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
        .should('have.color', getPaletteColor('blue-grey-1'))
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders timeline', () => {
      cy.dataCy('card-progress-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('contain', i18n.global.t('index.cardProgressSlider.timeline'))
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('card-progress-timeline')
        .find('.q-linear-progress')
        .first()
        .should('not.be.visible');

      cy.dataCy('card-progress-timeline')
        .find('.q-linear-progress')
        .last()
        .should('be.visible');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress)
        .should('contain', i18n.global.t('index.cardProgressSlider.toDate'));

      cy.dataCy('card-progress-circular')
        .should('be.visible')
        .should('have.css', 'width', '128px')
        .should('have.css', 'height', '128px');

      cy.dataCy('card-progress-percentage')
        .find('.circular-progress-number')
        .should('be.visible')
        .should('have.css', 'font-size', '40px');
    });

    it('renders stats', () => {
      cy.dataCy('card-progress-stats').should('not.be.visible');
    });

    // layout
    it('wraps items in card header', () => {
      cy.dataCy('card-progress-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'gap', '16px');
    });
  });
});

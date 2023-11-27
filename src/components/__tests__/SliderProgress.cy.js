import { colors } from 'quasar';

import SliderProgress from '../homepage/SliderProgress.vue';
import { hexToRgb } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');
const blueGrey3 = getPaletteColor('blue-grey-3');

// mocks
import { progressStats, cardsProgress } from 'src/mocks/homepage';
const cards = cardsProgress.slice(0, 5);

describe('<SliderProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.progressSlider',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(SliderProgress, {
        props: {
          title: i18n.global.t('index.progressSlider.title'),
          stats: progressStats,
          cards: cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: '/vysledky',
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain', i18n.global.t('index.progressSlider.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.progressSlider.title'),
            );
          });
      });
    });

    it('renders list of stats', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-stats-item').should('have.length', 3);
        cy.dataCy('progress-slider-stats-item').each(($item, index) => {
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .and('have.color', grey10);
          cy.wrap($item)
            .find('.q-icon')
            .should('contain', progressStats[index].icon)
            .and('have.color', blueGrey3)
            .and('have.css', 'width', '18px')
            .and('have.css', 'height', '18px');
          cy.wrap($item)
            .find('span')
            .should('contain', progressStats[index].label)
            .and('have.color', grey10);
          cy.wrap($item)
            .find('strong')
            .should('contain', progressStats[index].value)
            .and('have.color', grey10)
            .and('have.css', 'font-weight', '700');
        });
      });
    });

    it('renders a slider with stat cards', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container').should('be.visible');
      });
    });

    it('renders swiper navigation buttons', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('be.visible')
          .and('have.css', 'width', '38px')
          .and('have.css', 'height', '38px')
          .and('have.css', 'border', `1px solid ${hexToRgb('#212121')}`);
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('be.visible')
          .and('have.css', 'width', '38px')
          .and('have.css', 'height', '38px')
          .and('have.css', 'border', `1px solid ${hexToRgb('#212121')}`);
      });
    });

    it('changes button disabled state after navigation', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '0.35');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .click();
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .click();
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '0.35');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
      });
    });

    it('renders button with title', () => {
      cy.dataCy('progress-slider-button')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.color', grey10)
        .and('have.css', 'border-radius', '28px')
        .and('contain', i18n.global.t('index.progressSlider.button'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.progressSlider.button'),
          );
        });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SliderProgress, {
        props: {
          title: i18n.global.t('index.progressSlider.title'),
          stats: progressStats,
          cards: cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: '/vysledky',
          },
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain', i18n.global.t('index.progressSlider.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.progressSlider.title'),
            );
          });
      });
    });

    it('renders list of stats', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-stats-item').should('have.length', 3);
        cy.dataCy('progress-slider-stats-item').each(($item, index) => {
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .and('have.color', grey10);
          cy.wrap($item)
            .find('.q-icon')
            .should('contain', progressStats[index].icon)
            .and('have.color', blueGrey3)
            .and('have.css', 'width', '18px')
            .and('have.css', 'height', '18px');
          cy.wrap($item)
            .find('span')
            .should('contain', progressStats[index].label)
            .and('have.color', grey10);
          cy.wrap($item)
            .find('strong')
            .should('contain', progressStats[index].value)
            .and('have.color', grey10)
            .and('have.css', 'font-weight', '700');
        });
      });
    });

    it('renders a slider with stat cards', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container').should('be.visible');
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-button')
          .should('be.visible')
          .and('have.css', 'border-color', hexToRgb('#212121'))
          .and('have.css', 'border-radius', '28px')
          .and('contain', i18n.global.t('index.progressSlider.button'));
        cy.testElementPercentageWidth(cy.dataCy('progress-slider-button'), 100);
      });
    });
  });
});

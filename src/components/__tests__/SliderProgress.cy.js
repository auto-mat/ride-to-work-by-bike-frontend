import { colors } from 'quasar';
import SliderProgress from '../homepage/SliderProgress.vue';
import { hexToRgb } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { routesConf } from '../../router/routes_conf';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const classSelectorSwiperButtonPrev = '.swiper-button-prev';
const classSelectorSwiperButtonNext = '.swiper-button-next';
const selectorProgressSliderButton = 'progress-slider-button';
const selectorProgressSliderSectionTitle = 'progress-slider-section-title';
const selectorProgressSliderSectionStats = 'progress-slider-section-stats';
const selectorProgressSliderStats = 'progress-slider-stats';
const selectorSectionHeadingTitle = 'section-heading-title';
const selectorStatsBarItem = 'stats-bar-item';
const selectorSwiperContainer = 'swiper-container';

// variables
const buttonSize = '38px';
const opacityDisabled = '0.35';
const opacityEnabled = '1';

describe('<SliderProgress>', () => {
  let cards;
  let stats;

  before(() => {
    cy.fixture('cardsProgress').then((cardsData) => {
      cards = cardsData.slice(0, 5);
    });
    cy.fixture('statsBar').then((statsData) => {
      stats = statsData;
    });
  });

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
          stats,
          cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: routesConf['results']['path'],
          },
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    desktopTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SliderProgress, {
        props: {
          title: i18n.global.t('index.progressSlider.title'),
          stats,
          cards,
          button: {
            title: i18n.global.t('index.progressSlider.button'),
            url: routesConf['results']['path'],
          },
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.window().then(() => {
      // title
      cy.dataCy(selectorSectionHeadingTitle)
        .and('contain', i18n.global.t('index.progressSlider.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.progressSlider.title'),
          );
        });
      // stats
      cy.dataCy(selectorProgressSliderStats).should('be.visible');
      cy.dataCy(selectorStatsBarItem).should('have.length', 3);
    });
  });

  it('renders a slider with stat cards', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer).should('be.visible');
    });
  });

  it('renders button with title', () => {
    cy.dataCy(selectorProgressSliderButton)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '500')
      .and('have.css', 'text-transform', 'uppercase')
      .and('have.color', primary)
      .and('have.css', 'border-radius', '28px')
      .and('contain', i18n.global.t('index.progressSlider.button'))
      .then(($title) => {
        expect($title.text()).to.equal(
          i18n.global.t('index.progressSlider.button'),
        );
      });
  });
}

function desktopTests() {
  it('renders title and stats side by side', () => {
    cy.testElementsSideBySide(
      selectorProgressSliderSectionTitle,
      selectorProgressSliderSectionStats,
    );
  });

  it('renders swiper navigation buttons', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('be.visible')
        .and('have.css', 'width', buttonSize)
        .and('have.css', 'height', buttonSize)
        .and('have.css', 'border', `1px solid ${hexToRgb(grey10)}`);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('be.visible')
        .and('have.css', 'width', buttonSize)
        .and('have.css', 'height', buttonSize)
        .and('have.css', 'border', `1px solid ${hexToRgb(grey10)}`);
    });
  });

  it('changes button disabled state after navigation', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityDisabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .click();
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .click();
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonPrev)
        .should('have.css', 'opacity', opacityDisabled);
      cy.dataCy(selectorSwiperContainer)
        .shadow()
        .find(classSelectorSwiperButtonNext)
        .should('have.css', 'opacity', opacityEnabled);
    });
  });
}

function mobileTests() {
  it('renders full-width button', () => {
    cy.window().then(() => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorProgressSliderButton),
        100,
      );
    });
  });
}

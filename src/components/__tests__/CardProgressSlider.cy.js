import { colors } from 'quasar';
import CardProgressSlider from '../homepage/CardProgressSlider.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');
const white = getPaletteColor('white');

// Selectors
const dataSelectorCardProgressStatsTitle =
  '[data-cy="card-progress-stats-title"]';
const selectorCardProgressSlider = 'card-progress-slider';
const selectorCardProgressContent = 'card-progress-content';
const selectorCardProgressTimeline = 'linear-progress-numbers';
const selectorCardProgressStats = 'card-progress-stats';
const selectorCardProgressFooterMobile = 'card-progress-footer-mobile';
const selectorCardProgressHeader = 'card-progress-header';
const selectorCardProgressTitle = 'card-progress-title';
const selectorCardProgressCircular = 'card-section-progress';
const selectorCardProgressSectionStats = 'card-section-stats';
const selectorCardProgressCircularCaption = 'card-progress-circular-caption';
const selectorCardProgressCircularNumber = 'card-progress-circular-number';

// variables
const iconSize = '18px';
const progressCircularFontSize = 36;

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
      cy.fixture('cardProgressSlider').then((card) => {
        cy.wrap(card).as('cardProgress');
        cy.mount(CardProgressSlider, {
          props: {
            card,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    desktopTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('cardProgressSlider').then((card) => {
        cy.wrap(card).as('cardProgress');
        cy.mount(CardProgressSlider, {
          props: {
            card,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.get('@cardProgress').then((card) => {
      // component
      cy.dataCy(selectorCardProgressSlider)
        .should('be.visible')
        .and(
          'have.css',
          'border-radius',
          rideToWorkByBikeConfig.borderRadiusCard,
        )
        .and('have.backgroundColor', primary);
      // header
      cy.dataCy(selectorCardProgressHeader)
        .should('be.visible')
        .and('have.backgroundColor', primary);
      // header icon
      cy.dataCy(selectorCardProgressHeader)
        .find('.q-icon')
        .should('contain', card.icon)
        .and('have.color', white)
        .and('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
      // title
      cy.dataCy(selectorCardProgressTitle)
        .should('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white)
        .and('contain', card.title)
        .then(($title) => {
          expect($title.text()).to.equal(card.title);
        });
      // timeline
      cy.dataCy(selectorCardProgressTimeline)
        .should('be.visible')
        .and('contain', card.duration.current)
        .and('contain', card.duration.total)
        .and('contain', i18n.global.t('index.cardProgressSlider.timeline'));
      // circular progress
      cy.dataCy(selectorCardProgressCircular).should('be.visible');
      // circular caption
      cy.dataCy(selectorCardProgressCircularCaption)
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', white)
        .and('contain', i18n.global.t('index.cardProgressSlider.toDate'));
      // circular number
      cy.dataCy(selectorCardProgressCircularNumber)
        .should('be.visible')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white)
        .and('contain', card.progress);
    });
  });
}

function desktopTests() {
  it('renders title and linear progress side by side', () => {
    cy.testElementsSideBySide(
      selectorCardProgressTitle,
      selectorCardProgressTimeline,
    );
    // wrapper classes
    cy.dataCy(selectorCardProgressHeader)
      .should('be.visible')
      .and('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'row')
      .and('have.css', 'justify-content', 'space-between')
      .and('have.css', 'align-items', 'center')
      .and('have.css', 'gap', '16px');
  });

  it('renders circular progress and stats side by side', () => {
    cy.testElementsSideBySide(
      selectorCardProgressCircular,
      selectorCardProgressSectionStats,
    );
    // wrapper classes
    cy.dataCy(selectorCardProgressContent)
      .should('be.visible')
      .and('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'row')
      .and('have.css', 'align-items', 'center');
  });

  it('renders desktop version of timeline progress bar', () => {
    // desktop timeline
    cy.dataCy(selectorCardProgressTimeline)
      .find('.q-linear-progress')
      .first()
      .should('be.visible');
    // mobile timeline
    cy.dataCy(selectorCardProgressTimeline)
      .find('.q-linear-progress')
      .should('have.length', 1);
  });

  it('renders stats', () => {
    cy.get('@cardProgress').then((card) => {
      cy.dataCy(selectorCardProgressStats)
        .should('be.visible')
        .find(dataSelectorCardProgressStatsTitle)
        .first()
        .should('contain', card.stats[0].title)
        .and('have.color', secondary)
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'font-size', '12px');
      cy.dataCy(selectorCardProgressStats)
        .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].items[0].text)
        .and('have.color', white)
        .and('have.css', 'font-weight', '400')
        .and('have.css', 'font-size', '14px');
    });
  });

  it('does not render card footer with timeline', () => {
    cy.dataCy(selectorCardProgressFooterMobile).should('not.exist');
  });
}

function mobileTests() {
  it('renders timeline progress bar', () => {
    cy.dataCy(selectorCardProgressTimeline)
      .find('.q-linear-progress')
      .first()
      .should('not.be.visible');
    cy.dataCy(selectorCardProgressTimeline)
      .find('.q-linear-progress')
      .last()
      .should('be.visible');
  });

  it('does not render stats', () => {
    cy.dataCy(selectorCardProgressStats).should('not.be.visible');
  });

  it('renders smaller circular progress number', () => {
    cy.dataCy(selectorCardProgressCircularNumber)
      .should('be.visible')
      .and('have.css', 'font-size', `${progressCircularFontSize}px`);
  });

  it('wraps items in card header', () => {
    cy.dataCy(selectorCardProgressHeader)
      .should('be.visible')
      .and('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'row')
      .and('have.css', 'flex-wrap', 'wrap')
      .and('have.css', 'gap', '16px');
  });
}

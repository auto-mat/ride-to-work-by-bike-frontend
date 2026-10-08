import { colors } from 'quasar';
import CardChallenge from '../homepage/CardChallenge.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');
const { borderRadiusCard } = rideToWorkByBikeConfig;

// Selectors
const selectorCard = 'card';
const selectorCardTitle = 'card-title';
const selectorCardLink = 'card-link';
const selectorCardGradientOverlay = 'card-gradient-overlay';
const selectorCardDates = 'card-dates';
const selectorCardDatesDate = 'card-dates-date';
const selectorCardCompanyWrapper = 'card-company-wrapper';
const selectorCardCompany = 'card-company';

describe('<CardChallenge>', () => {
  let cardData;

  before(() => {
    cy.fixture('cardChallenge').then((data) => {
      cardData = data;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['dates', 'company'],
      'index.cardChallenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardChallenge, {
        props: {
          card: cardData,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardChallenge, {
        props: {
          card: cardData,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders title with icon on gray background', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardTitle)
          .should('be.visible')
          .and('have.css', 'padding-top', '16px')
          .and('have.css', 'padding-bottom', '16px')
          .and('have.backgroundColor', primary)
          .and('contain', cardData.title);
        cy.dataCy(selectorCardTitle)
          .find('i')
          .should('be.visible')
          .and('have.css', 'padding-top', '8px')
          .and('have.css', 'padding-bottom', '8px')
          .and('contain', 'person');
        cy.dataCy(selectorCardTitle)
          .find('a')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'padding-top', '8px')
          .and('have.css', 'padding-bottom', '8px')
          .and('have.css', 'font-weight', '700')
          .then(($title) => {
            expect($title.text()).to.equal(cardData.title);
          });
      });
    });

    it('renders title link', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardLink)
          .should('be.visible')
          .and('have.attr', 'href', cardData.url);
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCard)
          .find('img')
          .should('be.visible')
          .then(($img) => {
            const naturalHeight = $img[0].naturalHeight;
            expect(naturalHeight).to.be.greaterThan(0);
            expect($img.attr('src')).to.equal(cardData.image.src);
          });
      });
    });

    it('renders gradient overlay with correct properties', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardGradientOverlay)
          .should('be.visible')
          .and('have.css', 'position', 'absolute')
          .and('have.css', 'top', '0px')
          .and('have.css', 'left', '0px')
          .and('have.css', 'right', '0px')
          .and('have.css', 'bottom', '0px')
          .and(($el) => {
            const backgroundImage = $el.css('background-image');
            expect(backgroundImage).to.include('linear-gradient');
            expect(backgroundImage).to.include('rgba(0, 0, 0, 0) 69%');
            expect(backgroundImage).to.include('rgba(0, 0, 0, 0.5) 100%');
          })
          .and('have.css', 'pointer-events', 'none')
          .and(($el) => {
            const borderBottomLeftRadius = $el.css('border-bottom-left-radius');
            const borderBottomRightRadius = $el.css(
              'border-bottom-right-radius',
            );
            expect(borderBottomLeftRadius).to.equal(borderRadiusCard);
            expect(borderBottomRightRadius).to.equal(borderRadiusCard);
          });
      });
    });

    it('renders dates', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardDates)
          .should('be.visible')
          .and('have.color', white)
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('contain', cardData.dates);
        cy.dataCy(selectorCardDatesDate)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '700');
      });
    });

    it('renders company badge', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCardCompanyWrapper)
          .should('be.visible')
          .and('have.css', 'position', 'absolute')
          .and('have.css', 'top', '-12px');
        cy.dataCy(selectorCardCompany)
          .should('be.visible')
          .and('have.css', 'border-radius', '12px')
          .and('have.css', 'font-size', '12px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', primary)
          .and('have.backgroundColor', secondary)
          .and('have.css', 'height', '24px')
          .and('contain.text', i18n.global.t('index.cardChallenge.company'));
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy(selectorCard)
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadiusCard);
      });
    });
  }
});

import { colors } from 'quasar';
import ListCardFollow from '../homepage/ListCardFollow.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<ListCardFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.cardListFollow', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.mount(ListCardFollow, {
          props: {
            cards: listCardsFollow,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('renders items in three columns', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('card-list-follow-col-title'),
          33,
        );
        cy.testElementPercentageWidth(cy.dataCy('card-list-follow-item'), 33);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.mount(ListCardFollow, {
          props: {
            cards: listCardsFollow,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders items in one column', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('card-list-follow-col-title'),
          100,
        );
        cy.testElementPercentageWidth(cy.dataCy('card-list-follow-item'), 100);
      });
    });
  });
});

function coreTests() {
  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy('section-heading-title')
        .should('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', black)
        .and('contain', i18n.global.t('index.cardListFollow.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.cardListFollow.title'),
          );
        });
    });
  });

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.dataCy('card-list-follow-item').should('have.length', 2);
    });
  });

  it('aligns items center', () => {
    cy.window().then(() => {
      cy.dataCy('card-list-follow').should('have.css', 'align-items', 'center');
    });
  });
}

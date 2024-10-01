import ListCardFollow from '../homepage/ListCardFollow.vue';
import { i18n } from '../../boot/i18n';

// selectors
const cardListFollow = 'card-list-follow';
const cardListFollowColTitle = 'card-list-follow-col-title';
const cardListFollowItem = 'card-list-follow-item';
const cardListFollowItem1 = 'card-list-follow-item-1';
const cardListFollowItem2 = 'card-list-follow-item-2';
const sectionHeadingTitle = 'section-heading-title';

// variables
const cardsCount = 2;
const widthFull = 100;
const widthHalf = 50;

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

    it('renders title stacked and cards side by side', () => {
      cy.window().then(() => {
        // title full width
        cy.testElementPercentageWidth(
          cy.dataCy(cardListFollowColTitle),
          widthFull,
        );
        // cards side by side 50% width
        cy.testElementsSideBySide(cardListFollowItem1, cardListFollowItem2);
        cy.testElementPercentageWidth(cy.dataCy(cardListFollowItem), widthHalf);
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
          cy.dataCy(cardListFollowColTitle),
          widthFull,
        );
        cy.testElementPercentageWidth(cy.dataCy(cardListFollowItem), widthFull);
      });
    });
  });
});

function coreTests() {
  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy(sectionHeadingTitle)
        .should('contain', i18n.global.t('index.cardListFollow.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.cardListFollow.title'),
          );
        });
    });
  });

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.dataCy(cardListFollowItem).should('have.length', cardsCount);
    });
  });

  it('aligns items center', () => {
    cy.window().then(() => {
      cy.dataCy(cardListFollow).should('have.css', 'align-items', 'center');
    });
  });
}

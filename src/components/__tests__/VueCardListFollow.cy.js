import VueCardListFollow from 'components/VueCardListFollow.vue';
import { i18n } from '../../boot/i18n';

const card = {
  title: 'Do práce na kole – Brno',
  handle: '@DPNKBrno',
  image: 'https://picsum.photos/id/76/300/300',
  url: '#',
}

const cards = [card, card]

describe('<VueCardListFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.cardListFollow');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardListFollow, {
        props: {
          cards: cards,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.cardListFollow.title'))
          .then(($title) => {
            expect($title.text()).to.equal(i18n.global.t('index.cardListFollow.title'));
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-item').should('have.length', 2);
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-col-title').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(33, 5);
        });

        cy.dataCy('card-list-follow-item').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(33, 5);
        });
      });
    });

    it('aligns items center', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow').should(
          'have.css',
          'align-items',
          'center'
        );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardListFollow, {
        props: {
          cards: cards,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-follow-col-title').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(100, 5);
        });

        cy.dataCy('card-list-follow-item').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(100, 5);
        });
      });
    });
  });

  function calculatePercentageWidth($element) {
    const elementWidth = $element[0].clientWidth;
    const parentWidth = $element[0].parentNode.clientWidth;
    return (elementWidth / parentWidth) * 100;
  }
});

import VueCardListOffer from 'components/VueCardListOffer.vue';
import { i18n } from '../../boot/i18n';

const listTitle = 'Akční nabídky';

const cardOffer = {
  title: '100 CZK voucher do e-shopu Automatu',
  expirationDate: 'Some time later on',
  issuer: 'Automat',
  image: 'https://picsum.photos/380/380',
  code: '65972834',
  link: {
    title: 'Navštívit e-shop',
    url: '#',
    target: '_blank',
  },
  icon: 'pedal_bike',
  content:
    'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
};

const cards = [
  cardOffer,
  cardOffer,
  cardOffer,
  cardOffer,
  cardOffer,
  cardOffer,
  cardOffer,
  cardOffer,
];

describe('<VueCardListOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title', 'button'], 'index.cardListOffer');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardListOffer, {
        props: {
          title: listTitle,
          cards: cards,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', listTitle)
          .then(($title) => {
            expect($title.text()).to.equal(listTitle);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer-item').should('have.length', 6);
      });
    });

    it('renders items in a 3 col grid', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer').should('have.css', 'display', 'grid');

        cy.dataCy('card-list-offer-item').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(33, 5);
        });
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer-button')
          .should('be.visible')
          .should(
            'contain',
            i18n.global.t('index.cardListOffer.button', {
              count: cards.length,
            })
          );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardListOffer, {
        props: {
          title: listTitle,
          cards: cards,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', listTitle)
          .then(($title) => {
            expect($title.text()).to.equal(listTitle);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer-item').should('have.length', 6);
      });
    });

    it('renders items in a 1 col grid', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer').should('have.css', 'display', 'grid');

        cy.dataCy('card-list-offer-item').then(($element) => {
          expect(calculatePercentageWidth($element)).to.be.closeTo(100, 5);
        });
      });
    });

    it('renders show more button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-offer-button')
          .should('be.visible')
          .should(
            'contain',
            i18n.global.t('index.cardListOffer.button', {
              count: cards.length,
            })
          );
      });
    });

  });

  function calculatePercentageWidth($element) {
    const elementWidth = $element[0].clientWidth;
    const parentWidth = $element[0].parentNode.clientWidth;
    return (elementWidth / parentWidth) * 100;
  }
});

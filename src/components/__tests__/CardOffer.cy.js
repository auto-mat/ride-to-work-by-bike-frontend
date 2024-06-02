import { colors } from 'quasar';

import CardOffer from '../homepage/CardOffer.vue';
import { i18n } from '../../boot/i18n';
import { cardsOffer } from '../../mocks/homepage';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const { borderRadiusCard } = rideToWorkByBikeConfig;

const card = cardsOffer[0];

describe('<CardOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['unlimitedExpirationDate', 'offerCode'],
      'index.cardOffer',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardOffer, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadiusCard);
      });
    });

    it('has border', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').should(
          'have.css',
          'border',
          '1px solid rgba(0, 0, 0, 0.12)',
        );
      });
    });

    it('shows modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-offer').should('be.visible');
      });
    });

    it('shows modal with title', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('shows modal with two columns', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 50);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 50);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardOffer, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadiusCard);
      });
    });

    it('has border', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').should(
          'have.css',
          'border',
          '1px solid rgba(0, 0, 0, 0.12)',
        );
      });
    });

    it('has no shadow', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').should('have.css', 'box-shadow', 'none');
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders icon', () => {
      cy.window().then(() => {
        cy.dataCy('card-icon')
          .should('be.visible')
          .and('contain', card.icon)
          .and('have.css', 'height', '48px')
          .and('have.css', 'width', '48px')
          .and('have.color', 'rgb(176, 190, 197)');
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .should('be.visible')
          .and('have.backgroundColor', white);
      });
    });

    it('shows modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-offer').should('be.visible');
      });
    });

    it('shows modal with title', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('shows modal content', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-body')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain', card.content);
      });
    });

    it('shows modal image', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.dataCy('dialog-body').scrollTo('bottom');
        cy.dataCy('dialog-body')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image.src);
          });
        cy.matchImageSnapshotWithHiddenScrollbars(
          'dialog-body',
          0.5,
          'percent',
        );
      });
    });

    it('shows modal with one column', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 100);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 100);
      });
    });
  });
});

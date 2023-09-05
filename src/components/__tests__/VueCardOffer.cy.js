import VueCardOffer from 'components/VueCardOffer.vue';
import { i18n } from '../../boot/i18n';
import { cardsOffer } from 'src/mocks/homepage';

const card = cardsOffer[0];

describe('<VueCardOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['unlimitedExpirationDate', 'offerCode'],
      'index.cardOffer',
      i18n
    );
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardOffer, {
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
          .should('have.css', 'border-radius', '20px');
      });
    });

    it('has border', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').should(
          'have.css',
          'border',
          '1px solid rgba(0, 0, 0, 0.12)'
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
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#212121')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders icon', () => {
      cy.window().then(() => {
        cy.dataCy('card-icon')
          .should('be.visible')
          .should('contain', card.icon)
          .should('have.css', 'height', '48px')
          .should('have.css', 'width', '48px')
          .should('have.color', 'rgb(176, 190, 197)');
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .should('be.visible')
          .should('have.backgroundColor', '#ffffff');
      });
    });

    it('shows modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .click()
          .then(() => {
            cy.dataCy('dialog-card-offer').should('be.visible');
          });
      });
    });

    it('shows modal with title', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .click()
          .then(() => {
            cy.dataCy('dialog-header')
              .find('h3')
              .should('be.visible')
              .should('have.css', 'font-size', '20px')
              .should('have.css', 'font-weight', '500')
              .should('contain', card.title)
              .then(($title) => {
                expect($title.text()).to.equal(card.title);
              });
          });
      });
    });

    it('shows modal content', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .click()
          .then(() => {
            cy.dataCy('dialog-body')
              .should('be.visible')
              .should('have.css', 'font-size', '14px')
              .should('have.css', 'font-weight', '400')
              .should('have.color', '#000000')
              .should('contain', card.content);
          });
      });
    });

    it('shows modal image', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer')
          .click()
          .then(() => {
            cy.dataCy('dialog-body')
              .scrollTo('bottom')
              .find('img')
              .should('be.visible')
              .then(($img) => {
                cy.testImageHeight($img);
                expect($img.attr('src')).to.equal(card.image);
              });

            cy.dataCy('dialog-body').find('img').matchImageSnapshot({
              failureThreshold: 0.5,
              failureThresholdType: 'percent',
            });
          });
      });
    });
  });
});

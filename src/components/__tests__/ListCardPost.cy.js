import { colors } from 'quasar';
import ListCardPost from '../homepage/ListCardPost.vue';
import { hexToRgb } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';

// mocks
import { cardsPost } from 'src/mocks/homepage';
const title = i18n.global.t('index.cardListPost.title');
const cards = cardsPost.slice(0, 5);
const button = {
  title: i18n.global.t('index.cardListPost.button'),
  url: '/blog',
};

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<ListCardPost>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListPost',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ListCardPost, {
        props: {
          title,
          cards,
          button,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-item').should('have.length', 5);
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
          .should('have.css', 'opacity', '0.35');
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

    it('renders button container', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-buttons')
          .should('be.visible')
          .and('have.css', 'text-align', 'center');
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-button')
          .should('be.visible')
          .and('have.css', 'border-color', hexToRgb('#212121'))
          .and('have.css', 'border-radius', '28px')
          .and('contain', button.title);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ListCardPost, {
        props: {
          title,
          cards,
          button,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-item').should('have.length', 5);
      });
    });

    it('renders button container', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-buttons').should('be.visible');
        cy.testElementPercentageWidth(cy.dataCy('card-list-post-buttons'), 100);
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-button')
          .should('be.visible')
          .and('have.css', 'border-color', hexToRgb('#212121'))
          .and('have.css', 'border-radius', '28px')
          .and('contain', button.title);
        cy.testElementPercentageWidth(cy.dataCy('card-list-post-button'), 100);
      });
    });
  });
});

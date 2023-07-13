import VueCardListPost from 'components/VueCardListPost.vue';
import { hexToRgb } from '../../../test/cypress/utils';

const listTitle = 'Novinky';
const buttonTitle = 'Navštívit blog';
const buttonUrl = '/blog';
const title = 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?';
const date = new Date(2023, 8, 1);
const image = 'https://picsum.photos/id/100/380/380';

const cardPost = {
  title,
  date,
  image,
};

const cards = [cardPost, cardPost, cardPost, cardPost, cardPost];

describe('<VueCardListPost>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title', 'button'], 'index.cardListPost');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardListPost, {
        props: {
          title: listTitle,
          cards: cards,
          button: {
            title: buttonTitle,
            url: buttonUrl,
          },
        },
      });
      cy.viewport('macbook-13');
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
        cy.dataCy('card-list-post-item').should('have.length', 5);

        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(2)').should('be.visible');
        cy.get('.swiper-slide:nth-child(3)').should('be.visible');
        cy.get('.swiper-slide:nth-child(4)').should('be.visible');
        cy.get('.swiper-slide:nth-child(5)').should('not.be.visible');
      });
    });

    it('renders swiper navigation buttons', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#bdbdbd')}`);
        cy.get('.swiper-button-next')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#212121')}`);
      });
    });

    it('navigates after button click', () => {
      cy.window().then(() => {
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(5)').should('not.be.visible');
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-slide:nth-child(1)').should('not.be.visible');
        cy.get('.swiper-slide:nth-child(5)').should('be.visible');
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(5)').should('not.be.visible');
      });
    });

    it('changes button disabled state after navigation', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
      });
    });

    it('renders button container', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-buttons')
          .should('be.visible')
          .should('have.css', 'text-align', 'center');
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-button')
          .should('be.visible')
          .should('have.css', 'border-color', hexToRgb('#212121'))
          .should('have.css', 'border-radius', '28px')
          .should('contain', buttonTitle);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardListPost, {
        props: {
          title: listTitle,
          cards: cards,
          button: {
            title: buttonTitle,
            url: buttonUrl,
          },
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
        cy.dataCy('card-list-post-item').should('have.length', 5);

        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(2)').should('be.visible');
        cy.get('.swiper-slide:nth-child(3)').should('not.be.visible');
        cy.get('.swiper-slide:nth-child(4)').should('not.be.visible');
        cy.get('.swiper-slide:nth-child(5)').should('not.be.visible');
      });
    });

    it('renders swiper navigation buttons', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#bdbdbd')}`);
        cy.get('.swiper-button-next')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#212121')}`);
      });
    });

    it('navigates after button click', () => {
      cy.window().then(() => {
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(3)').should('not.be.visible');
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-slide:nth-child(1)').should('not.be.visible');
        cy.get('.swiper-slide:nth-child(3)').should('be.visible');
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(3)').should('not.be.visible');
      });
    });

    it('changes button disabled state after navigation', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
      });
    });

    it('renders button container', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-buttons')
          .should('be.visible')
          .should('have.css', 'text-align', 'left');
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-button')
          .should('be.visible')
          .should('have.css', 'border-color', hexToRgb('#212121'))
          .should('have.css', 'border-radius', '28px')
          .should('contain', buttonTitle);
      });
    });
  });
});

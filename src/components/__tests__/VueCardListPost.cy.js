import VueCardListPost from 'components/VueCardListPost.vue';

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
    cy.testLanguageStringsInContext([], 'index.cardListPost');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardListPost, {
        props: {
          cards: cards,
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
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('card-list-post-item')
          .should('have.length', 5)
          .then(($items) => {
            for (let i = 0; i < 4; i++) {
              cy.wrap($items[i]).should('be.visible');
            }

            for (let i = 4; i < $items.length; i++) {
              cy.wrap($items[i]).should('be.hidden');
            }
          });
      });
    });
  });

  // context('mobile', () => {
  //   beforeEach(() => {
  //     cy.mount(VueCardListPost, {
  //       props: {
  //         cards: cards,
  //       },
  //     });
  //     cy.viewport('iphone-6');
  //   });

  // });
});

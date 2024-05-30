import CardPrize from 'components/global/CardPrize.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CardPrize>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'cardPrize', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listResultsPrizes').then((listPrize) => {
        cy.wrap(listPrize.cards[0]).as('card');
        cy.mount(CardPrize, {
          props: {
            card: listPrize.cards[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows dialog content in two columns', () => {
      cy.window().then(() => {
        cy.dataCy('card-prize').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 50);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 50);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listResultsPrizes').then((listPrize) => {
        cy.wrap(listPrize.cards[0]).as('card');
        cy.mount(CardPrize, {
          props: {
            card: listPrize.cards[0],
          },
        });
      });
    });

    coreTests();

    it('shows modal content in one column', () => {
      cy.window().then(() => {
        cy.dataCy('card-prize').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 100);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 100);
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('card-prize').should('be.visible');
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-prize')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadiusCard);

      cy.dataCy('card-prize-image')
        .should('be.visible')
        .and('have.css', 'border-top-left-radius', borderRadiusCard)
        .and('have.css', 'border-top-right-radius', borderRadiusCard);
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-prize').click();
        // shows dialog
        cy.dataCy('dialog-prize').should('be.visible');
        // dialog title
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
        // content
        cy.dataCy('dialog-body')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .then(($el) => {
            const textContent = $el.text();
            cy.stripHtmlTags(card.content).then((text) => {
              expect(textContent).to.contain(text);
            });
          });
        // image
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('dialog-body')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image.src);
          });
      });
    });
  });
}

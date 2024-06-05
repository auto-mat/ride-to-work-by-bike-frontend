import CardLocation from 'components/global/CardLocation.vue';
import { i18n } from '../../boot/i18n';

describe('<CardLocation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsLocation').then((listLocations) => {
        cy.wrap(listLocations[0]).as('card');
        cy.mount(CardLocation, {
          props: {
            card: listLocations[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsLocation').then((listLocations) => {
        cy.wrap(listLocations[0]).as('card');
        cy.mount(CardLocation, {
          props: {
            card: listLocations[0],
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it.only('renders component', () => {
    cy.dataCy('card-location').should('be.visible');
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-location')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadiusCard);

      cy.dataCy('card-location-image')
        .should('be.visible')
        .and('have.css', 'border-top-left-radius', borderRadiusCard)
        .and('have.css', 'border-top-right-radius', borderRadiusCard);
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-location').click();
        // shows dialog
        cy.dataCy('dialog-location').should('be.visible');
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

import VueCardStats from 'components/VueCardStats.vue';
import { i18n } from '../../boot/i18n';
import { cardsStats } from 'src/mocks/homepage';

const card = cardsStats[0];

describe('<VueCardStats>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardStats, {
        props: {
          card
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-stats-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#000')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(
              card.title
            );
          });
      });
    })

    it('renders icon', () => {
      cy.dataCy('card-stats-icon')
        .should('contain', card.icon)
        .should('have.color', '#b0bec5') // blue-grey-3
        .should('have.css', 'width', '48px')
        .should('have.css', 'height', '48px');
    })

    it('renders stats', () => {
      cy.dataCy('card-stats-item')
        .should('have.length', card.stats.length);

      cy.dataCy('card-stats-item')
        .each(($item, index) => {
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('have.color', '#000')
            .should('contain', card.stats[index].text)
        })

      cy.dataCy('card-stats-item')
        .each(($item, index) => {
          cy.wrap($item)
            .find('.q-icon')
            .should('contain', card.stats[index].icon)
            .should('have.color', '#b0bec5') // blue-grey-3
            .should('have.css', 'width', '14px')
            .should('have.css', 'height', '14px');
        })
    })

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card-stats').should('have.css', 'border-radius', '20px');
      });
    })
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardStats, {
        props: {
          card
        },
      });
      cy.viewport('iphone-6');
    });
  });
});

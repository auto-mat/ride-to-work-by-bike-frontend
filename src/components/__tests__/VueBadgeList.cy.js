import VueBadgeList from 'components/VueBadgeList.vue';
import { i18n } from '../../boot/i18n';
import { badgeList } from 'src/mocks/homepage';

describe('<VueBadgeList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.badgeList', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueBadgeList, {
        props: {
          items: badgeList
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('badge-item-title')
          .first()
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'text-align', 'center')
          .should('have.color', '#424242') // bg-grey-9
          .should('contain', badgeList[0].title)
          .then(($title) => {
            expect($title.text()).to.equal(badgeList[0].title);
          });
      });
    })

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('badge-item-description')
          .first()
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.css', 'text-align', 'center')
          .should('have.color', '#424242') // bg-grey-9
          .should('contain', badgeList[0].description)
          .then(($description) => {
            expect($description.text()).to.equal(badgeList[0].description);
          });
      });
    });

    it('renders 4 column grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('badge-item'),
          25
        );
      });
    });

  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueBadgeList, {
        props: {
          items: badgeList
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders 2 column grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy('badge-item'),
          50
        );
      });
    });

  });
});

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
          items: badgeList,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders 4 column grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('badge-item'), 25);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueBadgeList, {
        props: {
          items: badgeList,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders 2 column grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('badge-item'), 50);
      });
    });
  });
});

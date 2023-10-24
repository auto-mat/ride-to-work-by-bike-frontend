import SectionColumnsTest from '../SectionColumnsTest.vue';
import { i18n } from '../../boot/i18n';

describe('<SectionColumnsTest>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop 2 columns', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 2,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders 2 columns', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 50);
    });
  });

  context('desktop 3 columns', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 3,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders 3 columns', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 33);
    });
  });

  context('desktop 4 columns', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 4,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders 4 columns', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 25);
    });
  });

  context('desktop 6 columns', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 6,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders 6 columns', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 17);
    });
  });

  context('tablet', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 4,
        },
      });
      cy.viewport('ipad-2');
    });

    it('renders 2 columns', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SectionColumnsTest, {
        props: {
          columns: 4,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders 1 column', () => {
      cy.dataCy('section-columns-row').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('section-columns-column'), 100);
    });
  });
});

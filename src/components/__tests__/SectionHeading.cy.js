import SectionHeading from 'components/global/SectionHeading.vue';
import { i18n } from '../../boot/i18n';

const title = 'Example title';
const perex = 'Example perex';

describe('<SectionHeading>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(SectionHeading, {
        props: {},
        slots: {
          title: {
            render: () => title,
          },
          perex: {
            render: () => perex,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SectionHeading, {
        props: {},
        slots: {
          default: {
            render: () => title,
          },
          perex: {
            render: () => perex,
          },
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('section-heading').should('be.visible');
    cy.dataCy('section-heading-title')
      .should('be.visible')
      .and('contain', title);
    cy.dataCy('section-heading-perex')
      .should('be.visible')
      .and('contain', perex);
  });
}

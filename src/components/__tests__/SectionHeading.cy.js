import { colors } from 'quasar';
import SectionHeading from 'components/global/SectionHeading.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorSectionHeading = 'section-heading';
const selectorSectionHeadingTitle = 'section-heading-title';
const selectorSectionHeadingPerex = 'section-heading-perex';

// variables
const title = 'Example title';
const perex = 'Example perex';
const titleFontSize = 24;
const titleFontWeight = '700';

describe('<SectionHeading>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
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
    cy.dataCy(selectorSectionHeading).should('be.visible');
    cy.dataCy(selectorSectionHeadingTitle)
      .should('be.visible')
      .and('contain', title)
      .and('have.css', 'font-size', `${titleFontSize}px`)
      .and('have.css', 'font-weight', titleFontWeight)
      .and('have.color', grey10);
    cy.dataCy(selectorSectionHeadingPerex)
      .should('be.visible')
      .and('contain', perex);
  });
}

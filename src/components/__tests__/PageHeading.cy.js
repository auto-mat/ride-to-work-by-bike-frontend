import { colors } from 'quasar';
import PageHeading from '@/components/global/PageHeading.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorPageHeading = 'page-heading';
const selectorPageHeadingTitle = 'page-heading-title';
const selectorPageHeadingSecondary = 'page-heading-secondary';

// variables
const title = 'Page Title';
const secondaryContent = 'Secondary Content';
const titleFontSize = 34;
const titleFontWeight = 700;
const secondaryFontSize = 14;
const secondaryFontWeight = 400;
const secondaryMarginTop = 24;
const componentMarginBottom = 48;

describe('<PageHeading>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(PageHeading, {
        props: {},
        slots: {
          default: title,
          secondary: secondaryContent,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    verticalLayoutTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(PageHeading, {
        props: {},
        slots: {
          default: title,
          secondary: secondaryContent,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    verticalLayoutTests();
  });

  context('horizontal layout', () => {
    beforeEach(() => {
      cy.mount(PageHeading, {
        props: {
          horizontal: true,
        },
        slots: {
          default: title,
          secondary: secondaryContent,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('applies horizontal layout classes', () => {
      cy.testElementsSideBySide(
        selectorPageHeadingTitle,
        selectorPageHeadingSecondary,
      );
    });

    it('removes top margin from secondary content in horizontal mode', () => {
      cy.dataCy(selectorPageHeadingSecondary).should(
        'have.css',
        'margin-top',
        '0px',
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorPageHeading).should('be.visible');
    cy.dataCy(selectorPageHeadingTitle)
      .should('be.visible')
      .and('contain', title)
      .and('have.css', 'font-size', `${titleFontSize}px`)
      .and('have.css', 'font-weight', `${titleFontWeight}`)
      .and('have.color', black)
      .and('contain', title)
      .and('have.css', 'margin-bottom', '0px')
      .and('have.css', 'margin-top', '0px');
    cy.dataCy(selectorPageHeadingSecondary)
      .should('be.visible')
      .and('have.css', 'font-size', `${secondaryFontSize}px`)
      .and('have.css', 'font-weight', `${secondaryFontWeight}`)
      .and('have.color', grey10)
      .and('contain', secondaryContent);
  });

  it('has correct margins', () => {
    cy.dataCy(selectorPageHeading).should(
      'have.css',
      'margin-bottom',
      `${componentMarginBottom}px`,
    );
  });
}

function verticalLayoutTests() {
  it('has margin top on secondary content', () => {
    cy.dataCy(selectorPageHeadingSecondary).should(
      'have.css',
      'margin-top',
      `${secondaryMarginTop}px`,
    );
  });
}

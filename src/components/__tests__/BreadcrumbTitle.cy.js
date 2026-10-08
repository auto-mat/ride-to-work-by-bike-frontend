import { colors } from 'quasar';
import BreadcrumbTitle from '@/components/global/BreadcrumbTitle.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const primary = getPaletteColor('primary');

// selectors
const selectorBreadcrumbTitle = 'breadcrumb-title';
const selectorBreadcrumbTitleEl = 'breadcrumb-title-el';
const selectorBreadcrumbTitleCurrent = 'breadcrumb-title-current';

describe('<BreadcrumbTitle>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BreadcrumbTitle, {
        props: {
          title: i18n.global.t('results.titleResultsYou'),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BreadcrumbTitle, {
        props: {
          title: i18n.global.t('results.titleResultsYou'),
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // within the component test, the breadcrumb renders only current route
    cy.dataCy(selectorBreadcrumbTitle).should('be.visible');
    cy.dataCy(selectorBreadcrumbTitleEl).should('have.color', primary);
    cy.dataCy(selectorBreadcrumbTitleCurrent)
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleResultsYou'))
      .and('have.color', black);
  });
}

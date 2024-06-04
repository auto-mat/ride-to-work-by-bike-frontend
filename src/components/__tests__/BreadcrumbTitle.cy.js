import BreadcrumbTitle from 'components/global/BreadcrumbTitle.vue';
import { i18n } from '../../boot/i18n';

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
    cy.dataCy('breadcrumb-title').should('be.visible');
    cy.dataCy('breadcrumb-title-current')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleResultsYou'));
  });
}

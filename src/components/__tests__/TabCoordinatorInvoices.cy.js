import TabCoordinatorInvoices from 'components/coordinator/TabCoordinatorInvoices.vue';
import { i18n } from '../../boot/i18n';

describe('<TabCoordinatorInvoices>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorInvoices, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorInvoices, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('tab-coordinator-invoices').should('be.visible');
  });
}

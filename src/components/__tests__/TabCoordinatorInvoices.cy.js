import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorInvoices from 'components/coordinator/TabCoordinatorInvoices.vue';
import { i18n } from '../../boot/i18n';

// variables
const iconSize = 18;

describe('<TabCoordinatorInvoices>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorInvoices, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorInvoices, {
        props: {},
      });
      cy.viewport(375, 1500);
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('tableInvoicesTestData.json').then((invoicesData) => {
      cy.setAdminOrganisationStoreState({ invoices: invoicesData.storeData });
      cy.dataCy('tab-coordinator-invoices').should('exist');
      // table title
      cy.dataCy('table-invoices-title')
        .should('be.visible')
        .and('contain', i18n.global.t('table.titleInvoices'));
      // button create invoice
      cy.dataCy('button-create-invoice')
        .should('be.visible')
        .and('contain', i18n.global.t('coordinator.buttonCreateInvoice'));
      // button icon size
      cy.dataCy('button-create-invoice')
        .find('i')
        .invoke('height')
        .should('equal', iconSize);
      cy.dataCy('button-create-invoice')
        .find('i')
        .invoke('width')
        .should('equal', iconSize);
      // title-button alignment
      cy.testElementsSideBySide(
        'table-invoices-title',
        'button-create-invoice',
      );
      // table invoices
      cy.dataCy('table-invoices').should('be.visible');
      cy.dataCy('table-invoices-row')
        .should('be.visible')
        .and('have.length', invoicesData.storeData[0].invoices.length);
    });
  });

  it('opens dialog when button create invoice is clicked', () => {
    cy.fixture('tableInvoicesTestData.json').then((invoicesData) => {
      cy.setAdminOrganisationStoreState({ invoices: invoicesData.storeData });
      cy.dataCy('button-create-invoice').click();
      cy.dataCy('dialog-create-invoice').should('be.visible');
      cy.dataCy('form-create-invoice').should('be.visible');
    });
  });
}

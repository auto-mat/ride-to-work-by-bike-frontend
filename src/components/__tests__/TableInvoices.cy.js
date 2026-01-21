import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import TableInvoices from 'components/coordinator/TableInvoices.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import testData from '../../../test/cypress/fixtures/tableInvoicesTestData.json';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorTableInvoices = 'table-invoices';
const selectorTable = 'table-invoices-table';
const selectorTableRow = 'table-invoices-row';
const selectorTableExposureDate = 'table-invoices-exposure-date';
const selectorTableOrderNumber = 'table-invoices-order-number';
const selectorTableFileIcon = 'table-invoices-file-icon';
const selectorTableFileLabel = 'table-invoices-file-label';
const selectorTablePaymentCount = 'table-invoices-payment-count';
const selectorTableTotalAmount = 'table-invoices-total-amount';
const selectorTablePaidDate = 'table-invoices-paid-date';

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const iconSize = 18;
const marginXs = 4;

describe('<TableInvoices>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleInvoices',
        'labelIssueDate',
        'labelOrderNumber',
        'labelFiles',
        'labelPaymentCount',
        'labelAmountIncludingVat',
        'labelConfirmationDate',
        'labelNotConfirmed',
        'textNoData',
        'textNoResults',
        'textLoading',
        'textRowsPerPage',
        'tooltipTotalAmount',
      ],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableInvoices, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableInvoices, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});

function coreTests() {
  it('loads data from store and displays the table', () => {
    // initiate store state
    cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
      cy.setAdminOrganisationStoreState({
        store: adminOrganisationStore,
        invoices: testData.storeData,
      });
    });
    // test DOM component
    cy.dataCy(selectorTableInvoices).should('exist').and('be.visible');
    // table
    cy.dataCy(selectorTable)
      .should('be.visible')
      .and('have.css', 'border-radius', borderRadius);
    // get invoices array
    const invoices = testData.storeData[0].invoices;
    // table rows
    cy.dataCy(selectorTableRow).should('be.visible').and('have.color', grey10);
    if (invoices.length === 0) {
      // no invoices - no table rows
      cy.dataCy(selectorTable).within(() => {
        cy.dataCy(selectorTableRow).should('not.exist');
      });
      // empty table state
      cy.get('.q-table__bottom--nodata')
        .should('be.visible')
        .and('contain', i18n.global.t('table.textNoData'));
    } else {
      cy.dataCy(selectorTableRow).should('have.length', invoices.length);
      // test each invoice
      testData.displayData.forEach((invoice, invoiceIndex) => {
        cy.dataCy(selectorTableRow)
          .eq(invoiceIndex)
          .within(() => {
            // exposure date
            if (invoice.exposureDate) {
              cy.dataCy(selectorTableExposureDate).should(
                'contain',
                i18n.global.d(new Date(invoice.exposureDate), 'numeric'),
              );
            }
            // order number
            cy.dataCy(selectorTableOrderNumber).should(
              'contain',
              invoice.orderNumber,
            );
            // button (only if URL exists)
            if (invoice.invoiceUrl) {
              cy.get('.q-btn')
                .should('have.length', 1)
                .should('have.attr', 'href', invoice.invoiceUrl)
                .within(() => {
                  // icon
                  cy.dataCy(selectorTableFileIcon)
                    .should('be.visible')
                    .and('have.color', primary)
                    .and('have.css', 'margin-right', `${marginXs}px`);
                  cy.dataCy(selectorTableFileIcon)
                    .invoke('width')
                    .should('eq', iconSize);
                  cy.dataCy(selectorTableFileIcon)
                    .invoke('height')
                    .should('eq', iconSize);
                  // label
                  cy.dataCy(selectorTableFileLabel).should(
                    'contain',
                    i18n.global.t('table.labelFakturoid'),
                  );
                });
            }
            // payment count
            cy.dataCy(selectorTablePaymentCount).should(
              'contain',
              invoice.paymentCount,
            );
            // total amount
            cy.dataCy(selectorTableTotalAmount).should(
              'contain',
              invoice.totalAmount,
            );
            // paid date
            cy.dataCy(selectorTablePaidDate).should(($td) => {
              const expectedText = invoice.paidDate
                ? i18n.global.d(new Date(invoice.paidDate), 'numeric')
                : i18n.global.t('table.labelNotConfirmed');
              expect($td.text().trim()).to.equal(expectedText);
            });
          });
      });
    }
  });
}

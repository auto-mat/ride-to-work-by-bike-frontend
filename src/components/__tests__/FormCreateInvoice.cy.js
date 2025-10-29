import { createPinia, setActivePinia } from 'pinia';
import FormCreateInvoice from 'components/form/FormCreateInvoice.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

describe('<FormCreateInvoice>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelBusinessId',
        'labelTaxId',
        'labelConfirmBillingDetails',
        'labelDonorEntryFee',
        'labelOrderNote',
        'labelOrderNumber',
        'textDonorEntryFee',
        'titleAdditionalInformation',
        'titleDonorEntryFee',
        'titleOrganizationBillingDetails',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormCreateInvoice, {});
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormCreateInvoice, {});
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('createInvoiceTestData.json').then((testData) => {
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: testData.storeDataInitial.organizations,
          invoices: testData.storeDataInitial.invoices,
        });
      });

      // component
      cy.dataCy('form-create-invoice').should('be.visible');
      // title
      cy.dataCy('form-create-invoice-title')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleOrganizationBillingDetails'));
      // organization details
      const organization = testData.storeDataInitial.organizations[0];
      cy.dataCy('form-create-invoice-organization-details')
        .should('be.visible')
        .and('contain', organization.name)
        .and('contain', organization.street)
        .and('contain', organization.street_number)
        .and('contain', organization.psc)
        .and('contain', organization.city);
      cy.dataCy('form-create-invoice-organization-id')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelBusinessId'))
        .and('contain', organization.ico);
      cy.dataCy('form-create-invoice-organization-vat-id')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelTaxId'))
        .and('contain', organization.dic);

      // confirm billing details
      cy.dataCy('form-create-invoice-confirm-billing-details')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelConfirmBillingDetails'));
      // edit billing details
      cy.dataCy('form-create-invoice-edit-billing-details')
        .should('be.visible')
        .and('contain', i18n.global.t('form.textEditBillingDetails'))
        .and('contain', i18n.global.t('form.linkEditBillingDetails'));
      // participants
      cy.dataCy('form-create-invoice-team').should('be.visible');
      // additional information
      cy.dataCy('form-create-invoice-additional-information')
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleAdditionalInformation'));
      // order number
      cy.dataCy('form-create-invoice-order-number')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelOrderNumber'));
      // order note
      cy.dataCy('form-create-invoice-note')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelOrderNote'));
      // entry fee title
      cy.dataCy('form-create-invoice-donor-entry-fee')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleDonorEntryFee'));
      // entry fee text
      cy.dataCy('form-create-invoice-donor-entry-fee-text')
        .should('be.visible')
        .then(($element) => {
          const text = $element.text();
          cy.stripHtmlTags(i18n.global.t('form.textDonorEntryFee')).then(
            (content) => {
              expect(text).to.equal(content);
            },
          );
        });
      // entry fee toggle
      cy.dataCy('form-create-invoice-donor-entry-fee-toggle')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelDonorEntryFee'));
    });
  });
}

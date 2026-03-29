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
        'labelCustomBillingDetails',
        'labelDonorEntryFee',
        'labelOrderNumber',
        'buttonEditOrganization',
        'messageIncompleteOrganizationBanner',
        'titleAdditionalInformation',
        'titleDonorEntryFee',
        'titleOrganizationDetails',
        'titleOrganizationBillingDetails',
      ],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(['discardChanges'], 'navigation', i18n);
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
        .and('contain', i18n.global.t('form.titleOrganizationDetails'));
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
      // organization details are complete - banner is hidden
      cy.dataCy('form-create-invoice-incomplete-org-banner').should(
        'not.exist',
      );
      // custom billing checkbox
      cy.dataCy('form-create-invoice-custom-billing-checkbox')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCustomBillingDetails'));
      // billing details edit form should not exist
      cy.dataCy('form-invoice-billing-street-input').should('not.exist');
      cy.dataCy('form-invoice-billing-houseNumber-input').should('not.exist');
      cy.dataCy('form-invoice-billing-city-input').should('not.exist');
      cy.dataCy('form-invoice-billing-zip-input').should('not.exist');
      // check the custom billing checkbox
      cy.dataCy('form-create-invoice-custom-billing-checkbox').click();
      // form fields exist
      cy.dataCy('form-invoice-billing-street-input').should('be.visible');
      cy.dataCy('form-invoice-billing-street-input').should(
        'have.value',
        organization.street,
      );
      cy.dataCy('form-invoice-billing-houseNumber-input').should('be.visible');
      cy.dataCy('form-invoice-billing-houseNumber-input').should(
        'have.value',
        organization.street_number,
      );
      cy.dataCy('form-invoice-billing-city-input').should('be.visible');
      cy.dataCy('form-invoice-billing-city-input').should(
        'have.value',
        organization.city,
      );
      cy.dataCy('form-invoice-billing-zip-input').should('be.visible');
      cy.dataCy('form-invoice-billing-zip-input')
        .invoke('val')
        .then((value) => {
          expect(value.replace(/\s/g, '')).to.be.equal(
            organization.psc.toString(),
          );
        });
      // participants
      cy.dataCy('form-field-checkbox-subsidiary').should('be.visible');
      // additional information
      cy.dataCy('form-create-invoice-additional-information')
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('form.titleAdditionalInformation'));
      // order number
      cy.dataCy('form-create-invoice-order-number')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelOrderNumber'));
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

  it('shows incomplete org banner when organization is missing required fields', () => {
    cy.fixture('createInvoiceTestData.json').then((testData) => {
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        // create incomplete organization data (missing street)
        const incompleteOrg = {
          ...testData.storeDataInitial.organizations[0],
          street: '',
        };
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: [incompleteOrg],
          invoices: testData.storeDataInitial.invoices,
        });
      });
      // banner should be visible
      cy.dataCy('form-create-invoice-incomplete-org-banner')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageIncompleteOrganizationBanner'),
        );
      // edit organization button should be visible
      cy.dataCy('form-create-invoice-edit-org-button')
        .should('be.visible')
        .and('contain', i18n.global.t('form.buttonEditOrganization'));
    });
  });
}

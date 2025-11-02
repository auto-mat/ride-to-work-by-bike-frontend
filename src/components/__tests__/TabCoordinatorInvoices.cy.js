import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorInvoices from 'components/coordinator/TabCoordinatorInvoices.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import { useChallengeStore } from '../../stores/challenge';
import { systemTimeChallengeActive } from '../../../test/cypress/support/commonTests';

// variables
const iconSize = 18;

describe('<TabCoordinatorInvoices>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleInvoices'], 'table', i18n);
    cy.testLanguageStringsInContext(
      [
        'apiMessageErrorNoPaymentsToInvoice',
        'apiMessageErrorNotInInvoicesPhase',
        'apiMessageSuccess',
      ],
      'makeInvoice',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
    cy.testLanguageStringsInContext(
      [
        'buttonCreateInvoice',
        'buttonDialogCreateInvoice',
        'titleCreateInvoice',
      ],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.mount(TabCoordinatorInvoices, {
          props: {},
        });
        cy.viewport(1920, 2000);
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.mount(TabCoordinatorInvoices, {
          props: {},
        });
        cy.viewport(375, 2000);
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('tableInvoicesTestData.json').then((invoicesData) => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          invoices: invoicesData.storeData,
        });
      });
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
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
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          invoices: invoicesData.storeData,
        });
      });
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.dataCy('button-create-invoice').click();
      cy.dataCy('dialog-create-invoice')
        .should('be.visible')
        .within(() => {
          // dialog header
          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .and('contain', i18n.global.t('coordinator.titleCreateInvoice'));
          // dialog form
          cy.dataCy('form-create-invoice').should('be.visible');
          // dialog action buttons
          cy.dataCy('dialog-button-cancel')
            .should('be.visible')
            .and('contain', i18n.global.t('navigation.discard'));
          cy.dataCy('dialog-button-submit')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('coordinator.buttonDialogCreateInvoice'),
            );
        });
    });
  });
}

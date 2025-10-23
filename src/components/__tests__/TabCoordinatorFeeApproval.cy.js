import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorFeeApproval from 'components/coordinator/TabCoordinatorFeeApproval.vue';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import { i18n } from '../../boot/i18n';

describe('<TabCoordinatorFeeApproval>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['titleFeeApprovalNotApproved', 'titleFeeApprovalApproved'],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorFeeApproval, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorFeeApproval, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('tableFeeApprovalTestData').then((tableFeeApprovalTestData) => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        const adminOrganisations = computed(
          () => adminOrganisationStore.getAdminOrganisations,
        );
        adminOrganisationStore.setAdminOrganisations(
          tableFeeApprovalTestData.storeData,
        );
        cy.wrap(adminOrganisations)
          .its('value')
          .should('deep.equal', tableFeeApprovalTestData.storeData);
      });
      // titles
      cy.dataCy('table-fee-approval-approved-title')
        .should('be.visible')
        .and('contain', i18n.global.t('table.titleFeeApprovalApproved'));
      cy.dataCy('table-fee-approval-not-approved-title')
        .should('be.visible')
        .and('contain', i18n.global.t('table.titleFeeApprovalNotApproved'));
      // tables
      cy.dataCy('table-fee-approval-not-approved').should('be.visible');
      cy.dataCy('table-fee-approval-approved').should('be.visible');
    });
  });
}

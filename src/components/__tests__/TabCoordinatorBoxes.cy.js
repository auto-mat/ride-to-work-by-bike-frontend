import TabCoordinatorBoxes from 'components/coordinator/TabCoordinatorBoxes.vue';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import { i18n } from '../../boot/i18n';

describe('<TabCoordinatorBoxes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleBoxes'], 'coordinator', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorBoxes, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorBoxes, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('tab-coordinator-boxes').should('be.visible');
    // title
    cy.dataCy('table-boxes-title')
      .should('be.visible')
      .and('have.text', i18n.global.t('titleBoxes'));
  });

  it('renders the progress bar based on the number of delivered boxes', () => {
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
    });
  });
}

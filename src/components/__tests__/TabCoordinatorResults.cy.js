import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorResults from 'components/coordinator/TabCoordinatorResults.vue';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

describe('<TabCoordinatorResults>', () => {
  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorResults);
      cy.viewport('macbook-16');
    });

    it('renders the component', () => {
      // initiate store state
      cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          cy.setAdminOrganisationStoreState({
            store: adminOrganisationStore,
            organizations: tableAttendanceTestData.storeData,
            invoices: null,
          });
        });
      });
      cy.dataCy('tab-coordinator-results').should('exist');
      // verify TableResults component is visible
      cy.dataCy('table-results').should('be.visible');
    });

    it('displays component when store has no data', () => {
      // initiate store state with empty data
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: {
            name: 'Test Organization',
            subsidiaries: [],
          },
          invoices: null,
        });
      });
      // component should still render
      cy.dataCy('tab-coordinator-results').should('exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TabCoordinatorResults);
      cy.viewport('iphone-6');
    });

    it('renders the component', () => {
      // initiate store state
      cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          cy.setAdminOrganisationStoreState({
            store: adminOrganisationStore,
            organizations: tableAttendanceTestData.storeData,
            invoices: null,
          });
        });
      });
      cy.dataCy('tab-coordinator-results').should('exist');
      // verify TableResults component is visible
      cy.dataCy('table-results').should('be.visible');
    });
  });
});

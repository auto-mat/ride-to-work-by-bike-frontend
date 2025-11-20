import { computed } from 'vue';
import TabCoordinatorBoxes from 'components/coordinator/TabCoordinatorBoxes.vue';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import { i18n } from '../../boot/i18n';
import testData from '../../../test/cypress/fixtures/tableBoxesTestData.json';

describe('<TabCoordinatorBoxes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleBoxes'], 'coordinator', i18n);
  });

  testData.forEach((testCase) => {
    context(testCase.description, () => {
      beforeEach(() => {
        cy.mount(TabCoordinatorBoxes, {
          props: {},
        });
        cy.viewport('macbook-16');
      });

      it('renders component', () => {
        cy.dataCy('tab-coordinator-boxes').should('be.visible');
        // title
        cy.dataCy('table-boxes-title')
          .should('be.visible')
          .and('have.text', i18n.global.t('coordinator.titleBoxes'));
      });

      it('renders the progress bar based on the number of delivered boxes', () => {
        // initiate store state
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          const adminOrganisations = computed(
            () => adminOrganisationStore.getAdminOrganisations,
          );
          adminOrganisationStore.setAdminOrganisations(testCase.storeData);
          cy.wrap(adminOrganisations)
            .its('value')
            .should('deep.equal', testCase.storeData);
        });
        // status label
        cy.dataCy('table-boxes-delivery-status-label')
          .should('be.visible')
          .and('contain', testCase.displayDataTab.deliveryStatus);
        cy.dataCy('table-boxes-delivery-progress-bar')
          .should('be.visible')
          .invoke('attr', 'aria-valuenow')
          .then((value) => {
            expect(Number(value).toFixed(2)).to.equal(
              testCase.displayDataTab.progressBarValue.toFixed(2),
            );
          });
      });

      it('renders title and progress bar side-by-side', () => {
        cy.testElementsSideBySide(
          'table-boxes-title',
          'table-boxes-delivery-status',
        );
      });
    });
  });
});

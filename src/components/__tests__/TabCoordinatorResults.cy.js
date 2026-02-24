import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorResults from 'components/coordinator/TabCoordinatorResults.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import { ResultsReportType } from 'src/components/enums/Results';

describe('<TabCoordinatorResults>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['tabResultsSummary', 'tabResultsDiplomas'],
      'coordinator',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['organizationCoordinator'],
      'results.reportType',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['linkOpenResultsInNewTab', 'messageNoReport'],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.viewport('macbook-16');
      // initiate admin organisation store state
      cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          cy.setAdminOrganisationStoreState({
            store: adminOrganisationStore,
            organizations: tableAttendanceTestData.storeData,
            invoices: null,
          });
        });
      });
      // intercept results api endpoint
      cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
        resultsResponses.forEach((resultsResponse) => {
          cy.interceptGetResultsApi(
            rideToWorkByBikeConfig,
            i18n,
            resultsResponse.key,
            resultsResponse.response,
          );
        });
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.viewport('iphone-6');
      // initiate admin organisation store state
      cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
        cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
          cy.setAdminOrganisationStoreState({
            store: adminOrganisationStore,
            organizations: tableAttendanceTestData.storeData,
            invoices: null,
          });
        });
      });
      // intercept results api endpoint
      cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
        resultsResponses.forEach((resultsResponse) => {
          cy.interceptGetResultsApi(
            rideToWorkByBikeConfig,
            i18n,
            resultsResponse.key,
            resultsResponse.response,
          );
        });
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders the component with nested tabs', () => {
    cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
      const organizationCoordinatorResponse = resultsResponses.find(
        (result) => result.key === ResultsReportType.organizationCoordinator,
      );
      cy.mount(TabCoordinatorResults);
      cy.dataCy('tab-coordinator-results').should('exist');
      // verify sub-tabs are visible
      cy.dataCy('coordinator-results-sub-tabs').should('be.visible');
      cy.dataCy('coordinator-results-sub-tab-summary').should('be.visible');
      cy.dataCy('coordinator-results-sub-tab-diplomas').should('be.visible');
      // verify panel existence
      cy.dataCy('coordinator-results-panel-diplomas').should('not.exist');
      cy.dataCy('coordinator-results-panel-summary').should('exist');
      // verify iframe section is visible
      cy.dataCy('coordinator-results-report').should('be.visible');
      // verify link
      cy.dataCy('coordinator-results-link-open-in-new-tab')
        .should('be.visible')
        .and('have.attr', 'target', '_blank')
        .and(
          'have.attr',
          'href',
          organizationCoordinatorResponse.response.data_report_url,
        );
      // verify iframe
      cy.dataCy('coordinator-results-iframe')
        .should('be.visible')
        .and(
          'have.attr',
          'src',
          organizationCoordinatorResponse.response.data_report_url,
        );
    });
  });

  it('switches between tabs correctly', () => {
    cy.mount(TabCoordinatorResults);
    // summary tab active
    cy.dataCy('coordinator-results-panel-summary').should('exist');
    // switch to diplomas tab
    cy.dataCy('coordinator-results-sub-tab-diplomas').click();
    // diplomas panel exists
    cy.dataCy('coordinator-results-panel-diplomas').should('exist');
    cy.dataCy('coordinator-results-panel-summary').should('not.exist');
    cy.dataCy('table-results').should('exist');
    // switch back to summary tab
    cy.dataCy('coordinator-results-sub-tab-summary').click();
    cy.dataCy('coordinator-results-panel-summary').should('exist');
    cy.dataCy('coordinator-results-panel-diplomas').should('not.exist');
  });

  it('should display "no report" message', () => {
    // intercept results api endpoint
    cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
      resultsResponses.forEach((resultsResponse) => {
        cy.interceptGetResultsApi(
          rideToWorkByBikeConfig,
          i18n,
          resultsResponse.key,
          { data_report_url: null },
        );
      });
    });
    cy.mount(TabCoordinatorResults);
    cy.wait(`@getResultsRequest-${ResultsReportType.organizationCoordinator}`);
    // verify no report message is shown
    cy.dataCy('coordinator-results-panel-summary')
      .should('be.visible')
      .within(() => {
        cy.contains(i18n.global.t('results.messageNoReport')).should(
          'be.visible',
        );
      });
    // verify iframe section does not exist
    cy.dataCy('coordinator-results-report').should('not.exist');
  });
}

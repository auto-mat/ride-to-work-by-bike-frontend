import { createPinia, setActivePinia } from 'pinia';
import TableAttendanceTabs from 'components/coordinator/TableAttendanceTabs.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { calculateSubsidiaryMemberCount } from './helpers/tableAttendance';

describe('<TableAttendanceTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['tabActiveSubsidiaries', 'tabEmptySubsidiaries'],
      'coordinator',
      i18n,
    );
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.mount(TableAttendanceTabs);
    cy.viewport('macbook-16');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
    });
    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });
    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.setAdminOrganisationStoreState({
      store: useAdminOrganisationStore(),
      organizations: testData[0].storeData,
    });
    cy.dataCy('table-attendance').should('be.visible');
    cy.dataCy('table-attendance-subsidiary-header').should('be.visible');
  });

  it('does not show tabs when all subsidiaries have members', () => {
    const dataWithoutEmptySubsidiaries = testData[0];
    cy.setAdminOrganisationStoreState({
      store: useAdminOrganisationStore(),
      organizations: dataWithoutEmptySubsidiaries.storeData,
    });
    // no tabs
    cy.dataCy('table-attendance-sub-tabs').should('not.exist');
    // verify subsidiary tables
    const subsidiaries = dataWithoutEmptySubsidiaries.storeData[0].subsidiaries;
    subsidiaries.forEach((subsidiary) => {
      cy.dataCy('table-attendance-subsidiary-header')
        .should('be.visible')
        .and('contain', subsidiary.name);
    });
  });

  it('shows tabs when empty subsidiaries exist and switches between panels', () => {
    const dataWithEmptySubsidiaries = testData[1];
    cy.setAdminOrganisationStoreState({
      store: useAdminOrganisationStore(),
      organizations: dataWithEmptySubsidiaries.storeData,
    });
    const subsidiaries = dataWithEmptySubsidiaries.storeData[0].subsidiaries;
    const activeSubsidiaries = subsidiaries.filter(
      (subsidiary) => calculateSubsidiaryMemberCount(subsidiary) > 0,
    );
    const emptySubsidiaries = subsidiaries.filter(
      (subsidiary) => calculateSubsidiaryMemberCount(subsidiary) === 0,
    );
    // verify tabs
    cy.dataCy('table-attendance-sub-tabs').should('be.visible');
    cy.dataCy('table-attendance-sub-tab-active')
      .should('be.visible')
      .and('contain', i18n.global.t('coordinator.tabActiveSubsidiaries'));
    cy.dataCy('table-attendance-sub-tab-empty')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('coordinator.tabEmptySubsidiaries', {
          count: emptySubsidiaries.length,
        }),
      );
    // `active` tab shown by default - verify active subsidiaries
    activeSubsidiaries.forEach((subsidiary) => {
      cy.dataCy('table-attendance-panel-active')
        .find('[data-cy="table-attendance-subsidiary-header"]')
        .should('be.visible')
        .and('contain', subsidiary.name);
    });
    // empty subsidiaries not visible
    emptySubsidiaries.forEach(() => {
      cy.dataCy('table-attendance-panel-empty')
        .find('[data-cy="table-attendance-subsidiary-header"]')
        .should('not.be.visible');
    });
    // switch to `empty` tab
    cy.dataCy('table-attendance-sub-tab-empty').click();
    // `empty` tab shown - verify empty subsidiaries
    emptySubsidiaries.forEach((subsidiary) => {
      cy.dataCy('table-attendance-panel-empty')
        .find('[data-cy="table-attendance-subsidiary-header"]')
        .should('be.visible')
        .and('contain', subsidiary.name);
    });
    // active subsidiaries not visible
    cy.dataCy('table-attendance-panel-active')
      .find('[data-cy="table-attendance-subsidiary-header"]')
      .should('not.be.visible');
  });
}

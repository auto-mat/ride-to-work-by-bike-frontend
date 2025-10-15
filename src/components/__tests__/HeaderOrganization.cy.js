import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import HeaderOrganization from 'components/coordinator/HeaderOrganization.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';

const { getPaletteColor } = colors;
const secondary = getPaletteColor('secondary');

describe('<HeaderOrganization>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(HeaderOrganization);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(HeaderOrganization);
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  testData.forEach((test) => {
    it(test.description, () => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        const adminOrganisations = computed(
          () => adminOrganisationStore.getAdminOrganisations,
        );
        adminOrganisationStore.setAdminOrganisations(test.storeData);
        cy.wrap(adminOrganisations)
          .its('value')
          .should('deep.equal', test.storeData);
      });
      // test icon
      cy.dataCy('header-organization-image-icon').should('be.visible');
      cy.dataCy('header-organization-image-icon').should(
        'have.color',
        secondary,
      );
      // test organization data
      cy.dataCy('header-organization').should('be.visible');
      cy.dataCy('header-organization-title')
        .should('be.visible')
        .and('contain', test.displayData.organizationTitle);
      // test subsidiaries count
      cy.dataCy('header-organization-branch-count')
        .should('be.visible')
        .and('contain', test.displayData.subsidiariesCount)
        .and(
          'contain',
          i18n.global.t(
            'coordinator.labelBranches',
            test.displayData.subsidiariesCount,
          ),
        );
      // test members count
      cy.dataCy('header-organization-member-count')
        .should('be.visible')
        .and('contain', test.displayData.membersCount)
        .and(
          'contain',
          i18n.global.t(
            'coordinator.labelMembers',
            test.displayData.membersCount,
          ),
        );
      // test export button
      cy.dataCy('header-organization-button-export')
        .should('be.visible')
        .and('contain', i18n.global.t('coordinator.buttonExportMembers'));
      cy.dataCy('header-organization-button-export')
        .find('i')
        .should('have.class', 'mdi-download');
    });
  });
}

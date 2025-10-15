import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TableAttendance from 'components/coordinator/TableAttendance.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
// import { useTableAttendance } from '../../composables/useTable';
// import { PaymentState } from '../enums/Payment';
// import {
//   AttendanceTableFeeColumnIcons,
//   AttendanceTableFeeColumnIconsColors,
//   AttendanceTablePayColumnIconsColors,
// } from '../types/Table';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

// composables
// const { getPaymentTypeLabel, getPaymentStateLabel } = useTableAttendance();

// selectors
// const classSelectorTableSortable = 'th.sortable';
const classSelectorIcon = '.q-icon';
const selectorTableAttendance = 'table-attendance';
const selectorTable = 'table-attendance-table';
const selectorTableTeamHeader = 'table-attendance-team-header';
const selectorTableRow = 'table-attendance-row';
const selectorTableName = 'table-attendance-name';
const selectorTableNickname = 'table-attendance-nickname';
const selectorTableContact = 'table-attendance-contact';
const selectorTableContactIcon = 'table-attendance-contact-icon';
const selectorTableFeeApproved = 'table-attendance-fee-approved';
const selectorTablePaymentType = 'table-attendance-payment-type';
const selectorTablePaymentState = 'table-attendance-payment-state';
const selectorTableActions = 'table-attendance-actions';
const selectorSubsidiaryHeader = 'table-attendance-subsidiary-header';
const selectorCityChallenge = 'table-attendance-city-challenge';
const selectorTeams = 'table-attendance-teams';
const selectorMembers = 'table-attendance-members';

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const iconSize = 18;

describe('<TableAttendance>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelName',
        'labelNickname',
        'labelContact',
        'labelFeeApproved',
        'labelPaymentType',
        'labelPaymentState',
        'labelTeam',
      ],
      'table',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'labelOrganization',
        'labelRegistration',
        'labelDone',
        'labelNoAdmission',
        'labelWaiting',
        'labelUnknown',
        'labelNone',
      ],
      'payment',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['labelCityChallenge', 'labelTeams', 'labelMembers'],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableAttendance);
      cy.viewport('macbook-16');
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

      // test component visibility
      cy.dataCy(selectorTableAttendance).should('exist');

      const subsidiaries = test.storeData[0].subsidiaries;

      if (subsidiaries.length === 0) {
        // no subsidiaries - no tables should be rendered
        cy.dataCy(selectorTable).should('not.exist');
        return;
      }

      // test each subsidiary
      subsidiaries.forEach((subsidiary, subsidiaryIndex) => {
        // count all members in this subsidiary
        const allMembers = [];
        subsidiary.teams.forEach((team) => {
          allMembers.push(
            ...team.members_without_paid_entry_fee_by_org_coord,
            ...team.members_with_paid_entry_fee_by_org_coord,
            ...team.other_members,
          );
        });

        // test subsidiary header
        cy.dataCy(selectorSubsidiaryHeader)
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', subsidiary.street)
          .and('contain', subsidiary.street_number)
          .and('contain', subsidiary.city);

        // test subsidiary info
        cy.dataCy(selectorCityChallenge)
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', i18n.global.t('coordinator.labelCityChallenge'))
          .and('contain', subsidiary.city);

        cy.dataCy(selectorTeams)
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', subsidiary.teams.length)
          .and(
            'contain',
            i18n.global.t('coordinator.labelTeams', subsidiary.teams.length),
          );

        cy.dataCy(selectorMembers)
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', allMembers.length)
          .and(
            'contain',
            i18n.global.t('coordinator.labelMembers', allMembers.length),
          );

        // test table
        cy.dataCy(selectorTable)
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadius);

        if (allMembers.length === 0) {
          // no members - table should be empty
          cy.dataCy(selectorTable)
            .eq(subsidiaryIndex)
            .within(() => {
              cy.dataCy(selectorTableRow).should('not.exist');
            });
        } else {
          // test table rows
          cy.dataCy(selectorTable)
            .eq(subsidiaryIndex)
            .within(() => {
              // test row styling and count
              cy.dataCy(selectorTableRow)
                .should('be.visible')
                .and('have.color', grey10)
                .and('have.length.at.least', 1);

              // test all cells are visible (at least once)
              [
                selectorTableName,
                selectorTableNickname,
                selectorTableContact,
                selectorTableFeeApproved,
                selectorTablePaymentType,
                selectorTablePaymentState,
                selectorTableActions,
              ].forEach((selector) => {
                cy.dataCy(selector).first().should('be.visible');
              });

              // test contact icon (first occurrence)
              cy.dataCy(selectorTableContact)
                .first()
                .within(() => {
                  cy.dataCy(selectorTableContactIcon)
                    .should('be.visible')
                    .and('have.color', primary);
                  cy.dataCy(selectorTableContactIcon)
                    .invoke('height')
                    .should('be.equal', iconSize);
                  cy.dataCy(selectorTableContactIcon)
                    .invoke('width')
                    .should('be.equal', iconSize);
                });

              // test payment state icons (first occurrence)
              cy.dataCy(selectorTablePaymentState)
                .first()
                .within(() => {
                  cy.get(classSelectorIcon)
                    .first()
                    .invoke('height')
                    .should('be.equal', iconSize);
                  cy.get(classSelectorIcon)
                    .first()
                    .invoke('width')
                    .should('be.equal', iconSize);
                });

              // test fee approved icons (first occurrence)
              cy.dataCy(selectorTableFeeApproved)
                .first()
                .within(() => {
                  cy.get(classSelectorIcon)
                    .invoke('height')
                    .should('be.equal', iconSize);
                  cy.get(classSelectorIcon)
                    .invoke('width')
                    .should('be.equal', iconSize);
                });
            });

          // test team headers if there are multiple teams
          const teamsWithMembers = subsidiary.teams.filter((team) => {
            return (
              team.members_without_paid_entry_fee_by_org_coord.length +
                team.members_with_paid_entry_fee_by_org_coord.length +
                team.other_members.length >
              0
            );
          });

          if (teamsWithMembers.length > 0) {
            cy.dataCy(selectorTable)
              .eq(subsidiaryIndex)
              .within(() => {
                cy.dataCy(selectorTableTeamHeader)
                  .should('be.visible')
                  .and('have.backgroundColor', primary)
                  .and('have.color', white);
              });
          }
        }
      });
    });
  });
}

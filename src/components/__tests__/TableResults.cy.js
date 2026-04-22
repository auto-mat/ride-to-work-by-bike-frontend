import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import TableResults from 'components/coordinator/TableResults.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

describe('<TableResults>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelName',
        'labelNickname',
        'labelEmail',
        'labelPhone',
        'labelDiploma',
        'labelTeam',
        'textNoData',
        'textNoResults',
        'textLoading',
        'textRowsPerPage',
      ],
      'table',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'labelCityChallenge',
        'labelTeams',
        'labelMembers',
        'labelBoxAddressee',
        'buttonDownloadDiploma',
        'downloadTeamDiploma',
        'downloadMemberDiploma',
      ],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableResults);
      cy.viewport('macbook-16');
    });

    coreTests();
    dataDisplayTests();
    diplomaDownloadTests();
  });
});

function coreTests() {
  testData.forEach((test) => {
    it(test.description, () => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: test.storeData,
          invoices: null,
        });
      });
      const subsidiaries = test.storeData[0].subsidiaries;
      if (subsidiaries.length === 0) {
        // no subsidiaries - no tables should be rendered
        cy.dataCy('table-results').should('not.exist');
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
        cy.dataCy('table-results-subsidiary-header')
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', subsidiary.name);
        // test subsidiary info
        cy.dataCy('table-results-city-challenge')
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', i18n.global.t('coordinator.labelCityChallenge'))
          .and('contain', subsidiary.city);
        cy.dataCy('table-results-teams')
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', subsidiary.teams.length)
          .and(
            'contain',
            i18n.global.t('coordinator.labelTeams', subsidiary.teams.length),
          );
        cy.dataCy('table-results-members')
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('contain', allMembers.length)
          .and(
            'contain',
            i18n.global.t('coordinator.labelMembers', allMembers.length),
          );
        // test table
        cy.dataCy('table-results')
          .eq(subsidiaryIndex)
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadius);
        if (subsidiary.teams.length === 0) {
          // no members - no member rows
          cy.dataCy('table-results')
            .eq(subsidiaryIndex)
            .within(() => {
              cy.dataCy('table-results-row').should('not.exist');
            });
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
        } else {
          // test table rows
          cy.dataCy('table-results')
            .eq(subsidiaryIndex)
            .within(() => {
              if (allMembers.length === 0) {
                // no members - no member rows (only empty teams)
                cy.dataCy('table-results-row').should('have.length', 0);
              } else {
                // test row styling and count
                cy.dataCy('table-results-row')
                  .should('be.visible')
                  .and('have.color', grey10)
                  .and('have.length.at.least', 1);
                // tests that all cells are visible (first row)
                [
                  'table-results-name',
                  'table-results-nickname',
                  'table-results-email',
                  'table-results-telephone',
                  'table-results-diploma',
                ].forEach((selector) => {
                  cy.dataCy(selector).first().should('be.visible');
                });
                // test diploma download button exists (first row)
                cy.dataCy('table-results-diploma')
                  .first()
                  .within(() => {
                    cy.dataCy('table-results-button-download-diploma')
                      .should('exist')
                      .and('be.visible');
                  });
                // test disabled button count
                if (test.displayData.disabledDiplomas) {
                  cy.dataCy('table-results-button-download-diploma')
                    .filter('.disabled')
                    .should('have.length', test.displayData.disabledDiplomas);
                }
                if (test.displayData.enabledDiplomas) {
                  // test enabled button count
                  cy.dataCy('table-results-button-download-diploma')
                    .filter(':not(.disabled)')
                    .should('have.length', test.displayData.enabledDiplomas);
                }
              }
            });
          // team headers (show all teams including empty teams)
          if (subsidiary.teams.length > 0) {
            cy.dataCy('table-results')
              .eq(subsidiaryIndex)
              .within(() => {
                cy.dataCy('table-results-team-header')
                  .should('be.visible')
                  .and('have.length', subsidiary.teams.length)
                  .and('have.backgroundColor', primary)
                  .and('have.color', white);
                subsidiary.teams.forEach((team) => {
                  cy.dataCy('table-results-team-header').should(
                    'contain',
                    team.name,
                  );
                });
                // test team diploma download buttons exist
                cy.dataCy('table-results-button-download-team-diploma').should(
                  'have.length',
                  subsidiary.teams.length,
                );
              });
          }
        }
      });
    });
  });
}

function dataDisplayTests() {
  it('display members in correct order and correct data for each member', () => {
    cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: tableAttendanceTestData.storeData,
          invoices: null,
        });
      });
      const display = tableAttendanceTestData.displayData;
      // address
      cy.dataCy('table-results-subsidiary-header')
        .should('be.visible')
        .and('contain', display.subsidiaryAddress);
      // challenge city
      cy.dataCy('table-results-city-challenge')
        .should('be.visible')
        .and('contain', display.subsidiaryCityChallenge);
      // team count
      cy.dataCy('table-results-teams')
        .should('be.visible')
        .and('contain', display.teamCount);
      // members count
      cy.dataCy('table-results-members')
        .should('be.visible')
        .and('contain', display.membersCount);
      // teams order (alphabetical)
      cy.dataCy('table-results-team-header').each((teamHeader, index) => {
        cy.wrap(teamHeader)
          .should('be.visible')
          .and('contain', display.orderedTeamNames[index]);
      });
      // test member data
      cy.dataCy('table-results-row').each((table, index) => {
        if (display.orderedMembers[index]) {
          cy.wrap(table).within(() => {
            // name
            if (display.orderedMembers[index].name) {
              cy.dataCy('table-results-name')
                .should('be.visible')
                .and('contain', display.orderedMembers[index].name);
            }
            // nickname
            if (display.orderedMembers[index].nickname) {
              cy.dataCy('table-results-nickname')
                .should('be.visible')
                .and('contain', display.orderedMembers[index].nickname);
            } else {
              cy.dataCy('table-results-nickname')
                .should('be.visible')
                .and('be.empty');
            }
            // email
            if (display.orderedMembers[index].email) {
              cy.dataCy('table-results-email')
                .should('be.visible')
                .and('contain', display.orderedMembers[index].email);
            } else {
              cy.dataCy('table-results-email')
                .should('be.visible')
                .and('be.empty');
            }
            // telephone
            if (display.orderedMembers[index].telephone) {
              cy.dataCy('table-results-telephone')
                .should('be.visible')
                .and('contain', display.orderedMembers[index].telephone);
            } else {
              cy.dataCy('table-results-telephone')
                .should('be.visible')
                .and('be.empty');
            }
            // diploma download button
            cy.dataCy('table-results-diploma').within(() => {
              cy.dataCy('table-results-button-download-diploma')
                .should('exist')
                .and('be.visible');
            });
          });
        }
      });
    });
  });
}

function diplomaDownloadTests() {
  it('displays diploma download buttons with correct disabled state', () => {
    cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: tableAttendanceTestData.storeData,
          invoices: null,
        });
      });
      // test member diploma buttons exist
      cy.dataCy('table-results-row')
        .first()
        .within(() => {
          cy.dataCy('table-results-diploma').within(() => {
            cy.dataCy('table-results-button-download-diploma')
              .should('exist')
              .and(
                'contain',
                i18n.global.t('coordinator.buttonDownloadDiploma'),
              );
          });
        });
      // test team diploma buttons exist
      cy.dataCy('table-results-team-header')
        .first()
        .within(() => {
          cy.dataCy('table-results-button-download-team-diploma').should(
            'exist',
          );
        });
    });
  });

  it('opens diploma URL in new window when download button is clicked', () => {
    cy.fixture('tableAttendanceTestData.json').then((testDataWithDiplomas) => {
      const teamDiplomaUrl =
        testDataWithDiplomas.storeData[0].subsidiaries[0].teams[0].diploma;
      const memberDiplomaUrl =
        testDataWithDiplomas.storeData[0].subsidiaries[0].teams[0]
          .members_without_paid_entry_fee_by_org_coord[0].diploma;
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        cy.setAdminOrganisationStoreState({
          store: adminOrganisationStore,
          organizations: testDataWithDiplomas.storeData,
          invoices: null,
        });
      });
      // stub window.open
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });
      // click member diploma button
      cy.dataCy('table-results-row')
        .first()
        .within(() => {
          cy.dataCy('table-results-diploma').within(() => {
            cy.dataCy('table-results-button-download-diploma')
              .should('not.be.disabled')
              .click();
          });
        });
      cy.get('@windowOpen').should(
        'have.been.calledWith',
        memberDiplomaUrl,
        '_blank',
      );
      // click team diploma button
      cy.dataCy('table-results-team-header')
        .first()
        .within(() => {
          cy.dataCy('table-results-button-download-team-diploma')
            .should('not.be.disabled')
            .click();
        });
      cy.get('@windowOpen').should(
        'have.been.calledWith',
        teamDiplomaUrl,
        '_blank',
      );
    });
  });
}

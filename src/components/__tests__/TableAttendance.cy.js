import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TableAttendance from 'components/coordinator/TableAttendance.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const grey5 = getPaletteColor('grey-5');

// selectors
const classSelectorIcon = '.q-icon';
const selectorTableAttendance = 'table-attendance';
const selectorTable = 'table-attendance-table';
const selectorTableTeamHeader = 'table-attendance-team-header';
const selectorTableRow = 'table-attendance-row';
const selectorTableName = 'table-attendance-name';
const selectorTableNickname = 'table-attendance-nickname';
const selectorTableContact = 'table-attendance-contact';
const selectorTablePhoneIcon = 'table-attendance-contact-phone-icon';
const selectorTableEmailIcon = 'table-attendance-contact-email-icon';
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
      ['labelCityChallenge', 'labelTeams', 'labelMembers', 'textClickToCopy'],
      'coordinator',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['copiedToClipboard', 'copyFailed', 'clipboardApiNotAvailable'],
      'notify',
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
    dataDisplayTests();
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
      // test DOM component
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
          // no members - no member rows
          cy.dataCy(selectorTable)
            .eq(subsidiaryIndex)
            .within(() => {
              cy.dataCy(selectorTableRow).should('not.exist');
            });
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
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
              // tests that all cells are visible (first row)
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
              // test contact icons (first row)
              cy.dataCy(selectorTableContact)
                .first()
                .within(() => {
                  cy.dataCy(selectorTablePhoneIcon)
                    .find('i')
                    .should('be.visible')
                    .invoke('height')
                    .should('be.equal', iconSize);
                  cy.dataCy(selectorTablePhoneIcon)
                    .find('i')
                    .invoke('width')
                    .should('be.equal', iconSize);
                  cy.dataCy(selectorTableEmailIcon)
                    .find('i')
                    .should('be.visible')
                    .invoke('height')
                    .should('be.equal', iconSize);
                  cy.dataCy(selectorTableEmailIcon)
                    .find('i')
                    .invoke('width')
                    .should('be.equal', iconSize);
                });
              // test payment state icons (first row)
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
              // test fee approved icons (first row)
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

function dataDisplayTests() {
  it('display members in correct order and correct data for each member', () => {
    cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        const adminOrganisations = computed(
          () => adminOrganisationStore.getAdminOrganisations,
        );
        adminOrganisationStore.setAdminOrganisations(
          tableAttendanceTestData.storeData,
        );
        cy.wrap(adminOrganisations)
          .its('value')
          .should('deep.equal', tableAttendanceTestData.storeData);
      });
      const display = tableAttendanceTestData.displayData;
      // address
      cy.dataCy(selectorSubsidiaryHeader)
        .should('be.visible')
        .and('contain', display.subsidiaryAddress);
      // challenge city
      cy.dataCy(selectorCityChallenge)
        .should('be.visible')
        .and('contain', display.subsidiaryCityChallenge);
      // team count
      cy.dataCy(selectorTeams)
        .should('be.visible')
        .and('contain', display.teamCount);
      // members count
      cy.dataCy(selectorMembers)
        .should('be.visible')
        .and('contain', display.membersCount);
      // teams order (alphabetical)
      cy.dataCy(selectorTableTeamHeader).each((teamHeader, index) => {
        cy.wrap(teamHeader)
          .should('be.visible')
          .and('contain', display.orderedTeamNames[index]);
      });
      // first member of "Administrativa" team
      cy.dataCy(selectorTableRow).each((table, index) => {
        if (display.orderedMembers[index]) {
          cy.wrap(table).within(() => {
            // name
            if (display.orderedMembers[index].name) {
              cy.dataCy(selectorTableName)
                .should('be.visible')
                .and('contain', display.orderedMembers[index].name);
            }
            // nickname
            if (display.orderedMembers[index].nickname) {
              cy.dataCy(selectorTableNickname)
                .should('be.visible')
                .and('contain', display.orderedMembers[index].nickname);
            } else {
              cy.dataCy(selectorTableNickname)
                .should('be.visible')
                .and('be.empty');
            }
            // contact icons
            cy.dataCy(selectorTableContact).within(() => {
              // phone
              if (display.orderedMembers[index].telephone) {
                cy.dataCy(selectorTablePhoneIcon)
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
                cy.dataCy(selectorTablePhoneIcon)
                  .find('i')
                  .should('have.color', primary);
              } else {
                cy.dataCy(selectorTablePhoneIcon)
                  .should('be.visible')
                  .and('have.class', 'disabled');
                cy.dataCy(selectorTablePhoneIcon)
                  .find('i')
                  .should('have.color', grey5);
              }
              // email
              if (display.orderedMembers[index].email) {
                cy.dataCy(selectorTableEmailIcon)
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
                cy.dataCy(selectorTableEmailIcon)
                  .find('i')
                  .should('have.color', primary);
              } else {
                cy.dataCy(selectorTableEmailIcon)
                  .should('be.visible')
                  .and('have.class', 'disabled');
                cy.dataCy(selectorTableEmailIcon)
                  .find('i')
                  .should('have.color', grey5);
              }
            });
            // approved
            if (display.orderedMembers[index].approved) {
              cy.dataCy(selectorTableFeeApproved).within(() => {
                cy.get(classSelectorIcon).should('contain', 'check');
              });
            } else {
              cy.dataCy(selectorTableFeeApproved).within(() => {
                cy.get(classSelectorIcon).should('contain', 'close');
              });
            }
            // payment type
            if (display.orderedMembers[index].paymentType) {
              cy.dataCy(selectorTablePaymentType)
                .should('be.visible')
                .and(
                  'contain',
                  i18n.global.t(display.orderedMembers[index].paymentType),
                );
            } else {
              cy.dataCy(selectorTablePaymentType)
                .should('be.visible')
                .and('be.empty');
            }
            // payment state
            if (display.orderedMembers[index].paymentState) {
              cy.dataCy(selectorTablePaymentState)
                .should('be.visible')
                .and(
                  'contain',
                  i18n.global.t(display.orderedMembers[index].paymentState),
                );
            } else {
              cy.dataCy(selectorTablePaymentState)
                .should('be.visible')
                .and('be.empty');
            }
            // button actions
            cy.dataCy(selectorTableActions).within(() => {
              cy.get('button').should('exist');
            });
          });
        }
      });
    });
  });

  it('should copy contact information to clipboard when clicking enabled icons', () => {
    cy.fixture('tableAttendanceTestData').then((tableAttendanceTestData) => {
      // mock clipboard API
      cy.window().then((win) => {
        if (!win.navigator.clipboard) {
          // for browsers/test environments without navigator.clipboard object
          Object.defineProperty(win.navigator, 'clipboard', {
            value: {
              writeText: cy.stub().resolves(),
            },
            writable: true,
          });
        } else {
          // for browsers with navigator.clipboard
          cy.stub(win.navigator, 'clipboard').value({
            writeText: cy.stub().resolves(),
          });
        }
      });
      // initiate store state
      cy.wrap(useAdminOrganisationStore()).then((adminOrganisationStore) => {
        const adminOrganisations = computed(
          () => adminOrganisationStore.getAdminOrganisations,
        );
        adminOrganisationStore.setAdminOrganisations(
          tableAttendanceTestData.storeData,
        );
        cy.wrap(adminOrganisations)
          .its('value')
          .should('deep.equal', tableAttendanceTestData.storeData);
      });
      const display = tableAttendanceTestData.displayData;
      // test clipboard functionality
      cy.dataCy(selectorTableRow).each((table, index) => {
        if (display.orderedMembers[index]) {
          if (display.orderedMembers[index].telephone) {
            cy.wrap(table).within(() => {
              cy.dataCy(selectorTableContact).within(() => {
                cy.dataCy(selectorTablePhoneIcon)
                  .should('not.have.class', 'disabled')
                  .click();
                cy.window().then((win) => {
                  expect(
                    win.navigator.clipboard.writeText,
                  ).to.have.been.calledWith(
                    display.orderedMembers[index].telephone,
                  );
                });
              });
            });
            cy.contains(i18n.global.t('notify.copiedToClipboard')).should(
              'be.visible',
            );
            cy.contains(i18n.global.t('notify.copiedToClipboard')).should(
              'not.be.visible',
            );
          }
          if (display.orderedMembers[index].email) {
            cy.wrap(table).within(() => {
              cy.dataCy(selectorTableContact).within(() => {
                cy.dataCy(selectorTableEmailIcon)
                  .should('not.have.class', 'disabled')
                  .click();
                cy.window().then((win) => {
                  expect(
                    win.navigator.clipboard.writeText,
                  ).to.have.been.calledWith(
                    display.orderedMembers[index].email,
                  );
                });
              });
            });
            cy.contains(i18n.global.t('notify.copiedToClipboard')).should(
              'be.visible',
            );
            cy.contains(i18n.global.t('notify.copiedToClipboard')).should(
              'not.be.visible',
            );
          }
        }
      });
    });
  });
}

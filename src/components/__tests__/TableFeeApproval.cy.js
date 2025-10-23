import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';
import testData from '../../../test/cypress/fixtures/headerOrganizationTestData.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useTable } from 'src/composables/useTable';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// composables
const { formatPrice } = useTable();

// selectors
const selectorTableFeeApproval = 'table-fee-approval';
const selectorTable = 'table-fee-approval-table';
const selectorTableSubsidiaryHeader = 'table-fee-approval-address-header';
const selectorTableRow = 'table-fee-approval-row';
const selectorTableCheckbox = 'table-fee-approval-checkbox';
const selectorTableAmount = 'table-fee-approval-amount';
const selectorTableName = 'table-fee-approval-name';
const selectorTableEmail = 'table-fee-approval-email';
const selectorTableNickname = 'table-fee-approval-nickname';
const selectorTableDate = 'table-fee-approval-date';

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

describe('<TableFeeApproval>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonFeeApproval',
        'labelAmount',
        'labelDateRegistered',
        'labelEmail',
        'labelName',
        'labelNickname',
        'labelTeam',
        'textNoData',
      ],
      'table',
      i18n,
    );
  });

  context('desktop non-approved variant', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableFeeApproval, {
        props: { approved: false },
      });
      cy.viewport('macbook-16');
    });

    testData.forEach((test) => {
      it(`${test.description} - non-approved variant`, () => {
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
        cy.dataCy(selectorTableFeeApproval).should('exist');

        const subsidiaries = test.storeData[0].subsidiaries;
        if (subsidiaries.length === 0) {
          // no subsidiaries - no table rows
          cy.dataCy(selectorTableRow).should('not.exist');
          return;
        }
        // count non-approved members
        let nonApprovedMemberCount = 0;
        subsidiaries.forEach((subsidiary) => {
          subsidiary.teams.forEach((team) => {
            nonApprovedMemberCount +=
              team.members_without_paid_entry_fee_by_org_coord.length;
          });
        });
        const displayedSubsidiaries = subsidiaries.filter((subsidiary) => {
          return subsidiary.teams.some((team) => {
            return team.members_without_paid_entry_fee_by_org_coord.length > 0;
          });
        });
        if (nonApprovedMemberCount === 0) {
          // no non-approved members
          cy.dataCy(selectorTableRow).should('not.exist');
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
        } else {
          // test table rows and subsidiary headers
          cy.dataCy(selectorTable)
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadius);
          // checkboxes are visible
          cy.dataCy(selectorTableRow).should('exist');
          cy.dataCy(selectorTableCheckbox).should('be.visible');
          // count table rows with name
          cy.dataCy(selectorTableName).should(
            'have.length',
            nonApprovedMemberCount,
          );
          // subsidiary headers are visible
          cy.dataCy(selectorTableSubsidiaryHeader)
            .should('be.visible')
            .and('have.backgroundColor', primary)
            .and('have.color', white)
            .and('have.length', displayedSubsidiaries.length);
          // test each subsidiary header
          cy.dataCy(selectorTableSubsidiaryHeader).each((header, index) => {
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street_number);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].city);
          });
        }
      });
    });

    it('display members with correct data for non-approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              const adminOrganisations = computed(
                () => adminOrganisationStore.getAdminOrganisations,
              );
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
              cy.wrap(adminOrganisations)
                .its('value')
                .should('deep.equal', tableFeeApprovalTestData.storeData);
            },
          );
          const display =
            tableFeeApprovalTestData.displayData.nonApprovedMembers;

          // test each member row
          cy.dataCy(selectorTableRow).each((table, index) => {
            if (display[index]) {
              cy.wrap(table).within(() => {
                // checkbox
                cy.dataCy(selectorTableCheckbox).should('be.visible');
                // amount
                cy.dataCy(selectorTableAmount)
                  .should('be.visible')
                  .and('contain', formatPrice(display[index].amount));
                // name
                cy.dataCy(selectorTableName)
                  .should('be.visible')
                  .and('contain', display[index].name);
                // email
                cy.dataCy(selectorTableEmail)
                  .should('be.visible')
                  .and('contain', display[index].email);
                // nickname
                if (display[index].nickname) {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('contain', display[index].nickname);
                } else {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('be.empty');
                }
                // date
                if (display[index].dateCreated) {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and(
                      'contain',
                      i18n.global.d(
                        new Date(display[index].dateCreated),
                        'numeric',
                      ),
                    );
                } else {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and('be.empty');
                }
              });
            }
          });
        },
      );
    });
  });

  context('desktop approved variant', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableFeeApproval, {
        props: { approved: true },
      });
      cy.viewport('macbook-16');
    });

    testData.forEach((test) => {
      it(`${test.description} - approved variant`, () => {
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
        cy.dataCy(selectorTableFeeApproval).should('exist');

        const subsidiaries = test.storeData[0].subsidiaries;
        if (subsidiaries.length === 0) {
          // no subsidiaries - no table rows
          cy.dataCy(selectorTableRow).should('not.exist');
          return;
        }
        // count approved members
        let approvedMemberCount = 0;
        subsidiaries.forEach((subsidiary) => {
          subsidiary.teams.forEach((team) => {
            approvedMemberCount +=
              team.members_with_paid_entry_fee_by_org_coord.length;
          });
        });
        const displayedSubsidiaries = subsidiaries.filter((subsidiary) => {
          return subsidiary.teams.some((team) => {
            return team.members_with_paid_entry_fee_by_org_coord.length > 0;
          });
        });
        if (approvedMemberCount === 0) {
          // no approved members
          cy.dataCy(selectorTableRow).should('not.exist');
          // empty table state
          cy.get('.q-table__bottom--nodata')
            .should('be.visible')
            .and('contain', i18n.global.t('table.textNoData'));
        } else {
          // table is visible
          cy.dataCy(selectorTable)
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadius);
          // checkboxes are NOT visible
          cy.dataCy(selectorTableCheckbox).should('not.exist');
          // count table rows with name
          cy.dataCy(selectorTableName).should(
            'have.length',
            approvedMemberCount,
          );
          // subsidiary headers are visible
          cy.dataCy(selectorTableSubsidiaryHeader)
            .should('be.visible')
            .and('have.backgroundColor', primary)
            .and('have.color', white)
            .and('have.length', displayedSubsidiaries.length);
          // test each subsidiary header
          cy.dataCy(selectorTableSubsidiaryHeader).each((header, index) => {
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].street_number);
            cy.wrap(header)
              .should('be.visible')
              .and('contain', displayedSubsidiaries[index].city);
          });
        }
      });
    });

    it('display members with correct data for approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              const adminOrganisations = computed(
                () => adminOrganisationStore.getAdminOrganisations,
              );
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
              cy.wrap(adminOrganisations)
                .its('value')
                .should('deep.equal', tableFeeApprovalTestData.storeData);
            },
          );
          const display = tableFeeApprovalTestData.displayData.approvedMembers;

          // test each member row
          cy.dataCy(selectorTableRow).each((table, index) => {
            if (display[index]) {
              cy.wrap(table).within(() => {
                // checkbox is NOT visible
                cy.dataCy(selectorTableCheckbox).should('not.exist');
                // amount
                cy.dataCy(selectorTableAmount)
                  .should('be.visible')
                  .and('contain', formatPrice(display[index].amount));
                // name
                cy.dataCy(selectorTableName)
                  .should('be.visible')
                  .and('contain', display[index].name);
                // email
                cy.dataCy(selectorTableEmail)
                  .should('be.visible')
                  .and('contain', display[index].email);
                // nickname
                if (display[index].nickname) {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('contain', display[index].nickname);
                } else {
                  cy.dataCy(selectorTableNickname)
                    .should('be.visible')
                    .and('be.empty');
                }
                // date
                if (display[index].dateCreated) {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and(
                      'contain',
                      i18n.global.d(
                        new Date(display[index].dateCreated),
                        'numeric',
                      ),
                    );
                } else {
                  cy.dataCy(selectorTableDate)
                    .should('be.visible')
                    .and('be.empty');
                }
              });
            }
          });
        },
      );
    });
  });
});

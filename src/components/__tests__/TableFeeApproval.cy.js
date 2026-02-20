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
const selectorTableReward = 'table-fee-approval-reward';
const selectorTableRewardCheckbox = 'table-fee-approval-reward-checkbox';
const selectorTableEmail = 'table-fee-approval-email';
const selectorTableNickname = 'table-fee-approval-nickname';
const selectorTableDate = 'table-fee-approval-date';
const selectorApproveButton = 'table-fee-approval-button';
const selectorDisapproveButton = 'table-fee-disapproval-button';
const selectorDisapproveDialog = 'dialog-disapprove-payments';
const selectorDisapproveCancel = 'dialog-disapprove-cancel';
const selectorDisapproveConfirm = 'dialog-disapprove-confirm';

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

describe('<TableFeeApproval>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonFeeApproval',
        'buttonFeeDisapproval',
        'buttonConfirmDisapprove',
        'titleDialogDisapprovePayments',
        'labelDisapprovePaymentsDescription',
        'labelAmount',
        'labelDateRegistered',
        'labelEmail',
        'labelName',
        'labelNickname',
        'labelReward',
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
                // reward
                cy.dataCy(selectorTableReward).should('be.visible');
                cy.dataCy(selectorTableRewardCheckbox)
                  .should('be.visible')
                  .and('not.have.class', 'disabled');
                if (display[index].reward === true) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--truthy');
                } else if (display[index].reward === false) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--falsy');
                } else {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--indet');
                }
              });
            }
          });
        },
      );
    });

    it('should show disapprove and approve buttons with correct state', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // buttons visible
          cy.dataCy(selectorDisapproveButton).should('be.visible');
          cy.dataCy(selectorApproveButton).should('be.visible');
          // buttons disabled (no members selected)
          cy.dataCy(selectorDisapproveButton).should('be.disabled');
          cy.dataCy(selectorApproveButton).should('be.disabled');
          // select a payment
          cy.dataCy(selectorTableCheckbox).first().click();
          // buttons enabled
          cy.dataCy(selectorDisapproveButton).should('not.be.disabled');
          cy.dataCy(selectorApproveButton).should('not.be.disabled');
        },
      );
    });

    it('should open disapprove confirmation dialog when disapprove button is clicked', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // dialog not visible initially
          cy.dataCy(selectorDisapproveDialog).should('not.exist');
          // select a payment
          cy.dataCy(selectorTableCheckbox).first().click();
          // click disapprove button
          cy.dataCy(selectorDisapproveButton).click();
          // dialog visible
          cy.dataCy(selectorDisapproveDialog).should('be.visible');
          // verify title
          cy.dataCy(selectorDisapproveDialog)
            .contains(i18n.global.t('table.titleDialogDisapprovePayments'))
            .should('be.visible');
          // verify cancel and confirm buttons
          cy.dataCy(selectorDisapproveCancel).should('be.visible');
          cy.dataCy(selectorDisapproveConfirm).should('be.visible');
          // click cancel
          cy.dataCy(selectorDisapproveCancel).click();
          // dialog should close
          cy.dataCy(selectorDisapproveDialog).should('not.exist');
        },
      );
    });

    it('only clears local state for successfully approved payments', () => {
      cy.fixture('apiGetAdminOrganisationResponse').then((initialOrgData) => {
        cy.fixture('apiGetCoordinatorInvoicesResponse').then((invoicesData) => {
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              // set initial store state
              adminOrganisationStore.setAdminOrganisations(
                initialOrgData.results,
              );
              adminOrganisationStore.setAdminInvoices([invoicesData]);
              // get payment IDs from API data
              const payments =
                initialOrgData.results[0].subsidiaries[0].teams[0]
                  .members_without_paid_entry_fee_by_org_coord;
              const payment1 = payments[0];
              const payment2 = payments[1];
              const payment3 = payments[2];
              // select all three payments using UI
              cy.contains(payment1.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment2.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment3.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              // verify local state
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              const selectedPayments = computed(
                () => adminOrganisationStore.selectedPaymentsToApprove,
              );
              // verify all three payments are selected
              cy.wrap(selectedPayments).its('value').should('have.length', 3);
              // verify local state has all three payments
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment1.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment2.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment3.id);
              // setup API intercepts - only 2 of 3 succeed
              const approveResponse = {
                message: 'Approved 2 payments successfully',
                approved_ids: [payment1.id, payment3.id],
              };
              cy.interceptCoordinatorApprovePaymentsPostApi(
                rideToWorkByBikeConfig,
                approveResponse,
              );
              // intercept organization structure GET
              cy.interceptAdminOrganisationGetApi(
                rideToWorkByBikeConfig,
                'apiGetAdminOrganisationResponsePartialApproval',
              );
              // intercept invoices GET
              cy.interceptCoordinatorInvoicesGetApi(
                rideToWorkByBikeConfig,
                'apiGetCoordinatorInvoicesResponse',
              );
              // click approve button
              cy.dataCy(selectorApproveButton).click();
              // wait for API calls
              cy.waitForCoordinatorApprovePaymentsPostApi(
                {
                  ids: {
                    [payment1.id]: parseFloat(payment1.payment_amount),
                    [payment2.id]: parseFloat(payment2.payment_amount),
                    [payment3.id]: parseFloat(payment3.payment_amount),
                  },
                },
                approveResponse,
              );
              cy.wait('@getAdminOrganisation');
              cy.wait('@getCoordinatorInvoices');
              // verify store state: only successful IDs cleared
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', {
                  [payment2.id]: payment2.is_payment_with_reward,
                });
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', {
                  [payment2.id]: parseFloat(payment2.payment_amount),
                });
              // verify only failed payment remains selected
              cy.wrap(selectedPayments).its('value').should('have.length', 1);
              cy.wrap(selectedPayments)
                .its('value.0.id')
                .should('equal', payment2.id);
            },
          );
        });
      });
    });

    it('only clears local state for successfully approved payments when subset selected', () => {
      cy.fixture('apiGetAdminOrganisationResponse').then((initialOrgData) => {
        cy.fixture('apiGetCoordinatorInvoicesResponse').then((invoicesData) => {
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              // set initial store state
              adminOrganisationStore.setAdminOrganisations(
                initialOrgData.results,
              );
              adminOrganisationStore.setAdminInvoices([invoicesData]);
              // get payment IDs from API data
              const payments =
                initialOrgData.results[0].subsidiaries[0].teams[0]
                  .members_without_paid_entry_fee_by_org_coord;
              const payment1 = payments[0];
              const payment2 = payments[1];
              const payment3 = payments[2];
              // select only two payments using UI
              cy.contains(payment1.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment2.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              // verify local state
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              const selectedPayments = computed(
                () => adminOrganisationStore.selectedPaymentsToApprove,
              );
              // verify only two payments are selected
              cy.wrap(selectedPayments).its('value').should('have.length', 2);
              // verify local state has all three payments initialized
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment1.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment2.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment3.id);
              // setup API intercepts - both selected payments succeed
              const approveResponse = {
                message: 'Approved 2 payments successfully',
                approved_ids: [payment1.id, payment2.id],
              };
              cy.interceptCoordinatorApprovePaymentsPostApi(
                rideToWorkByBikeConfig,
                approveResponse,
              );
              // intercept organization structure GET
              cy.interceptAdminOrganisationGetApi(
                rideToWorkByBikeConfig,
                'apiGetAdminOrganisationResponseTwoApprovedMembers',
              );
              // intercept invoices GET
              cy.interceptCoordinatorInvoicesGetApi(
                rideToWorkByBikeConfig,
                'apiGetCoordinatorInvoicesResponse',
              );
              // click approve button
              cy.dataCy(selectorApproveButton).click();
              // wait for API calls
              cy.waitForCoordinatorApprovePaymentsPostApi(
                {
                  ids: {
                    [payment1.id]: parseFloat(payment1.payment_amount),
                    [payment2.id]: parseFloat(payment2.payment_amount),
                  },
                },
                approveResponse,
              );
              cy.wait('@getAdminOrganisation');
              cy.wait('@getCoordinatorInvoices');
              // verify store state: only successful IDs cleared
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', {
                  [payment3.id]: payment3.is_payment_with_reward,
                });
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', {
                  [payment3.id]: parseFloat(payment3.payment_amount),
                });
              // verify no payments remain selected
              cy.wrap(selectedPayments).its('value').should('have.length', 0);
            },
          );
        });
      });
    });

    it('only clears local state for successfully disapproved payments', () => {
      cy.fixture('apiGetAdminOrganisationResponse').then((initialOrgData) => {
        cy.fixture('apiGetCoordinatorInvoicesResponse').then((invoicesData) => {
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              // set initial store state
              adminOrganisationStore.setAdminOrganisations(
                initialOrgData.results,
              );
              adminOrganisationStore.setAdminInvoices([invoicesData]);
              // get payment IDs from API data
              const payments =
                initialOrgData.results[0].subsidiaries[0].teams[0]
                  .members_without_paid_entry_fee_by_org_coord;
              const payment1 = payments[0];
              const payment2 = payments[1];
              const payment3 = payments[2];
              // select all three payments using UI
              cy.contains(payment1.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment2.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment3.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              // verify local state
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              const selectedPayments = computed(
                () => adminOrganisationStore.selectedPaymentsToApprove,
              );
              // verify all three payments are selected
              cy.wrap(selectedPayments).its('value').should('have.length', 3);
              // verify local state has all three payments
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment1.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment2.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment3.id);
              // setup API intercepts - only 2 of 3 succeed
              const disapproveResponse = {
                message: 'Disapproved 2 payments successfully',
                disapproved_ids: [payment1.id, payment3.id],
              };
              cy.interceptCoordinatorDisapprovePaymentsPostApi(
                rideToWorkByBikeConfig,
                disapproveResponse,
              );
              // intercept organization structure GET
              cy.interceptAdminOrganisationGetApi(
                rideToWorkByBikeConfig,
                'apiGetAdminOrganisationResponsePartialDisapproval',
              );
              // intercept invoices GET
              cy.interceptCoordinatorInvoicesGetApi(
                rideToWorkByBikeConfig,
                'apiGetCoordinatorInvoicesResponse',
              );
              // click disapprove button
              cy.dataCy(selectorDisapproveButton).click();
              // confirm in dialog
              cy.dataCy(selectorDisapproveDialog).should('be.visible');
              cy.dataCy(selectorDisapproveConfirm).click();
              // wait for API call
              cy.waitForCoordinatorDisapprovePaymentsPostApi(
                {
                  ids: {
                    [payment1.id]: parseFloat(payment1.payment_amount),
                    [payment2.id]: parseFloat(payment2.payment_amount),
                    [payment3.id]: parseFloat(payment3.payment_amount),
                  },
                },
                disapproveResponse,
              );
              cy.wait('@getAdminOrganisation');
              cy.wait('@getCoordinatorInvoices');
              // verify store state: only successful IDs cleared
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', {
                  [payment2.id]: payment2.is_payment_with_reward,
                });
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', {
                  [payment2.id]: parseFloat(payment2.payment_amount),
                });
              // verify only failed payment remains selected
              cy.wrap(selectedPayments).its('value').should('have.length', 1);
              cy.wrap(selectedPayments)
                .its('value.0.id')
                .should('equal', payment2.id);
            },
          );
        });
      });
    });

    it('only clears local state for successfully disapproved payments when subset selected', () => {
      cy.fixture('apiGetAdminOrganisationResponse').then((initialOrgData) => {
        cy.fixture('apiGetCoordinatorInvoicesResponse').then((invoicesData) => {
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              // set initial store state
              adminOrganisationStore.setAdminOrganisations(
                initialOrgData.results,
              );
              adminOrganisationStore.setAdminInvoices([invoicesData]);
              // get payment IDs from API data
              const payments =
                initialOrgData.results[0].subsidiaries[0].teams[0]
                  .members_without_paid_entry_fee_by_org_coord;
              const payment1 = payments[0];
              const payment2 = payments[1];
              const payment3 = payments[2];
              // select only two payments using UI
              cy.contains(payment1.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              cy.contains(payment2.name)
                .parent('tr')
                .find('[data-cy="table-fee-approval-checkbox"]')
                .click();
              // verify local state
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              const selectedPayments = computed(
                () => adminOrganisationStore.selectedPaymentsToApprove,
              );
              // verify only two payments are selected
              cy.wrap(selectedPayments).its('value').should('have.length', 2);
              // verify local state has all three payments initialized
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment1.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment2.id);
              cy.wrap(paymentRewards)
                .its('value')
                .should('have.property', payment3.id);
              // setup API intercepts - both selected payments succeed
              const disapproveResponse = {
                message: 'Disapproved 2 payments successfully',
                disapproved_ids: [payment1.id, payment2.id],
              };
              cy.interceptCoordinatorDisapprovePaymentsPostApi(
                rideToWorkByBikeConfig,
                disapproveResponse,
              );
              // intercept organization structure GET
              cy.interceptAdminOrganisationGetApi(
                rideToWorkByBikeConfig,
                'apiGetAdminOrganisationResponseTwoDisapprovedMembers',
              );
              // intercept invoices GET
              cy.interceptCoordinatorInvoicesGetApi(
                rideToWorkByBikeConfig,
                'apiGetCoordinatorInvoicesResponse',
              );
              // click disapprove button
              cy.dataCy(selectorDisapproveButton).click();
              // confirm in dialog
              cy.dataCy(selectorDisapproveDialog).should('be.visible');
              cy.dataCy(selectorDisapproveConfirm).click();
              // wait for API call
              cy.waitForCoordinatorDisapprovePaymentsPostApi(
                {
                  ids: {
                    [payment1.id]: parseFloat(payment1.payment_amount),
                    [payment2.id]: parseFloat(payment2.payment_amount),
                  },
                },
                disapproveResponse,
              );
              cy.wait('@getAdminOrganisation');
              cy.wait('@getCoordinatorInvoices');
              // verify store state: only successful IDs cleared
              cy.wrap(paymentRewards)
                .its('value')
                .should('deep.equal', {
                  [payment3.id]: payment3.is_payment_with_reward,
                });
              cy.wrap(paymentAmounts)
                .its('value')
                .should('deep.equal', {
                  [payment3.id]: parseFloat(payment3.payment_amount),
                });
              // verify no payments remain selected
              cy.wrap(selectedPayments).its('value').should('have.length', 0);
            },
          );
        });
      });
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
                // reward
                cy.dataCy(selectorTableReward).should('be.visible');
                cy.dataCy(selectorTableRewardCheckbox)
                  .should('be.visible')
                  .and('have.class', 'disabled');
                if (display[index].reward === true) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--truthy');
                } else if (display[index].reward === false) {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--falsy');
                } else {
                  cy.dataCy(selectorTableRewardCheckbox)
                    .find('.q-checkbox__inner')
                    .should('have.class', 'q-checkbox__inner--indet');
                }
              });
            }
          });
        },
      );
    });

    it('should not show action buttons for approved variant', () => {
      cy.fixture('tableFeeApprovalTestData').then(
        (tableFeeApprovalTestData) => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.storeData,
              );
            },
          );
          // approve and disapprove buttons should not exist
          cy.dataCy(selectorDisapproveButton).should('not.exist');
          cy.dataCy(selectorApproveButton).should('not.exist');
        },
      );
    });

    it('does not initialize local state for approved table', () => {
      cy.fixture('apiGetAdminOrganisationResponseAlt2').then(
        (tableFeeApprovalTestData) => {
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              adminOrganisationStore.setAdminOrganisations(
                tableFeeApprovalTestData.results,
              );
              const paymentRewards = computed(
                () => adminOrganisationStore.paymentRewards,
              );
              const paymentAmounts = computed(
                () => adminOrganisationStore.paymentAmounts,
              );
              // approved table does not initialize local state
              cy.wrap(paymentRewards).its('value').should('deep.equal', {});
              cy.wrap(paymentAmounts).its('value').should('deep.equal', {});
            },
          );
        },
      );
    });
  });
});

import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import { computed } from 'vue';
import TableBoxes from 'components/coordinator/TableBoxes.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import testData from '../../../test/cypress/fixtures/tableBoxesTestData.json';
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');
const positive = getPaletteColor('positive');

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const iconSize = 18;

describe('<TableBoxes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCellEmpty',
        'labelTrackingNumber',
        'labelPackageStatus',
        'labelRecipients',
        'labelAddressee',
        'labelPackageProcessing',
        'labelPackageDispatched',
        'textNoData',
        'textNoResults',
        'textLoading',
        'textRowsPerPage',
      ],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableBoxes, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    testData.forEach((testCase) => {
      context(testCase.description, () => {
        it('renders table with correct data', () => {
          // initiate store state
          cy.wrap(useAdminOrganisationStore()).then(
            (adminOrganisationStore) => {
              const adminOrganisations = computed(
                () => adminOrganisationStore.getAdminOrganisations,
              );
              adminOrganisationStore.setAdminOrganisations(testCase.storeData);
              cy.wrap(adminOrganisations)
                .its('value')
                .should('deep.equal', testCase.storeData);
            },
          );
          // test table
          cy.dataCy('table-boxes').should('exist').and('be.visible');
          cy.dataCy('table-boxes-table')
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadius);

          if (testCase.displayData.length === 0) {
            // no boxes - no table rows
            cy.dataCy('table-boxes-row').should('not.exist');
            // empty table state
            cy.get('.q-table__bottom--nodata')
              .should('be.visible')
              .and('contain', i18n.global.t('table.textNoData'));
          } else {
            cy.dataCy('table-boxes-row')
              .should('be.visible')
              .and('have.color', grey10)
              .and('have.length', testCase.displayData.length);

            // check address headers
            const uniqueAddresses = [
              ...new Set(testCase.displayData.map((box) => box.address)),
            ];
            if (uniqueAddresses.length > 0) {
              cy.dataCy('table-boxes-address-header')
                .should('be.visible')
                .and('have.length', uniqueAddresses.length);
              uniqueAddresses.forEach((address) => {
                cy.dataCy('table-boxes-address-header').contains(address);
              });
            }
            // test each row
            testCase.displayData.forEach((box, boxIndex) => {
              cy.dataCy('table-boxes-row')
                .eq(boxIndex)
                .within(() => {
                  // tracking number
                  cy.dataCy('table-boxes-tracking-number').should('be.visible');
                  cy.dataCy('table-boxes-tracking-link')
                    .should('be.visible')
                    .and('have.attr', 'href', box.trackingLink)
                    .and('have.attr', 'target', '_blank')
                    .and('contain', box.trackingNumber)
                    .and('have.color', primary);
                  // icon
                  cy.dataCy('table-boxes-tracking-icon')
                    .should('be.visible')
                    .and('have.color', primary);
                  cy.dataCy('table-boxes-tracking-icon')
                    .invoke('width')
                    .should('eq', iconSize);
                  cy.dataCy('table-boxes-tracking-icon')
                    .invoke('height')
                    .should('eq', iconSize);
                  // package status
                  cy.dataCy('table-boxes-status').should('be.visible');
                  cy.dataCy('table-boxes-status-icon')
                    .invoke('width')
                    .should('eq', iconSize);
                  cy.dataCy('table-boxes-status-icon')
                    .invoke('height')
                    .should('eq', iconSize);
                  if (box.packageStatus) {
                    cy.dataCy('table-boxes-status-icon')
                      .should('be.visible')
                      .and('have.color', positive);
                  } else {
                    cy.dataCy('table-boxes-status-icon')
                      .should('be.visible')
                      .and('have.color', primary);
                  }
                  const expectedStatusLabel = box.packageStatus
                    ? i18n.global.t('table.labelPackageDispatched')
                    : i18n.global.t('table.labelPackageProcessing');
                  cy.dataCy('table-boxes-status-label').should(
                    'contain',
                    expectedStatusLabel,
                  );
                  // recipients
                  cy.dataCy('table-boxes-recipients')
                    .should('be.visible')
                    .and('contain', box.recipients);
                  // addressee
                  cy.dataCy('table-boxes-addressee')
                    .should('be.visible')
                    .and('contain', box.addressee);
                });
            });
          }
        });
      });
    });
  });
});

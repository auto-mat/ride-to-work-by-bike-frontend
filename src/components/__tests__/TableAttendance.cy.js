import { colors } from 'quasar';
import TableAttendance from 'components/coordinator/TableAttendance.vue';
import { i18n } from '../../boot/i18n';
import tableAttendance from '../../../test/cypress/fixtures/tableAttendance.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useTableAttendance } from '../../composables/useTable';
import { PaymentState } from '../types/Payment';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const positive = getPaletteColor('positive');
const negative = getPaletteColor('negative');

// composables
const { getPaymentTypeLabel, getPaymentStateLabel } = useTableAttendance();

// selectors
const classSelectorTableSortable = 'th.sortable';
const classSelectorIcon = '.q-icon';
const selectorTableAttendance = 'table-attendance';
const selectorTable = 'table-attendance-table';
const selectorTableTeamHeader = 'table-attendance-team-header';
const selectorTableRow = 'table-attendance-row';
const selectorTableName = 'table-attendance-name';
const selectorTableNickname = 'table-attendance-nickname';
const selectorTableContact = 'table-attendance-contact';
const selectorTableFeeApproved = 'table-attendance-fee-approved';
const selectorTablePaymentType = 'table-attendance-payment-type';
const selectorTablePaymentState = 'table-attendance-payment-state';
const selectorTableActions = 'table-attendance-actions';

/**
 * Sort order
 * To test sorting, predefine sets of correctly sorted data.
 */
const dataByNameAsc = [
  tableAttendance[0], // Aneta
  tableAttendance[1], // Barbora
  tableAttendance[2], // Cyprián
  tableAttendance[3], // Denisa
  tableAttendance[4], // Emil
];

const dataByNameDesc = [
  tableAttendance[4], // Emil
  tableAttendance[3], // Denisa
  tableAttendance[2], // Cyprián
  tableAttendance[1], // Barbora
  tableAttendance[0], // Aneta
];

// variables
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

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
      ['labelOrganization', 'labelPaid', 'labelRegistration', 'labelScheduled'],
      'payment',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('tableAttendance').then((rows) => {
        cy.wrap(rows).as('rows');
        cy.mount(TableAttendance, {
          props: {},
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorTableAttendance).should('be.visible');
  });

  it('renders table with correct styling', () => {
    // table
    cy.dataCy(selectorTable)
      .should('be.visible')
      .and('have.css', 'border-radius', borderRadius);
    // team header
    cy.dataCy(selectorTableTeamHeader)
      .should('be.visible')
      .and('have.backgroundColor', primary)
      .and('have.color', white);
    // table row
    cy.dataCy(selectorTableRow).should('be.visible').and('have.color', grey10);
    // table cells
    [
      selectorTableName,
      selectorTableNickname,
      selectorTableContact,
      selectorTableFeeApproved,
      selectorTablePaymentType,
      selectorTablePaymentState,
      selectorTableActions,
    ].forEach((selector) => {
      cy.dataCy(selector).should('be.visible');
    });
  });

  it('displays correct data in table', () => {
    cy.get('@rows').then((rows) => {
      // default sorting by name ascending
      cy.dataCy(selectorTableRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).within(() => {
            cy.dataCy(selectorTableName).should('contain', rows[index].name);
            cy.dataCy(selectorTableNickname).should(
              'contain',
              rows[index].nickname,
            );
            cy.dataCy(selectorTableContact).should(
              'contain',
              rows[index].contact,
            );
            cy.dataCy(selectorTablePaymentType).should(
              'contain',
              getPaymentTypeLabel(rows[index].paymentType),
            );
            // Check payment state icon and label
            cy.dataCy(selectorTablePaymentState).within(() => {
              let expectedIcon;
              let expectedColor;
              if (rows[index].paymentState === PaymentState.paid) {
                expectedIcon = 'check';
                expectedColor = positive;
              } else if (rows[index].paymentState === PaymentState.scheduled) {
                expectedIcon = 'calendar_month';
                expectedColor = primary;
              }
              cy.get(classSelectorIcon)
                .should('have.color', expectedColor)
                .and('contain', expectedIcon);
              cy.contains(getPaymentStateLabel(rows[index].paymentState));
            });
            // Check fee approved icon
            cy.dataCy(selectorTableFeeApproved).within(() => {
              let expectedIcon;
              let expectedColor;
              if (rows[index].isFeeApproved) {
                expectedIcon = 'check';
                expectedColor = positive;
              } else {
                expectedIcon = 'close';
                expectedColor = negative;
              }
              cy.get(classSelectorIcon)
                .should('have.color', expectedColor)
                .and('contain', expectedIcon);
            });
          });
        });
    });
  });

  it('sorts correctly by team', () => {
    // default sorting by name ascending
    cy.dataCy(selectorTableRow)
      .should('have.length', 5)
      .each((tableRow, index) => {
        cy.wrap(tableRow).should('contain', dataByNameAsc[index].name);
      });

    // sorting by name descending
    cy.dataCy(selectorTableAttendance)
      .find(classSelectorTableSortable)
      .first()
      .click();
    cy.dataCy(selectorTableRow)
      .should('have.length', 5)
      .each((tableRow, index) => {
        cy.wrap(tableRow).should('contain', dataByNameDesc[index].name);
      });
  });
}
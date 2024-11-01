import { colors, date } from 'quasar';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useTable } from 'src/composables/useTable';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

// composables
const { formatDate } = date;
const { formatPrice } = useTable();

// selectors
const classSelectorTableRow = '.data-row';
const classSelectorTableSortable = 'th.sortable';
const selectorTableFeeApproval = 'table-fee-approval';
const selectorTableFeeApprovalRow = 'table-fee-approval-row';
const selectorTableTitle = 'table-fee-approval-title';
const selectorTableButton = 'table-fee-approval-button';
const selectorTable = 'table-fee-approval-table';
const selectorTableTeamHeader = 'table-fee-approval-team-header';
const selectorTableRow = 'table-fee-approval-row';
const selectorTableCheckbox = 'table-fee-approval-checkbox';
const selectorTableAmount = 'table-fee-approval-amount';
const selectorTableName = 'table-fee-approval-name';
const selectorTableEmail = 'table-fee-approval-email';
const selectorTableNickname = 'table-fee-approval-nickname';
const selectorTableTeam = 'table-fee-approval-team';
const selectorTableDate = 'table-fee-approval-date';

/**
 * Sort order
 * To test sorting, predefine sets of correctly sorted data.
 */
const dataByAmountAsc = [
  tableFeeApproval[1],
  tableFeeApproval[0],
  tableFeeApproval[2],
  tableFeeApproval[5],
  tableFeeApproval[3],
  tableFeeApproval[4],
];
const dataByAmountDesc = [
  tableFeeApproval[4],
  tableFeeApproval[3],
  tableFeeApproval[5],
  tableFeeApproval[2],
  tableFeeApproval[0],
  tableFeeApproval[1],
];
const dataByDateDesc = [
  tableFeeApproval[5],
  tableFeeApproval[4],
  tableFeeApproval[3],
  tableFeeApproval[2],
  tableFeeApproval[1],
  tableFeeApproval[0],
];

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
        'textEmptyTable',
        'titleFeeApproval',
      ],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('tableFeeApproval').then((rows) => {
        cy.wrap(rows).as('rows');
        cy.mount(TableFeeApproval, {
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
    // component
    cy.dataCy(selectorTableFeeApproval).should('be.visible');
  });

  it('renders component title', () => {
    // title
    cy.dataCy(selectorTableTitle)
      .should('be.visible')
      .and('contain', i18n.global.t('table.titleFeeApproval'));
  });

  it('renders action button', () => {
    // button
    cy.dataCy(selectorTableButton)
      .should('be.visible')
      .and('have.backgroundColor', primary)
      .and('have.color', white)
      .and('contain', i18n.global.t('table.buttonFeeApproval'));
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
      selectorTableAmount,
      selectorTableName,
      selectorTableEmail,
      selectorTableNickname,
      selectorTableDate,
    ].forEach((selector) => {
      cy.dataCy(selector).should('be.visible').and('have.color', grey10);
    });
    [selectorTableTeam].forEach((selector) => {
      cy.dataCy(selector).should('not.exist');
    });
    // checkbox
    cy.dataCy(selectorTableCheckbox).should('be.visible');
  });

  it('displays correct data in table', () => {
    cy.get('@rows').then((rows) => {
      // default sorting by date ascending
      cy.dataCy(selectorTableFeeApprovalRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).within(() => {
            cy.dataCy(selectorTableAmount).should(
              'contain',
              formatPrice(rows[index].amount),
            );
            cy.dataCy(selectorTableName).should('contain', rows[index].name);
            cy.dataCy(selectorTableEmail).should('contain', rows[index].email);
            cy.dataCy(selectorTableNickname).should(
              'contain',
              rows[index].nickname,
            );
            cy.dataCy(selectorTableDate).should(
              'contain',
              formatDate(
                new Date(String(rows[index].dateCreated)),
                'D. MMM. YYYY',
              ),
            );
          });
        });
    });
  });

  it('sorts correctly by team', () => {
    cy.get('@rows').then((rows) => {
      // default sorting by date ascending
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should('contain', rows[index].email);
        });
      // sorting by date descending
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableSortable)
        .last()
        .click();
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should('contain', dataByDateDesc[index].email);
        });
      // sorting by amount ascending
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableSortable)
        .first()
        .click();
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should('contain', dataByAmountAsc[index].email);
        });
      // sorting by amount descending
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableSortable)
        .first()
        .click();
      cy.dataCy(selectorTableFeeApproval)
        .find(classSelectorTableRow)
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should('contain', dataByAmountDesc[index].email);
        });
    });
  });
}

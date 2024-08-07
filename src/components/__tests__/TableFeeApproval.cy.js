// import { date } from 'quasar';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';
import tableFeeApproval from '../../../test/cypress/fixtures/tableFeeApproval.json';

// const { formatDate } = date;

// sort order
const dataByAmountAsc = [
  tableFeeApproval[1],
  tableFeeApproval[0],
  tableFeeApproval[2],
  tableFeeApproval[5],
  tableFeeApproval[3],
  tableFeeApproval[4],
]
const dataByAmountDesc = [
  tableFeeApproval[4],
  tableFeeApproval[3],
  tableFeeApproval[5],
  tableFeeApproval[2],
  tableFeeApproval[0],
  tableFeeApproval[1],
]
const dataByDateDesc = [
  tableFeeApproval[5],
  tableFeeApproval[4],
  tableFeeApproval[3],
  tableFeeApproval[2],
  tableFeeApproval[1],
  tableFeeApproval[0],
]

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

  // context('mobile', () => {
  //   beforeEach(() => {
  //     cy.fixture('tableFeeApproval').then((rows) => {
  //       cy.wrap(rows).as('rows');
  //       cy.mount(TableFeeApproval, {
  //         props: {},
  //       });
  //       cy.viewport('iphone-6');
  //     });
  //   });

  //   coreTests();
  // });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('table-fee-approval').should('be.visible');
    // title
    cy.dataCy('table-fee-approval-title')
      .should('be.visible')
      .and('contain', i18n.global.t('table.titleFeeApproval'));
    // button
    cy.dataCy('table-fee-approval-button')
      .should('be.visible')
      .and('contain', i18n.global.t('table.buttonFeeApproval'));
  });

  it('sorts correctly by team', () => {
    cy.get('@rows').then(rows => {
      // default sorting by date ascending
      cy.dataCy('table-fee-approval')
        .find('.data-row')
        .should('have.length', 5)
        .each((tableRow, index) => {
          cy.wrap(tableRow).should('contain', rows[index].email)
        })
      // sorting by date descending
      cy.dataCy('table-fee-approval').find('th.sortable').last().click()
      cy.dataCy('table-fee-approval')
      .find('.data-row')
      .should('have.length', 5)
      .each((tableRow, index) => {
        cy.wrap(tableRow).should('contain', dataByDateDesc[index].email)
      })
      // sorting by amount ascending
      cy.dataCy('table-fee-approval').find('th.sortable').first().click()
      cy.dataCy('table-fee-approval')
      .find('.data-row')
      .should('have.length', 5)
      .each((tableRow, index) => {
        cy.wrap(tableRow).should('contain', dataByAmountAsc[index].email)
      })
      // sorting by amount descending
      cy.dataCy('table-fee-approval').find('th.sortable').first().click()
      cy.dataCy('table-fee-approval')
      .find('.data-row')
      .should('have.length', 5)
      .each((tableRow, index) => {
        cy.wrap(tableRow).should('contain', dataByAmountDesc[index].email)
      })
    });
  });
}

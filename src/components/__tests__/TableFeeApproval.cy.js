// import { date } from 'quasar';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';

// const { formatDate } = date;

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
    /**
     * "Konzistentní tým" data row [0, 1] "Aneta", "Barbora"
     * "Nadšený tým" data row [2] "Cyprián"
     * "Silný tým" data row [3, 4, 5] "Denisa", "Emil", "Filip"
     * dateCreated: 0-5 ascending
     */
  });
}

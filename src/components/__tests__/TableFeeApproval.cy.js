import { date } from 'quasar';
import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';

const { formatDate } = date;

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

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('tableFeeApproval').then((rows) => {
        cy.wrap(rows).as('rows');
        cy.mount(TableFeeApproval, {
          props: {},
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
  });
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
    // table rows
    cy.get('@rows').then((rows) => {
      cy.dataCy('table-fee-approval')
        .find('tbody')
        .find('tr')
        .should('have.length', rows.length);
      cy.dataCy('table-fee-approval')
        .find('tbody')
        .find('tr')
        .each((row, index) =>
          cy
            .wrap(row)
            .should('contain', rows[index].name)
            .and('contain', rows[index].email)
            .and('contain', rows[index].team)
            .and('contain', rows[index].amount)
            .and(
              'contain',
              formatDate(new Date(rows[index].dateCreated), 'D. MMM. YYYY'),
            ),
        );
    });
  });
}

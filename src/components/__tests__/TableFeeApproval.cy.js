import TableFeeApproval from 'components/coordinator/TableFeeApproval.vue';
import { i18n } from '../../boot/i18n';

describe('<TableFeeApproval>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TableFeeApproval, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TableFeeApproval, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('table-fee-approval').should('be.visible');
  });
}

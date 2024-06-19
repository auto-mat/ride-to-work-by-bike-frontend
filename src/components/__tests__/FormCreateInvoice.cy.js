import FormCreateInvoice from 'components/form/FormCreateInvoice.vue';
import { i18n } from '../../boot/i18n';

describe('<FormCreateInvoice>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelCompanyId', 'labelCompanyIdVat', 'labelConfirmBillingDetails'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('formCreateInvoice').then((organization) => {
        cy.mount(FormCreateInvoice, {
          props: {
            organization,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  // context('mobile', () => {
  //   beforeEach(() => {
  //     cy.fixture('formCreateInvoice').then((organization) => {
  //       cy.mount(FormCreateInvoice, {
  //         props: {
  //           organization,
  //         },
  //       });
  //       cy.viewport('iphone-6');
  //     });
  //   });

  //   coreTests();
  // });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-create-invoice').should('be.visible');
  });
}

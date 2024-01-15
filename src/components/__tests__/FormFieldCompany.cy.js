import FormFieldCompanyTest from 'components/global/FormFieldCompanyTest.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldCompany>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldCompanyTest, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders input with label', () => {
      // input wrapper
      cy.dataCy('form-company')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input label
      cy.dataCy('form-company')
        .find('label')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompany'));
      // input
      cy.dataCy('form-company').find('input').should('be.visible');
    });

    it('allows user to select option', () => {
      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 1');
    });

    it('allows to search through options', () => {
      // search for option
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').type('2');
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 2');
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').blur();
      cy.dataCy('form-company')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelCompanyShort'),
          }),
        );
      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.dataCy('form-company').find('.q-field__messages').should('not.exist');
    });

    it('renders input and button in a column layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 90);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 10);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldCompanyTest, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders input and button in a stacked layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
    });
  });
});

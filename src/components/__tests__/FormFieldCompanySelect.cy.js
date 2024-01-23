import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldCompanySelect>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelCompany'], 'form.company', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCompanySelect',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders necessary elements', () => {
      // input label
      cy.dataCy('form-company-select-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.labelCompany'));
      // input
      cy.dataCy('form-company-select-search')
        .find('input')
        .should('be.visible');
      cy.dataCy('form-company-select-search')
        .find('i')
        .invoke('height')
        .should('eq', 24);
      cy.dataCy('form-company-select-search')
        .find('i')
        .invoke('width')
        .should('eq', 24);
      // options
      cy.dataCy('form-company-select-option-group').should('be.visible');
      // add new button
      cy.dataCy('form-company-select-button').should('be.visible');
      cy.dataCy('button-add-company').should('be.visible');
      cy.dataCy('button-add-company')
        .find('i')
        .invoke('height')
        .should('be.gt', 23);
      cy.dataCy('button-add-company')
        .find('i')
        .invoke('width')
        .should('be.gt', 23);
    });

    it('allows to search through options', () => {
      // search for option
      cy.dataCy('form-company-select-search').find('input').focus();
      cy.dataCy('form-company-select-search').find('input').type('2');
      // select option
      cy.dataCy('form-company-select-option-group').within(() => {
        cy.get('.q-radio__label').first().click();
      });
      // show only one option
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      // test selected option
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__inner')
        .should('have.class', 'text-primary');
      cy.dataCy('form-company-select-search').find('input').clear();
      cy.dataCy('form-company-select-search').find('input').blur();
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__label')
        .should('have.length', 7);
    });
  });
});

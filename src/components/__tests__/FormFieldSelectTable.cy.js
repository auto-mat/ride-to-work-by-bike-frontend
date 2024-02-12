import FormFieldSelectTable from 'components/form/FormFieldSelectTable.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldSelectTable>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonAddCompany', 'labelCompany', 'titleAddCompany'],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddTeam', 'labelTeam', 'titleAddTeam'],
      'form.team',
      i18n,
    );
  });

  context('company desktop', () => {
    beforeEach(() => {
      cy.fixture('companyOptions').then((options) => {
        cy.mount(FormFieldSelectTable, {
          props: {
            options: options,
            label: i18n.global.t('form.company.labelCompany'),
            labelButton: i18n.global.t('register.challenge.buttonAddCompany'),
            labelButtonDialog: i18n.global.t('form.company.buttonAddCompany'),
            titleDialog: i18n.global.t('form.company.titleAddCompany'),
          },
        });
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
      cy.dataCy('button-add-option').should('be.visible');
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('height')
        .should('be.gt', 23);
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('width')
        .should('be.gt', 23);
    });

    it('allows to search through options', () => {
      // search for option
      cy.dataCy('form-company-select-search').find('input').focus();
      cy.dataCy('form-company-select-search').find('input').type('2');
      // show only one option
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-company-select-search').find('input').clear();
      cy.dataCy('form-company-select-search').find('input').blur();
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__label')
        .should('have.length', 7);
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-company-select-search').find('input').focus();
      cy.dataCy('form-company-select-search').find('input').blur();
      cy.dataCy('form-select-table-field')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageOptionRequired'));
    });

    it('renders dialog when for adding a new company', () => {
      cy.dataCy('button-add-option').click();
      cy.dataCy('dialog-add-option').should('be.visible');
      cy.dataCy('dialog-add-option')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.company.titleAddCompany'));
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('have.text', i18n.global.t('navigation.discard'));
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('have.text', i18n.global.t('form.company.buttonAddCompany'));
    });
  });

  context('company selected', () => {
    beforeEach(() => {
      cy.fixture('companyOptions').then((options) => {
        cy.mount(FormFieldSelectTable, {
          props: {
            options: options,
            modelValue: options[0].value,
            label: i18n.global.t('form.company.labelCompany'),
            labelButton: i18n.global.t('register.challenge.buttonAddCompany'),
            labelButtonDialog: i18n.global.t('form.company.buttonAddCompany'),
            titleDialog: i18n.global.t('form.company.titleAddCompany'),
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('shows selected option', () => {
      cy.dataCy('form-company-select-option-group')
        .find('.q-radio__inner')
        .first()
        .should('have.class', 'text-primary');
    });
  });
});

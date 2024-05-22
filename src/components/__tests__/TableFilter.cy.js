import TableFilter from 'components/global/TableFilter.vue';
import { i18n } from '../../boot/i18n';

describe('<TableFilter>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['textEmptyTable'], 'table', i18n);
    cy.testLanguageStringsInContext(['all'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TableFilter, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TableFilter, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('table-filter').should('be.visible');
    cy.dataCy('table-filter-table').should('be.visible');
    cy.dataCy('table-filter-search').should('be.visible');
    cy.dataCy('table-filter-select').should('be.visible');
    cy.dataCy('table-button-download')
      .should('be.visible')
      .and('contain', 'download');
  });

  it('allows to filter by search', () => {
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 3);
    cy.dataCy('table-filter-search').focus();
    cy.dataCy('table-filter-search').type('Marta');
    cy.dataCy('table-filter-search').blur();
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 1);
    cy.dataCy('table-filter-search').clear();
    cy.dataCy('table-filter-search').blur();
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 3);
  });

  it('allows to filter by select', () => {
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 3);
    cy.dataCy('table-filter-select').select('Organizace 1');
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 1);
    cy.dataCy('table-filter-select').select('Organizace 2');
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 2);
    cy.dataCy('table-filter-select').select(i18n.global.t('global.all'));
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 3);
  });

  it('allows to filter by both search and select', () => {
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 3);
    cy.dataCy('table-filter-search').focus();
    cy.dataCy('table-filter-search').type('Marta');
    cy.dataCy('table-filter-search').blur();
    cy.dataCy('table-filter-select').select('Organizace 2');
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 1);
  });

  it('shows message when table is empty', () => {
    cy.dataCy('table-filter-search').focus();
    cy.dataCy('table-filter-search').type('Non-existing data');
    cy.dataCy('table-filter-search').blur();
    cy.dataCy('table-filter-table')
      .find('tbody')
      .find('tr')
      .should('have.length', 0);
    cy.dataCy('table-no-data')
      .should('be.visible')
      .and('contain', i18n.global.t('table.textEmptyTable'));
  });
}

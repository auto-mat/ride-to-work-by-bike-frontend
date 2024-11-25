import { createPinia, setActivePinia } from 'pinia';
import FormSelectOrganization from 'components/form/FormSelectOrganization.vue';
import { i18n } from '../../boot/i18n';
import { OrganizationType } from 'src/components/types/Organization';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// selectors
const selectorFormFieldCompanyAddress = 'form-company-address';
const selectorFormFieldSelectTable = 'form-select-table-company';
const selectorFormSelectOrganization = 'form-select-organization';

describe('<FormSelectOrganization>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders the main component', () => {
    cy.dataCy(selectorFormSelectOrganization).should('be.visible');
  });

  it('renders the FormFieldSelectTable component', () => {
    cy.dataCy(selectorFormFieldSelectTable).should('be.visible');
  });

  it('renders the FormFieldCompanyAddress component', () => {
    cy.dataCy(selectorFormFieldCompanyAddress).should('be.visible');
  });

  it('renders the "Company" version when store organizationType is Company', () => {
    const registerChallengeStore = useRegisterChallengeStore();
    registerChallengeStore.setOrganizationType(OrganizationType.company);
    // test correct value of the prop via data-cy selector
    cy.dataCy('form-select-table-company')
      .should('have.attr', 'data-organization-type')
      .and('equal', OrganizationType.company);
  });

  it('renders the "School" version when store organizationType is School', () => {
    const registerChallengeStore = useRegisterChallengeStore();
    registerChallengeStore.setOrganizationType(OrganizationType.school);
    // test correct value of the prop via data-cy selector
    cy.dataCy('form-select-table-company')
      .should('have.attr', 'data-organization-type')
      .and('equal', OrganizationType.school);
  });

  it('renders the "Family" version when store organizationType is Family', () => {
    const registerChallengeStore = useRegisterChallengeStore();
    registerChallengeStore.setOrganizationType(OrganizationType.family);
    // test correct value of the prop via data-cy selector
    cy.dataCy('form-select-table-company')
      .should('have.attr', 'data-organization-type')
      .and('equal', OrganizationType.family);
  });
}

import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import FormSelectOrganization from 'components/form/FormSelectOrganization.vue';
import { i18n } from '../../boot/i18n';
import { OrganizationType } from 'src/components/types/Organization';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { interceptOrganizationsApi } from '../../../test/cypress/support/commonTests';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// selectors
const selectorFormFieldCompanyAddress = 'form-company-address';
const selectorFormFieldSelectTable = 'form-select-table-company';
const selectorFormSelectOrganization = 'form-select-organization';

describe('<FormSelectOrganization>', () => {
  let organizationId;

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  before(() => {
    setActivePinia(createPinia());
    // set common organizationId from fixture
    cy.fixture('formFieldCompanyCreate').then(
      (formFieldCompanyCreateResponse) => {
        organizationId = formFieldCompanyCreateResponse.id;
      },
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.interceptSubsidiariesGetApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptSubsidiariesGetApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  context('create new organization and subsidiary', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      cy.interceptSubsidiaryPostApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      cy.mount(FormSelectOrganization, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('allows to create a new organization and subsidiary', () => {
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        cy.fixture('apiPostSubsidiaryRequest').then(
          (apiPostSubsidiaryRequest) => {
            cy.fixture('apiPostSubsidiaryResponse').then(
              (apiPostSubsidiaryResponse) => {
                cy.fixture('formFieldCompanyCreateRequest').then(
                  (formFieldCompanyCreateRequest) => {
                    cy.fixture('formFieldCompanyCreate').then(
                      (formFieldCompanyCreateResponse) => {
                        cy.wrap(useRegisterChallengeStore()).then((store) => {
                          store.setOrganizationType(OrganizationType.company);
                          const organizationId = computed(
                            () => store.getOrganizationId,
                          );
                          const subsidiaryId = computed(
                            () => store.getSubsidiaryId,
                          );
                          // open dialog form
                          cy.dataCy('button-add-option').click();
                          // verify that dialog is visible
                          cy.dataCy('dialog-add-option').should('be.visible');
                          cy.dataCy('dialog-add-option')
                            .find('h3')
                            .should('be.visible')
                            .and(
                              'contain',
                              i18n.global.t('form.company.titleAddCompany'),
                            );
                          // fill in the form
                          cy.fillOrganizationSubsidiaryForm(
                            formFieldCompanyCreateRequest,
                            apiPostSubsidiaryRequest,
                          );
                          // submit the form
                          cy.dataCy('dialog-button-submit').click();
                          // check that POST organization API was called
                          cy.waitForOrganizationPostApi();
                          // check that POST subsidiary API was called
                          cy.waitForSubsidiaryPostApi();
                          // check that a new organization was added to the list
                          cy.dataCy('form-select-table-options')
                            .find('.q-radio__label')
                            .should(
                              'have.length',
                              formFieldCompanyResponse.count + 1,
                            );
                          cy.dataCy('form-select-table-options')
                            .find('.q-radio__label')
                            .contains(formFieldCompanyCreateRequest.name)
                            .should('exist');
                          // check that organizationId was saved in store
                          cy.wrap(organizationId)
                            .its('value')
                            .should('equal', formFieldCompanyCreateResponse.id);
                          // check that subsidiaryId was saved in store
                          cy.wrap(subsidiaryId)
                            .its('value')
                            .should('equal', apiPostSubsidiaryResponse.id);
                          // check that the subsidary (address) input has correct value
                          cy.dataCy('form-company-address').should(
                            'contain',
                            apiPostSubsidiaryRequest.address.street,
                          );
                        });
                      },
                    );
                  },
                );
              },
            );
          },
        );
      });
    });
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

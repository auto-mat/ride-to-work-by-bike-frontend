import { nextTick, ref } from 'vue';
import FormAddCompany from '../form/FormAddCompany.vue';
import { vModelAdapter } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { OrganizationType } from '../types/Organization';
import { emptyFormCompanyFields } from '../global/FormFieldCompany.vue';
import { deepObjectWithSimplePropsCopy } from '../../utils';

// selectors
const classSelectorDropdownItem = '.q-item';
const classSelectorDropdownMenu = '.q-menu';
const selectorFormTitle = 'form-add-company-title';
const selectorFormPermission = 'form-add-company-permission';
const selectorFormName = 'form-add-company-name';
const selectorFormVatId = 'form-add-company-vat-id';
const selectorFormStreet = 'form-add-company-street';
const selectorFormHouseNumber = 'form-add-company-house-number';
const selectorFormCity = 'form-add-company-city';
const selectorFormZip = 'form-add-company-zip';
const selectorFormCityChallenge = 'form-add-company-city-challenge';
const selectorFormDepartment = 'form-add-company-department';

describe('<FormAddCompany>', () => {
  // default form state (make a deep copy of empty state)
  const model = ref(deepObjectWithSimplePropsCopy(emptyFormCompanyFields));

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCompanyShort',
        'company.textCompanyPermission',
        'labelTitle',
        'labelBusinessId',
        'company.titleSubsidiaryAddress',
        'company.textSubsidiaryAddress',
        'labelStreet',
        'labelHouseNumber',
        'messageFieldRequired',
        'labelCity',
        'labelZip',
        'company.labelCityChallenge',
        'company.hintCityChallenge',
        'company.labelDepartment',
        'company.hintDepartment',
        'labelSchool',
        'labelFamily',
      ],
      'form',
      i18n,
    );
  });

  context('variant: simple', () => {
    beforeEach(() => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: 'simple',
        },
      });
    });

    it('renders basic form elements', () => {
      // title
      cy.dataCy(selectorFormTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompanyShort'));
      // permission text not visible
      cy.dataCy(selectorFormPermission).should('not.exist');
      // basic fields
      cy.dataCy(selectorFormName).should('be.visible');
      cy.dataCy(selectorFormVatId).should('be.visible');
      // address fields not visible
      cy.dataCy(selectorFormStreet).should('not.exist');
      cy.dataCy(selectorFormHouseNumber).should('not.exist');
      cy.dataCy(selectorFormCity).should('not.exist');
      cy.dataCy(selectorFormZip).should('not.exist');
      cy.dataCy(selectorFormCityChallenge).should('not.exist');
      cy.dataCy(selectorFormDepartment).should('not.exist');
    });

    it('updates model value when fields change', () => {
      cy.fixture('companyAddress').then((companyAddress) => {
        model.value = deepObjectWithSimplePropsCopy(emptyFormCompanyFields);
        nextTick();
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // verify model updates
        nextTick();
        cy.wrap(model).its('value.name').should('eq', companyAddress.name);
        cy.wrap(model).its('value.vatId').should('eq', companyAddress.vatId);
      });
    });
  });

  context('variant: default', () => {
    beforeEach(() => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: 'default',
        },
      });
    });

    it('renders all form elements', () => {
      model.value = deepObjectWithSimplePropsCopy(emptyFormCompanyFields);
      nextTick();
      // title
      cy.dataCy(selectorFormTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompanyShort'));
      // permission text
      cy.dataCy(selectorFormPermission)
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.textCompanyPermission'));
      // basic fields
      cy.dataCy(selectorFormName).should('be.visible');
      cy.dataCy(selectorFormVatId).should('be.visible');
      // address fields
      cy.dataCy(selectorFormStreet).should('be.visible');
      cy.dataCy(selectorFormHouseNumber).should('be.visible');
      cy.dataCy(selectorFormCity).should('be.visible');
      cy.dataCy(selectorFormZip).should('be.visible');
      cy.dataCy(selectorFormCityChallenge).should('be.visible');
      cy.dataCy(selectorFormDepartment).should('be.visible');
    });

    it('updates model value when all fields change', () => {
      cy.fixture('companyAddress').then((companyAddress) => {
        model.value = deepObjectWithSimplePropsCopy(emptyFormCompanyFields);
        nextTick();
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // fill in address fields
        cy.dataCy(selectorFormStreet)
          .find('input')
          .type(companyAddress.address[0].street);
        cy.dataCy(selectorFormHouseNumber)
          .find('input')
          .type(companyAddress.address[0].houseNumber);
        cy.dataCy(selectorFormCity)
          .find('input')
          .type(companyAddress.address[0].city);
        cy.dataCy(selectorFormZip)
          .find('input')
          .type(companyAddress.address[0].zip);
        cy.dataCy(selectorFormCityChallenge).click();
        cy.get(classSelectorDropdownMenu)
          .should('be.visible')
          .within(() => {
            cy.get(classSelectorDropdownItem).first().click();
          });
        cy.dataCy(selectorFormDepartment).type(
          companyAddress.address[0].department,
        );
        cy.dataCy(selectorFormDepartment).blur();
        nextTick();
        // verify model updates
        cy.wrap(model).its('value').should('deep.equal', companyAddress);
      });
    });
  });

  context('organizationType prop', () => {
    it('shows VAT field for company type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: 'simple',
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('shows VAT field for company type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: 'default',
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('hides VAT field for school type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: 'simple',
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelSchool'),
      );
    });

    it('hides VAT field for school type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: 'default',
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelSchool'),
      );
    });

    it('hides VAT field for family type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: 'simple',
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelFamily'),
      );
    });

    it('hides VAT field for family type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: 'default',
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelFamily'),
      );
    });

    it('shows VAT field when organizationType is not provided (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          variant: 'simple',
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('shows VAT field when organizationType is not provided (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          variant: 'default',
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });
  });
});

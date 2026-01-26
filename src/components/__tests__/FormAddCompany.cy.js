import { ref } from 'vue';
import FormAddCompany from '../form/FormAddCompany.vue';
import { vModelAdapter } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { OrganizationType } from '../types/Organization';
import { emptyFormCompanyFields } from '../global/FormFieldCompany.vue';
import { deepObjectWithSimplePropsCopy } from '../../utils';
import { FormAddCompanyVariantProp } from '../enums/Form';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// selectors
const classSelectorDropdownItem = '.q-item';
const classSelectorDropdownMenu = '.q-menu';
const selectorFormTitle = 'form-add-company-title';
const selectorFormPermission = 'form-add-company-permission';
const selectorFormName = 'form-add-company-name';
const selectorFormVatId = 'form-add-company-vat-id';
const selectorFormSectionOrgAddressTitle =
  'form-add-company-section-org-address-title';
const selectorFormOrgAddressStreet = 'form-orgAddress-street';
const selectorFormOrgAddressHouseNumber = 'form-orgAddress-house-number';
const selectorFormOrgAddressCity = 'form-orgAddress-city';
const selectorFormOrgAddressZip = 'form-orgAddress-zip';
const selectorFormStreet = 'form-add-subsidiary-street';
const selectorFormHouseNumber = 'form-add-subsidiary-house-number';
const selectorFormCity = 'form-add-subsidiary-city';
const selectorFormZip = 'form-add-subsidiary-zip';
const selectorFormCityChallenge = 'form-add-subsidiary-city-challenge';
const selectorFormDepartment = 'form-add-subsidiary-department';
const selectorFormSectionSubsidiaryTitle =
  'form-add-company-section-subsidiary-title';

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
        'company.titleOrganizationAddress',
        'company.textOrganizationAddress',
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
        'labelSchoolShort',
        'labelFamilyShort',
      ],
      'form',
      i18n,
    );
  });

  context('variant: simple', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
    });

    it('renders basic form elements', () => {
      // title
      cy.dataCy(selectorFormTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompanyShort'));
      // permission text not visible in simple variant
      cy.dataCy(selectorFormPermission).should('not.exist');
      // basic fields
      cy.dataCy(selectorFormName).should('be.visible');
      cy.dataCy(selectorFormVatId).should('be.visible');
      // org address section title
      cy.dataCy(selectorFormSectionOrgAddressTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.titleOrganizationAddress'));
      // org address fields visible
      cy.dataCy(selectorFormOrgAddressStreet).should('be.visible');
      cy.dataCy(selectorFormOrgAddressHouseNumber).should('be.visible');
      cy.dataCy(selectorFormOrgAddressCity).should('be.visible');
      cy.dataCy(selectorFormOrgAddressZip).should('be.visible');
      // subsidiary fields not visible in simple variant
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
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // fill in org address fields
        cy.dataCy(selectorFormOrgAddressStreet)
          .find('input')
          .type(companyAddress.orgAddress.street);
        cy.dataCy(selectorFormOrgAddressHouseNumber)
          .find('input')
          .type(companyAddress.orgAddress.houseNumber);
        cy.dataCy(selectorFormOrgAddressCity)
          .find('input')
          .type(companyAddress.orgAddress.city);
        cy.dataCy(selectorFormOrgAddressZip)
          .find('input')
          .type(companyAddress.orgAddress.zip);
        // verify model updates
        cy.wrap(model).its('value.name').should('eq', companyAddress.name);
        cy.wrap(model).its('value.vatId').should('eq', companyAddress.vatId);
        cy.wrap(model)
          .its('value.orgAddress.street')
          .should('eq', companyAddress.orgAddress.street);
        cy.wrap(model)
          .its('value.orgAddress.houseNumber')
          .should('eq', companyAddress.orgAddress.houseNumber);
        cy.wrap(model)
          .its('value.orgAddress.city')
          .should('eq', companyAddress.orgAddress.city);
        cy.wrap(model)
          .its('value.orgAddress.zip')
          .should('eq', companyAddress.orgAddress.zip);
      });
    });
  });

  context('variant: default', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: FormAddCompanyVariantProp.default,
        },
      });
    });

    it('renders all form elements', () => {
      model.value = deepObjectWithSimplePropsCopy(emptyFormCompanyFields);
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
      // org address section
      cy.dataCy(selectorFormSectionOrgAddressTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.titleOrganizationAddress'));
      // org address fields
      cy.dataCy(selectorFormOrgAddressStreet).should('be.visible');
      cy.dataCy(selectorFormOrgAddressHouseNumber).should('be.visible');
      cy.dataCy(selectorFormOrgAddressCity).should('be.visible');
      cy.dataCy(selectorFormOrgAddressZip).should('be.visible');
      // subsidiary section
      cy.dataCy(selectorFormSectionSubsidiaryTitle).should('be.visible');
      // subsidiary address fields
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
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // fill in org address fields
        cy.dataCy(selectorFormOrgAddressStreet)
          .find('input')
          .type(companyAddress.orgAddress.street);
        cy.dataCy(selectorFormOrgAddressHouseNumber)
          .find('input')
          .type(companyAddress.orgAddress.houseNumber);
        cy.dataCy(selectorFormOrgAddressCity)
          .find('input')
          .type(companyAddress.orgAddress.city);
        cy.dataCy(selectorFormOrgAddressZip)
          .find('input')
          .type(companyAddress.orgAddress.zip);
        // fill in subsidiary address fields
        cy.dataCy(selectorFormStreet)
          .find('input')
          .type(companyAddress.subsidiaryAddress.street);
        cy.dataCy(selectorFormHouseNumber)
          .find('input')
          .type(companyAddress.subsidiaryAddress.houseNumber);
        cy.dataCy(selectorFormCity)
          .find('input')
          .type(companyAddress.subsidiaryAddress.city);
        cy.dataCy(selectorFormZip)
          .find('input')
          .type(companyAddress.subsidiaryAddress.zip);
        cy.dataCy(selectorFormCityChallenge).click();
        cy.get(classSelectorDropdownMenu)
          .should('be.visible')
          .within(() => {
            cy.get(classSelectorDropdownItem).first().click();
          });
        cy.dataCy(selectorFormDepartment).type(
          companyAddress.subsidiaryAddress.department,
        );
        cy.dataCy(selectorFormDepartment).blur();
        // override cityChallenge with fixture data to get correct ID
        cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
          companyAddress.subsidiaryAddress.cityChallenge =
            citiesResponse.results[0].id;
        });
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
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('hides company related message for company type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormPermission).should('not.exist');
    });

    it('shows VAT field for company type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('shows company related message for company type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormPermission)
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.textCompanyPermission'));
    });

    it('hides VAT field for school type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelSchoolShort'),
      );
    });

    it('hides company related message for school type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormPermission).should('not.exist');
    });

    it('hides VAT field for school type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelSchoolShort'),
      );
    });

    it('shows label for school type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelSchoolShort'),
      );
      cy.dataCy(selectorFormSectionSubsidiaryTitle).should(
        'have.text',
        i18n.global.t('form.company.titleSubsidiaryAddress'),
      );
    });

    it('hides company related message for school type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.school,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormPermission).should('not.exist');
    });

    it('hides VAT field for family type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelFamilyShort'),
      );
    });

    it('hides company related message for family type (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: FormAddCompanyVariantProp.simple,
        },
      });
      cy.dataCy(selectorFormPermission).should('not.exist');
    });

    it('hides VAT field for family type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormVatId).should('not.exist');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelFamilyShort'),
      );
    });

    it('shows label for family type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelFamilyShort'),
      );
      cy.dataCy(selectorFormSectionSubsidiaryTitle).should(
        'have.text',
        i18n.global.t('form.labelAddress'),
      );
    });

    it('hides company related message for family type (default)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.family,
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormPermission).should('not.exist');
    });

    it('shows VAT field when organizationType is not provided (simple)', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          variant: FormAddCompanyVariantProp.simple,
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
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormVatId).should('be.visible');
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });

    it('shows correct label when organizationType is not provided', () => {
      cy.mount(FormAddCompany, {
        props: {
          ...vModelAdapter(model),
          variant: FormAddCompanyVariantProp.default,
        },
      });
      cy.dataCy(selectorFormTitle).should(
        'contain',
        i18n.global.t('form.labelCompanyShort'),
      );
    });
  });
});

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
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // verify model updates
        cy.wrap(model).its('value.name').should('eq', companyAddress.name);
        cy.wrap(model).its('value.vatId').should('eq', companyAddress.vatId);
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
        // fill in basic fields
        cy.dataCy(selectorFormName).find('input').type(companyAddress.name);
        cy.dataCy(selectorFormVatId).find('input').type(companyAddress.vatId);
        // fill in address fields
        cy.dataCy(selectorFormStreet)
          .find('input')
          .type(companyAddress.address.street);
        cy.dataCy(selectorFormHouseNumber)
          .find('input')
          .type(companyAddress.address.houseNumber);
        cy.dataCy(selectorFormCity)
          .find('input')
          .type(companyAddress.address.city);
        cy.dataCy(selectorFormZip)
          .find('input')
          .type(companyAddress.address.zip);
        cy.dataCy(selectorFormCityChallenge).click();
        cy.get(classSelectorDropdownMenu)
          .should('be.visible')
          .within(() => {
            cy.get(classSelectorDropdownItem).first().click();
          });
        cy.dataCy(selectorFormDepartment).type(
          companyAddress.address.department,
        );
        cy.dataCy(selectorFormDepartment).blur();
        // override cityChallenge with fixture data to get correct ID
        cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
          companyAddress.address.cityChallenge = citiesResponse.results[0].id;
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

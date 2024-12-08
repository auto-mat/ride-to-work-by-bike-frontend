import { ref } from 'vue';
import FormAddSubsidiary from 'components/form/FormAddSubsidiary.vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';
import { deepObjectWithSimplePropsCopy } from '../../../src/utils';

// selectors
const selectorFormStreet = 'form-add-subsidiary-street';
const selectorFormHouseNumber = 'form-add-subsidiary-house-number';
const selectorFormCity = 'form-add-subsidiary-city';
const selectorFormZip = 'form-add-subsidiary-zip';
const selectorFormCityChallenge = 'form-add-subsidiary-city-challenge';
const selectorFormDepartment = 'form-add-subsidiary-department';

// variables
const testData = {
  street: 'Main Street',
  houseNumber: '42',
  city: 'Praha',
  zip: '11000',
  cityChallenge: '', // added from fixture
  department: 'IT Department',
};

const emptyData = {
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
  cityChallenge: '',
  department: '',
};

const model = ref(deepObjectWithSimplePropsCopy(emptyData));

describe('<FormAddSubsidiary>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      // assign selected city ID from fixture to testData for final comparison
      cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
        testData.cityChallenge = citiesResponse.results[0].id;
      });
      model.value = deepObjectWithSimplePropsCopy(emptyData);
      cy.mount(FormAddSubsidiary, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    desktopTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      // assign selected city ID from fixture to testData for final comparison
      cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
        testData.cityChallenge = citiesResponse.results[0].id;
      });
      model.value = deepObjectWithSimplePropsCopy(emptyData);
      cy.mount(FormAddSubsidiary, {
        props: {
          ...vModelAdapter(model),
        },
      });

      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // address fields
    cy.dataCy(selectorFormStreet).should('be.visible');
    cy.dataCy(selectorFormHouseNumber).should('be.visible');
    cy.dataCy(selectorFormCity).should('be.visible');
    cy.dataCy(selectorFormZip).should('be.visible');
    cy.dataCy(selectorFormCityChallenge).should('be.visible');
    cy.dataCy(selectorFormDepartment).should('be.visible');
  });

  it('updates model when fields are filled', () => {
    // street
    cy.dataCy(selectorFormStreet).find('input').type(testData.street);
    cy.wrap(model).its('value.street').should('equal', testData.street);
    // house number
    cy.dataCy(selectorFormHouseNumber).find('input').type(testData.houseNumber);
    cy.wrap(model)
      .its('value.houseNumber')
      .should('equal', testData.houseNumber);
    // city
    cy.dataCy(selectorFormCity).find('input').type(testData.city);
    cy.wrap(model).its('value.city').should('equal', testData.city);
    // ZIP
    cy.dataCy(selectorFormZip).find('input').type(testData.zip);
    cy.wrap(model).its('value.zip').should('equal', testData.zip);
    // city challenge
    cy.dataCy(selectorFormCityChallenge).click();
    // test loaded city options
    cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
      cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
        cy.get('.q-menu .q-item__label')
          .should('be.visible')
          .and(
            'have.length',
            citiesResponse.results.length + citiesResponseNext.results.length,
          );
        cy.get('.q-menu .q-item__label').first().click();
        cy.wrap(model)
          .its('value.cityChallenge')
          .should('equal', citiesResponse.results[0].id);
      });
    });
    // department
    cy.dataCy(selectorFormDepartment).type(testData.department);
    cy.wrap(model).its('value.department').should('equal', testData.department);
    cy.wrap(model).its('value').should('deep.include', testData);
  });
}

function desktopTests() {
  it('renders some fields side by side', () => {
    cy.testElementsSideBySide(selectorFormStreet, selectorFormHouseNumber);
    cy.testElementsSideBySide(selectorFormCity, selectorFormZip);
  });
}

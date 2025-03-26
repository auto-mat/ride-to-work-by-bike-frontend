import { ref } from 'vue';
import FormFieldSelectCity from '../form/FormFieldSelectCity.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

// variables
const model = ref(null);

describe('<FormFieldSelectCity>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelCity'], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      model.value = null;
      cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
        cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
          cy.mount(FormFieldSelectCity, {
            props: {
              ...vModelAdapter(model),
              cities: [
                ...citiesResponse.results,
                ...citiesResponseNext.results,
              ],
              loading: false,
            },
          });
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      model.value = null;
      cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
        cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
          cy.mount(FormFieldSelectCity, {
            props: {
              ...vModelAdapter(model),
              cities: [
                ...citiesResponse.results,
                ...citiesResponseNext.results,
              ],
              loading: false,
            },
          });
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-select-label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelCity'));
    // click select
    cy.dataCy('form-select-city').click();
    // check if all cities are visible
    cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
      cy.fixture('apiGetCitiesResponseNext').then((citiesResponseNext) => {
        cy.get('.q-menu .q-item__label')
          .should('be.visible')
          .and(
            'have.length',
            citiesResponse.results.length + citiesResponseNext.results.length,
          );
      });
    });
  });

  it('allows to select city and updates modelValue', () => {
    cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
      cy.dataCy('form-select-city').click();
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.wrap(model)
        .its('value')
        .should('eq', citiesResponse.results[0].wp_slug);
    });
  });

  it('works correctly with non-unique wp_slug', () => {
    cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
      // choose city with different slug and wp_slug
      cy.dataCy('form-select-city').click();
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').contains(citiesResponse.results[6].name).click();
        });
      // modelValue is set to chosen city wp_slug
      cy.wrap(model)
        .its('value')
        .should('eq', citiesResponse.results[6].wp_slug);
      // select contains chosen city name
      cy.dataCy('form-select-city').should(
        'contain',
        citiesResponse.results[6].name,
      );
      // choose city with same wp_slug as previous city
      cy.dataCy('form-select-city').click();
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').contains(citiesResponse.results[12].name).click();
        });
      // modelValue is set to chosen city wp_slug
      cy.wrap(model)
        .its('value')
        .should('eq', citiesResponse.results[12].wp_slug);
      // select contains chosen city name
      cy.dataCy('form-select-city').should(
        'contain',
        citiesResponse.results[12].name,
      );
    });
  });
}

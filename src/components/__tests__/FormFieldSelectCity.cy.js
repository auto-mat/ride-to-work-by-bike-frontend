import { ref } from 'vue';
import FormFieldSelectCity from '../form/FormFieldSelectCity.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { vModelAdapter } from '../../../test/cypress/utils';

// variables
const model = ref(null);

describe('<FormFieldSelectCity>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelCity'], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      model.value = null;
      cy.mount(FormFieldSelectCity, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      model.value = null;
      cy.mount(FormFieldSelectCity, {
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
    cy.waitForCitiesApi();
    cy.dataCy('form-field-select-city').should('be.visible');
    cy.dataCy('form-select-label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelCity'));
    // click select
    cy.dataCy('form-select-city').click();

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
      cy.waitForCitiesApi();
      cy.dataCy('form-select-city').click();
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.wrap(model).its('value').should('eq', citiesResponse.results[0].slug);
    });
  });
}

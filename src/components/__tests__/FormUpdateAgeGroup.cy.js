import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import FormUpdateAgeGroup from 'components/form/FormUpdateAgeGroup.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormUpdateAgeGroup>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelAgeGroup', 'messageFieldRequired'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetAgeGroupsResponse').then((response) => {
        cy.interceptAgeGroupsGetApi(rideToWorkByBikeConfig, i18n, response);
      });
      const closeSpy = cy.spy().as('closeSpy');
      const updateValueSpy = cy.spy().as('updateValueSpy');
      cy.mount(FormUpdateAgeGroup, {
        props: {
          value: null,
          onClose: closeSpy,
          'onUpdate:value': updateValueSpy,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetAgeGroupsResponse').then((response) => {
        cy.interceptAgeGroupsGetApi(rideToWorkByBikeConfig, i18n, response);
      });
      const closeSpy = cy.spy().as('closeSpy');
      const updateValueSpy = cy.spy().as('updateValueSpy');
      cy.mount(FormUpdateAgeGroup, {
        props: {
          value: null,
          onClose: closeSpy,
          'onUpdate:value': updateValueSpy,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  context('with value', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetAgeGroupsResponse').then((response) => {
        cy.interceptAgeGroupsGetApi(rideToWorkByBikeConfig, i18n, response);
        const closeSpy = cy.spy().as('closeSpy');
        const updateValueSpy = cy.spy().as('updateValueSpy');
        cy.mount(FormUpdateAgeGroup, {
          props: {
            value: response[0][0],
            onClose: closeSpy,
            'onUpdate:value': updateValueSpy,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('displays selected value', () => {
      cy.fixture('apiGetAgeGroupsResponse').then((response) => {
        cy.wait('@ageGroupsGetApi');
        cy.dataCy('form-update-age-group')
          .find('input')
          .invoke('val')
          .should('contain', response[0][1]);
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-update-age-group').should('be.visible');
    cy.dataCy('form-label')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelAgeGroup'));
    cy.dataCy('form-age-group-select').should('be.visible');
    cy.dataCy('form-button-cancel')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    cy.dataCy('form-button-save')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide('form-button-cancel', 'form-button-save');
  });

  it('loads age groups on mount if empty', () => {
    cy.fixture('apiGetAgeGroupsResponse').then((ageGroupsResponse) => {
      cy.wait('@ageGroupsGetApi');
      cy.dataCy('form-age-group-select').click();
      cy.get('.q-menu').should('be.visible');
      cy.get('.q-menu .q-item').should('have.length', ageGroupsResponse.length);
    });
  });

  it('validates form on submit', () => {
    cy.wait('@ageGroupsGetApi');
    cy.dataCy('form-button-save').should('be.visible').click();
    cy.get('.q-field__messages').should(
      'contain',
      i18n.global.t('form.messageFieldRequired'),
    );
  });

  it('allows user to select age group', () => {
    cy.fixture('apiGetAgeGroupsResponse').then((response) => {
      cy.wait('@ageGroupsGetApi');
      cy.dataCy('form-age-group-select').click();
      cy.get('.q-menu').should('be.visible');
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-update-age-group')
        .find('input')
        .invoke('val')
        .should('contain', response[0][1]);
    });
  });

  it('emits correct ID value on submit', () => {
    cy.fixture('apiGetAgeGroupsResponse').then((response) => {
      cy.wait('@ageGroupsGetApi');
      cy.dataCy('form-age-group-select').click();
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-button-save').click();
      cy.get('@updateValueSpy').should(
        'have.been.calledOnceWith',
        response[0][0],
      );
      cy.get('@closeSpy').should('have.been.calledOnce');
    });
  });

  it('allows filtering age groups', () => {
    cy.fixture('apiGetAgeGroupsResponse').then((response) => {
      cy.wait('@ageGroupsGetApi');
      cy.dataCy('form-update-age-group').find('input').type(response[0][1]);
      cy.get('.q-menu').should('be.visible');
      cy.get('.q-menu .q-item').should('have.length', 1);
      cy.get('.q-menu .q-item').first().should('contain', response[0][1]);
    });
  });

  it('calls onClose when cancel is clicked', () => {
    cy.dataCy('form-button-cancel').click();
    cy.get('@closeSpy').should('have.been.calledOnce');
  });
}

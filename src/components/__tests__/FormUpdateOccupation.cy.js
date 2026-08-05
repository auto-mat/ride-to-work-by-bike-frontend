import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import FormUpdateOccupation from 'components/form/FormUpdateOccupation.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const testOccupation = 'IT';

describe('<FormUpdateOccupation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelOccupation', 'messageFieldRequired'],
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
      cy.fixture('apiGetOccupationsResponse').then((response) => {
        cy.interceptOccupationsGetApi(rideToWorkByBikeConfig, i18n, response);
      });
      const closeSpy = cy.spy().as('closeSpy');
      const updateValueSpy = cy.spy().as('updateValueSpy');
      cy.mount(FormUpdateOccupation, {
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
      cy.fixture('apiGetOccupationsResponse').then((response) => {
        cy.interceptOccupationsGetApi(rideToWorkByBikeConfig, i18n, response);
      });
      const closeSpy = cy.spy().as('closeSpy');
      const updateValueSpy = cy.spy().as('updateValueSpy');
      cy.mount(FormUpdateOccupation, {
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
      cy.fixture('apiGetOccupationsResponse').then((response) => {
        cy.interceptOccupationsGetApi(rideToWorkByBikeConfig, i18n, response);
      });
      const closeSpy = cy.spy().as('closeSpy');
      const updateValueSpy = cy.spy().as('updateValueSpy');
      cy.mount(FormUpdateOccupation, {
        props: {
          value: 138,
          onClose: closeSpy,
          'onUpdate:value': updateValueSpy,
        },
      });
      cy.viewport('macbook-16');
    });

    it('displays selected value', () => {
      cy.wait('@occupationsGetApi');
      cy.dataCy('form-update-occupation')
        .find('input')
        .invoke('val')
        .should('contain', testOccupation);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-update-occupation').should('be.visible');
    cy.dataCy('form-label')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelOccupation'));
    cy.dataCy('form-occupation-select').should('be.visible');
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

  it('loads occupations on mount if empty', () => {
    cy.fixture('apiGetOccupationsResponse').then((occupationsResponse) => {
      cy.wait('@occupationsGetApi');
      cy.dataCy('form-occupation-select').click();
      cy.get('.q-menu').should('be.visible');
      cy.get('.q-menu .q-item').should(
        'have.length',
        occupationsResponse.length,
      );
    });
  });

  it('validates form on submit', () => {
    cy.wait('@occupationsGetApi');
    cy.dataCy('form-button-save').should('be.visible').click();
    cy.get('.q-field__messages').should(
      'contain',
      i18n.global.t('form.messageFieldRequired'),
    );
  });

  it('allows user to select occupation', () => {
    cy.wait('@occupationsGetApi');
    cy.dataCy('form-occupation-select').click();
    cy.get('.q-menu').should('be.visible');
    cy.get('.q-menu .q-item').first().click();
    cy.dataCy('form-update-occupation')
      .find('input')
      .invoke('val')
      .should('contain', 'Administrativní pracovník');
  });

  it('emits correct ID value on submit', () => {
    cy.wait('@occupationsGetApi');
    cy.dataCy('form-occupation-select').click();
    cy.get('.q-menu .q-item').first().click();
    cy.dataCy('form-button-save').click();
    cy.get('@updateValueSpy').should('have.been.calledOnce');
    cy.get('@updateValueSpy').should('have.been.calledWith', 129);
    cy.get('@closeSpy').should('have.been.calledOnce');
  });

  it('allows filtering occupations', () => {
    cy.wait('@occupationsGetApi');
    cy.dataCy('form-update-occupation').find('input').type(testOccupation);
    cy.get('.q-menu').should('be.visible');
    // due to fuzzy select we get 4 matches
    cy.get('.q-menu .q-item').should('have.length', 4);
    // due to fuzzy select the "IT" occupation is second
    cy.get('.q-menu .q-item').eq(1).should('contain', testOccupation);
  });

  it('calls onClose when cancel is clicked', () => {
    cy.dataCy('form-button-cancel').click();
    cy.get('@closeSpy').should('have.been.calledOnce');
  });
}

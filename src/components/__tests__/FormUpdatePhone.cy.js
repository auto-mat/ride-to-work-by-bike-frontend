import { ref } from 'vue';
import FormUpdatePhone from '@/components/form/FormUpdatePhone.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

// selectors
const selectorFormUpdatePhone = 'form-update-phone';
const selectorFormButtonSave = 'form-button-save';
const selectorFormButtonCancel = 'form-button-cancel';
const selectorFormPhone = 'form-phone';

// variables
const invalidPhone = '123';
const validPhone = '+420777888999';

const model = ref('');
const setModelValue = (value) => {
  model.value = value;
};

describe('<FormUpdatePhone>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(''));
      cy.mount(FormUpdatePhone, {
        props: {
          ...vModelAdapter(model),
          onClose: () => {},
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(''));
      cy.mount(FormUpdatePhone, {
        props: {
          ...vModelAdapter(model),
          onClose: () => {},
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormUpdatePhone).should('be.visible');
    // button cancel
    cy.dataCy(selectorFormButtonCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    // button save
    cy.dataCy(selectorFormButtonSave)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide(selectorFormButtonCancel, selectorFormButtonSave);
  });

  it('updates form validation messages on submit and input blur', () => {
    // save
    cy.dataCy(selectorFormButtonSave).should('be.visible').click();
    // validate phone required
    cy.dataCy(selectorFormPhone)
      .should('be.visible')
      .find('.q-field__messages')
      .should('not.be.visible')
      .and(
        'not.contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelPhone'),
        }),
      );

    // enter invalid phone
    cy.dataCy(selectorFormPhone).find('input').clear();
    cy.dataCy(selectorFormPhone).find('input').type(invalidPhone);
    cy.dataCy(selectorFormPhone).find('input').blur();
    // invalid phone message is visible
    cy.dataCy(selectorFormPhone)
      .should('be.visible')
      .find('.q-field__messages')
      .should('be.visible')
      .and('contain', i18n.global.t('form.messagePhoneInvalid'));
    // enter valid phone
    cy.dataCy(selectorFormPhone).find('input').clear();
    cy.dataCy(selectorFormPhone).find('input').type(validPhone);
    cy.dataCy(selectorFormPhone).find('input').blur();
    // error message is not visible
    cy.dataCy(selectorFormPhone)
      .find('.q-field__messages')
      .should('not.contain', i18n.global.t('form.messagePhoneInvalid'));
  });
}

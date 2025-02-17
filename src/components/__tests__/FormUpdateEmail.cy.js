import FormUpdateEmail from 'components/form/FormUpdateEmail.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormUpdateEmail = 'form-update-email';
const selectorFormButtonSave = 'form-button-save';
const selectorFormButtonCancel = 'form-button-cancel';
const selectorFormMessage = 'form-message';
const selectorFormEmail = 'form-email';
const selectorFormPassword = 'form-password';

// variables
const invalidEmail = 'abc@me';
const validEmail = 'abc@me.com';
const password = '123456a';

describe('<FormUpdateEmail>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['textPasswordConfirm'], 'profile', i18n);
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['emailUpdateWrongPassword'],
      'notify',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormUpdateEmail, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormUpdateEmail, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormUpdateEmail).should('be.visible');
    // message
    cy.dataCy(selectorFormMessage)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('contain', i18n.global.t('profile.textPasswordConfirm'));
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

  it('validates form on submit', () => {
    // save
    cy.dataCy(selectorFormButtonSave).should('be.visible').click();
    // validate email required
    cy.dataCy(selectorFormEmail)
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelEmail'),
        }),
      );
    // type invalid email
    cy.dataCy(selectorFormEmail).find('input').clear();
    cy.dataCy(selectorFormEmail).find('input').type(invalidEmail);
    cy.dataCy(selectorFormEmail).find('input').blur();
    // validate email format
    cy.dataCy(selectorFormEmail)
      .find('.q-field__messages')
      .should('be.visible')
      .and('contain', i18n.global.t('form.messageEmailInvalid'));
    // type valid email
    cy.dataCy(selectorFormEmail).find('input').clear();
    cy.dataCy(selectorFormEmail).find('input').type(validEmail);
    cy.dataCy(selectorFormEmail).find('input').blur();
    // save
    cy.dataCy(selectorFormButtonSave).should('be.visible').click();
    // validate password required
    cy.dataCy(selectorFormPassword)
      .find('.q-field__messages')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelPassword'),
        }),
      );
    // type valid password
    cy.dataCy(selectorFormPassword).find('input').clear();
    cy.dataCy(selectorFormPassword).find('input').type(password);
    cy.dataCy(selectorFormPassword).find('input').blur();
    // save
    cy.dataCy(selectorFormButtonSave).should('be.visible').click();
  });
}

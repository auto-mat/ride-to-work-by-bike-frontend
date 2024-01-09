import { colors } from 'quasar';

import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldPasswordConfirm>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelPassword',
        'hintPassword',
        'messagePasswordStrong',
        'messagePasswordNotIdentical',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldPasswordConfirm',
          compareValue: '123456a',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders password field', () => {
      // input label
      cy.dataCy('form-password-confirm')
        .should('be.visible')
        .find('label[for="form-password-confirm"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.labelPassword'));
      // input wrapper
      cy.dataCy('form-password-confirm')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-password-confirm-input').should('be.visible');
      // icon
      cy.dataCy('form-password-confirm-icon')
        .should('contain', 'visibility')
        .and('have.color', colorPrimary);
      cy.dataCy('form-password-confirm-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-password-confirm-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('allows user to reveal and hide password', () => {
      testPasswordInputReveal({
        identifierPassword: 'form-password-confirm',
      });
    });

    it('validates password correctly', () => {
      // test password empty
      cy.dataCy('form-password-confirm-input').focus();
      cy.dataCy('form-password-confirm-input').blur();
      cy.dataCy('form-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelPassword'),
          }),
        );
      // test password length
      cy.dataCy('form-password-confirm-input').type('12a');
      cy.dataCy('form-password-confirm-input').blur();
      cy.dataCy('form-password-confirm')
        .find('.q-field__messages')
        .should('contain', i18n.global.t('form.messagePasswordStrong'));
      cy.dataCy('form-password-confirm-input').clear();
      // test password strength
      cy.dataCy('form-password-confirm-input').type('12345');
      cy.dataCy('form-password-confirm-input').blur();
      cy.dataCy('form-password-confirm')
        .find('.q-field__messages')
        .should('contain', i18n.global.t('form.messagePasswordStrong'));
      cy.dataCy('form-password-confirm-input').clear();
      // test non-matching password
      cy.dataCy('form-password-confirm-input').type('12345a');
      cy.dataCy('form-password-confirm-input').blur();
      cy.dataCy('form-password-confirm')
        .find('.q-field__messages')
        .should('contain', i18n.global.t('form.messagePasswordNotIdentical'));
      cy.dataCy('form-password-confirm-input').clear();
      // valid password (shows hint)
      cy.dataCy('form-password-confirm-input').type('123456a');
      cy.dataCy('form-password-confirm-input').blur();
      cy.get('*[data-cy="form-password-confirm"] .q-field__messages').should(
        'not.exist',
      );
    });
  });
});

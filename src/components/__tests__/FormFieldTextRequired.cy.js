import { colors } from 'quasar';

import FormFieldTextRequiredTest from 'components/global/FormFieldTextRequiredTest.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldTextRequired>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelTextRequired'], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTextRequiredTest, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders first name field', () => {
      // input label
      cy.dataCy('form-text-required')
        .should('be.visible')
        .find('label[for="form-text-required"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.labelTextRequired'));
      // input wrapper
      cy.dataCy('form-text-required')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-text-required-input').should('be.visible');
    });

    it('validates required rule', () => {
      cy.dataCy('form-text-required-input').focus();
      cy.dataCy('form-text-required-input').blur();
      cy.dataCy('form-text-required')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelTextRequired'),
          }),
        );
    });
  });
});

import { colors } from 'quasar';

import FormFieldLastNameTest from 'components/global/FormFieldLastNameTest.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldLastName>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldLastNameTest, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders last name field', () => {
      // input label
      cy.dataCy('form-last-name')
        .should('be.visible')
        .find('label[for="form-last-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.labelLastName'));
      // input wrapper
      cy.dataCy('form-last-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-last-name-input').should('be.visible');
    });

    it('validates required rule', () => {
      cy.dataCy('form-last-name-input').focus();
      cy.dataCy('form-last-name-input').blur();
      cy.dataCy('form-last-name')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelLastName'),
          }),
        );
    });
  });
});

import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

const dateLabel = 'Date';

describe('<FormFieldDateRequired>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldDateRequired',
          name: 'date',
          label: dateLabel,
          required: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldDateRequired',
          name: 'date',
          label: 'Date',
          required: true,
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
    cy.dataCy('form-field-date').should('be.visible');
    // label
    cy.dataCy('form-date-label').should('be.visible').and('contain', dateLabel);
    // icon
    cy.dataCy('form-date-icon').should('be.visible').and('contain', 'event');
  });

  it('renders a required message', () => {
    cy.dataCy('form-field-date').find('input').focus();
    cy.dataCy('form-field-date').find('input').blur();
    cy.dataCy('form-field-date')
      .find('.q-field__messages')
      .should(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: dateLabel,
        }),
      );
  });
}

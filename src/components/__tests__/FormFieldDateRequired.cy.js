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

  it('allows any date input when no range is set', () => {
    cy.dataCy('form-field-date').find('input').clear();
    cy.dataCy('form-field-date').find('input').type('15. 08. 2024');
    cy.dataCy('form-field-date').find('input').blur();
    cy.dataCy('form-field-date').find('.q-field__messages').should('not.exist');
  });
}

describe('<FormFieldDateRequired> with limited date range', () => {
  const minDate = '2024-05-01';
  const maxDate = '2024-05-31';
  // formatted dates for display in error message
  const minDateFormatted = i18n.global.d(new Date(minDate), 'numeric');
  const maxDateFormatted = i18n.global.d(new Date(maxDate), 'numeric');

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldDateRequired',
          name: 'date',
          label: dateLabel,
          required: true,
          minDate,
          maxDate,
        },
      });
      cy.viewport('macbook-16');
    });

    dateRangeTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldDateRequired',
          name: 'date',
          label: dateLabel,
          required: true,
          minDate,
          maxDate,
        },
      });
      cy.viewport('iphone-6');
    });

    dateRangeTests();
  });

  function dateRangeTests() {
    it('shows validation error for date outside range', () => {
      // date before minDate
      cy.dataCy('form-field-date').find('input').clear();
      cy.dataCy('form-field-date').find('input').type('30. 04. 2024');
      cy.dataCy('form-field-date').find('input').blur();
      cy.dataCy('form-field-date')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldDateOutOfRange', {
            minDate: minDateFormatted,
            maxDate: maxDateFormatted,
          }),
        );
      // date after maxDate
      cy.dataCy('form-field-date').find('input').clear();
      cy.dataCy('form-field-date').find('input').type('01. 06. 2024');
      cy.dataCy('form-field-date').find('input').blur();
      cy.dataCy('form-field-date')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('form.messageFieldDateOutOfRange', {
            minDate: minDateFormatted,
            maxDate: maxDateFormatted,
          }),
        );
    });

    it('accepts date within range', () => {
      // date within range
      cy.dataCy('form-field-date').find('input').clear();
      cy.dataCy('form-field-date').find('input').type('15. 05. 2024');
      cy.dataCy('form-field-date').find('input').blur();
      cy.dataCy('form-field-date')
        .find('.q-field__messages')
        .should('not.exist');
    });

    it('accepts min and max boundary dates', () => {
      // minDate boundary
      cy.dataCy('form-field-date').find('input').clear();
      cy.dataCy('form-field-date').find('input').type('01. 05. 2024');
      cy.dataCy('form-field-date').find('input').blur();
      cy.dataCy('form-field-date')
        .find('.q-field__messages')
        .should('not.exist');
      // maxDate boundary
      cy.dataCy('form-field-date').find('input').clear();
      cy.dataCy('form-field-date').find('input').type('31. 05. 2024');
      cy.dataCy('form-field-date').find('input').blur();
      cy.dataCy('form-field-date')
        .find('.q-field__messages')
        .should('not.exist');
    });
  }
});

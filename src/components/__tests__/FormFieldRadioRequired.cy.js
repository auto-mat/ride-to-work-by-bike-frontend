import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormFieldTestWrapper>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['form.messageOptionRequired'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldRadioRequired',
          options: [
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ],
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders radio field', () => {
      cy.dataCy('form-field-radio').should('be.visible');
      cy.dataCy('form-field-radio')
        .find('.q-radio__label')
        .first()
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('contain', 'Option 1');
    });

    it('allows user to select option', () => {
      cy.dataCy('form-field-radio').find('.q-radio__label').first().click();
      // test selected option
      cy.dataCy('form-field-radio')
        .find('.q-radio__inner')
        .first()
        .should('have.color', colorPrimary);
    });
  });
});

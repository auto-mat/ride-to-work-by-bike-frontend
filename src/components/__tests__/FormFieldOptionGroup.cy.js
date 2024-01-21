import { colors } from 'quasar';
import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { hexToRgb } from 'app/test/cypress/utils';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');

const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormFieldOptionGroup>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldOptionGroup',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-field-option-group').should('be.visible');
    });

    it('renders 3 options', () => {
      cy.dataCy('form-field-option').should('have.length', 3);
    });

    it('renders options with coorect styles', () => {
      cy.dataCy('form-field-option')
        .first()
        .should('have.backgroundColor', white)
        .should('have.css', 'border-radius', borderRadius);
      cy.dataCy('form-field-option-icon').invoke('height').should('equal', 48);
      cy.dataCy('form-field-option-icon').invoke('width').should('equal', 48);
    });

    it('shows highlighted option', () => {
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('form-field-option')
        .first()
        .should('have.css', 'border-color', hexToRgb(colorPrimary));
      cy.dataCy('form-field-option-check')
        .first()
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb(colorPrimary));
      cy.dataCy('form-field-option').last().click();
      cy.dataCy('form-field-option')
        .last()
        .should('have.css', 'border-color', hexToRgb(colorPrimary));
      cy.dataCy('form-field-option-check')
        .last()
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb(colorPrimary));
    });
  });
});

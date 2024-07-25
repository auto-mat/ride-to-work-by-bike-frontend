import { colors } from 'quasar';
import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor, textToRgb } = colors;
const white = getPaletteColor('white');
// get primary color
const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
const rgbPrimary = textToRgb(rideToWorkByBikeConfig.colorPrimary);
const colorPrimary = `rgb(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b})`;

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

    it('renders options with corect styles', () => {
      cy.dataCy('form-field-option')
        .first()
        .should('have.backgroundColor', white)
        .should('have.css', 'border-radius', borderRadius);
      // test icons
      cy.dataCy('form-field-option-icon').each((element, index) => {
        cy.testIcon({
          element: element,
          name: `form-field-option-${index}`,
          size: 48,
        });
      });
    });

    it('shows highlighted option', () => {
      // highlight first opiton
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('form-field-option')
        .first()
        .should('have.css', 'border-color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .first()
        .then((element) => {
          cy.testIcon({
            element: element,
            name: 'form-field-option-check',
            size: 24,
          });
        });
      // highlight last option
      cy.dataCy('form-field-option').last().click();
      cy.dataCy('form-field-option')
        .last()
        .should('have.css', 'border-color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .last()
        .then((element) => {
          cy.testIcon({ element, name: 'form-field-option-check', size: 24 });
        });
    });
  });
});

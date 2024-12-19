import { colors } from 'quasar';
import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor, textToRgb, changeAlpha } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
const rgbPrimary = textToRgb(rideToWorkByBikeConfig.colorPrimary);
const colorPrimary = `rgb(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b})`;
const primaryOpacity = changeAlpha(
  primary,
  rideToWorkByBikeConfig.colorPrimaryOpacity,
);

// variables
const avatarSize = 48;
const iconSize = 24;

describe('<FormFieldOptionGroup>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelColleagues',
        'textColleagues',
        'labelSchoolmates',
        'textSchoolmates',
        'labelFamily',
      ],
      'form.participation',
      i18n,
    );
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
      // test avatar
      cy.dataCy('form-field-option-avatar')
        .should('be.visible')
        .should('have.backgroundColor', primaryOpacity);
      cy.dataCy('form-field-option-avatar')
        .invoke('height')
        .should('equal', avatarSize);
      cy.dataCy('form-field-option-avatar')
        .invoke('width')
        .should('equal', avatarSize);
      // test icon
      cy.dataCy('form-field-option-icon')
        .should('be.visible')
        .should('have.color', primary);
      cy.dataCy('form-field-option-icon')
        .invoke('height')
        .should('equal', iconSize);
      cy.dataCy('form-field-option-icon')
        .invoke('width')
        .should('equal', iconSize);
    });

    it('shows highlighted option', () => {
      // highlight first opiton
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('form-field-option')
        .first()
        .should('have.css', 'border-color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .first()
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .first()
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('form-field-option-check')
        .first()
        .invoke('width')
        .should('be.equal', 24);
      // highlight last option
      cy.dataCy('form-field-option').last().click();
      cy.dataCy('form-field-option')
        .last()
        .should('have.css', 'border-color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .last()
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', colorPrimary);
      cy.dataCy('form-field-option-check')
        .last()
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('form-field-option-check')
        .last()
        .invoke('width')
        .should('be.equal', 24);
    });
  });
});

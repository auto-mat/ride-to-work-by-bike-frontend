import { colors } from 'quasar';
import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';

// selectors
const classSelectorMessages = '.q-field__messages';
const classSelectorCheckboxBg = '.q-checkbox__bg';
const selectorCheckboxRequired = 'form-field-checkbox-required';
const selectorCheckboxRequiredLabel = 'form-field-checkbox-required-label';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// variables
const checkboxSize = 16;

describe('<FormFieldCheckboxRequired>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([
      'labelResponsibility',
      'messageResponsibilityRequired',
    ], 'register.coordinator.form', i18n);
  });

  context('default', () => {
    beforeEach(() => {
      cy.wrap(
        i18n.global.t('register.coordinator.form.labelResponsibility'),
      ).then((label) => {
        cy.wrap(
          i18n.global.t(
            'register.coordinator.form.messageResponsibilityRequired',
          ),
        ).then((validationMessage) => {
          cy.mount(FormFieldTestWrapper, {
            props: {
              type: 'boolean',
              component: 'FormFieldCheckboxRequired',
              validationMessage,
            },
            slots: {
              default: label,
            },
          });
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorCheckboxRequired).should('be.visible');
    cy.dataCy(selectorCheckboxRequiredLabel)
      .should('be.visible')
      .and('have.color', grey10)
      .and(
        'contain',
        i18n.global.t('register.coordinator.form.labelResponsibility'),
      );
    // checkbox border
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorCheckboxBg)
      .should('have.css', 'border-radius', '4px');
    // checkbox height
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorCheckboxBg)
      .invoke('height')
      .should('be.equal', checkboxSize);
    // checkbox width
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorCheckboxBg)
      .invoke('width')
      .should('be.equal', checkboxSize);
  });

  it('validates checkbox', () => {
    cy.dataCy(selectorCheckboxRequired).click();
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorMessages)
      .should('not.exist')
    cy.dataCy(selectorCheckboxRequired).click();
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorMessages)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t(
          'register.coordinator.form.messageResponsibilityRequired',
        ),
      );
    cy.dataCy(selectorCheckboxRequired).click();
    cy.dataCy(selectorCheckboxRequired)
      .find(classSelectorMessages)
      .should('not.exist');
  });
}

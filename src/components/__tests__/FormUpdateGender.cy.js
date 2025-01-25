import { colors } from 'quasar';
import FormUpdateGender from 'components/form/FormUpdateGender.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const classSelectorMessages = '.q-field__messages';
const selectorFormUpdateGender = 'form-update-gender';
const selectorFormLabel = 'form-label';
const selectorFormGender = 'form-gender';
const selectorFormButtonCancel = 'form-button-cancel';
const selectorFormButtonSave = 'form-button-save';

describe('<FormUpdateGender>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelGender'], 'form', i18n);
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormUpdateGender, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormUpdateGender, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormUpdateGender).should('be.visible');
    // label
    cy.dataCy(selectorFormLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelGender'));
    // radio buttons
    cy.dataCy(selectorFormGender).should('be.visible');
    // cancel
    cy.dataCy(selectorFormButtonCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    // save
    cy.dataCy(selectorFormButtonSave)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide(selectorFormButtonCancel, selectorFormButtonSave);
  });

  it('validates form on submit', () => {
    // save
    cy.dataCy(selectorFormButtonSave).should('be.visible').click();
    // validate gender required
    cy.dataCy(selectorFormGender)
      .find(classSelectorMessages)
      .should('contain', i18n.global.t('form.messageOptionRequired'));
    // click first radio
    cy.dataCy(selectorFormGender).find('.q-radio__label').first().click();
    cy.get(classSelectorMessages).should('not.exist');
  });
}

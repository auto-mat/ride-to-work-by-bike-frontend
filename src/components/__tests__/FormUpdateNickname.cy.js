import { colors } from 'quasar';
import FormUpdateNickname from 'components/form/FormUpdateNickname.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorFormUpdateNickname = 'form-update-nickname';
const selectorInput = 'form-input';
const selectorLabel = 'form-label';
const selectorButtonCancel = 'form-button-cancel';
const selectorButtonSave = 'form-button-save';

// variables
const initialValue = 'initialValue';

describe('<FormUpdateNickname>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['hintNickname', 'labelNicknameOptional'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormUpdateNickname, {
        props: {
          value: initialValue,
          onClose: () => {},
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormUpdateNickname, {
        props: {
          value: initialValue,
          onClose: () => {},
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
    cy.dataCy(selectorFormUpdateNickname)
      .should('be.visible')
      .and('contain', i18n.global.t('form.hintNickname'));
    // label
    cy.dataCy(selectorLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelNicknameOptional'));
    // input
    cy.dataCy(selectorInput)
      .should('be.visible')
      .should('have.value', initialValue);
    // cancel
    cy.dataCy(selectorButtonCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    // save
    cy.dataCy(selectorButtonSave)
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide(selectorButtonCancel, selectorButtonSave);
  });
}

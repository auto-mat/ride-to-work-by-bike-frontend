import { ref } from 'vue';
import { colors } from 'quasar';
import FormUpdateTeam from 'components/form/FormUpdateTeam.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormUpdateTeam>', () => {
  const model = ref(null);
  const setModelValue = (value) => {
    model.value = value;
  };

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelTeam', 'messageFieldRequired'],
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
      cy.wrap(setModelValue(null));
      cy.mount(FormUpdateTeam, {
        props: {
          ...vModelAdapter(model),
          onClose: () => {},
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.wrap(setModelValue(null));
      cy.mount(FormUpdateTeam, {
        props: {
          ...vModelAdapter(model),
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
    cy.dataCy('form-update-team').should('be.visible');
    // label
    cy.dataCy('form-label')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelTeam'));
    // select
    cy.dataCy('form-select').should('be.visible');
    // cancel
    cy.dataCy('form-button-cancel')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    // save
    cy.dataCy('form-button-save')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide('form-button-cancel', 'form-button-save');
  });
}

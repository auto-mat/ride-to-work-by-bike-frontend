import { colors } from 'quasar';
import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';
import FormFieldSliderNumber from 'components/form/FormFieldSliderNumber.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorFormFieldSliderNumber = 'form-field-slider-number';
const selectorFormFieldSliderNumberInput = 'form-field-slider-number-input';
const selectorFormFieldSliderNumberUnit = 'form-field-slider-number-unit';
const selectorFormFieldSliderNumberSlider = 'form-field-slider-number-slider';

// variables
const defaultValue = 500;
const valueThousand = 1000;

describe('<FormFieldSliderNumber>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['currencyUnitCzk'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldSliderNumber, {
        props: {
          modelValue: defaultValue,
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('macbook-13');
    });

    interactionTests();
    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldSliderNumber, {
        props: {
          modelValue: defaultValue,
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('iphone-6');
    });

    interactionTests();
    coreTests();
  });

  context('dynamic', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldSliderNumber',
          defaultValue: defaultValue,
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormFieldSliderNumber).should('be.visible');
    // input
    cy.dataCy(selectorFormFieldSliderNumberInput)
      .should('be.visible')
      .and('have.value', '500');
    cy.dataCy(selectorFormFieldSliderNumberUnit)
      .should('be.visible')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('global.currencyUnitCzk'));
    // slider
    cy.dataCy(selectorFormFieldSliderNumberSlider).should('be.visible');
  });

  it('renders slider and input side by side', () => {
    cy.testElementsSideBySide(
      selectorFormFieldSliderNumberSlider,
      selectorFormFieldSliderNumberInput,
    );
  });
}

function interactionTests() {
  it('reacts to user interaction', () => {
    cy.dataCy(selectorFormFieldSliderNumberInput).clear();
    cy.dataCy(selectorFormFieldSliderNumberInput).type(valueThousand);
    cy.dataCy(selectorFormFieldSliderNumberInput).blur();
    cy.dataCy(selectorFormFieldSliderNumberInput).should(
      'have.value',
      valueThousand,
    );
    cy.get('@wrapper').then((wrapper) => {
      const eventValues = wrapper.emitted();
      const lastEventValue = eventValues['update:modelValue'].pop()[0];
      expect(lastEventValue).to.equal(valueThousand);
    });
  });
}

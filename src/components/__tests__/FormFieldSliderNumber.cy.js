import { ref } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { colors } from 'quasar';
import FormFieldSliderNumber from 'components/form/FormFieldSliderNumber.vue';
import { i18n } from '../../boot/i18n';
import { useChallengeStore } from '../../stores/challenge';
import { vModelAdapter } from '../../../test/cypress/utils';
import { getCurrentPriceLevelsUtil } from '../../utils/price_levels';
import { PriceLevelCategory } from '../enums/Challenge';

import { systemTimeChallengeActive } from '../../../test/cypress/support/commonTests';

// colors
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
const valueThreeHundredNinety = 390;
let valueMin = 0;

const model = ref(defaultValue);
function setModelValue(value) {
  model.value = value;
}

describe('<FormFieldSliderNumber>', () => {
  before(() => {
    cy.clock(new Date(systemTimeChallengeActive), ['Date']).then(() => {
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        const priceLevels = response.results[0].price_level;
        const currentPriceLevels = getCurrentPriceLevelsUtil(priceLevels);

        valueMin = currentPriceLevels[PriceLevelCategory.basic].price;
      });
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['currencyUnitCzk'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.wrap(setModelValue(defaultValue));
      cy.mount(FormFieldSliderNumber, {
        props: {
          ...vModelAdapter(model),
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('macbook-13');
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((storeChallenge) => {
          storeChallenge.setPriceLevel(response.results[0].price_level);
        });
      });
    });

    coreTests();
    interactionTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.wrap(setModelValue(defaultValue));
      cy.mount(FormFieldSliderNumber, {
        props: {
          ...vModelAdapter(model),
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('iphone-6');
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((storeChallenge) => {
          storeChallenge.setPriceLevel(response.results[0].price_level);
        });
      });
    });

    coreTests();
    interactionTests();
  });

  context('dynamic', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.wrap(setModelValue(defaultValue));
      cy.mount(FormFieldSliderNumber, {
        props: {
          ...vModelAdapter(model),
        },
      }).then(({ wrapper, component }) => {
        cy.wrap(wrapper).as('wrapper');
        cy.wrap(component).as('component');
      });
      cy.viewport('iphone-6');
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((storeChallenge) => {
          storeChallenge.setPriceLevel(response.results[0].price_level);
        });
      });
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

  it('does not allow values below minimum', () => {
    cy.dataCy(selectorFormFieldSliderNumberInput).clear();
    cy.dataCy(selectorFormFieldSliderNumberInput).type(valueThreeHundredNinety);
    cy.dataCy(selectorFormFieldSliderNumberInput).blur();
    cy.dataCy(selectorFormFieldSliderNumberInput).should(
      'have.value',
      valueMin,
    );
  });
}

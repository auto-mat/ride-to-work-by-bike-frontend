import { colors } from 'quasar';
import RouteInputDistance from 'components/routes/RouteInputDistance.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { RouteInputType } from '../types/Route';
import { routeFormFieldOptions } from '../routes/utils';

// composables
const { getPaletteColor } = colors;

// colors
const grey10 = getPaletteColor('grey-10');

// selectors
const classSelectorMessages = '.q-field__messages';
const selectorButtonTraceMap = 'button-trace-map';
const selectorIconTraceMap = 'icon-trace-map';
const selectorInputDistance = 'input-distance';
const selectorLabelDistance = 'label-distance';
const selectorRouteInputDistance = 'route-input-distance';
const selectorSelectAction = 'select-action';
const selectorSectionInputAction = 'section-input-action';
const selectorSectionInputNumber = 'section-input-number';
const selectorSectionInputMap = 'section-input-map';
const selectorUnitsDistance = 'units-distance';

// variables
const iconTraceMapSize = 24;
const valueMinusOne = '-1.00';
const valueOne = '1.00';
const valueHalf = '0.50';
const valueEmpty = '';
const { defaultDistanceZero } = rideToWorkByBikeConfig;
const optionsAction = [
  ...routeFormFieldOptions,
  {
    label: i18n.global.t('routes.actionCopyYesterday'),
    value: RouteInputType.copyYesterday,
  },
  {
    label: i18n.global.t('routes.actionTraceMap'),
    value: RouteInputType.inputMap,
  },
];

describe('<RouteInputDistance>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'actionInputDistance',
        'actionCopyYesterday',
        'actionTraceMap',
        'buttonTraceMap',
        'labelDistance',
      ],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(['messageFieldAboveZero'], 'form', i18n);
    // not testing global.routeLengthUnit (identical across languages)
  });

  context('desktop - input number', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: defaultDistanceZero,
          optionsAction,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    maskTests();
    inputTests();
    validateZeroTests();

    it('renders inputs side by side (align-bottom)', () => {
      // input type is input distance
      cy.dataCy(selectorSelectAction)
        .should('be.visible')
        .find('input')
        .should('have.value', i18n.global.t('routes.actionInputDistance'));
      // input type and input distance are on the same line
      cy.testElementsSideBySide(
        selectorSectionInputAction,
        selectorSectionInputNumber,
      );
    });
  });

  context.skip('desktop - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputMap,
          modelValue: defaultDistanceZero,
          optionsAction,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    buttonMapTests();

    it('renders inputs side by side (align-bottom)', () => {
      // input type is input distance
      cy.dataCy(selectorSelectAction)
        .should('be.visible')
        .find('input')
        .should('have.value', i18n.global.t('routes.actionTraceMap'));
      // input type and input distance are on the same line
      cy.testElementsSideBySide(
        selectorSectionInputAction,
        selectorSectionInputMap,
      );
    });
  });

  context('mobile - input number', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: defaultDistanceZero,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    maskTests();
    inputTests();
    validateZeroTests();
  });

  context('mobile - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputMap,
          modelValue: defaultDistanceZero,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    buttonMapTests();
  });

  context('mobile - input number empty', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: valueEmpty,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    validateEmptyTests();
  });

  context('mobile - input number negative', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: valueMinusOne,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    isValidatedNegativeTests();
  });

  context('mobile - input number decimal', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: valueHalf,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    valuePassingTests();
  });

  context('mobile - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputMap,
          modelValue: defaultDistanceZero,
          optionsAction,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    buttonMapTests();
  });

  context('desktop - input number - not validated', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: defaultDistanceZero,
          optionsAction,
          hasValidation: false,
        },
      });
      cy.viewport('macbook-16');
    });

    isNotValidatedTests();
  });

  context('desktop - single action option', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: RouteInputType.inputNumber,
          modelValue: defaultDistanceZero,
          optionsAction: routeFormFieldOptions,
        },
      });
      cy.viewport('macbook-16');
    });

    it('only renders one action option passed in props', () => {
      cy.dataCy(selectorSelectAction).should('be.visible').click();
      cy.get('.q-menu').within(() => {
        cy.get('.q-item').should('have.length', 1);
        cy.get('.q-item').should(
          'contain',
          i18n.global.t('routes.actionInputDistance'),
        );
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorRouteInputDistance).should('be.visible');
    cy.dataCy(selectorLabelDistance)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // select action
    cy.dataCy(selectorSelectAction).should('be.visible');
  });
}

function maskTests() {
  it('allows user to enter value using a mask', () => {
    cy.dataCy(selectorInputDistance).type('1');
    cy.dataCy(selectorInputDistance).should(
      'have.value',
      i18n.global.n(0.01, 'routeDistanceDecimalNumber'),
    );
    cy.dataCy(selectorInputDistance).type('50');
    cy.dataCy(selectorInputDistance).should(
      'have.value',
      i18n.global.n(1.5, 'routeDistanceDecimalNumber'),
    );
    cy.dataCy(selectorInputDistance).type('{backspace}');
    cy.dataCy(selectorInputDistance).should(
      'have.value',
      i18n.global.n(0.15, 'routeDistanceDecimalNumber'),
    );
    cy.dataCy(selectorInputDistance).type('{backspace}');
    cy.dataCy(selectorInputDistance).type('{backspace}');
    cy.dataCy(selectorInputDistance).should(
      'have.value',
      i18n.global.n(
        parseFloat(defaultDistanceZero),
        'routeDistanceDecimalNumber',
      ),
    );
    cy.dataCy(selectorInputDistance).type('a');
    cy.dataCy(selectorInputDistance).should(
      'have.value',
      i18n.global.n(
        parseFloat(defaultDistanceZero),
        'routeDistanceDecimalNumber',
      ),
    );
  });
}

function inputTests() {
  it('renders distance input', () => {
    cy.dataCy(selectorButtonTraceMap).should('not.exist');
    // input
    cy.dataCy(selectorInputDistance).should('be.visible');
    // input distance unit styles
    cy.dataCy(selectorUnitsDistance)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('global.routeLengthUnit'));
  });
}

function buttonMapTests() {
  it('renders map button', () => {
    cy.dataCy(selectorInputDistance).should('not.exist');
    cy.dataCy(selectorButtonTraceMap)
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('contain', i18n.global.t('routes.buttonTraceMap'));
    cy.dataCy(selectorIconTraceMap).should('be.visible');
    cy.dataCy(selectorIconTraceMap)
      .invoke('width')
      .should('be.equal', iconTraceMapSize);
    cy.dataCy(selectorIconTraceMap)
      .invoke('height')
      .should('be.equal', iconTraceMapSize);
  });
}

function validateZeroTests() {
  it('validates input when 0', () => {
    cy.dataCy(selectorSectionInputNumber)
      .find('input')
      .should('be.visible')
      .and(
        'have.value',
        i18n.global.n(
          parseFloat(defaultDistanceZero),
          'routeDistanceDecimalNumber',
        ),
      );
    cy.dataCy(selectorSectionInputNumber).find('input').focus();
    cy.dataCy(selectorSectionInputNumber).find('input').blur();
    cy.dataCy(selectorSectionInputNumber)
      .find(classSelectorMessages)
      .should('contain', i18n.global.t('form.messageFieldAboveZero'));
  });
}

function valuePassingTests() {
  it('validates input when 0.5', () => {
    cy.dataCy(selectorSectionInputNumber)
      .find('input')
      .should('be.visible')
      .and(
        'have.value',
        i18n.global.n(parseFloat(valueHalf), 'routeDistanceDecimalNumber'),
      );
    cy.dataCy(selectorSectionInputNumber).find('input').focus();
    cy.dataCy(selectorSectionInputNumber).find('input').blur();
    cy.dataCy(selectorSectionInputNumber)
      .find(classSelectorMessages)
      .then(() => {
        // wait for animation
        return new Cypress.Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      })
      .then(() => {
        cy.dataCy(selectorSectionInputNumber)
          .find(classSelectorMessages)
          .last()
          .should('be.empty');
      });
  });
}

function validateEmptyTests() {
  it.skip('validates input when empty', () => {
    cy.dataCy(selectorSectionInputNumber)
      .find('input')
      .should('be.visible')
      .and('have.value', defaultDistanceZero);
    cy.dataCy(selectorSectionInputNumber).find('input').focus();
    cy.dataCy(selectorSectionInputNumber).find('input').blur();
    cy.dataCy(selectorSectionInputNumber)
      .find(classSelectorMessages)
      .should(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('routes.labelValidationDistance'),
        }),
      );
  });
}

function isValidatedNegativeTests() {
  it('does not allow negative number', () => {
    cy.dataCy(selectorSectionInputNumber)
      .find('input')
      .should('be.visible')
      .and(
        'have.value',
        i18n.global.n(parseFloat(valueOne), 'routeDistanceDecimalNumber'),
      );
    cy.dataCy(selectorSectionInputNumber).find('input').focus();
    cy.dataCy(selectorSectionInputNumber).find('input').blur();
    cy.dataCy(selectorSectionInputNumber)
      .find(classSelectorMessages)
      .should('contain', i18n.global.t('form.messageFieldAboveZero'));
  });
}

function isNotValidatedTests() {
  it('does not validate input', () => {
    cy.dataCy(selectorSectionInputNumber)
      .find('input')
      .should('be.visible')
      .and(
        'have.value',
        i18n.global.n(
          parseFloat(defaultDistanceZero),
          'routeDistanceDecimalNumber',
        ),
      );
    cy.dataCy(selectorSectionInputNumber).find('input').focus();
    cy.dataCy(selectorSectionInputNumber).find('input').blur();
    cy.dataCy(selectorSectionInputNumber)
      .find(classSelectorMessages)
      .then(() => {
        // wait for animation
        return new Cypress.Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      })
      .then(() => {
        cy.dataCy(selectorSectionInputNumber)
          .find(classSelectorMessages)
          .last()
          .should('be.empty');
      });
  });
}

import { colors } from 'quasar';
import RouteInputDistance from 'components/routes/RouteInputDistance.vue';
import { i18n } from '../../boot/i18n';

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

describe('<RouteInputDistance>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'actionInputDistance',
        'actionTraceMap',
        'buttonTraceMap',
        'labelDistance',
      ],
      'routes',
      i18n,
    );
    // not testing global.routeLengthUnit (identical across languages)
  });

  context('desktop - input number', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-number',
          modelValue: 0,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    inputTests();
    isValidatedTests();

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

  context('desktop - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-map',
          modelValue: 0,
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
          modelAction: 'input-number',
          modelValue: 0,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    inputTests();
    isValidatedTests();
  });

  context('mobile - input map', () => {
    beforeEach(() => {
      cy.mount(RouteInputDistance, {
        props: {
          modelAction: 'input-map',
          modelValue: 0,
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
          modelAction: 'input-number',
          modelValue: 0,
          isValidated: false,
        },
      });
      cy.viewport('macbook-16');
    });

    isNotValidatedTests();
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

function isValidatedTests() {
  it('validates input', () => {
    cy.dataCy(selectorSectionInputNumber).find('input').should('be.visible').and('have.value', 0);
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
  })
}

function isNotValidatedTests() {
  it('does not validate input', () => {
    cy.dataCy(selectorSectionInputNumber).find('input').should('be.visible').and('have.value', 0);
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
      }).then(() => {
        cy.dataCy(selectorSectionInputNumber)
          .find(classSelectorMessages)
          .last()
          .should('be.empty');
      });
  })
}

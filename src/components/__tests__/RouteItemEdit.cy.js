import { colors } from 'quasar';

import RouteItemEdit from 'components/routes/RouteItemEdit.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

describe('<RouteItemEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelDistance',
        'labelDirectionFromWork',
        'labelDirectionToWork',
        'labelTransportType',
      ],
      'routes',
      i18n,
    );
  });

  context('route no direction label', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders the input distance value', () => {
      // make sure transport type is bike
      cy.dataCy('button-toggle-transport').find('button').eq(0).click();
      cy.fixture('routeListItem').then((routes) => {
        // input distance value
        cy.dataCy('input-distance')
          .should('be.visible')
          .invoke('val')
          .should('eq', routes.toWork.distance.toString());
      });
    });

    it('renders column transport distance full width', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport-distance'),
        (12 / 12) * 100,
      );
    });

    it('renders columns transport:distance side by side in 5:7 ratio', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport'),
        (5 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-distance'),
        (7 / 12) * 100,
      );
    });
  });

  context('route to work', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
            displayLabel: true,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    labelDirectionTests();

    it('renders label direction', () => {
      // direction label
      cy.dataCy('column-direction').should('be.visible');
      cy.dataCy('label-direction').should(
        'contain',
        i18n.global.t('routes.labelDirectionToWork'),
      );
      // direction icon
      cy.dataCy('label-direction-icon').should('be.visible');
      cy.dataCy('label-direction-icon').should('contain', 'arrow_forward');
    });

    it('renders the input distance value', () => {
      // make sure transport type is bike
      cy.dataCy('button-toggle-transport').find('button').eq(0).click();
      cy.fixture('routeListItem').then((routes) => {
        // input distance value
        cy.dataCy('input-distance')
          .should('be.visible')
          .invoke('val')
          .should('eq', routes.toWork.distance.toString());
      });
    });

    it('renders correct transport type', () => {
      cy.fixture('routeListItem').then((routes) => {
        cy.dataCy('description-transport')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t(`routes.transport.${routes.toWork.transport}`),
          );
      });
    });

    it('renders columns direction:transport-distance side by side in 2:10 ratio', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-direction'),
        (2 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport-distance'),
        (10 / 12) * 100,
      );
    });

    it('renders columns transport:distance side by side in 4:8 ratio', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport'),
        (4 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-distance'),
        (8 / 12) * 100,
      );
    });
  });

  context('route from work (0 distance)', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.fromWork,
            displayLabel: true,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    labelDirectionTests();

    it('renders label direction', () => {
      // direction label
      cy.dataCy('column-direction').should('be.visible');
      cy.dataCy('label-direction').should(
        'contain',
        i18n.global.t('routes.labelDirectionFromWork'),
      );
      // direation icon
      cy.dataCy('label-direction-icon').should('be.visible');
      cy.dataCy('label-direction-icon').should('contain', 'arrow_back');
    });

    it('renders "0" when distance is empty', () => {
      // empty distance value
      cy.dataCy('input-distance')
        .should('be.visible')
        .invoke('val')
        .should('eq', '0');
    });

    it('renders columns direction:transport-distance side by side in 2:10 ratio', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-direction'),
        (2 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport-distance'),
        (10 / 12) * 100,
      );
    });

    it('renders columns transport:distance side by side in 4:8 ratio', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport'),
        (4 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-distance'),
        (8 / 12) * 100,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
            displayLabel: true,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
    labelDirectionTests();

    it('renders columns direction:transport-distance stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-direction'), 100);
      cy.testElementPercentageWidth(
        cy.dataCy('column-transport-distance'),
        100,
      );
    });

    it('renders columns transport:distance stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-transport'), 100);
      cy.testElementPercentageWidth(cy.dataCy('column-distance'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-list-item').should('be.visible');
    // column transport
    cy.dataCy('column-transport').should('be.visible');
    // label transport styles
    cy.dataCy('label-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // button toggle transport
    cy.dataCy('button-toggle-transport')
      .should('be.visible')
      .find('button')
      .should('have.length', 5);
    cy.dataCy('button-toggle-transport')
      .should('be.visible')
      .find('button')
      .find('i')
      .invoke('width')
      .should('be.gt', 1);
    cy.dataCy('button-toggle-transport')
      .should('be.visible')
      .find('button')
      .find('i')
      .invoke('height')
      .should('be.gt', 1);
    // description transport styles
    cy.dataCy('description-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black);
  });

  it('renders column distance', () => {
    // make sure transport type is bike
    cy.dataCy('button-toggle-transport').find('button').eq(0).click();
    // column distance
    cy.dataCy('column-distance').should('be.visible');
    cy.dataCy('label-distance')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // select action
    cy.dataCy('select-action').should('be.visible');
    // input distance
    cy.dataCy('input-distance').should('be.visible');
    // input distance value styles
    cy.dataCy('units-distance')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain', i18n.global.t('global.routeLengthUnit'));
  });

  it('allows to change transport type', () => {
    // make sure transport type is bike
    cy.dataCy('button-toggle-transport').find('button').eq(0).click();
    // description transport
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.bike'),
    );
    // change transport type
    cy.dataCy('button-toggle-transport').find('button').eq(1).click();
    // transport on foot
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.walk'),
    );
    // change transport type
    cy.dataCy('button-toggle-transport').find('button').eq(2).click();
    // transport by public transport
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.bus'),
    );
    // change transport type
    cy.dataCy('button-toggle-transport').find('button').eq(3).click();
    // transport by car
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.car'),
    );
    // change transport type
    cy.dataCy('button-toggle-transport').find('button').eq(4).click();
    // transport none
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.none'),
    );
  });

  it('hides distance if transport type is "car" or "none"', () => {
    // make sure transport type is bike
    cy.dataCy('button-toggle-transport').find('button').eq(0).click();
    // distance is shown
    cy.dataCy('column-distance').should('be.visible');
    // change transport type - car
    cy.dataCy('button-toggle-transport').find('button').eq(3).click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.car'),
    );
    // distance is not shown
    cy.dataCy('column-distance').should('not.be.visible');
    // change transport type - none
    cy.dataCy('button-toggle-transport').find('button').eq(4).click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.none'),
    );
    // distance is not shown
    cy.dataCy('column-distance');
    // change transport type -  bike
    cy.dataCy('button-toggle-transport').find('button').eq(0).click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.bike'),
    );
    // distance is shown
    cy.dataCy('column-distance').should('be.visible');
  });
}

function labelDirectionTests() {
  it('renders column direction', () => {
    // column direction
    cy.dataCy('column-direction').should('be.visible');
    // label direction styles
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // icon direction styles
    cy.dataCy('label-direction-icon').should('be.visible');
    cy.dataCy('label-direction-icon').invoke('width').should('be.equal', 18);
    cy.dataCy('label-direction-icon').invoke('height').should('be.equal', 18);
  });
}

import { colors } from 'quasar';

import RouteItemDisplay from 'components/routes/RouteItemDisplay.vue';
import { i18n } from '../../boot/i18n';
import { hexToRgb } from 'app/test/cypress/utils';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { useRoutes } from 'src/composables/useRoutes';

// composables
const { getPaletteColor } = colors;
const { getTransportLabel } = useRoutes();

// colors
const grey2 = getPaletteColor('grey-2');
const grey7 = getPaletteColor('grey-7');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');
const secondary = getPaletteColor('secondary');

// selectors
const selectorAvatarTransport = 'avatar-transport';
const selectorDescriptionTransport = 'description-transport';
const selectorDirectionIcon = 'label-direction-icon';
const selectorIconTransport = 'icon-transport';
const selectorLabelDirection = 'label-direction';
const selectorLabelDistance = 'label-distance';
const selectorSectionDirection = 'section-direction';
const selectorSectionDistance = 'section-distance';
const selectorRouteItemDisplay = 'route-item-display';

// variables
const avatarTransportSize = 32;
const iconDirectionSize = 18;
const iconTransportSize = 18;
const sectionDirectionPercentageWidth = 100;
const sectionDistancePercentageWidth = 100;
const snapshotParameters = {
  failureThreshold: 0.1,
  failureThresholdType: 'percent',
  timeout: 4000,
  customDiffConfig: { threshold: 0.4 },
  retries: 2,
}

describe('<RouteItemDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelDirectionFromWork', 'labelDirectionToWork'],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['bike', 'car', 'walk', 'bus', 'none', 'unknown'],
      'routes.transport',
      i18n,
    );
  });

  context('to work - with distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.toWork;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelToWork();
  });

  context('from work - with distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });

  context('to work - empty', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.toWork;
        route.transport = null;
        route.distance = null;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelToWork();
  });

  context('from work - empty', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        route.transport = null;
        route.distance = null;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });

  context('from work - no distance', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        const route = routes.fromWork;
        // set distance to 0 for test purposes
        route.distance = 0;
        cy.wrap(route).as('route');
        cy.mount(RouteItemDisplay, {
          props: {
            route: route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy(selectorRouteItemDisplay)
      .should('be.visible')
      .and(
        'have.css',
        'border',
        `1px solid ${hexToRgb(rideToWorkByBikeConfig.colorGray)}`,
      )
      .and(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    // label direction styles
    cy.dataCy(selectorLabelDirection)
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and('have.css', 'padding', '16px')
      .and('have.color', grey10);
    // icon direction
    cy.dataCy(selectorDirectionIcon)
      .should('be.visible')
      .invoke('height')
      .should('be.eq', iconDirectionSize);
    cy.dataCy(selectorDirectionIcon)
      .should('be.visible')
      .invoke('width')
      .should('be.eq', iconDirectionSize);
    // avatar transport
    cy.dataCy(selectorAvatarTransport).should('be.visible');
    cy.dataCy(selectorAvatarTransport)
      .invoke('height')
      .should('be.eq', avatarTransportSize);
    cy.dataCy(selectorAvatarTransport)
      .invoke('width')
      .should('be.eq', avatarTransportSize);
    // icon transport
    cy.dataCy(selectorIconTransport)
      .should('be.visible')
      .and('have.css', 'font-size', '18px');
    cy.dataCy(selectorIconTransport)
      .invoke('height')
      .should('be.eq', iconTransportSize);
    cy.dataCy(selectorIconTransport)
      .invoke('width')
      .should('be.eq', iconTransportSize);
    // description transport styles
    cy.dataCy(selectorDescriptionTransport)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
  });

  it('renders correct transport value', () => {
    cy.get('@route').then((route) => {
      // test styles if transport value is logged
      if (route.transport) {
        // transport value
        cy.dataCy(selectorAvatarTransport)
          .should('be.visible')
          .and('have.backgroundColor', secondary);
        // icon transport
        cy.dataCy(selectorIconTransport)
          .should('be.visible')
          .and('have.color', primary);
      } else {
        // transport value empty
        cy.dataCy(selectorAvatarTransport)
          .should('be.visible')
          .and('have.backgroundColor', grey2);
        // icon transport question mark
        cy.dataCy(selectorIconTransport)
          .should('be.visible')
          .and('have.color', grey7);
      }
      cy.dataCy(selectorDescriptionTransport).then((description) => {
        cy.wrap(getTransportLabel(route.transport)).should(
          'eq',
          description.text(),
        );
      });
    });
  });

  it('renders two sections stacked', () => {
    cy.testElementPercentageWidth(
      cy.dataCy(selectorSectionDirection),
      sectionDirectionPercentageWidth,
    );
    cy.testElementPercentageWidth(
      cy.dataCy(selectorSectionDistance),
      sectionDistancePercentageWidth,
    );
  });

  it('renders correct distance value', () => {
    cy.get('@route').then((route) => {
      if (route.distance) {
        // distance value including units
        cy.dataCy(selectorLabelDistance)
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', route.distance)
          .and('contain', i18n.global.t('global.routeLengthUnit'));
      } else {
        // distance value empty
        cy.dataCy(selectorLabelDistance).should('not.exist');
      }
    });
  });

  it('renders icons correctly', () => {
    // icon direction
    cy.dataCy(selectorDirectionIcon)
      .should('be.visible')
      .matchImageSnapshot(
        `${Cypress.currentTest.titlePath}-direction`,
        snapshotParameters
      );
    // icon transport
    cy.dataCy(selectorIconTransport)
      .should('be.visible')
      .matchImageSnapshot(
        `${Cypress.currentTest.titlePath}-transport`,
        snapshotParameters
      );
  });
}

function testLabelToWork() {
  it('renders label and icon "to work"', () => {
    // label to work
    cy.dataCy(selectorLabelDirection)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionToWork'));
    // icon to work
    cy.dataCy(selectorDirectionIcon)
      .should('be.visible')
      .and('contain', 'arrow_forward');
  });
}

function testLabelFromWork() {
  it('renders label and icon "from work"', () => {
    // label from work
    cy.dataCy(selectorLabelDirection)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionFromWork'));
    // icon from work
    cy.dataCy(selectorDirectionIcon)
      .should('be.visible')
      .and('contain', 'arrow_back');
  });
}

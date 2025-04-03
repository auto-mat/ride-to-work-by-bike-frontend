import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import { hexToRgb } from 'app/test/cypress/utils';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import RouteItemEdit from 'components/routes/RouteItemEdit.vue';
import { i18n } from '../../boot/i18n';
import { useTripsStore } from 'src/stores/trips';
import { TransportType } from 'src/components/types/Route';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<RouteItemEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelDirectionFromWork', 'labelDirectionToWork'],
      'routes',
      i18n,
    );
  });

  context('route no direction label', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
    testLabelToWork();
  });

  context('route to work', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
            displayLabel: true,
          },
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelToWork();

    it('renders the input distance value', () => {
      // make sure transport type is bike
      cy.dataCy('button-toggle-transport').eq(0).click();
      cy.fixture('routeListItem').then((routes) => {
        // input distance value
        cy.dataCy('input-distance')
          .should('be.visible')
          .invoke('val')
          .should(
            'eq',
            i18n.global.n(
              parseFloat(routes.toWork.distance),
              'routeDistanceDecimalNumber',
            ),
          );
      });
    });

    it('renders correct transport type', () => {
      cy.dataCy('description-transport')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.transport.bike'));
    });
  });

  context('route from work (0 distance)', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.fromWork,
            displayLabel: true,
          },
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    testLabelFromWork();
  });

  context('route to work - unlogged', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItemEmpty').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
            displayLabel: true,
          },
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.viewport('macbook-16');
      });
    });

    it('renders route with direction label', () => {
      cy.dataCy('label-direction')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.labelDirectionToWork'));
    });

    it('renders the transport type input', () => {
      cy.dataCy('section-transport')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.transport.unknown'))
        .within(() => {
          cy.fixture('apiGetCommuteMode').then((commuteModes) => {
            cy.dataCy('button-toggle-transport')
              .should('be.visible')
              .and('have.length', commuteModes.results.length);
          });
        });
    });
  });

  context('route from work - unlogged', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItemEmpty').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.fromWork,
            displayLabel: true,
          },
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.viewport('macbook-16');
      });
    });

    it('renders route with direction label', () => {
      cy.dataCy('label-direction')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.labelDirectionFromWork'));
    });

    it('renders the transport type input - no selected transport type', () => {
      cy.dataCy('section-transport')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.transport.unknown'))
        .within(() => {
          cy.fixture('apiGetCommuteMode').then((commuteModes) => {
            // all buttons are rendered
            cy.dataCy('button-toggle-transport')
              .should('be.visible')
              .and('have.length', commuteModes.results.length);
            // no button is selected
            cy.dataCy('button-toggle-transport')
              .find('.q-avatar')
              .should('not.have.class', 'bg-secondary');
          });
        });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemEdit, {
          props: {
            route: routes.toWork,
            displayLabel: true,
          },
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.viewport('iphone-6');
      });
    });

    coreTests();
    testLabelToWork();
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-item-edit')
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
    // column transport
    cy.dataCy('section-transport').should('be.visible');
  });

  it('renders column direction', () => {
    // column direction
    cy.dataCy('section-direction').should('be.visible');
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

  it('renders column distance', () => {
    // make sure transport type is bike
    cy.dataCy('button-toggle-transport').eq(0).click();
    // column distance
    cy.dataCy('section-distance').should('be.visible');
  });

  // Note: We need to test this behaviour here since we have dynamic state.
  it('allows to switch input type', () => {
    // input type is input distance
    cy.dataCy('select-action')
      .should('be.visible')
      .find('input')
      .should('have.value', i18n.global.t('routes.actionInputDistance'));
    cy.dataCy('button-trace-map').should('not.exist');
    cy.dataCy('input-distance').should('be.visible');
    cy.dataCy('select-action').select(i18n.global.t('routes.actionTraceMap'));
    cy.dataCy('input-distance').should('not.exist');
    cy.dataCy('button-trace-map').should('be.visible');
  });

  it('hides distance if transport type is "car" or "none"', () => {
    // make sure transport type is bike
    cy.dataCy('button-toggle-transport')
      .filter(`[data-value="${TransportType.bike}"]`)
      .click();
    // distance is shown
    cy.dataCy('section-distance').should('be.visible');
    // change transport type - car
    cy.dataCy('button-toggle-transport')
      .filter(`[data-value="${TransportType.car}"]`)
      .click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.car'),
    );
    // distance is not shown
    cy.dataCy('section-distance').should('not.be.visible');
    // change transport type - none
    cy.dataCy('button-toggle-transport')
      .filter(`[data-value="${TransportType.none}"]`)
      .click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.none'),
    );
    // distance is not shown
    cy.dataCy('section-distance');
    // change transport type -  bike
    cy.dataCy('button-toggle-transport')
      .filter(`[data-value="${TransportType.bike}"]`)
      .click();
    cy.dataCy('description-transport').should(
      'contain',
      i18n.global.t('routes.transport.bike'),
    );
    // distance is shown
    cy.dataCy('section-distance').should('be.visible');
  });

  it('renders icons correctly', () => {
    // icon direction
    cy.dataCy('label-direction-icon', { timeout: 4000 })
      .should('be.visible')
      .matchImageSnapshot(`${Cypress.currentTest.titlePath}-direction`, {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        retries: 2,
      });
  });
}

function testLabelToWork() {
  it('renders label and icon "to work"', () => {
    // label to work
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionToWork'));
    // icon to work
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .and('contain', 'arrow_forward');
  });
}

function testLabelFromWork() {
  it('renders label and icon "from work"', () => {
    // label from work
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.labelDirectionFromWork'));
    // icon from work
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .and('contain', 'arrow_back');
  });
}

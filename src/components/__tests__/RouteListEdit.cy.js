import { createPinia, setActivePinia } from 'pinia';
import { date, colors } from 'quasar';
import { computed } from 'vue';
import RouteListEdit from 'components/routes/RouteListEdit.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';
import { useRoutes } from '../../../src/composables/useRoutes';
import { useLogRoutes } from '../../../src/composables/useLogRoutes';
import { rideToWorkByBikeConfig } from '../../../src/boot/global_vars';
import { useTripsStore } from '../../../src/stores/trips';

const { getPaletteColor } = colors;

const { getTransportLabel } = useRoutes();

// selectors
const dataSelectorButtonToggleTransport = '[data-cy="button-toggle-transport"]';
const dataSelectorInputDistance = '[data-cy="input-distance"]';
const dataSelectorRouteDistance = '[data-cy="route-distance"]';
const dataSelectorSelectAction = '[data-cy="select-action"]';
const selectorButtonSave = 'button-save';
const selectorRouteListEdit = 'route-list-edit';
const selectorRouteListItem = 'route-list-item';
const selectorRouteListItemWrapper = 'route-list-item-wrapper';
const selectorSectionDirection = 'section-direction';

// variables
const routeListItemWrapperWidthDesktop = 50;
const routeListItemWrapperWidthMobile = 100;
const { challengeLoggingWindowDays } = rideToWorkByBikeConfig;

describe('<RouteListEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.clock(new Date('2024-08-15').getTime());
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders items in two columns', () => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorRouteListItemWrapper),
        routeListItemWrapperWidthDesktop,
      );
    });
  });

  // cy.clock() interferes with select dropdown function
  context('desktop - current date', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    it('tracks dirty state of input type', () => {
      // test changing input type
      cy.dataCy(selectorRouteListItem)
        .first()
        .find(dataSelectorButtonToggleTransport)
        .first()
        .click();
      cy.dataCy(selectorRouteListItem)
        .first()
        .find(dataSelectorSelectAction)
        .select(i18n.global.t('routes.actionTraceMap'));
      cy.dataCy(selectorButtonSave).should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
      );
      // reset
      cy.dataCy(selectorRouteListItem)
        .first()
        .find(dataSelectorSelectAction)
        .select(i18n.global.t('routes.actionInputDistance'));
      cy.dataCy(selectorRouteListItem)
        .first()
        .find(dataSelectorButtonToggleTransport)
        .last()
        .click();
      cy.dataCy(selectorButtonSave).should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.clock(new Date('2024-08-15').getTime());
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders items in one columns', () => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorRouteListItemWrapper),
        routeListItemWrapperWidthMobile,
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy(selectorRouteListEdit).should('be.visible');
    // items visible
    cy.dataCy(selectorRouteListItem)
      .should('be.visible')
      .and('have.length', challengeLoggingWindowDays * 2);
    // direction labels visible
    cy.dataCy(selectorSectionDirection).should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate(getPaletteColor('grey-10'));

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // initialize composable function
      const { hasTransportDistance } = useLogRoutes(computed(() => routeList));
      // check logged routes by id
      routeList.forEach((loggedRoute) => {
        const startDate = date.addToDate(new Date(), {
          days: -1 * challengeLoggingWindowDays,
        });
        const endDate = new Date();
        if (loggedRoute.date > startDate && loggedRoute.date <= endDate) {
          // has transport label
          cy.dataCy(selectorRouteListItemWrapper)
            .find(`[data-id="${loggedRoute.id}"]`)
            .should('contain', getTransportLabel(loggedRoute.transport));
          // has transport distance (value)
          if (hasTransportDistance(loggedRoute)) {
            cy.dataCy(selectorRouteListItemWrapper)
              .find(`[data-id="${loggedRoute.id}"]`)
              .find(dataSelectorRouteDistance)
              .should('be.visible')
              .and('have.value', loggedRoute.distance);
          } else {
            cy.dataCy(selectorRouteListItemWrapper)
              .find(`[data-id="${loggedRoute.id}"]`)
              .find(dataSelectorRouteDistance)
              .should('not.exist');
          }
        }
      });
    });
  });

  it('renders save button with edit count', () => {
    cy.dataCy(selectorButtonSave)
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      );
    // introduce a change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorButtonToggleTransport)
      .last()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // revert change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorButtonToggleTransport)
      .first()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
    // introduce two changes
    // change first route
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorButtonToggleTransport)
      .last()
      .click();
    // change last route
    cy.dataCy(selectorRouteListItem)
      .last()
      .find(dataSelectorButtonToggleTransport)
      .first()
      .click();
    // count changes
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
    );
    // revert changes
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorButtonToggleTransport)
      .first()
      .click();
    cy.dataCy(selectorRouteListItem)
      .last()
      .find(dataSelectorButtonToggleTransport)
      .last()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
    // test inputting distance value
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .type('{backspace}');
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .blur();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // reset distance value
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .type('0');
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .blur();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
  });
}

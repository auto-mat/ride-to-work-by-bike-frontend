import { colors, date } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { computed } from 'vue';
import RouteListDisplay from 'components/routes/RouteListDisplay.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';
import { useRoutes } from '../../../src/composables/useRoutes';
import { useLogRoutes } from '../../../src/composables/useLogRoutes';
import { useChallengeStore } from '../../../src/stores/challenge';
import { useTripsStore } from '../../../src/stores/trips';
import { rideToWorkByBikeConfig } from '../../../src/boot/global_vars';
import { systemTimeLoggingRoutes } from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const { getTransportLabel } = useRoutes();

// variables
const { challengeLoggingWindowDays, challengeStartDate } =
  rideToWorkByBikeConfig;

describe('<RouteListDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.clock(systemTimeLoggingRoutes, ['Date']);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.mount(RouteListDisplay, {
        props: {},
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
    });

    coreTests();

    it('renders items in two columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.mount(RouteListDisplay, {
        props: {},
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
    });

    coreTests();

    it('renders items in one columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-list-display').should('be.visible');
    // day title
    cy.dataCy('route-list-day-date')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
    // items
    cy.dataCy('route-list-item').should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate(grey10);

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // initialize composable function
      const { hasTransportDistance } = useLogRoutes(computed(() => routeList));
      // check logged routes by id
      routeList.forEach((loggedRoute) => {
        const startDate = date.addToDate(new Date(challengeStartDate), {
          days: -1,
        });
        const endDate = date.addToDate(new Date(), {
          days: -1 * challengeLoggingWindowDays,
        });
        if (loggedRoute.date > startDate && loggedRoute.date <= endDate) {
          // has transport label
          cy.dataCy(selectorRouteListItemWrapper)
            .find(`[data-id="${loggedRoute.id}"]`)
            .should('contain', getTransportLabel(loggedRoute.transport));
          // has transport distance (value)
          if (
            hasTransportDistance(loggedRoute) &&
            loggedRoute.distance &&
            parseFloat(loggedRoute.distance) > 0
          ) {
            cy.dataCy(selectorRouteListItemWrapper)
              .find(`[data-id="${loggedRoute.id}"]`)
              .find('[data-cy="label-distance"]')
              .should('be.visible')
              .and('have.value', loggedRoute.distance);
          } else {
            cy.dataCy(selectorRouteListItemWrapper)
              .find(`[data-id="${loggedRoute.id}"]`)
              .find('[data-cy="label-distance"]')
              .should('not.exist');
          }
        }
      });
    });
  });
}

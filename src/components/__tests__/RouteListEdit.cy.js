import { createPinia, setActivePinia } from 'pinia';
import { date, colors } from 'quasar';
import { computed } from 'vue';
import RouteListEdit from 'components/routes/RouteListEdit.vue';
import { i18n } from '../../boot/i18n';
import {
  testRouteListDayDate,
  systemTimeLoggingRoutes,
} from '../../../test/cypress/support/commonTests';
import { useRoutes } from '../../../src/composables/useRoutes';
import { useLogRoutes } from '../../../src/composables/useLogRoutes';
import { rideToWorkByBikeConfig } from '../../../src/boot/global_vars';
import { useTripsStore } from '../../../src/stores/trips';
import { useChallengeStore } from '../../../src/stores/challenge';
import { TransportType } from '../../../src/components/types/Route';
import testData from '../../../test/cypress/fixtures/routeListEditInputTest.json';
const { getPaletteColor } = colors;

const { getTransportLabel } = useRoutes();

// selectors
const dataSelectorButtonToggleTransport = '[data-cy="button-toggle-transport"]';
const dataSelectorInputDistance = '[data-cy="input-distance"]';
const dataSelectorRouteDistance = '[data-cy="route-distance"]';
const dataSelectorSelectAction = '[data-cy="select-action"]';
const selectorButtonSaveBottom = 'button-save-bottom';
const selectorButtonSaveSticky = 'button-save-sticky';
const selectorButtonSaveTop = 'button-save-top';
const selectorRouteListEdit = 'route-list-edit';
const selectorRouteListItem = 'route-list-item';
const selectorRouteListItemWrapper = 'route-list-item-wrapper';
const selectorSectionDirection = 'section-direction';

// variables
const routeListItemWrapperWidthDesktop = 50;
const routeListItemWrapperWidthMobile = 100;
const { challengeLoggingWindowDays } = rideToWorkByBikeConfig;

let selectorButtonSave;

describe('<RouteListEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.clock(systemTimeLoggingRoutes, ['Date']);
  });

  context('desktop - full logging window', () => {
    beforeEach(() => {
      // test save button top
      selectorButtonSave = selectorButtonSaveTop;
      cy.mount(RouteListEdit);
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.fixture('routeItemsCalendar.json').then((response) => {
        cy.wrap(useTripsStore()).then((store) => {
          store.setRouteItems(response);
        });
      });
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

  context('mobile', () => {
    beforeEach(() => {
      // test save button sticky
      selectorButtonSave = selectorButtonSaveSticky;
      cy.mount(RouteListEdit);
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.fixture('routeItemsCalendar.json').then((response) => {
        cy.wrap(useTripsStore()).then((store) => {
          store.setRouteItems(response);
        });
      });
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

  context('API payloads for route entry', () => {
    beforeEach(() => {
      // test save button bottom
      selectorButtonSave = selectorButtonSaveBottom;
      cy.viewport('macbook-16');
    });

    // generate tests based on fixture routeCalendarPanelInputTest.json
    Object.entries(testData).forEach(([testKey, testCase]) => {
      it(`${testKey}: ${testCase.description}`, () => {
        // mount component with test data
        cy.mount(RouteListEdit);
        cy.fixture('apiGetThisCampaignMay.json').then((response) => {
          cy.wrap(useChallengeStore()).then((store) => {
            store.setDaysActive(response.results[0].days_active);
            store.setPhaseSet(response.results[0].phase_set);
          });
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.fixture('routeListEmpty.json').then((response) => {
          cy.wrap(useTripsStore()).then((store) => {
            store.setRouteItems(response);
          });
        });
        cy.viewport('macbook-16');
        // intercept API call with response matching the payload
        const responseBody = {
          trips: testCase.apiPayload.trips.map((trip, index) => ({
            id: index + 1,
            ...trip,
            durationSeconds: null,
            sourceId: null,
            file: null,
            description: '',
            track: null,
          })),
        };
        cy.interceptPostTripsApi(rideToWorkByBikeConfig, i18n, responseBody);
        // input each route
        testCase.propRoutes.forEach((route) => {
          cy.get(`[data-date="${route.date}"]`)
            .should('be.visible')
            .find(`[data-direction="${route.direction}"]`)
            .should('be.visible')
            .within(() => {
              // input transport type if provided
              if (testCase.inputValues.transport) {
                cy.dataCy('button-toggle-transport').should('be.visible');
                cy.dataCy('section-transport')
                  .find(`[data-value="${testCase.inputValues.transport}"]`)
                  .click();
              }
              // input distance if provided
              if (testCase.inputValues.distance) {
                cy.dataCy('section-input-number').should('be.visible');
                cy.dataCy('section-input-number').find('input').clear();
                cy.dataCy('section-input-number')
                  .find('input')
                  .type(testCase.inputValues.distance);
              }
            });
        });
        // click save button
        cy.dataCy(selectorButtonSave).click();
        // wait for API call and verify payload
        cy.waitForPostTripsApi(testCase.apiPayload);
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('apiGetThisCampaignMay.json').then((response) => {
      // component visible
      cy.dataCy(selectorRouteListEdit).should('be.visible');
      // items visible
      cy.dataCy(selectorRouteListItem)
        .should('be.visible')
        .and('have.length', response.results[0].days_active * 2);
      // direction labels visible
      cy.dataCy(selectorSectionDirection).should('be.visible');
    });
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
      )
      .and('have.class', 'disabled');
    // check initial state for 1st route
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(`[data-value="${TransportType.bike}"]`)
      .find('.q-avatar')
      .should('have.class', 'bg-secondary');
    // check initial state for 2nd route
    cy.dataCy(selectorRouteListItem)
      .eq(1)
      .within(() => {
        // no button is selected
        cy.dataCy('button-toggle-transport')
          .find('.q-avatar')
          .should('not.have.class', 'bg-secondary');
      });
    // introduce a change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(`[data-value="${TransportType.car}"]`)
      .click();
    // check save button with edit count
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
      )
      .and('not.have.class', 'disabled');
    // revert change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(`[data-value="${TransportType.bike}"]`)
      .click();
    // check save button with edit count
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      )
      .and('have.class', 'disabled');
    // introduce two changes
    // change first route
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(`[data-value="${TransportType.car}"]`)
      .click();
    // change second route
    cy.dataCy(selectorRouteListItem)
      .eq(1)
      .find(`[data-value="${TransportType.bike}"]`)
      .click();
    // count changes
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
      )
      .and('not.have.class', 'disabled');
    // revert 1 change (other change cannot be reverted)
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(`[data-value="${TransportType.bike}"]`)
      .click();
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
      )
      .and('not.have.class', 'disabled');
    // test changing distance value by deleting '0'
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .type('{backspace}');
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .blur();
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
      )
      .and('not.have.class', 'disabled');
    // reset distance value
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .type('0');
    cy.dataCy(selectorRouteListItem)
      .first()
      .find(dataSelectorInputDistance)
      .blur();
    cy.dataCy(selectorButtonSave)
      .should(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
      )
      .and('not.have.class', 'disabled');
  });

  it('validates list on save and shows notification if distance is missing', () => {
    const responseBody = {
      trips: testData.test_2.apiPayload.trips.map((trip, index) => ({
        id: index + 1,
        ...trip,
        durationSeconds: null,
        sourceId: null,
        file: null,
        description: '',
        track: null,
      })),
    };
    cy.interceptPostTripsApi(rideToWorkByBikeConfig, i18n, responseBody);
    // pick one editable route
    cy.get(`[data-date="${testData.test_2.propRoutes[0].date}"]`)
      .should('be.visible')
      .find(`[data-direction="${testData.test_2.propRoutes[0].direction}"]`)
      .should('be.visible')
      .within(() => {
        // input transport type
        cy.dataCy('button-toggle-transport').should('be.visible');
        cy.dataCy('section-transport')
          .find(`[data-value="${testData.test_2.inputValues.transport}"]`)
          .click();
      });
    // skip distance input and save
    cy.dataCy(selectorButtonSave).click();
    // check notification
    cy.contains(i18n.global.t('postTrips.messageFormValidationFailed')).should(
      'be.visible',
    );
    // input contains error
    cy.get(`[data-date="${testData.test_2.propRoutes[0].date}"]`)
      .should('be.visible')
      .find(`[data-direction="${testData.test_2.propRoutes[0].direction}"]`)
      .should('be.visible')
      .within(() => {
        // error message visible
        cy.contains(i18n.global.t('form.messageFieldAboveZero')).should(
          'be.visible',
        );
        // input distance
        cy.dataCy('section-input-number').should('be.visible');
        cy.dataCy('section-input-number').find('input').clear();
        cy.dataCy('section-input-number')
          .find('input')
          .type(testData.test_2.inputValues.distance);
        // error message not visible
        cy.contains(i18n.global.t('form.messageFieldAboveZero')).should(
          'not.exist',
        );
      });
    // save
    cy.dataCy(selectorButtonSave).click();
    // wait for API call and verify payload
    cy.waitForPostTripsApi(testData.test_2.apiPayload);
  });

  it('shows notification when entry is not enabled', () => {
    // pick one editable route
    cy.get('[data-date="2025-05-12"]')
      .should('be.visible')
      .find('[data-direction="fromWork"]')
      .should('be.visible')
      .within(() => {
        // input transport type
        cy.dataCy('button-toggle-transport').should('be.visible');
        cy.dataCy('section-transport')
          .find(`[data-value="${TransportType.bike}"]`)
          .click();
        // input distance
        cy.dataCy('section-input-number').should('be.visible');
        cy.dataCy('section-input-number').find('input').clear();
        cy.dataCy('section-input-number').find('input').type('10');
      });
    // wait 9 days (to get to a day when entry is not enabled)
    cy.tick(9 * 24 * 60 * 60 * 1000);
    // click save button
    cy.dataCy(selectorButtonSave).click();
    // check notification
    cy.contains(i18n.global.t('postTrips.messageEntryNotEnabled')).should(
      'be.visible',
    );
  });

  it.skip('tracks dirty state when input type changes (currently not used)', () => {
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
}

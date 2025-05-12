import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import RouteCalendarPanel from 'components/routes/RouteCalendarPanel.vue';
import { i18n } from '../../boot/i18n';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useChallengeStore } from 'src/stores/challenge';
import { useTripsStore } from 'src/stores/trips';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { systemTimeLoggingRoutes } from '../../../test/cypress/support/commonTests';
import testData from '../../../test/cypress/fixtures/routeCalendarPanelInputTest.json';
import { TransportType } from '../../../src/components/types/Route';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorDialogCard = 'dialog-card';
const selectorDialogTitle = 'dialog-title';
const selectorDialogSaveButton = 'dialog-save-button';
const selectorRouteCalendarPanel = 'route-calendar-panel';
const selectorRouteInputDistance = 'route-input-distance';
const selectorRouteInputTransportType = 'route-input-transport-type';
const selectorSectionDistance = 'section-distance';
const selectorSectionTransport = 'section-transport';

describe('<RouteCalendarPanel>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['titleBottomPanel', 'titleBottomPanelNoRoutes'],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'postTrips',
      i18n,
    );
  });

  context('desktop - logged route', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeList').then((listRoutes) => {
        const routes = [listRoutes[0]];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - route to work unlogged (default data)', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeCalendarEmptyToWork').then((routeEmptyToWork) => {
        const routes = [routeEmptyToWork];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
    unloggedRouteTests();
  });

  context('desktop - route from work unlogged (default data)', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeCalendarEmptyFromWork').then((routeEmptyFromWork) => {
        const routes = [routeEmptyFromWork];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
    unloggedRouteTests();
  });

  context('desktop - multiple routes', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeList').then((routes) => {
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
    unloggedRouteTests();
  });

  context('mobile - one route', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeList').then((listRoutes) => {
        const routes = [listRoutes[0]];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
  });

  context('mobile - multiple routes', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('routeList').then((routes) => {
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
    unloggedRouteTests();
  });

  context('API payloads for route entry', () => {
    beforeEach(() => {
      cy.clock(systemTimeLoggingRoutes, ['Date']);
      setActivePinia(createPinia());
      cy.viewport('macbook-16');
    });

    // generate tests based on fixture routeCalendarPanelInputTest.json
    Object.entries(testData).forEach(([testKey, testCase]) => {
      it(`${testKey}: ${testCase.description}`, () => {
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
        // mount component with test data
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes: testCase.propRoutes,
          },
        });
        cy.fixture('apiGetThisCampaignMay.json').then((response) => {
          cy.wrap(useChallengeStore()).then((store) => {
            store.setDaysActive(response.results[0].days_active);
            store.setPhaseSet(response.results[0].phase_set);
          });
        });
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        // setup user approval status
        cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
        // input transport type if provided
        if (testCase.inputValues.transport) {
          cy.dataCy('button-toggle-transport').should('be.visible');
          cy.dataCy(selectorRouteInputTransportType)
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
        // click save button
        cy.dataCy(selectorDialogSaveButton).click();
        // wait for API call and verify payload
        cy.waitForPostTripsApi(testCase.apiPayload);
      });
    });

    it('shows notification when entry is not enabled', () => {
      cy.mount(RouteCalendarPanel, {
        props: {
          modelValue: true,
          routes: testData.test_1.propRoutes,
        },
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // input transport type
      cy.dataCy('button-toggle-transport').should('be.visible');
      cy.dataCy(selectorRouteInputTransportType)
        .find(`[data-value="${testData.test_1.inputValues.transport}"]`)
        .click();
      // input distance
      cy.dataCy('section-input-number').should('be.visible');
      cy.dataCy('section-input-number').find('input').clear();
      cy.dataCy('section-input-number')
        .find('input')
        .type(testData.test_1.inputValues.distance);
      // wait 9 days (to get to a day when entry is not enabled)
      cy.tick(9 * 24 * 60 * 60 * 1000);
      // click save button
      cy.dataCy(selectorDialogSaveButton).click();
      // check notification
      cy.contains(i18n.global.t('postTrips.messageEntryNotEnabled')).should(
        'be.visible',
      );
    });

    it('shows notification when member is not approved', () => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup register challenge store
      cy.fixture('apiGetMyTeamResponseUndecided').then((response) => {
        cy.setupRegisterChallengeTeamApprovalStatus(
          useRegisterChallengeStore,
          response,
        );
      });
      // input transport type
      cy.dataCy('button-toggle-transport').should('be.visible');
      cy.dataCy(selectorRouteInputTransportType)
        .find(`[data-value="${TransportType.bike}"]`)
        .click();
      // input distance
      cy.dataCy('section-input-number').should('be.visible');
      cy.dataCy('section-input-number').find('input').clear();
      cy.dataCy('section-input-number').find('input').type('10');
      // click save button
      cy.dataCy(selectorDialogSaveButton).click();
      // check notification
      cy.contains(i18n.global.t('postTrips.messageUserNotApproved')).should(
        'be.visible',
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.get('@routes').then((routes) => {
      cy.dataCy(selectorRouteCalendarPanel).should('be.visible');
      cy.dataCy(selectorDialogTitle)
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('routes.titleBottomPanel', routes.length, {
            count: routes.length,
          }),
        );
      cy.dataCy(selectorSectionDistance).should('be.visible');
      cy.dataCy(selectorSectionTransport).should('be.visible');
      cy.dataCy(selectorRouteInputDistance).should('be.visible');
      cy.dataCy(selectorRouteInputTransportType).should('be.visible');
    });
  });
}

function unloggedRouteTests() {
  it('renders disabled button by default', () => {
    cy.dataCy(selectorDialogSaveButton).should('be.visible').and('be.disabled');
  });
}

function mobileTests() {
  it('renders panel full width', () => {
    cy.dataCy(selectorDialogCard)
      .should('be.visible')
      .invoke('width')
      .then((width) => {
        // should be 100% of viewport
        expect(width).to.equal(window.innerWidth);
      });
    cy.testElementPercentageWidth(cy.dataCy(selectorSectionDistance), 100);
    cy.testElementPercentageWidth(cy.dataCy(selectorSectionTransport), 100);
  });
}

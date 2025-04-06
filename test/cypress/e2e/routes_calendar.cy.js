import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeLastDayOfCompetitionMay } from '../support/commonTests';

const dateWithLoggedRoute = new Date(2025, 4, 26);

describe('Routes calendar page', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    // load config an i18n objects as aliases
    cy.task('getAppConfig', process).then((config) => {
      // alias config
      cy.wrap(config).as('config');
      cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
        cy.interceptThisCampaignGetApi(config, defLocale, campaign);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
        cy.waitForThisCampaignApi(campaign);
      });
    });
  });

  context('desktop - no logged routes', () => {
    beforeEach(() => {
      cy.clock(new Date(dateWithLoggedRoute), ['Date']);
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
        cy.waitForCommuteModeApi();
        cy.waitForTripsApi();
      });
    });

    coreTests();
    testDesktopSidebar();

    it('allows to enter a new route and save it', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeCalendarPanelInputTest.json').then((testCases) => {
            // intercept API call with response matching the payload
            const responseBody = {
              trips: testCases.test_1.apiPayload.trips.map((trip, index) => ({
                id: index + 1,
                ...trip,
                durationSeconds: null,
                sourceId: null,
                file: null,
                description: '',
                track: null,
              })),
            };
            cy.interceptPostTripsApi(config, i18n, responseBody);
            const testCaseDate = testCases.test_1.propRoutes[0].date;
            const testCaseTransport = testCases.test_1.inputValues.transport;
            const testCaseDistance = testCases.test_1.inputValues.distance;
            // wait for routes calendar to be visible
            cy.dataCy('routes-calendar').should('be.visible');
            // click on the calendar item
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-towork-empty"]')
              .click({ force: true });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            // input transport type
            cy.dataCy('button-toggle-transport').should('be.visible');
            cy.dataCy('route-input-transport-type')
              .find(`[data-value="${testCaseTransport}"]`)
              .click({ force: true });
            // input distance
            cy.dataCy('section-input-number').should('be.visible');
            cy.dataCy('section-input-number').find('input').clear();
            cy.dataCy('section-input-number')
              .find('input')
              .type(testCaseDistance);
            // click save button
            cy.dataCy('dialog-save-button').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_1.apiPayload);
            // verify that the route is saved and updated in the UI (depending on the direction)
            cy.get(`[data-date="${testCaseDate}"]`).find(
              '[data-cy="calendar-item-icon-towork-logged"]',
            );
            cy.get(`[data-date="${testCaseDate}"]`).should(
              'contain',
              i18n.global.n(
                testCases.test_1.apiPayload.trips[0].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
          });
        });
      });
    });

    it('allows to enter multiple new routes', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeCalendarPanelInputTest.json').then((testCases) => {
            // intercept API call with response matching the payload
            const responseBody = {
              trips: testCases.test_17.apiPayload.trips.map((trip, index) => ({
                id: index + 1,
                ...trip,
                durationSeconds: null,
                sourceId: null,
                file: null,
                description: '',
                track: null,
              })),
            };
            cy.interceptPostTripsApi(config, i18n, responseBody);
            const testCaseDate = testCases.test_17.propRoutes[0].date;
            const testCaseTransport = testCases.test_17.inputValues.transport;
            const testCaseDistance = testCases.test_17.inputValues.distance;
            cy.dataCy('routes-calendar').should('be.visible');
            // click on the first calendar route
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-towork-empty"]')
              .click({ force: true });
            // click on the second calendar route
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-fromwork-empty"]')
              .click({ force: true });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            // input transport type
            cy.dataCy('button-toggle-transport').should('be.visible');
            cy.dataCy('route-input-transport-type')
              .find(`[data-value="${testCaseTransport}"]`)
              .click({ force: true });
            // input distance
            cy.dataCy('section-input-number').should('be.visible');
            cy.dataCy('section-input-number').find('input').clear();
            cy.dataCy('section-input-number')
              .find('input')
              .type(testCaseDistance);
            // click save button
            cy.dataCy('dialog-save-button').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_17.apiPayload);
            // verify that the first route is saved and updated in the UI
            cy.get(`[data-date="${testCaseDate}"]`).find(
              '[data-cy="calendar-item-icon-towork-logged"]',
            );
            cy.get(`[data-date="${testCaseDate}"]`).should(
              'contain',
              i18n.global.n(
                testCases.test_17.apiPayload.trips[0].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
            // verify that the second route is saved and updated in the UI
            cy.get(`[data-date="${testCaseDate}"]`).find(
              '[data-cy="calendar-item-icon-fromwork-logged"]',
            );
            cy.get(`[data-date="${testCaseDate}"]`).should(
              'contain',
              i18n.global.n(
                testCases.test_17.apiPayload.trips[1].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
          });
        });
      });
    });
  });

  context('desktop - with logged routes', () => {
    beforeEach(() => {
      cy.clock(new Date(dateWithLoggedRoute), ['Date']);
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.fixture('apiGetTripsResponseCalendar.json').then((trips) => {
          cy.fixture('apiGetTripsResponseCalendarNext.json').then(
            (tripsNext) => {
              cy.interceptTripsGetApi(config, defLocale, trips, tripsNext);
              cy.visit(
                '#' + routesConf['routes_calendar']['children']['fullPath'],
              );
              cy.waitForCommuteModeApi();
              cy.waitForTripsApi(trips, tripsNext);
            },
          );
        });
      });
    });

    it('allows to update an existing route', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeCalendarPanelInputTest.json').then((testCases) => {
            // intercept API call with response matching the payload
            const responseBody = {
              trips: testCases.test_1.apiPayload.trips.map((trip, index) => ({
                id: index + 1,
                ...trip,
                durationSeconds: null,
                sourceId: null,
                file: null,
                description: '',
                track: null,
              })),
            };
            cy.interceptPostTripsApi(config, i18n, responseBody);
            const testCaseDate = testCases.test_1.propRoutes[0].date;
            const testCaseTransport = testCases.test_1.inputValues.transport;
            const testCaseDistance = testCases.test_1.inputValues.distance;
            // wait for routes calendar to be visible
            cy.dataCy('routes-calendar').should('be.visible');
            // click on the calendar item
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-towork-logged"]')
              .click({ force: true });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            // input transport type
            cy.dataCy('button-toggle-transport').should('be.visible');
            cy.dataCy('route-input-transport-type')
              .find(`[data-value="${testCaseTransport}"]`)
              .click({ force: true });
            // input distance
            cy.dataCy('section-input-number').should('be.visible');
            cy.dataCy('section-input-number').find('input').clear();
            cy.dataCy('section-input-number')
              .find('input')
              .type(testCaseDistance);
            // click save button
            cy.dataCy('dialog-save-button').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_1.apiPayload);
            // verify that the route is saved and updated in the UI (depending on the direction)
            cy.get(`[data-date="${testCaseDate}"]`).find(
              '[data-cy="calendar-item-icon-towork-logged"]',
            );
            cy.get(`[data-date="${testCaseDate}"]`).should(
              'contain',
              i18n.global.n(
                testCases.test_1.apiPayload.trips[0].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
          });
        });
      });
    });
  });

  context('desktop - last day of competition (may)', () => {
    beforeEach(() => {
      cy.clock(systemTimeLastDayOfCompetitionMay, ['Date']);
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
        cy.waitForCommuteModeApi();
        cy.waitForTripsApi();
      });
    });

    it('allows to log date which is outside current month', () => {
      /**
       * Test case 2 has date "2025-05-26"
       */
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeCalendarPanelInputTest.json').then((testCases) => {
            // intercept API call with response matching the payload
            const responseBody = {
              trips: testCases.test_2.apiPayload.trips.map((trip, index) => ({
                id: index + 1,
                ...trip,
                durationSeconds: null,
                sourceId: null,
                file: null,
                description: '',
                track: null,
              })),
            };
            cy.interceptPostTripsApi(config, i18n, responseBody);
            const testCaseDate = testCases.test_2.propRoutes[0].date;
            const testCaseTransport = testCases.test_2.inputValues.transport;
            const testCaseDistance = testCases.test_2.inputValues.distance;
            // wait for routes calendar to be visible
            cy.dataCy('routes-calendar').should('be.visible');
            // click on the calendar item
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-fromwork-empty"]')
              .click({ force: true });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            // input transport type
            cy.dataCy('button-toggle-transport').should('be.visible');
            cy.dataCy('route-input-transport-type')
              .find(`[data-value="${testCaseTransport}"]`)
              .click({ force: true });
            // input distance
            cy.dataCy('section-input-number').should('be.visible');
            cy.dataCy('section-input-number').find('input').clear();
            cy.dataCy('section-input-number')
              .find('input')
              .type(testCaseDistance);
            // click save button
            cy.dataCy('dialog-save-button').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_2.apiPayload);
            // verify that the route is saved and updated in the UI (depending on the direction)
            cy.get(`[data-date="${testCaseDate}"]`).find(
              '[data-cy="calendar-item-icon-fromwork-logged"]',
            );
            cy.get(`[data-date="${testCaseDate}"]`).should(
              'contain',
              i18n.global.n(
                testCases.test_2.apiPayload.trips[0].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
          });
        });
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-calendar').should('be.visible');
  });
}

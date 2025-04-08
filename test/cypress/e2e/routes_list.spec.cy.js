import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';

const dateWithLoggedRoute = new Date(2025, 4, 26);

describe('Routes list page', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
    cy.clock(new Date(dateWithLoggedRoute), ['Date']);
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
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
        cy.waitForCommuteModeApi();
        cy.dataCy('spinner-route-list-edit').should('be.visible');
        cy.dataCy('spinner-route-list-display').should('be.visible');
        cy.waitForTripsApi();
      });
    });

    coreTests();
    testDesktopSidebar();

    it('allows to enter a new route and save it', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeListEditInputTest.json').then((testCases) => {
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
            const testCaseDirection = testCases.test_1.propRoutes[0].direction;
            const testCaseTransport = testCases.test_1.inputValues.transport;
            const testCaseDistance = testCases.test_1.inputValues.distance;
            // wait for routes list to be visible
            cy.dataCy('route-list-edit').should('be.visible');
            // update the route list item
            cy.get(`[data-date="${testCaseDate}"]`)
              .should('be.visible')
              .find(`[data-direction="${testCaseDirection}"]`)
              .should('be.visible')
              .within(() => {
                if (testCaseTransport) {
                  cy.dataCy('button-toggle-transport').should('be.visible');
                  cy.dataCy('section-transport')
                    .find(`[data-value="${testCaseTransport}"]`)
                    .click();
                }
                // input distance if provided
                if (testCaseDistance) {
                  cy.dataCy('section-input-number').should('be.visible');
                  cy.dataCy('section-input-number').find('input').clear();
                  cy.dataCy('section-input-number')
                    .find('input')
                    .type(testCaseDistance);
                }
              });
            // click save button
            cy.dataCy('button-save-bottom').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_1.apiPayload);
            // go to calendar page to confirm saving
            cy.visit(
              '#' + routesConf['routes_calendar']['children']['fullPath'],
            );
            cy.dataCy('routes-calendar').should('be.visible');
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
          cy.fixture('routeListEditInputTest.json').then((testCases) => {
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
            const testCaseTransport = testCases.test_17.inputValues.transport;
            const testCaseDistance = testCases.test_17.inputValues.distance;
            cy.dataCy('route-list-edit').should('be.visible');
            // update the first route list route
            cy.get(`[data-date="${testCases.test_17.propRoutes[0].date}"]`)
              .should('be.visible')
              .find(
                `[data-direction="${testCases.test_17.propRoutes[0].direction}"]`,
              )
              .should('be.visible')
              .within(() => {
                if (testCaseTransport) {
                  cy.dataCy('button-toggle-transport').should('be.visible');
                  cy.dataCy('section-transport')
                    .find(`[data-value="${testCaseTransport}"]`)
                    .click();
                }
                // input distance if provided
                if (testCaseDistance) {
                  cy.dataCy('section-input-number').should('be.visible');
                  cy.dataCy('section-input-number').find('input').clear();
                  cy.dataCy('section-input-number')
                    .find('input')
                    .type(testCaseDistance);
                }
              });
            // update the second route list route
            cy.get(`[data-date="${testCases.test_17.propRoutes[1].date}"]`)
              .should('be.visible')
              .find(
                `[data-direction="${testCases.test_17.propRoutes[1].direction}"]`,
              )
              .should('be.visible')
              .within(() => {
                if (testCaseTransport) {
                  cy.dataCy('button-toggle-transport').should('be.visible');
                  cy.dataCy('section-transport')
                    .find(`[data-value="${testCaseTransport}"]`)
                    .click();
                }
                // input distance if provided
                if (testCaseDistance) {
                  cy.dataCy('section-input-number').should('be.visible');
                  cy.dataCy('section-input-number').find('input').clear();
                  cy.dataCy('section-input-number')
                    .find('input')
                    .type(testCaseDistance);
                }
              });
            // click save button
            cy.dataCy('button-save-bottom').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_17.apiPayload);
            // go to calendar page to confirm saving
            cy.visit(
              '#' + routesConf['routes_calendar']['children']['fullPath'],
            );
            cy.dataCy('routes-calendar').should('be.visible');
            // verify that the first route is saved and updated in the UI
            cy.get(
              `[data-date="${testCases.test_17.propRoutes[0].date}"]`,
            ).find('[data-cy="calendar-item-icon-towork-logged"]');
            cy.get(
              `[data-date="${testCases.test_17.propRoutes[0].date}"]`,
            ).should(
              'contain',
              i18n.global.n(
                testCases.test_17.apiPayload.trips[0].distanceMeters / 1000.0,
                'routeDistanceDecimalNumber',
                defLocale,
              ),
            );
            // verify that the second route is saved and updated in the UI
            cy.get(
              `[data-date="${testCases.test_17.propRoutes[1].date}"]`,
            ).find('[data-cy="calendar-item-icon-fromwork-logged"]');
            cy.get(
              `[data-date="${testCases.test_17.propRoutes[1].date}"]`,
            ).should(
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
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.fixture('apiGetTripsResponseCalendar.json').then((trips) => {
          cy.fixture('apiGetTripsResponseCalendarNext.json').then(
            (tripsNext) => {
              cy.interceptTripsGetApi(config, defLocale, trips, tripsNext);
              cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
              cy.waitForCommuteModeApi();
              cy.dataCy('spinner-route-list-edit').should('be.visible');
              cy.dataCy('spinner-route-list-display').should('be.visible');
              cy.waitForTripsApi(trips, tripsNext);
            },
          );
        });
      });
    });

    it('allows to update an existing route', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.fixture('routeListEditInputTest.json').then((testCases) => {
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
            const testCaseDirection = testCases.test_1.propRoutes[0].direction;
            const testCaseTransport = testCases.test_1.inputValues.transport;
            const testCaseDistance = testCases.test_1.inputValues.distance;
            // wait for routes list to be visible
            cy.dataCy('route-list-edit').should('be.visible');
            // update the route list item
            cy.get(`[data-date="${testCaseDate}"]`)
              .should('be.visible')
              .find(`[data-direction="${testCaseDirection}"]`)
              .should('be.visible')
              .within(() => {
                if (testCaseTransport) {
                  cy.dataCy('button-toggle-transport').should('be.visible');
                  cy.dataCy('section-transport')
                    .find(`[data-value="${testCaseTransport}"]`)
                    .click();
                }
                // input distance if provided
                if (testCaseDistance) {
                  cy.dataCy('section-input-number').should('be.visible');
                  cy.dataCy('section-input-number').find('input').clear();
                  cy.dataCy('section-input-number')
                    .find('input')
                    .type(testCaseDistance);
                }
              });
            // click save button
            cy.dataCy('button-save-bottom').click();
            // wait for API call and verify payload
            cy.waitForPostTripsApi(testCases.test_1.apiPayload);
            // go to calendar page to confirm saving
            cy.visit(
              '#' + routesConf['routes_calendar']['children']['fullPath'],
            );
            cy.dataCy('routes-calendar').should('be.visible');
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
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-list-edit').should('be.visible');
  });
}

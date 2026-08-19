import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { systemTimeLastDayOfCompetitionMay } from '../support/commonTests';
import testDataUploadFile from '../fixtures/routesUploadFileTestData.json';
import { RouteInputType } from '../../../src/components/types/Route';

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
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.fixture('apiGetRegisterChallengeIndividualPaidCompleteStaff').then(
          (responseRegisterChallenge) => {
            cy.interceptRegisterChallengeGetApi(
              config,
              defLocale,
              responseRegisterChallenge,
            );
          },
        );
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        cy.visit('#' + routesConf['home']['path']);
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
        cy.dataCy('routes-page-title').should('be.visible');
        cy.dataCy('spinner-routes-calendar').should('be.visible');
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

    it('show how to log route number play video modal dialog', () => {
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
            // wait for routes calendar to be visible
            cy.dataCy('routes-calendar').should('be.visible');
            // click on the calendar item
            cy.get(`[data-date="${testCaseDate}"]`)
              .find('[data-cy="calendar-item-icon-towork-empty"]')
              .click({ force: true });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            cy.playVideoModalDialog(
              config.urlLogRouteCalendarNumberVideo.split('/').pop(),
              i18n,
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

    it('allows to upload a file and shows notification if file is invalid', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // wait for routes calendar to be visible
          cy.dataCy('routes-calendar').should('be.visible');
          // click on the calendar item to open panel
          cy.get('[data-date="2025-05-20"]')
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          // route calendar panel should be open
          cy.dataCy('route-calendar-panel').should('exist');
          // setup initial state
          cy.dataCy('route-calendar-panel').within(() => {
            // select transport type
            cy.dataCy('button-toggle-transport').should('be.visible');
            cy.dataCy('route-input-transport-type')
              .find('[data-value="bicycle"]')
              .click();
            // select upload file action
            cy.dataCy('select-action').should('be.visible');
            cy.dataCy('select-action').select(
              i18n.global.t('routes.actionUploadFile'),
            );
          });
          // test invalid format
          cy.dataCy('route-calendar-panel').within(() => {
            cy.dataCy('input-file').selectFile(
              'test/cypress/fixtures/route.jpg',
              { force: true },
            );
          });
          cy.contains(
            i18n.global.t('routes.messageFileInvalidFormat', {
              formats: '.gpx, .gz',
            }),
          ).should('be.visible');
          // test file too large
          cy.dataCy('route-calendar-panel').within(() => {
            cy.dataCy('input-file').selectFile(
              'test/cypress/fixtures/routeOverMaxSize.gpx',
              { force: true },
            );
          });
          cy.contains(
            i18n.global.t('routes.messageFileTooLarge', {
              size: `${config.tripMaxFileUploadSizeMegabytes} MB`,
            }),
          ).should('be.visible');
          // test valid file
          cy.dataCy('route-calendar-panel').within(() => {
            cy.dataCy('input-file').selectFile(
              'test/cypress/fixtures/route.gpx',
              { force: true },
            );
          });
          cy.get('.q-notification').should('not.exist');
          // test valid file
          cy.dataCy('route-calendar-panel').within(() => {
            cy.dataCy('input-file').selectFile(
              'test/cypress/fixtures/route.gz',
              {
                force: true,
              },
            );
          });
          cy.get('.q-notification').should('not.exist');
        });
      });
    });
  });

  context('desktop - vacation mode', () => {
    beforeEach(() => {
      cy.clock(new Date(dateWithLoggedRoute), ['Date']);
      cy.get('@config').then((config) => {
        cy.fixture('apiGetCommuteMode').then((commuteModeResponse) => {
          cy.interceptCommuteModeGetApi(config, defLocale, commuteModeResponse);
          cy.interceptTripsGetApi(config, defLocale);
          cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
          cy.dataCy('routes-page-title').should('be.visible');
          cy.waitForCommuteModeApi(commuteModeResponse);
          cy.waitForTripsApi();
        });
      });
    });

    it('allows to mark a day as vacation and save it', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // vacation's earliest selectable date is today (see disabledBefore
          // tests below), so use the frozen "today" date, not a backdated one
          const testCaseDate = '2025-05-26';
          const requestBody = {
            trips: [
              {
                trip_date: testCaseDate,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDate,
                direction: 'trip_from',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
            ],
          };
          const responseBody = {
            trips: requestBody.trips.map((trip, index) => ({
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
          // switch to vacation mode
          cy.dataCy('vacation-mode-toggle').should('be.visible');
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // click both directions individually, same as trip mode
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-empty"]')
            .click({ force: true });
          // route calendar panel should be open with vacation confirmation
          cy.dataCy('route-calendar-panel').should('exist');
          cy.dataCy('text-vacation-confirm')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.vacation.markButton'));
          // click save button
          cy.dataCy('dialog-save-button').click();
          // wait for API call and verify payload
          cy.waitForPostTripsApi(requestBody, responseBody);
          // verify that the day is now displayed as vacation
          cy.get(`[data-date="${testCaseDate}"]`).find(
            '[data-cy="calendar-item-icon-towork-logged"]',
          );
        });
      });
    });

    it('allows selecting multiple days and directions in vacation mode', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // vacation's earliest selectable date is today, so use today and
          // tomorrow rather than backdated dates
          const testCaseDateOne = '2025-05-26';
          const testCaseDateTwo = '2025-05-27';
          const requestBody = {
            trips: [
              {
                trip_date: testCaseDateOne,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDateOne,
                direction: 'trip_from',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDateTwo,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
            ],
          };
          const responseBody = {
            trips: requestBody.trips.map((trip, index) => ({
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
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // select both directions on the first day
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-empty"]')
            .click({ force: true });
          // select only the to-work direction on the second day
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          // panel should reflect all three selected items
          cy.dataCy('dialog-title').should('contain', '3');
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
        });
      });
    });

    it('allows removing multiple already marked vacation days at once', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDateOne = '2025-05-26';
          const testCaseDateTwo = '2025-05-27';
          const markRequestBody = {
            trips: [
              {
                trip_date: testCaseDateOne,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDateOne,
                direction: 'trip_from',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDateTwo,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
            ],
          };
          const markResponseBody = {
            trips: markRequestBody.trips.map((trip, index) => ({
              id: index + 1,
              ...trip,
              durationSeconds: null,
              sourceId: null,
              file: null,
              description: '',
              track: null,
            })),
          };
          cy.interceptPostTripsApi(config, i18n, markResponseBody);
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // mark all three routes as vacation first
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);

          // select the same three (now logged) vacation routes for removal
          const removeRequestBody = {
            trips: markRequestBody.trips.map((trip) => ({
              ...trip,
              commuteMode: 'no_work',
            })),
          };
          const removeResponseBody = {
            trips: removeRequestBody.trips.map((trip, index) => ({
              id: index + 1,
              ...trip,
              durationSeconds: null,
              sourceId: null,
              file: null,
              description: '',
              track: null,
            })),
          };
          cy.interceptPostTripsApi(config, i18n, removeResponseBody);
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-logged"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          // panel should reflect all three selected items and offer removal
          cy.dataCy('dialog-title').should('contain', '3');
          cy.dataCy('text-vacation-confirm')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.vacation.remove'));
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(removeRequestBody, removeResponseBody);
        });
      });
    });

    it('resets selection when mixing empty and already logged routes', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDateLogged = '2025-05-26';
          const testCaseDateEmpty = '2025-05-27';
          const markRequestBody = {
            trips: [
              {
                trip_date: testCaseDateLogged,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
            ],
          };
          const markResponseBody = {
            trips: markRequestBody.trips.map((trip, index) => ({
              id: index + 1,
              ...trip,
              durationSeconds: null,
              sourceId: null,
              file: null,
              description: '',
              track: null,
            })),
          };
          cy.interceptPostTripsApi(config, i18n, markResponseBody);
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // mark one route as vacation first
          cy.get(`[data-date="${testCaseDateLogged}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);

          // select the now-logged vacation route
          cy.get(`[data-date="${testCaseDateLogged}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '1');
          // selecting an empty route afterwards should reset the selection
          // to just the newly clicked (empty) route, not mix the two
          cy.get(`[data-date="${testCaseDateEmpty}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '1');
          cy.dataCy('text-vacation-confirm')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.vacation.markButton'));
        });
      });
    });

    it('blocks logging a trip on routes already marked as vacation', () => {
      cy.get('@i18n').then((i18n) => {
        const testCaseDate = '2025-05-26';
        cy.get('@config').then((config) => {
          const requestBody = {
            trips: [
              {
                trip_date: testCaseDate,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDate,
                direction: 'trip_from',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
            ],
          };
          const responseBody = {
            trips: requestBody.trips.map((trip, index) => ({
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
          // mark day as vacation first
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
          // switch back to trip mode
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.labelTripMode'))
            .click({ force: true });
          // vacation routes are grayed out and unclickable in trip mode
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-display-item"]')
            .first()
            .should('have.css', 'opacity', '0.5');
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-display-item"]')
            .first()
            .click({ force: true });
          cy.dataCy('route-calendar-panel').should('not.exist');
        });
      });
    });

    it('only allows marking vacation from today onward, unlike trip mode backdating', () => {
      cy.get('@i18n').then((i18n) => {
        // clock is frozen at dateWithLoggedRoute = 2025-05-26 ("today")
        const dateToday = '2025-05-26';
        const dateYesterday = '2025-05-25';
        // trip mode allows backdating within the logging window - yesterday
        // is enabled
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // yesterday is now disabled - vacation cannot be backdated
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '0.5');
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('not.exist');
        // today is still enabled - it's the earliest selectable vacation date
        cy.get(`[data-date="${dateToday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        cy.get(`[data-date="${dateToday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        cy.dataCy('text-vacation-confirm')
          .should('be.visible')
          .and('contain', i18n.global.t('routes.vacation.markButton'));
      });
    });
  });

  context('desktop - vacation mode with existing trip', () => {
    beforeEach(() => {
      // freeze "today" on the fixture's trip date - vacation mode's
      // earliest selectable date is today, so it must match the date the
      // fixture already has a trip logged on
      cy.clock(new Date(2025, 4, 25), ['Date']);
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.fixture('apiGetTripsResponseCalendar.json').then((trips) => {
          cy.fixture('apiGetTripsResponseCalendarNext.json').then(
            (tripsNext) => {
              cy.interceptTripsGetApi(config, defLocale, trips, tripsNext);
              cy.visit(
                '#' + routesConf['routes_calendar']['children']['fullPath'],
              );
              cy.dataCy('routes-page-title').should('be.visible');
              cy.waitForCommuteModeApi();
              cy.waitForTripsApi(trips, tripsNext);
            },
          );
        });
      });
    });

    it('blocks marking a route as vacation if a trip is already logged there', () => {
      cy.get('@i18n').then((i18n) => {
        // fixture apiGetTripsResponseCalendar.json already has a trip_to
        // logged on this date (by_foot), trip_from is empty
        const testCaseDate = '2025-05-25';
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // the direction with an existing trip is grayed out and unclickable
        cy.get(`[data-date="${testCaseDate}"]`)
          .find('[data-cy="calendar-item-display-to-work"]')
          .find('[data-cy="calendar-item-display-item"]')
          .should('have.css', 'opacity', '0.5');
        cy.get(`[data-date="${testCaseDate}"]`)
          .find('[data-cy="calendar-item-icon-towork-logged"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('not.exist');
        // the empty direction on the same day can still be marked as vacation
        cy.get(`[data-date="${testCaseDate}"]`)
          .find('[data-cy="calendar-item-icon-fromwork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        cy.dataCy('text-vacation-confirm')
          .should('be.visible')
          .and('contain', i18n.global.t('routes.vacation.markButton'));
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
              cy.dataCy('routes-page-title').should('be.visible');
              cy.dataCy('spinner-routes-calendar').should('be.visible');
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

    // generate tests based on fixture routesCalendarPanelUploadTestData.json
    testDataUploadFile.forEach((testCase) => {
      it(testCase.description, () => {
        cy.get('@i18n').then((i18n) => {
          cy.get('@config').then((config) => {
            // intercept API call with response matching the payload
            const distanceMeters = testCase.apiResponseDistance;
            const apiPayload =
              Cypress.platform === 'win32'
                ? testCase.apiPayloadWin
                : testCase.apiPayload;
            const responseBody = {
              trips: apiPayload.trips.map((trip, index) => ({
                id: index + 1,
                ...trip,
                distanceMeters,
                durationSeconds: null,
                sourceId: null,
                description: '',
                track: null,
              })),
            };
            cy.interceptPostTripsApi(config, i18n, responseBody);
            // for each logged route, click on the calendar field
            testCase.loggedRoutes.forEach((route) => {
              cy.get(`[data-date="${route.date}"]`)
                .find(
                  `[data-cy="calendar-item-icon-${route.direction.toLowerCase()}-${route.state}"]`,
                )
                .click({ force: true });
            });
            // route calendar panel should be open
            cy.dataCy('route-calendar-panel').should('exist');
            testCase.inputValues.forEach((inputValue) => {
              // input transport type
              cy.dataCy('button-toggle-transport').should('be.visible');
              cy.dataCy('route-input-transport-type')
                .find(`[data-value="${inputValue.transport}"]`)
                .click({ force: true });
              if (inputValue.inputType === RouteInputType.uploadFile) {
                // select upload file action
                cy.dataCy('select-action').should('be.visible');
                cy.dataCy('select-action').select(
                  i18n.global.t('routes.actionUploadFile'),
                );
                // upload file
                cy.dataCy('input-file').selectFile(
                  'test/cypress/fixtures/route.gpx',
                  { force: true },
                );
              } else if (inputValue.inputType === RouteInputType.inputNumber) {
                // select input number action
                cy.dataCy('select-action').should('be.visible');
                cy.dataCy('select-action').select(
                  i18n.global.t('routes.actionInputDistance'),
                );
                // input distance
                cy.dataCy('input-distance').should('be.visible');
                cy.dataCy('input-distance').clear();
                cy.dataCy('input-distance').should(($input) => {
                  expect($input.val().replace(',', '.')).to.equal(
                    config.defaultDistanceZero,
                  );
                });
                cy.dataCy('input-distance').type(inputValue.inputValue);
              }
            });
            // for number distance input, verify UI state before submitting
            if (apiPayload.trips[0].distanceMeters) {
              // Divide meters e.g. 10000 by 10 to get the input number without decimal point
              // (e.g. 10.00 -> 1000), because input number use 2 decimal places and length unit is km
              const expectedInputNumbers =
                apiPayload.trips[0].distanceMeters / 10;
              // ensure the distance input contains the expected value
              cy.dataCy('section-input-number')
                .find('input')
                .then(($input) => {
                  expect($input.val().replace(/[,.]/g, '')).to.equal(
                    expectedInputNumbers.toString(),
                  );
                });
            }
            // click save button
            cy.dataCy('dialog-save-button').click();
            // wait for API call and verify payload
            if (Cypress.platform === 'win32') {
              cy.waitForPostTripsApi(testCase.apiPayloadWin);
            } else {
              cy.waitForPostTripsApi(testCase.apiPayload);
            }
            // panel should be closed
            cy.dataCy('route-calendar-panel').should('not.exist');
            // verify that the routes are saved and updated in the UI
            testCase.loggedRoutes.forEach((route) => {
              cy.get(`[data-date="${route.date}"]`).find(
                `[data-cy="calendar-item-icon-${route.direction.toLowerCase()}-logged"]`,
              );
              cy.get(`[data-date="${route.date}"]`).should(
                'contain',
                i18n.global.n(
                  testCase.apiResponseDistance / 1000.0,
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

  context('desktop - last day of competition (may)', () => {
    beforeEach(() => {
      cy.clock(systemTimeLastDayOfCompetitionMay, ['Date']);
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
        cy.dataCy('routes-page-title').should('be.visible');
        cy.dataCy('spinner-routes-calendar').should('be.visible');
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

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

    it('allows marking a whole day as vacation with a single click and saving it', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // first selectable vacation date is tomorrow
          const testCaseDate = '2025-05-27';
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
          // one click selects both directions
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          // route calendar panel should open with vacation option pre-selected
          cy.dataCy('route-calendar-panel').should('exist');
          cy.dataCy('dialog-title').should('contain', '2');
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="vacation"]',
          ).should('exist');
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="no_work"]',
          ).should('exist');
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="bicycle"]',
          ).should('not.exist');
          // label
          cy.dataCy('description-transport').should(
            'contain',
            i18n.global.t('routes.transport.vacation'),
          );
          // click save button
          cy.dataCy('dialog-save-button').click();
          // wait for API call
          cy.waitForPostTripsApi(requestBody, responseBody);
          // verify that the day is logged as vacation
          cy.get(`[data-date="${testCaseDate}"]`).find(
            '[data-cy="calendar-item-icon-towork-logged"]',
          );
        });
      });
    });

    it('allows selecting multiple unmarked days at once', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // first selectable vacation date is tomorrow
          const testCaseDateOne = '2025-05-27';
          const testCaseDateTwo = '2025-05-28';
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
              {
                trip_date: testCaseDateTwo,
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
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // one click selects both directions
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-fromwork-empty"]')
            .click({ force: true });
          // two days = 4 routes selected
          cy.dataCy('dialog-title').should('contain', '4');
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
        });
      });
    });

    it('collapses selection to a single day when an already-logged day is clicked', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDateLogged = '2025-05-27';
          const testCaseDateEmpty = '2025-05-28';
          const markRequestBody = {
            trips: [
              {
                trip_date: testCaseDateLogged,
                direction: 'trip_to',
                commuteMode: 'vacation',
                distanceMeters: 0,
                sourceApplication: config.apiTripsSourceApplicationId,
              },
              {
                trip_date: testCaseDateLogged,
                direction: 'trip_from',
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
          // log one day as vacation
          cy.get(`[data-date="${testCaseDateLogged}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);
          // select the logged day
          cy.get(`[data-date="${testCaseDateLogged}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '2');
          // select empty day (should clear previous selection)
          cy.get(`[data-date="${testCaseDateEmpty}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '2');
          // only empty day has been selected
          cy.get(`[data-date="${testCaseDateLogged}"]`)
            .find('[data-cy="calendar-item-icon-towork-active"]')
            .should('not.exist');
        });
      });
    });

    it('does not allow multi-selecting several already-logged vacation days', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDateOne = '2025-05-27';
          const testCaseDateTwo = '2025-05-28';
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
              {
                trip_date: testCaseDateTwo,
                direction: 'trip_from',
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
          // log both days as vacation
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);
          // select first day
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '2');
          // select second day (should clear previous selection)
          cy.get(`[data-date="${testCaseDateTwo}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('dialog-title').should('contain', '2');
          // first day is not selected
          cy.get(`[data-date="${testCaseDateOne}"]`)
            .find('[data-cy="calendar-item-icon-towork-active"]')
            .should('not.exist');
        });
      });
    });

    it('allows updating a marked vacation to "none" (no_work commute mode)', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDate = '2025-05-27';
          const markRequestBody = {
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
          // mark the day as vacation first
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-empty"]')
            .click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);
          // create updated intercept
          const clearRequestBody = {
            trips: markRequestBody.trips.map((trip) => ({
              ...trip,
              commuteMode: 'no_work',
            })),
          };
          const clearResponseBody = {
            trips: clearRequestBody.trips.map((trip, index) => ({
              id: index + 1,
              ...trip,
              durationSeconds: null,
              sourceId: null,
              file: null,
              description: '',
              track: null,
            })),
          };
          cy.interceptPostTripsApi(config, i18n, clearResponseBody);
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          // verify label
          cy.dataCy('description-transport').should(
            'contain',
            i18n.global.t('routes.transport.vacation'),
          );
          // change trip value to "none"
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="no_work"]',
          ).click({ force: true });
          cy.dataCy('dialog-save-button').click();
          // wait for API call
          cy.waitForPostTripsApi(clearRequestBody, clearResponseBody);
          // allows to keep editing the day
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('route-calendar-panel').should('exist');
        });
      });
    });

    it('does not show vacation transport type toggle button in trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        // trip mode: vacation does not show
        const dateYesterday = '2025-05-25';
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.get(
          '[data-cy="button-toggle-transport"][data-value="vacation"]',
        ).should('not.exist');
        cy.dataCy('dialog-close').click();
        // vacation mode: only vacation/none are shown
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        const testCaseDate = '2025-05-27';
        cy.get(`[data-date="${testCaseDate}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.get('[data-cy="button-toggle-transport"]').should('have.length', 2);
      });
    });

    it('only allows marking vacation from tomorrow onward', () => {
      cy.get('@i18n').then((i18n) => {
        // clock at dateWithLoggedRoute - 2025-05-26
        const dateToday = '2025-05-26';
        const dateTomorrow = '2025-05-27';
        const dateYesterday = '2025-05-25';
        // today is enabled in trip mode
        cy.get(`[data-date="${dateToday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // yesterday is enabled in vacation mode
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        // today is enabled in vacation mode
        cy.get(`[data-date="${dateToday}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        cy.get(`[data-date="${dateToday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        // tomorrow is enabled in vacation mode
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find('[data-cy="calendar-item-display-item"]')
          .first()
          .should('have.css', 'opacity', '1');
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
      });
    });

    it('clears the selection when switching from vacation mode to trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        // select tomorrow in vacation mode
        const dateTomorrow = '2025-05-27';
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        // switch back to trip mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.labelTripMode'))
          .click({ force: true });
        // clears selection
        cy.dataCy('route-calendar-panel').should('not.exist');
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find('[data-cy="calendar-item-icon-towork-active"]')
          .should('not.exist');
        // trip mode allows to log trips
        const dateYesterday = '2025-05-25';
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        cy.get(
          '[data-cy="button-toggle-transport"][data-value="vacation"]',
        ).should('not.exist');
        cy.get(
          '[data-cy="button-toggle-transport"][data-value="bicycle"]',
        ).should('exist');
      });
    });

    it('clears the selection when switching from trip mode to vacation mode', () => {
      cy.get('@i18n').then((i18n) => {
        // select yesterday
        const dateYesterday = '2025-05-25';
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // clears selection
        cy.dataCy('route-calendar-panel').should('not.exist');
        cy.get(`[data-date="${dateYesterday}"]`)
          .find('[data-cy="calendar-item-icon-towork-active"]')
          .should('not.exist');
        // vacation mode allows to log vacations
        const dateTomorrow = '2025-05-27';
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find('[data-cy="calendar-item-icon-towork-empty"]')
          .click({ force: true });
        cy.dataCy('route-calendar-panel').should('exist');
        cy.get(
          '[data-cy="button-toggle-transport"][data-value="bicycle"]',
        ).should('not.exist');
        cy.get(
          '[data-cy="button-toggle-transport"][data-value="vacation"]',
        ).should('exist');
      });
    });
  });

  context('desktop - trip mode with a day already marked as vacation', () => {
    beforeEach(() => {
      cy.clock(new Date(dateWithLoggedRoute), ['Date']);
      cy.get('@config').then((config) => {
        cy.fixture('apiGetCommuteMode').then((commuteModeResponse) => {
          cy.interceptCommuteModeGetApi(config, defLocale, commuteModeResponse);
          // add vacation into the trip mode logging window
          const tripsResponse = {
            count: 2,
            next: null,
            previous: null,
            results: [
              {
                distanceMeters: 0,
                durationSeconds: null,
                commuteMode: 'vacation',
                sourceApplication: 'RTWBB web app',
                trip_date: '2025-05-26',
                sourceId: null,
                file: null,
                description: '',
                id: 5001,
                direction: 'trip_to',
                track: null,
              },
              {
                distanceMeters: 0,
                durationSeconds: null,
                commuteMode: 'vacation',
                sourceApplication: 'RTWBB web app',
                trip_date: '2025-05-26',
                sourceId: null,
                file: null,
                description: '',
                id: 5002,
                direction: 'trip_from',
                track: null,
              },
            ],
          };
          cy.interceptTripsGetApi(config, defLocale, tripsResponse);
          cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
          cy.dataCy('routes-page-title').should('be.visible');
          cy.waitForCommuteModeApi(commuteModeResponse);
          cy.waitForTripsApi(tripsResponse);
        });
      });
    });

    it('allows to change vacation to another transport in trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDate = '2025-05-26';
          const testCaseDistance = '500';
          const requestBody = {
            trips: [
              {
                trip_date: testCaseDate,
                direction: 'trip_to',
                commuteMode: 'bicycle',
                distanceMeters: 5000,
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
          // select vacation trip
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('route-calendar-panel').should('exist');
          // vacation is not offered as a transport option
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="vacation"]',
          ).should('not.exist');
          // save new transport type
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="bicycle"]',
          ).click({ force: true });
          cy.dataCy('section-input-number').should('be.visible');
          cy.dataCy('section-input-number').find('input').clear();
          cy.dataCy('section-input-number')
            .find('input')
            .type(testCaseDistance);
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
        });
      });
    });

    it('allows to change vacation to no_work in trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDate = '2025-05-26';
          const requestBody = {
            trips: [
              {
                trip_date: testCaseDate,
                direction: 'trip_to',
                commuteMode: 'no_work',
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
          cy.get(`[data-date="${testCaseDate}"]`)
            .find('[data-cy="calendar-item-icon-towork-logged"]')
            .click({ force: true });
          cy.dataCy('route-calendar-panel').should('exist');
          cy.get(
            '[data-cy="button-toggle-transport"][data-value="no_work"]',
          ).click({ force: true });
          cy.dataCy('dialog-save-button').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
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

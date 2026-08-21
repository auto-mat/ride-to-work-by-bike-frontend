import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import logRouteFromDayBeforeTestData from '../fixtures/logRouteFromDayBeforeTestData.json';
import testDataUploadFile from '../fixtures/routesUploadFileTestData.json';
import {
  RouteInputType,
  TransportDirection,
} from '../../../src/components/types/Route';

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
        // intercept is user organization admin API
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
        cy.dataCy('index-title').should('be.visible');
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
        cy.dataCy('routes-page-title').should('be.visible');
        cy.dataCy('spinner-route-list-edit').should('be.visible');
        cy.dataCy('spinner-route-list-display').should('be.visible');
        cy.waitForCommuteModeApi();
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

    it('allows to upload a file and shows notification if file is invalid', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // wait for routes list to be visible
          cy.dataCy('route-list-edit').should('be.visible');
          // select and interact with the route item
          cy.get('[data-date="2025-05-20"]')
            .should('be.visible')
            .find('[data-direction="fromWork"]')
            .should('be.visible')
            .then(($routeItem) => {
              // setup initial state
              cy.wrap($routeItem).within(() => {
                // select transport type
                cy.dataCy('button-toggle-transport').should('be.visible');
                cy.dataCy('section-transport')
                  .find('[data-value="bicycle"]')
                  .click();
                // select upload file action
                cy.dataCy('select-action').should('be.visible');
                cy.dataCy('select-action').select(
                  i18n.global.t('routes.actionUploadFile'),
                );
              });
              // test invalid format
              cy.wrap($routeItem).within(() => {
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
              cy.wrap($routeItem).within(() => {
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
              cy.wrap($routeItem).within(() => {
                cy.dataCy('input-file').selectFile(
                  'test/cypress/fixtures/route.gpx',
                  { force: true },
                );
              });
              cy.get('.q-notification').should('not.exist');
              // test valid file
              cy.wrap($routeItem).within(() => {
                cy.dataCy('input-file').selectFile(
                  'test/cypress/fixtures/route.gz',
                  { force: true },
                );
              });
              cy.get('.q-notification').should('not.exist');
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
              cy.dataCy('routes-page-title').should('be.visible');
              cy.dataCy('spinner-route-list-edit').should('be.visible');
              cy.dataCy('spinner-route-list-display').should('be.visible');
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

    // New generated tests
    logRouteFromDayBeforeTestData.forEach((testCase) => {
      it(`${testCase.description}`, () => {
        cy.get('@i18n').then((i18n) => {
          cy.get('@config').then((config) => {
            // intercept API call with response matching the payload
            if (testCase.apiPayload) {
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
              cy.interceptPostTripsApi(config, i18n, responseBody);
            }
            // for each day to log
            testCase.inputValues.daysToLog.forEach((dayToLog) => {
              // find the route by date and direction
              cy.get(`[data-date="${dayToLog.date}"]`)
                .should('be.visible')
                .find(`[data-direction="${dayToLog.direction}"]`)
                .should('be.visible')
                .within(() => {
                  // select transport type
                  if (dayToLog.transport) {
                    cy.dataCy('button-toggle-transport').should('be.visible');
                    cy.dataCy('section-transport')
                      .find(`[data-value="${dayToLog.transport}"]`)
                      .click();
                  }
                  // select copy from yesterday action
                  cy.dataCy('select-action').select(
                    i18n.global.t('routes.actionCopyYesterday'),
                  );
                });
            });
            // click save button
            cy.dataCy('button-save-bottom').click();
            // wait for API call and verify payload if exists
            if (testCase.apiPayload) {
              cy.waitForPostTripsApi(testCase.apiPayload);
            }
            // check notification if exists
            if (testCase.notificationTranslationKey) {
              cy.get('.q-notification').should('be.visible');
              cy.get('.q-notification').should(
                'contain',
                i18n.global.t(testCase.notificationTranslationKey),
              );
            }
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

            // for each logged route, find and edit the route list item
            testCase.loggedRoutes.forEach((route) => {
              cy.get(`[data-date="${route.date}"]`)
                .find(`[data-direction="${route.direction}"]`)
                .within(() => {
                  testCase.inputValues.forEach((inputValue) => {
                    // input transport type
                    cy.dataCy('button-toggle-transport').should('be.visible');
                    cy.dataCy('section-transport')
                      .find(`[data-value="${inputValue.transport}"]`)
                      .click();
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
                    } else if (
                      inputValue.inputType === RouteInputType.inputNumber
                    ) {
                      // select input number action
                      cy.dataCy('select-action').should('be.visible');
                      cy.dataCy('select-action').select(
                        i18n.global.t('routes.actionInputDistance'),
                      );
                      // input distance
                      cy.dataCy('section-input-number').should('be.visible');
                      cy.dataCy('section-input-number').find('input').clear();
                      cy.dataCy('section-input-number')
                        .find('input')
                        .type(inputValue.inputValue);
                    }
                  });
                });
            });
            // click save button
            cy.dataCy('button-save-bottom').click();
            // wait for API call and verify payload
            if (Cypress.platform === 'win32') {
              cy.waitForPostTripsApi(testCase.apiPayloadWin);
            } else {
              cy.waitForPostTripsApi(testCase.apiPayload);
            }
          });
        });
      });
    });
  });

  context('mobile - with logged routes', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
        cy.dataCy('routes-page-title').should('be.visible');
        cy.dataCy('spinner-route-list-edit').should('be.visible');
        cy.dataCy('spinner-route-list-display').should('be.visible');
        cy.waitForCommuteModeApi();
        cy.waitForTripsApi();
      });
    });

    coreTests();

    it('shows floating button that does not overlap with footer', () => {
      cy.dataCy('button-save-sticky').should('be.visible');
      // scroll down to bottom of page
      cy.scrollTo('bottom');
      // check that floating button is visible
      cy.dataCy('button-save-sticky').should('be.visible');
      // spacer element should be visible on the bottom of the page
      cy.dataCy('footer-routes-list-spacer').should('be.visible');
      // check that footer content is not covered by floating button
      cy.dataCy('footer-app-info-mobile').should('be.visible');
      cy.testElementsNoOverlap('footer-app-info-mobile', 'button-save-sticky');
      cy.dataCy('footer-social-menu').should('be.visible');
      cy.testElementsNoOverlap('footer-social-menu', 'button-save-sticky');
      cy.dataCy('language-switcher-footer').should('be.visible');
      cy.testElementsNoOverlap(
        'language-switcher-footer',
        'button-save-sticky',
      );
    });

    it('makes space for floating button in footer on routes list page, but nowhere else', () => {
      // check that spacer element is visible on the bottom of the page
      cy.dataCy('footer-routes-list-spacer').should('be.visible');
      // check that spacer element is not visible on other pages
      cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
      cy.visit('#' + routesConf['routes_app']['children']['fullPath']);
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
      // home
      cy.visit('#' + routesConf['home']['children']['fullPath']);
      cy.dataCy('index-title').should('be.visible');
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
      // results
      cy.visit('#' + routesConf['results']['children']['fullPath']);
      cy.dataCy('results-page-title').should('be.visible');
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
      // prizes
      cy.visit('#' + routesConf['prizes']['children']['fullPath']);
      cy.dataCy('prizes-page-title').should('be.visible');
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
      // profile
      cy.visit('#' + routesConf['profile_details']['children']['fullPath']);
      cy.dataCy('profile-page-title').should('be.visible');
      cy.dataCy('footer-routes-list-spacer').should('not.exist');
    });
  });
  context('desktop - vacation mode', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
        cy.interceptTripsGetApi(config, defLocale);
        cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
        cy.dataCy('routes-page-title').should('be.visible');
        cy.waitForCommuteModeApi();
        cy.waitForTripsApi();
      });
    });

    it('shows the vacation date range from tomorrow to end of challenge', () => {
      cy.get('@i18n').then((i18n) => {
        const dateToday = '2025-05-26';
        const dateTomorrow = '2025-05-27';
        const dateFuture = '2025-05-28';
        const dateCompetitionEnd = '2025-06-01';
        const dateAfterCompetitionEnd = '2025-06-02';
        // future date is not rendered in trip mode
        cy.get(`[data-date="${dateFuture}"]`).should('not.exist');
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // today only exists in trip mode
        cy.get(`[data-date="${dateToday}"]`).should('not.exist');
        // tomorrow through end of competition is rendered
        cy.get(`[data-date="${dateTomorrow}"]`).should('be.visible');
        cy.get(`[data-date="${dateFuture}"]`).should('be.visible');
        cy.get(`[data-date="${dateCompetitionEnd}"]`).should('be.visible');
        // date after competition end is not rendered
        cy.get(`[data-date="${dateAfterCompetitionEnd}"]`).should('not.exist');
      });
    });

    it('orders days chronologically ascending (tomorrow first)', () => {
      cy.get('@i18n').then((i18n) => {
        // most recent date is first, goes into the past
        cy.get('[data-date]')
          .first()
          .should('have.attr', 'data-date', '2025-05-26');
        cy.get('[data-date]')
          .eq(1)
          .should('have.attr', 'data-date', '2025-05-25');
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        // tomorrow is first, goes into the future
        cy.get('[data-date]')
          .first()
          .should('have.attr', 'data-date', '2025-05-27');
        cy.get('[data-date]')
          .eq(1)
          .should('have.attr', 'data-date', '2025-05-28');
      });
    });

    it('shows vacation and no_work transport type toggle buttons, no default', () => {
      cy.get('@i18n').then((i18n) => {
        const testCaseDate = '2025-05-27';
        // switch to vacation mode
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        cy.get(`[data-date="${testCaseDate}"]`)
          .find(`[data-direction="${TransportDirection.toWork}"]`)
          .within(() => {
            cy.get('[data-cy="button-toggle-transport"]').should(
              'have.length',
              2,
            );
            cy.get(
              '[data-cy="button-toggle-transport"][data-value="bicycle"]',
            ).should('not.exist');
            // no default seleciton
            cy.dataCy('description-transport').should(
              'contain',
              i18n.global.t('routes.transport.unknown'),
            );
          });
      });
    });

    it('syncs the update between routes to-work and from-work', () => {
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
          // switch to vacation mode
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          // updating to-work auto-updates from-work
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="vacation"]',
              ).click();
            });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.fromWork}"]`)
            .within(() => {
              cy.dataCy('description-transport').should(
                'contain',
                i18n.global.t('routes.transport.vacation'),
              );
            });
          cy.dataCy('button-save-bottom').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);
          // switch to "no_work"
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
            .find(`[data-direction="${TransportDirection.fromWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="no_work"]',
              ).click();
            });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.dataCy('description-transport').should(
                'contain',
                i18n.global.t('routes.transport.none'),
              );
            });
          cy.dataCy('button-save-bottom').click();
          cy.waitForPostTripsApi(clearRequestBody, clearResponseBody);
        });
      });
    });

    it('does not sync to-work and from-work in trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        const testCaseDate = '2025-05-26';
        cy.get(`[data-date="${testCaseDate}"]`)
          .find(`[data-direction="${TransportDirection.toWork}"]`)
          .within(() => {
            cy.get(
              '[data-cy="button-toggle-transport"][data-value="bicycle"]',
            ).click();
          });
        cy.get(`[data-date="${testCaseDate}"]`)
          .find(`[data-direction="${TransportDirection.fromWork}"]`)
          .within(() => {
            cy.dataCy('description-transport').should(
              'contain',
              i18n.global.t('routes.transport.unknown'),
            );
          });
      });
    });

    it('returns dirty count to zero after updating synced directions and then reverting', () => {
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
          // switch to vacation mode
          cy.dataCy('vacation-mode-toggle')
            .contains(i18n.global.t('routes.vacation.modeToggle'))
            .click({ force: true });
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="vacation"]',
              ).click();
            });
          cy.dataCy('button-save-bottom').click();
          cy.waitForPostTripsApi(markRequestBody, markResponseBody);
          cy.dataCy('button-save-bottom').should('be.disabled');
          // changing to-work logs 2 changes
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="no_work"]',
              ).click();
            });
          cy.dataCy('button-save-bottom').should('not.be.disabled');
          // reverting clears both dirty trips
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="vacation"]',
              ).click();
            });
          cy.dataCy('button-save-bottom').should('be.disabled');
        });
      });
    });

    it('discards an unsaved vacation-mode selection when switching to trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        const dateTomorrow = '2025-05-27';
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        cy.get(`[data-date="${dateTomorrow}"]`)
          .find(`[data-direction="${TransportDirection.toWork}"]`)
          .within(() => {
            cy.get(
              '[data-cy="button-toggle-transport"][data-value="vacation"]',
            ).click();
          });
        cy.dataCy('button-save-bottom').should('not.be.disabled');
        // update is cleared
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.labelTripMode'))
          .click({ force: true });
        cy.dataCy('button-save-bottom').should('be.disabled');
      });
    });

    it('discards an unsaved trip-mode selection when switching to vacation mode', () => {
      cy.get('@i18n').then((i18n) => {
        const dateToday = '2025-05-26';
        cy.get(`[data-date="${dateToday}"]`)
          .find(`[data-direction="${TransportDirection.toWork}"]`)
          .within(() => {
            cy.get(
              '[data-cy="button-toggle-transport"][data-value="bicycle"]',
            ).click();
          });
        cy.dataCy('button-save-bottom').should('not.be.disabled');
        // update is cleared
        cy.dataCy('vacation-mode-toggle')
          .contains(i18n.global.t('routes.vacation.modeToggle'))
          .click({ force: true });
        cy.dataCy('button-save-bottom').should('be.disabled');
      });
    });
  });

  context('desktop - trip mode with a day already marked as vacation', () => {
    beforeEach(() => {
      // add vacation into the trip mode logging window
      cy.get('@config').then((config) => {
        cy.interceptCommuteModeGetApi(config, defLocale);
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
        cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
        cy.dataCy('routes-page-title').should('be.visible');
        cy.waitForCommuteModeApi();
        cy.waitForTripsApi(tripsResponse);
      });
    });

    it('allows to change vacation to another transport in trip mode', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          const testCaseDate = '2025-05-26';
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
          // vacation is not offered as a transport option
          cy.get(`[data-date="${testCaseDate}"]`)
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="vacation"]',
              ).should('not.exist');
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="bicycle"]',
              ).click();
            });
          cy.dataCy('section-input-number').should('be.visible');
          cy.dataCy('section-input-number').find('input').clear();
          cy.dataCy('section-input-number').find('input').type('500');
          cy.dataCy('button-save-bottom').click();
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
            .find(`[data-direction="${TransportDirection.toWork}"]`)
            .within(() => {
              cy.get(
                '[data-cy="button-toggle-transport"][data-value="no_work"]',
              ).click();
            });
          cy.dataCy('button-save-bottom').click();
          cy.waitForPostTripsApi(requestBody, responseBody);
        });
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-list-edit').should('be.visible');
  });
  it('show how to log route number play video modal dialog', () => {
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
          // wait for routes list to be visible
          cy.dataCy('route-list-edit').should('be.visible');
          // update the route list item
          cy.get(`[data-date="${testCaseDate}"]`)
            .should('be.visible')
            .find(`[data-direction="${testCaseDirection}"]`)
            .should('be.visible')
            .within(() => {
              cy.playVideoModalDialog(
                config.urlLogRouteListNumberVideo.split('/').pop(),
                i18n,
                'body',
              );
            });
        });
      });
    });
  });
}

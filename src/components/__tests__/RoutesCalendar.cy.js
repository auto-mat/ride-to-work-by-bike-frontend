import { createPinia, setActivePinia } from 'pinia';
import { date } from 'quasar';
import RoutesCalendar from 'components/routes/RoutesCalendar.vue';
import { i18n } from '../../boot/i18n';
import { useTripsStore } from 'src/stores/trips';
import { useChallengeStore } from 'src/stores/challenge';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// selectors
const classSelectorCurrentDay = '.q-current-day';
const classSelectorFutureDay = '.q-future-day';
const classSelectorHeadWeekday = '.q-calendar-month__head--weekday';
const classSelectorOutsideDay = '.q-outside';
const classSelectorPastDay = '.q-past-day';
const classSelectorPastDayNotDisabled = '.q-past-day:not(.q-disabled-day)';
const dataSelectorButtonSave = '[data-cy="dialog-save-button"]';
const dataSelectorDialogClose = '[data-cy="dialog-close"]';
const dataSelectorDialogHeader = '[data-cy="dialog-header"]';
const dataSelectorInputDistance = '[data-cy="input-distance"]';
const dataSelectorInputTransportType = '[data-cy="route-input-transport-type"]';
const dataSelectorItemFromWork = '[data-cy="calendar-item-display-from-work"]';
const dataSelectorItemFromWorkActive =
  '[data-cy="calendar-item-icon-fromwork-active"]';
const dataSelectorItemFromWorkEmpty =
  '[data-cy="calendar-item-icon-fromwork-empty"]';
const dataSelectorItemFromWorkLogged =
  '[data-cy="calendar-item-icon-fromwork-logged"]';
const dataSelectorItemToWork = '[data-cy="calendar-item-display-to-work"]';
const dataSelectorItemToWorkActive =
  '[data-cy="calendar-item-icon-towork-active"]';
const dataSelectorItemToWorkEmpty =
  '[data-cy="calendar-item-icon-towork-empty"]';
const dataSelectorItemToWorkLogged =
  '[data-cy="calendar-item-icon-towork-logged"]';
const dataSelectorRouteInputDistance = '[data-cy="route-input-distance"]';
const selectorCalendarTitle = 'calendar-title';
const selectorRouteCalendarPanel = 'route-calendar-panel';
const selectorRoutesCalendar = 'routes-calendar';

// variables
const routeCountSingle = 1;
const routeCountMultiple = 2;
const dateWithNoLoggedRoute = new Date(2025, 4, 27);
const dateWithLoggedRoute = new Date(2025, 4, 26);
const dateFirstDayOfCompetition = new Date(2025, 4, 1);
const lastDayOfCompetition = new Date(2025, 4, 31);
const lastDayOfEntryPhase = new Date(2025, 5, 1);

const dayNames = [
  i18n.global.t('time.mondayShort'),
  i18n.global.t('time.tuesdayShort'),
  i18n.global.t('time.wednesdayShort'),
  i18n.global.t('time.thursdayShort'),
  i18n.global.t('time.fridayShort'),
  i18n.global.t('time.saturdayShort'),
  i18n.global.t('time.sundayShort'),
];

describe('<RoutesCalendar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  context('desktop - full logging window', () => {
    beforeEach(() => {
      const now = dateWithNoLoggedRoute;
      cy.clock(new Date(now), ['Date']);
      cy.wrap(now).as('now');
      cy.mount(RoutesCalendar, {
        props: {},
      });
      cy.fixture('routeItemsCalendar.json').then((response) => {
        cy.wrap(useTripsStore()).then((store) => {
          store.setRouteItems(response);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context(
    'desktop - full logging window - current date has a logged route',
    () => {
      beforeEach(() => {
        setActivePinia(createPinia());
        // set default date
        const now = dateWithLoggedRoute;
        cy.clock(new Date(now), ['Date']);
        cy.wrap(now).as('now');
        cy.fixture('routeListCalendar.json').then((response) => {
          cy.mount(RoutesCalendar, {
            props: {
              routes: response,
            },
          });
        });
        cy.fixture('routeItemsCalendar.json').then((response) => {
          cy.wrap(useTripsStore()).then((store) => {
            store.setRouteItems(response);
          });
        });
        // setup store with commute modes
        cy.setupTripsStoreWithCommuteModes(useTripsStore);
        cy.fixture('apiGetThisCampaignMay.json').then((response) => {
          cy.wrap(useChallengeStore()).then((store) => {
            store.setDaysActive(response.results[0].days_active);
            store.setPhaseSet(response.results[0].phase_set);
          });
        });
        cy.viewport('macbook-16');
      });

      it('only allows to select a single logged route', () => {
        // select today's "to work" route (LOGGED)
        cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkActive)
          .should('have.length', 0);
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkActive)
          .should('have.length', 1);
        // select today's "from work" route
        cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
        // only one route should be active
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkActive)
          .should('have.length', 1);
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkActive)
          .should('have.length', 0);
        /**
         * Above tests suffice for a 1-day logging window case.
         * Following tests apply for past days if days_active > 1.
         */
        cy.fixture('apiGetThisCampaignMay.json').then((response) => {
          if (response.results[0].days_active > 1) {
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemToWorkLogged)
              .first()
              .click({ force: true });
            // only one route should be active
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemFromWorkActive)
              .should('have.length', 0);
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemToWorkActive)
              .should('have.length', 1);
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemFromWorkLogged)
              .first()
              .click({ force: true });
            // only one route should be active
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemFromWorkActive)
              .should('have.length', 1);
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemToWorkActive)
              .should('have.length', 0);
            // select today's "to work" route
            cy.get(classSelectorCurrentDay)
              .find(dataSelectorItemToWork)
              .click();
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemFromWorkActive)
              .should('have.length', 0);
            cy.dataCy(selectorRoutesCalendar)
              .find(dataSelectorItemToWorkActive)
              .should('have.length', 1);
          }
        });
      });
    },
  );

  context('desktop - first day of competition - no routes', () => {
    beforeEach(() => {
      cy.clock(new Date(dateFirstDayOfCompetition), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    it('renders one active calendar day to log routes', () => {
      // click on all routes to work
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemToWorkEmpty)
        .each((item) => {
          cy.wrap(item).click({ force: true });
        });
      // should activate exactly 1 route
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemToWorkActive)
        .should('have.length', 1);
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemFromWorkEmpty)
        .each((item) => {
          cy.wrap(item).click({ force: true });
        });
      // should activate exactly 1 route
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemFromWorkActive)
        .should('have.length', 1);
    });
  });

  context('desktop - last day of competition - no routes', () => {
    beforeEach(() => {
      cy.clock(new Date(lastDayOfCompetition), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    it('it allows to select max number of logged routes (not limited by last day)', () => {
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        // click on all routes to work
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkEmpty)
          .each((item) => {
            cy.wrap(item).click({ force: true });
          });
        // max routes that should be active is the logging window
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkActive)
          .should('have.length', response.results[0].days_active);
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkEmpty)
          .each((item) => {
            cy.wrap(item).click({ force: true });
          });
        // max routes that should be active is the logging window
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkActive)
          .should('have.length', response.results[0].days_active);
      });
    });
  });

  context('desktop - last day of entry phase - no routes', () => {
    beforeEach(() => {
      cy.clock(new Date(lastDayOfEntryPhase), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    it('it allows to select days within the intersection of entry phase and logging window', () => {
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        // click on all routes to work
        const dateDiff = date.getDateDiff(
          lastDayOfEntryPhase,
          lastDayOfCompetition,
          'days',
        );
        const maxRoutes = response.results[0].days_active - dateDiff;
        // we are on the first day of month so we need to go back one month
        cy.dataCy('calendar-navigation-previous-button').click();
        // click on all routes to work
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkEmpty)
          .each((item) => {
            cy.wrap(item).click({ force: true });
          });
        // max routes that should be active
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkActive)
          .should('have.length', maxRoutes);
        // click on all routes from work
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkEmpty)
          .each((item) => {
            cy.wrap(item).click({ force: true });
          });
        // max routes that should be active
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkActive)
          .should('have.length', maxRoutes);
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorRoutesCalendar).should('be.visible');
  });

  it('renders top title with month and year', () => {
    cy.get('@now').then((now) => {
      const locale = i18n.global.locale;
      const month = now.toLocaleString(locale, { month: 'long' });
      const year = now.toLocaleString(locale, { year: 'numeric' });
      const title = `${month} ${year}`;

      cy.dataCy(selectorCalendarTitle)
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', title);
    });
  });

  it('renders localized day names', () => {
    cy.get(classSelectorHeadWeekday)
      .should('be.visible')
      .each((element, index) => {
        cy.wrap(element).should('contain', dayNames[index]);
      });
  });

  // Each calendar day contains two routes
  it('renders two routes for each past day', () => {
    // check dates in the past
    cy.get(classSelectorPastDay)
      .find(dataSelectorItemToWork)
      .should('be.visible');
    cy.get(classSelectorPastDay)
      .find(dataSelectorItemFromWork)
      .should('be.visible');
    // no routes for future dates
    cy.get(classSelectorFutureDay)
      .find(dataSelectorItemToWork)
      .should('not.exist');
  });

  // First route of the current date is active
  it('renders inactive routes by default', () => {
    // check for active background
    checkTodayToWorkInactive();
    checkTodayFromWorkInactive();
  });

  it('allows to select multiple routes', () => {
    // select today's "to work" route
    cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
    // select today's "from work" route
    cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
    // both today's routes are active
    checkTodayFromWorkActive();
    checkTodayToWorkActive();
    /**
     * Above tests suffice for a 1-day logging window case.
     * Following tests apply for past days if days_active > 1.
     */
    cy.fixture('apiGetThisCampaignMay.json').then((response) => {
      if (response.results[0].days_active > 1) {
        // select a past day's to work route
        cy.get(classSelectorPastDayNotDisabled)
          .first()
          .find(dataSelectorItemFromWork)
          .click();
        // from work is active
        checkTodayToWorkActive();
        checkTodayFromWorkActive();
        checkPastDayToWorkActive();
        // disable today's "to work" route
        cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
        checkTodayToWorkInactive();
        checkTodayFromWorkActive();
        checkPastDayToWorkActive();
        // disable today's "from work" route
        cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
        checkTodayToWorkInactive();
        checkTodayFromWorkInactive();
        checkPastDayToWorkActive();
        // disable a past day's to work route
        cy.get(classSelectorPastDayNotDisabled)
          .first()
          .find(dataSelectorItemFromWork)
          .click();
        checkTodayToWorkInactive();
        checkTodayFromWorkInactive();
        checkPastDayToWorkInactive();
      }
    });
  });

  it('does not allow to select a day outside current month', () => {
    // click on outside date
    cy.get(classSelectorOutsideDay)
      .find(dataSelectorItemToWork)
      .first()
      .click();
    // date should not be active
    cy.get(classSelectorOutsideDay)
      .find(dataSelectorItemToWork)
      .first()
      .find(dataSelectorItemToWorkActive)
      .should('not.exist');
  });

  it('it allows to select max number of logged routes', () => {
    cy.fixture('apiGetThisCampaignMay.json').then((response) => {
      // click on all routes to work
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemToWorkEmpty)
        .each((item) => {
          cy.wrap(item).click({ force: true });
        });
      // max routes that should be active is the logging window
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemToWorkActive)
        .should('have.length.at.most', response.results[0].days_active);
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemFromWorkEmpty)
        .each((item) => {
          cy.wrap(item).click({ force: true });
        });
      // max routes that should be active is the logging window
      cy.dataCy(selectorRoutesCalendar)
        .find(dataSelectorItemFromWorkActive)
        .should('have.length.at.most', response.results[0].days_active);
    });
  });

  it('renders panel with dynamic heading if routes are selected', () => {
    cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
    // Note: cy.dataCy(selectorRouteCalendarPanel) is "not visible" because of its CSS properties.
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('routes.titleBottomPanel', routeCountSingle, {
          count: routeCountSingle,
        }),
      );
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorInputTransportType)
      .should('be.visible');
    cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('routes.titleBottomPanel', routeCountMultiple, {
          count: routeCountMultiple,
        }),
      );
    cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
    cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('not.be.visible');
  });

  it('renders inputs and allows saving when value is entered', () => {
    cy.fixture('routeCalendarInputTest.json').then((testData) => {
      cy.get(`[data-date="${testData.test_1.inputValues.date}"]`)
        .find(dataSelectorItemToWork)
        .click();
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorDialogHeader)
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('routes.titleBottomPanel', routeCountSingle, {
            count: routeCountSingle,
          }),
        );
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorInputTransportType)
        .should('be.visible');
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorRouteInputDistance)
        .should('be.visible');
      // save disabed
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorButtonSave)
        .should('be.visible')
        .and('be.disabled');
      // fill in distance
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorInputDistance)
        .should('be.visible')
        .focus();
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorInputDistance)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorInputDistance)
        .should('be.visible')
        .type(testData.test_1.inputValues.distance);
      // save enabled
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorButtonSave)
        .should('not.be.disabled');
      // intercept API call with response matching the payload
      cy.interceptPostTripsApi(
        rideToWorkByBikeConfig,
        i18n,
        testData.test_1.responseBody,
      );
      // save
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorButtonSave)
        .click();
      // panel is closed
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorDialogHeader)
        .should('not.be.visible');
    });
  });

  it('allows to manually close panel and reopen on interaction', () => {
    cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
    // show panel with 1 route
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('routes.titleBottomPanel', routeCountSingle, {
          count: routeCountSingle,
        }),
      );
    // close button
    cy.dataCy(selectorRouteCalendarPanel).find(dataSelectorDialogClose).click();
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('not.be.visible');
    // select new route
    cy.get(classSelectorCurrentDay).find(dataSelectorItemFromWork).click();
    // show panel with 2 routes
    cy.dataCy(selectorRouteCalendarPanel)
      .find(dataSelectorDialogHeader)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('routes.titleBottomPanel', routeCountMultiple, {
          count: routeCountMultiple,
        }),
      );
  });
}

function checkTodayToWorkActive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkActive)
    .should('be.visible');
}

function checkTodayFromWorkActive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkActive)
    .should('be.visible');
}

function checkPastDayToWorkActive() {
  cy.get(classSelectorPastDayNotDisabled)
    .first()
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkActive)
    .should('be.visible');
}

function checkTodayToWorkInactive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkEmpty)
    .should('be.visible');
}

function checkTodayFromWorkInactive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkEmpty)
    .should('be.visible');
}

function checkPastDayToWorkInactive() {
  cy.get(classSelectorPastDayNotDisabled)
    .first()
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkEmpty)
    .should('be.visible');
}

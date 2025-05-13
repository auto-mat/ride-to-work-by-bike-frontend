import { createPinia, setActivePinia } from 'pinia';
import { date } from 'quasar';
import RoutesCalendar from 'components/routes/RoutesCalendar.vue';
import { i18n } from '../../boot/i18n';
import { useTripsStore } from 'src/stores/trips';
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { systemTimeLastDayOfCompetitionMay } from '../../../test/cypress/support/commonTests';

// selectors
const classSelectorCurrentDay = '.q-current-day';
const classSelectorHeadWeekday = '.q-calendar-month__head--weekday';
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
const dateSeptemberWithNoLoggedRoute = new Date(2024, 8, 27);
// see apiGetThisCampaignMay.json for phase dates
const dateMayWithNoLoggedRoute = new Date(2025, 4, 27);
const dateMayWithLoggedRoute = new Date(2025, 4, 26);
const dateMayFirstDayOfCompetition = new Date(2025, 4, 1);
const lastMayDayOfEntryPhase = new Date(2025, 5, 3);

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
      const now = dateMayWithNoLoggedRoute;
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
      // setup store with register challenge team approval status
      cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
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
        const now = dateMayWithLoggedRoute;
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
        // setup store with register challenge team approval status
        cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
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
      cy.clock(new Date(dateMayFirstDayOfCompetition), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with register challenge team approval status
      cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
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

  context('desktop - last day of competition (september) - no routes', () => {
    beforeEach(() => {
      cy.clock(new Date(dateSeptemberWithNoLoggedRoute), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with register challenge team approval status
      cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    it('it allows to select max number of logged routes (not limited by last day)', () => {
      cy.fixture('apiGetThisCampaign.json').then((response) => {
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
      cy.clock(new Date(lastMayDayOfEntryPhase), ['Date']);
      cy.mount(RoutesCalendar, {
        props: {
          routes: [],
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      // setup store with register challenge team approval status
      cy.setupRegisterChallengeTeamApprovalStatus(useRegisterChallengeStore);
      // setup store with challenge data
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      cy.viewport('macbook-16');
    });

    it('allows to select days within the intersection of entry phase and logging window', () => {
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        // click on all routes to work
        const dateDiff = date.getDateDiff(
          lastMayDayOfEntryPhase,
          systemTimeLastDayOfCompetitionMay,
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
  it('renders two routes for each day of the challenge phase', () => {
    cy.fixture('apiGetThisCampaignMay.json').then((response) => {
      // get competition phase from and to
      const competitionPhaseFrom = response.results[0].phase_set.find(
        (phase) => phase.phase_type === 'competition',
      ).date_from;
      const competitionPhaseTo = response.results[0].phase_set.find(
        (phase) => phase.phase_type === 'competition',
      ).date_to;
      const competitionPhaseFromDate = new Date(competitionPhaseFrom);
      const competitionPhaseToDate = new Date(competitionPhaseTo);
      // include from and to dates of competition phase
      const dateOneDayBeforeFrom = date.subtractFromDate(
        competitionPhaseFromDate,
        { days: 1 },
      );
      const dateOneDayAfterTo = date.addToDate(competitionPhaseToDate, {
        days: 1,
      });
      // for each calendar day, check that it belongs to competition phase
      cy.dataCy('calendar-day').each((element) => {
        // find element with data-date attribute
        const dayDate = element.attr('data-date');
        // check that date is between competition phase from and to including
        const isInCompetitionPhase = date.isBetweenDates(
          dayDate,
          dateOneDayBeforeFrom,
          dateOneDayAfterTo,
        );
        cy.wrap(isInCompetitionPhase).should('be.true');
        // check that day has two routes
        cy.wrap(element).within(() => {
          cy.get(dataSelectorItemToWork).should('be.visible');
          cy.get(dataSelectorItemFromWork).should('be.visible');
        });
      });
    });
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
    cy.get('[data-date="2025-06-01"]')
      .find(dataSelectorItemToWork)
      .first()
      .click();
    // date should not be active
    cy.get('[data-date="2025-06-01"]')
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

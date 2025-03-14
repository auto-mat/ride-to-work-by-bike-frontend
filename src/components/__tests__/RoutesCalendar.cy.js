import { createPinia, setActivePinia } from 'pinia';
import RoutesCalendar from 'components/routes/RoutesCalendar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { useTripsStore } from 'src/stores/trips';

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
const { challengeLoggingWindowDays } = rideToWorkByBikeConfig;

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

  context('desktop - fixed date', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // set default date
      const now = new Date(2024, 5, 17);
      cy.clock(now);
      cy.wrap(now).as('now');
      cy.mount(RoutesCalendar, {
        props: {},
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - fixed date logged route today', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // set default date
      const now = new Date(2024, 5, 16);
      cy.clock(now);
      cy.wrap(now).as('now');
      cy.mount(RoutesCalendar, {
        props: {},
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
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
       * Following tests apply for past days if challengeLoggingWindowDays > 1.
       */
      if (challengeLoggingWindowDays > 1) {
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
        cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemFromWorkActive)
          .should('have.length', 0);
        cy.dataCy(selectorRoutesCalendar)
          .find(dataSelectorItemToWorkActive)
          .should('have.length', 1);
      }
    });
  });

  context('desktop - current date', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // skipping the cy.clock call, as it breaks the interaction with q-dialog
      cy.mount(RoutesCalendar, {
        props: {},
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
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
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorRouteInputDistance)
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
      cy.get(classSelectorCurrentDay).find(dataSelectorItemToWork).click();
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
        .type('10');
      // save enabled
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorButtonSave)
        .should('not.be.disabled');
      // save
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorButtonSave)
        .click();
      // panel is closed
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorDialogHeader)
        .should('not.be.visible');
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
      cy.dataCy(selectorRouteCalendarPanel)
        .find(dataSelectorDialogClose)
        .click();
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
     * Following tests apply for past days if challengeLoggingWindowDays > 1.
     */
    if (challengeLoggingWindowDays > 1) {
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
    // click on all routes to work
    cy.dataCy(selectorRoutesCalendar)
      .find(dataSelectorItemToWorkEmpty)
      .each((item) => {
        cy.wrap(item).click({ force: true });
      });
    // max routes that should be active is the logging window from config
    cy.dataCy(selectorRoutesCalendar)
      .find(dataSelectorItemToWorkActive)
      .should('have.length.at.most', challengeLoggingWindowDays);
    cy.dataCy(selectorRoutesCalendar)
      .find(dataSelectorItemFromWorkEmpty)
      .each((item) => {
        cy.wrap(item).click({ force: true });
      });
    // max routes that should be active is the logging window from config
    cy.dataCy(selectorRoutesCalendar)
      .find(dataSelectorItemFromWorkActive)
      .should('have.length.at.most', challengeLoggingWindowDays);
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

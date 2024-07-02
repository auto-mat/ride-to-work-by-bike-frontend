import RoutesCalendar from 'components/routes/RoutesCalendar.vue';
import { i18n } from '../../boot/i18n';

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

  context('desktop', () => {
    beforeEach(() => {
      // set default date
      const now = new Date(2024, 5, 17);
      cy.clock(now);
      cy.wrap(now).as('now');
      cy.mount(RoutesCalendar, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  // TODO: Responsive version (option to use mini-mode) https://qcalendar.netlify.app/developing/qcalendarmonth-minimode/minimode-getting-started
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-calendar').should('be.visible');
  });

  it('renders top title with month and year', () => {
    cy.get('@now').then((now) => {
      const locale = i18n.global.locale;
      const month = now.toLocaleString(locale, { month: 'long' });
      const year = now.toLocaleString(locale, { year: 'numeric' });
      const title = `${month} ${year}`;

      cy.dataCy('calendar-title')
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', title);
    });
  });

  it('renders localized day names', () => {
    cy.get('.q-calendar-month__head--weekday')
      .should('be.visible')
      .each((element, index) => {
        cy.wrap(element).should('contain', dayNames[index]);
      });
  });

  // Each calendar day contains two routes
  it('renders two routes for each past day', () => {
    // check dates in the past
    cy.get('.q-past-day')
      .find('[data-cy="calendar-item-display-to-work"]')
      .should('be.visible');
    cy.get('.q-past-day')
      .find('[data-cy="calendar-item-display-from-work"]')
      .should('be.visible');
    // no routes for future dates
    cy.get('.q-future-day')
      .find('[data-cy="calendar-item-display-to-work"]')
      .should('not.exist');
  });

  // First route of the current date is active
  it('renders default active route', () => {
    // check for active background
    cy.get('.q-current-day')
      .find('[data-cy="calendar-item-display-to-work"]')
      .find('[data-cy="calendar-item-icon-towork-active"]')
      .should('be.visible');
  });

  it('allows to switch active route', () => {
    // switch to today from work
    cy.get('.q-current-day')
      .find('[data-cy="calendar-item-display-from-work"]')
      .click();
    // today from work is active
    cy.get('.q-current-day')
      .find('[data-cy="calendar-item-display-from-work"]')
      .find('[data-cy="calendar-item-icon-fromwork-active"]')
      .should('be.visible');
    cy.dataCy('calendar-day');
    // switch to a past day within the current month
    cy.get('.q-past-day')
      .find('[data-cy="calendar-item-display-to-work"]')
      .first()
      .click();
    // from work is active
    cy.get('.q-past-day')
      .find('[data-cy="calendar-item-display-to-work"]')
      .first()
      .find('[data-cy="calendar-item-icon-towork-active"]')
      .should('be.visible');
  });
}

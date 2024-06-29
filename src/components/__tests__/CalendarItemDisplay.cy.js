import { colors } from 'quasar';
import CalendarItemDisplay from 'components/routes/CalendarItemDisplay.vue';

const { getPaletteColor } = colors;

const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

describe('<CalendarItemDisplay>', () => {
  context('toWork - logged active', () => {
    beforeEach(() => {
      cy.fixture('routeListCalendar').then((routeList) => {
        const day = routeList[0];
        cy.wrap(day).as('day');
        cy.mount(CalendarItemDisplay, {
          props: {
            active: true,
            direction: 'toWork',
            day,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    loggedTests({ active: true, direction: 'toWork' });
  });

  context('toWork - empty active', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          active: true,
          direction: 'toWork',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    emptyTests({ active: true });
  });

  context('toWork - logged', () => {
    beforeEach(() => {
      cy.fixture('routeListCalendar').then((routeList) => {
        const day = routeList[0];
        cy.wrap(day).as('day');
        cy.mount(CalendarItemDisplay, {
          props: {
            direction: 'toWork',
            day,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    loggedTests({ active: false, direction: 'toWork' });
  });

  context('toWork - empty', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          direction: 'toWork',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    emptyTests({ active: false });
  });

  context('fromWork - logged active', () => {
    beforeEach(() => {
      cy.fixture('routeListCalendar').then((routeList) => {
        const day = routeList[0];
        cy.wrap(day).as('day');
        cy.mount(CalendarItemDisplay, {
          props: {
            active: true,
            direction: 'fromWork',
            day,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();

    loggedTests({ active: true, direction: 'fromWork' });
  });

  context('fromWork - empty active', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          active: true,
          direction: 'fromWork',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    emptyTests({ active: true });
  });

  context('fromWork - logged', () => {
    beforeEach(() => {
      cy.fixture('routeListCalendar').then((routeList) => {
        const day = routeList[0];
        cy.wrap(day).as('day');
        cy.mount(CalendarItemDisplay, {
          props: {
            direction: 'fromWork',
            day,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    loggedTests({ active: false, direction: 'fromWork' });
  });

  context('fromWork - empty', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          direction: 'fromWork',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    emptyTests({ active: false });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('calendar-item-display').should('be.visible');
    // snapshot
    cy.dataCy('calendar-item-display').then((element) => {
      cy.wrap(element).matchImageSnapshot({
        name: `calendar-item-display-${Cypress.currentTest.titlePath[0]}`,
      });
    });
  });
}

function loggedTests({ active, direction }) {
  it('renders transport type', () => {
    // icon transport
    cy.dataCy('calendar-item-icon-transport')
      .should('have.color', active ? white : primary)
      .and('have.css', 'font-size', '18px');
    // distance
  });

  it('renders distance', () => {
    cy.get('@day').then((day) => {
      console.log(day[direction].distance);
      cy.dataCy('calendar-item-distance')
        .should('be.visible')
        .and('have.color', active ? white : primary)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('contain', `${day[direction].distance} km`);
    });
  });
}

function emptyTests({ active }) {
  it('renders plus icon', () => {
    cy.dataCy('calendar-item-icon-plus')
      .should('have.color', active ? white : primary)
      .and('have.css', 'font-size', '18px');
  });
}

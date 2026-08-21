import { colors } from 'quasar';
import CalendarItemDisplay from 'components/routes/CalendarItemDisplay.vue';
import { i18n } from '../../boot/i18n';
import { TransportDirection } from '../../../src/components/types/Route';

const { getPaletteColor } = colors;

const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

const day = {
  id: '10001',
  date: '2025-05-24',
  toWork: {
    id: '00001',
    date: '2025-05-24',
    transport: 'vacation',
    distance: '0.00',
    direction: 'toWork',
  },
  fromWork: {
    id: '00002',
    date: '2025-05-24',
    transport: 'vacation',
    distance: '0.00',
    direction: 'fromWork',
  },
};

describe('<CalendarItemDisplay>', () => {
  context('toWork - logged active', () => {
    beforeEach(() => {
      cy.fixture('routeListCalendar').then((routeList) => {
        const day = routeList[0];
        cy.wrap(day).as('day');
        cy.mount(CalendarItemDisplay, {
          props: {
            active: true,
            direction: TransportDirection.toWork,
            day,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    loggedTests({ active: true, direction: TransportDirection.toWork });
  });

  context('toWork - empty active', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          active: true,
          direction: TransportDirection.toWork,
        },
      });
      cy.viewport('iphone-6');
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
            direction: TransportDirection.toWork,
            day,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    loggedTests({ active: false, direction: TransportDirection.toWork });
  });

  context('toWork - empty', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          direction: TransportDirection.toWork,
        },
      });
      cy.viewport('iphone-6');
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
            direction: TransportDirection.fromWork,
            day,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();

    loggedTests({ active: true, direction: TransportDirection.fromWork });
  });

  context('fromWork - empty active', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          active: true,
          direction: TransportDirection.fromWork,
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
            direction: TransportDirection.fromWork,
            day,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    loggedTests({ active: false, direction: TransportDirection.fromWork });
  });

  context('fromWork - empty', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          direction: TransportDirection.fromWork,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    emptyTests({ active: false });
  });

  context('toWork - vacation logged', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          direction: TransportDirection.toWork,
          day,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders vacation background and icon', () => {
      cy.dataCy('calendar-item-icon-towork-logged')
        .should('be.visible')
        .and('have.color', getPaletteColor('positive'));
      cy.dataCy('calendar-item-icon-transport').should('be.visible');
      // distance is empty for vacation entries (0 distance)
      cy.dataCy('calendar-item-distance').should('have.text', '');
    });
  });

  context('toWork - vacation logged active', () => {
    beforeEach(() => {
      cy.mount(CalendarItemDisplay, {
        props: {
          active: true,
          direction: TransportDirection.toWork,
          day,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders selected background and icon same as other transport types', () => {
      cy.dataCy('calendar-item-icon-towork-active')
        .should('be.visible')
        .and('have.color', primary);
      cy.dataCy('calendar-item-icon-transport')
        .should('be.visible')
        .and('have.color', white);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('calendar-item-display').should('be.visible');
    // snapshot

    cy.dataCy('calendar-item-display').then((element) => {
      cy.wrap(element).matchImageSnapshot({
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
        timeout: 4000,
        customDiffConfig: { threshold: 0.4 },
        screenshotsFolder: 'test/cypress/snapshots',
        retries: 2,
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
      cy.dataCy('calendar-item-distance')
        .should('be.visible')
        .and('have.color', active ? white : primary)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and(
          'contain',
          `${i18n.global.n(parseFloat(day[direction].distance), 'routeDistanceDecimalNumber')}` +
            ` ${i18n.global.t('global.routeLengthUnit')}`,
        );
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

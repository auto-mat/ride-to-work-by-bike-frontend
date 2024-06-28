import CalendarItemDisplay from 'components/routes/CalendarItemDisplay.vue';

describe('<CalendarItemDisplay>', () => {
  context('toWork - active', () => {
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

    it('renders transport type', () => {
      cy.dataCy('calendar-item-icon-transport').should('be.visible');
      // TODO: test icon
    });

    it('renders distance', () => {
      cy.get('@day').then((day) => {
        cy.dataCy('calendar-item-distance')
          .should('be.visible')
          .and('contain', `${day.toWork.distance} km`);
      });
    });
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

    it('renders plus icon', () => {
      cy.dataCy('calendar-item-icon-plus').should('be.visible');
      // TODO: test icon
    });
  });

  context('fromWork - active', () => {
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
        cy.viewport('iphone-6');
      });
    });

    coreTests();

    it('renders distance', () => {
      cy.get('@day').then((day) => {
        cy.dataCy('calendar-item-distance')
          .should('be.visible')
          .and('contain', `${day.fromWork.distance} km`);
      });
    });
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
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('calendar-item-display').should('be.visible');
    // TODO: snapshot
    // cy.dataCy('calendar-item-display').then((element) => {
    //   cy.wrap(element).matchImageSnapshot({
    //     name: `calendar-item-display-${Cypress.currentTest.titlePath[0]}`,
    //   });
    // })
  });
}

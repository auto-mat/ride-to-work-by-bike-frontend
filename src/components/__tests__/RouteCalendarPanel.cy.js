import { colors } from 'quasar';
import RouteCalendarPanel from 'components/routes/RouteCalendarPanel.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorDialogCard = 'dialog-card';
const selectorDialogTitle = 'dialog-title';
const selectorDialogSaveButton = 'dialog-save-button';
const selectorRouteCalendarPanel = 'route-calendar-panel';
const selectorRouteInputDistance = 'route-input-distance';
const selectorRouteInputTransportType = 'route-input-transport-type';
const selectorSectionDistance = 'section-distance';
const selectorSectionTransport = 'section-transport';

describe('<RouteCalendarPanel>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['titleBottomPanel', 'titleBottomPanelNoRoutes'],
      'routes',
      i18n,
    );
  });

  context('desktop - logged route', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((listRoutes) => {
        const routes = [listRoutes[0]];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - empty route', () => {
    beforeEach(() => {
      cy.fixture('routeEmpty').then((routeEmpty) => {
        const routes = [routeEmpty];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    unloggedRouteTests();
  });

  context('desktop - multiple routes', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    unloggedRouteTests();
  });

  context('mobile - one route', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((listRoutes) => {
        const routes = [listRoutes[0]];
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
  });

  context('mobile - multiple routes', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.wrap(routes).as('routes');
        cy.mount(RouteCalendarPanel, {
          props: {
            modelValue: true,
            routes,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    mobileTests();
    unloggedRouteTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.get('@routes').then((routes) => {
      cy.dataCy(selectorRouteCalendarPanel).should('be.visible');
      cy.dataCy(selectorDialogTitle)
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('routes.titleBottomPanel', routes.length, {
            count: routes.length,
          }),
        );
      cy.dataCy(selectorSectionDistance).should('be.visible');
      cy.dataCy(selectorSectionTransport).should('be.visible');
      cy.dataCy(selectorRouteInputDistance).should('be.visible');
      cy.dataCy(selectorRouteInputTransportType).should('be.visible');
    });
  });
}

function unloggedRouteTests() {
  it('renders disabled button by default', () => {
    cy.dataCy(selectorDialogSaveButton).should('be.visible').and('be.disabled');
  });
}

function mobileTests() {
  it('renders panel full width', () => {
    cy.dataCy(selectorDialogCard)
      .should('be.visible')
      .invoke('width')
      .then((width) => {
        // should be 100% of viewport
        expect(width).to.equal(window.innerWidth);
      });
    cy.testElementPercentageWidth(cy.dataCy(selectorSectionDistance), 100);
    cy.testElementPercentageWidth(cy.dataCy(selectorSectionTransport), 100);
  });
}

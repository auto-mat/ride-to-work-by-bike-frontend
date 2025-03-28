import { createPinia, setActivePinia } from 'pinia';
import RouteTabs from 'components/routes/RouteTabs.vue';
import { i18n } from '../../boot/i18n';
import { routesConf } from 'src/router/routes_conf';
import { useChallengeStore } from '../../../src/stores/challenge';
import { useTripsStore } from '../../../src/stores/trips';
import { systemTimeLoggingRoutes } from '../../../test/cypress/support/commonTests';

describe('<RouteTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['tabCalendar', 'tabList', 'tabMap', 'tabApp'],
      'routes',
      i18n,
    );
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.clock(systemTimeLoggingRoutes, ['Date']);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {},
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - hidden tabs', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {
          hidden: ['map', 'app'],
        },
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    it('does not render tabs or panels marked as hidden', () => {
      cy.dataCy('route-tabs-button-map').should('not.exist');
      cy.dataCy('route-tabs-button-app').should('not.exist');
      cy.dataCy('route-tabs-panel-map').should('not.exist');
      cy.dataCy('route-tabs-panel-app').should('not.exist');
    });

    it('renders tabs and panels not marked as hidden', () => {
      cy.dataCy('route-tabs-button-calendar').click();
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');
      cy.dataCy('route-tabs-button-list').click();
      cy.dataCy('route-tabs-panel-list').should('be.visible');
    });
  });

  context('desktop - locked tabs', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {
          locked: ['map', 'app'],
        },
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    it('renders tabs as locked', () => {
      cy.dataCy('route-tabs-button-map')
        .find('i')
        .should('have.class', 'mdi-lock');
      cy.dataCy('route-tabs-button-app')
        .find('i')
        .should('have.class', 'mdi-lock');
    });

    it('does not switch to locked tab', () => {
      cy.dataCy('route-tabs-button-calendar').click();
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');

      cy.dataCy('route-tabs-button-map').click();
      cy.dataCy('route-tabs-panel-map').should('not.exist');
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');

      cy.dataCy('route-tabs-button-app').click();
      cy.dataCy('route-tabs-panel-app').should('not.exist');
      cy.dataCy('route-tabs-panel-calendar').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {},
      });
      cy.fixture('apiGetThisCampaignMay.json').then((response) => {
        cy.wrap(useChallengeStore()).then((store) => {
          store.setDaysActive(response.results[0].days_active);
          store.setPhaseSet(response.results[0].phase_set);
        });
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-tabs').should('be.visible');
    cy.dataCy('route-tabs-button-calendar').and(
      'contain',
      i18n.global.t('routes.tabCalendar'),
    );
    cy.dataCy('route-tabs-button-list').and(
      'contain',
      i18n.global.t('routes.tabList'),
    );
    cy.dataCy('route-tabs-button-map').and(
      'contain',
      i18n.global.t('routes.tabMap'),
    );
    cy.dataCy('route-tabs-button-app').and(
      'contain',
      i18n.global.t('routes.tabApp'),
    );

    cy.dataCy('route-tabs-button-calendar').click();
    cy.dataCy('route-tabs-panel-calendar').should('be.visible');
    cy.dataCy('route-tabs-panel-list').should('not.exist');
    cy.dataCy('route-tabs-panel-map').should('not.exist');
    cy.dataCy('route-tabs-panel-app').should('not.exist');
  });

  it('allows to switch tabs', () => {
    cy.dataCy('route-tabs-button-list').click();
    cy.dataCy('route-tabs-panel-list').should('be.visible');
    // test panel content
    cy.dataCy('route-list-edit').should('be.visible');
    cy.dataCy('route-list-display').should('be.visible');

    cy.dataCy('route-tabs-button-map').click();
    cy.dataCy('route-tabs-panel-map').should('be.visible');

    cy.dataCy('route-tabs-button-app').click();
    cy.dataCy('route-tabs-panel-app').should('be.visible');
    // test panel content
    cy.dataCy('routes-apps').should('be.visible');

    cy.dataCy('route-tabs-button-calendar').click();
    cy.dataCy('route-tabs-panel-calendar').should('be.visible');
  });

  it('syncs tab navigation with URL', () => {
    // initial state
    cy.url().should('include', routesConf['routes_calendar'].path);
    // switch to list tab
    cy.dataCy('route-tabs-button-list').click();
    cy.url().should('not.include', routesConf['routes_calendar'].path);
    cy.url().should('include', routesConf['routes_list'].path);
    // switch to map tab
    cy.dataCy('route-tabs-button-map').click();
    cy.url().should('not.include', routesConf['routes_list'].path);
    cy.url().should('include', routesConf['routes_map'].path);
    // switch to app tab
    cy.dataCy('route-tabs-button-app').click();
    cy.url().should('not.include', routesConf['routes_map'].path);
    cy.url().should('include', routesConf['routes_app'].path);
    // popstate
    cy.go('back');
    cy.url().should('include', routesConf['routes_map'].path);
    cy.dataCy('route-tabs-panel-map').should('be.visible');
  });
}

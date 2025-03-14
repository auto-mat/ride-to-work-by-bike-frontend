import { createPinia, setActivePinia } from 'pinia';
import RoutesBottomPanel from 'components/routes/RoutesBottomPanel.vue';
import { i18n } from '../../boot/i18n';
import { useTripsStore } from 'src/stores/trips';

const routeSingle = 1;
const routeMultiple = 2;

describe('<RoutesBottomPanel>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleBottomPanel'], 'routes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RoutesBottomPanel, {
        props: {
          isOpen: true,
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();
    singleRouteTests();
  });

  context('desktop multiple routes', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RoutesBottomPanel, {
        props: {
          isOpen: true,
          routeCount: routeMultiple,
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders title', () => {
      // title visible
      cy.dataCy('section-heading-title')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('routes.titleBottomPanel', routeMultiple, {
            count: routeMultiple,
          }),
        );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RoutesBottomPanel, {
        props: {
          isOpen: true,
        },
      });
      // setup store with commute modes
      cy.setupTripsStoreWithCommuteModes(useTripsStore);
      cy.viewport('iphone-6');
    });

    coreTests();
    singleRouteTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('route-bottom-panel').should('be.visible');
    // button close
    cy.dataCy('bottom-panel-close')
      .should('be.visible')
      .and('contain', 'close');
    // route item edit
    cy.dataCy('route-item-edit').should('be.visible');
    // button save
    cy.dataCy('bottom-panel-save').should('be.visible').and('contain', 'check');
  });
}

function singleRouteTests() {
  it('renders title', () => {
    // title visible
    cy.dataCy('section-heading-title')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('routes.titleBottomPanel', routeSingle, {
          count: routeSingle,
        }),
      );
  });
}

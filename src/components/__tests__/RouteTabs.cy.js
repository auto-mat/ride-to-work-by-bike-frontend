import RouteTabs from 'components/routes/RouteTabs.vue';
import { i18n } from '../../boot/i18n';

describe('<RouteTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['tabCalendar', 'tabList', 'tabMap', 'tabApp'],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - locked tabs', () => {
    beforeEach(() => {
      cy.mount(RouteTabs, {
        props: {
          locked: ['map', 'app'],
        },
      });
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
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-tabs').should('be.visible');
    cy.dataCy('route-tabs-button-calendar')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tabCalendar'));
    cy.dataCy('route-tabs-button-list')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tabList'));
    cy.dataCy('route-tabs-button-map')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tabMap'));
    cy.dataCy('route-tabs-button-app')
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tabApp'));

    cy.dataCy('route-tabs-button-calendar').click();
    cy.dataCy('route-tabs-panel-calendar').should('be.visible');
    cy.dataCy('route-tabs-panel-list').should('not.exist');
    cy.dataCy('route-tabs-panel-map').should('not.exist');
    cy.dataCy('route-tabs-panel-app').should('not.exist');
  });

  it('allows to switch tabs', () => {
    cy.dataCy('route-tabs-button-list').click();
    cy.dataCy('route-tabs-panel-list').should('be.visible');

    cy.dataCy('route-tabs-button-map').click();
    cy.dataCy('route-tabs-panel-map').should('be.visible');

    cy.dataCy('route-tabs-button-app').click();
    cy.dataCy('route-tabs-panel-app').should('be.visible');

    cy.dataCy('route-tabs-button-calendar').click();
    cy.dataCy('route-tabs-panel-calendar').should('be.visible');
  });

  it('syncs tab navigation with URL', () => {
    // initial state
    cy.url().should('include', 'activeTab=calendar');
    // switch to list tab
    cy.dataCy('route-tabs-button-list').click();
    cy.url().should('not.include', 'activeTab=calendar');
    cy.url().should('include', 'activeTab=list');
    // switch to map tab
    cy.dataCy('route-tabs-button-map').click();
    cy.url().should('not.include', 'activeTab=list');
    cy.url().should('include', 'activeTab=map');
    // switch to app tab
    cy.dataCy('route-tabs-button-app').click();
    cy.url().should('not.include', 'activeTab=map');
    cy.url().should('include', 'activeTab=app');
    // popstate
    cy.go('back');
    cy.url().should('include', 'activeTab=map');
    cy.dataCy('route-tabs-panel-map').should('be.visible');
  });
}

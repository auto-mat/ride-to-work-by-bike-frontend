import ResultsTabs from 'components/results/ResultsTabs.vue';
import { i18n } from '../../boot/i18n';
import { routesConf } from 'src/router/routes_conf';

describe('<ResultsTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        // Not tested - identical
        // 'tabReport',
        'tabConsistency',
        'tabPerformance',
      ],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ResultsTabs, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - locked tabs', () => {
    beforeEach(() => {
      cy.mount(ResultsTabs, {
        props: {
          locked: ['report'],
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders tabs as locked', () => {
      cy.dataCy('results-tabs-button-report')
        .find('i')
        .should('have.class', 'mdi-lock');
    });

    it('does not switch to locked tab', () => {
      cy.dataCy('results-tabs-button-consistency').click();
      cy.dataCy('results-tabs-panel-consistency').should('be.visible');

      cy.dataCy('results-tabs-button-report').click();
      cy.dataCy('results-tabs-panel-report').should('not.exist');
      cy.dataCy('results-tabs-panel-consistency').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ResultsTabs, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('results-tabs').should('be.visible');
    cy.dataCy('results-tabs-button-report')
      .should('be.visible')
      .and('contain', i18n.global.t('results.tabReport'));
    cy.dataCy('results-tabs-button-consistency')
      .should('be.visible')
      .and('contain', i18n.global.t('results.tabConsistency'));
    cy.dataCy('results-tabs-button-performance')
      .should('be.visible')
      .and('contain', i18n.global.t('results.tabPerformance'));

    cy.dataCy('results-tabs-button-report').click();
    cy.dataCy('results-tabs-panel-report').should('be.visible');
    cy.dataCy('results-tabs-panel-consistency').should('not.exist');
    cy.dataCy('results-tabs-panel-performance').should('not.exist');
  });

  it('allows to switch tabs', () => {
    // display report
    cy.dataCy('results-tabs-button-report').click();
    cy.dataCy('results-tabs-panel-report').should('be.visible');
    cy.dataCy('results-tabs-title-report').should('be.visible');
    // display consistency
    cy.dataCy('results-tabs-button-consistency').click();
    cy.dataCy('results-tabs-panel-consistency').should('be.visible');
    cy.dataCy('results-tabs-title-consistency').should('be.visible');
    // display performance
    cy.dataCy('results-tabs-button-performance').click();
    cy.dataCy('results-tabs-panel-performance').should('be.visible');
    cy.dataCy('results-tabs-title-performance').should('be.visible');
  });

  it('syncs tab navigation with URL', () => {
    // initial state
    cy.dataCy('results-tabs-button-report').click();
    cy.url().should('include', routesConf['results_report'].path);
    // switch to list tab
    cy.dataCy('results-tabs-button-consistency').click();
    cy.url().should('not.include', routesConf['results_report'].path);
    cy.url().should('include', routesConf['results_consistency'].path);
    // switch to map tab
    cy.dataCy('results-tabs-button-performance').click();
    cy.url().should('not.include', routesConf['results_consistency'].path);
    cy.url().should('include', routesConf['results_performance'].path);
    // popstate
    cy.go('back');
    cy.url().should('include', routesConf['results_consistency'].path);
    cy.dataCy('results-tabs-panel-performance').should('be.visible');
  });
}

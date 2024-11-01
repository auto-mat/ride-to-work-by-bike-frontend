import CoordinatorTabs from 'components/coordinator/CoordinatorTabs.vue';
import { i18n } from '../../boot/i18n';
import { routesConf } from 'src/router/routes_conf';

// selectors
const selectorCoordinatorTabs = 'coordinator-tabs';
const selectorButtonTasks = 'coordinator-tabs-button-tasks';
const selectorButtonFees = 'coordinator-tabs-button-fees';
const selectorButtonInvoices = 'coordinator-tabs-button-invoices';
const selectorButtonPackages = 'coordinator-tabs-button-packages';
const selectorButtonAttendance = 'coordinator-tabs-button-attendance';
const selectorButtonChallenges = 'coordinator-tabs-button-challenges';
const selectorButtonResults = 'coordinator-tabs-button-results';
const selectorPanelTasks = 'coordinator-tabs-panel-tasks';
const selectorPanelFees = 'coordinator-tabs-panel-fees';
const selectorPanelInvoices = 'coordinator-tabs-panel-invoices';
const selectorPanelPackages = 'coordinator-tabs-panel-packages';
const selectorPanelAttendance = 'coordinator-tabs-panel-attendance';
const selectorPanelChallenges = 'coordinator-tabs-panel-challenges';
const selectorPanelResults = 'coordinator-tabs-panel-results';

describe('<CoordinatorTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'tabTasks',
        'tabFees',
        'tabInvoices',
        'tabPackages',
        'tabAttendance',
        'tabChallenges',
        'tabResults',
      ],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CoordinatorTabs, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CoordinatorTabs, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorCoordinatorTabs).should('be.visible');
    cy.dataCy(selectorButtonTasks).and(
      'contain',
      i18n.global.t('coordinator.tabTasks'),
    );
    cy.dataCy(selectorButtonFees).and(
      'contain',
      i18n.global.t('coordinator.tabFees'),
    );
    cy.dataCy(selectorButtonInvoices).and(
      'contain',
      i18n.global.t('coordinator.tabInvoices'),
    );
    cy.dataCy(selectorButtonPackages).and(
      'contain',
      i18n.global.t('coordinator.tabPackages'),
    );
    cy.dataCy(selectorButtonAttendance).and(
      'contain',
      i18n.global.t('coordinator.tabAttendance'),
    );
    cy.dataCy(selectorButtonChallenges).and(
      'contain',
      i18n.global.t('coordinator.tabChallenges'),
    );
    cy.dataCy(selectorButtonResults).and(
      'contain',
      i18n.global.t('coordinator.tabResults'),
    );

    cy.dataCy(selectorButtonTasks).click();
    cy.dataCy(selectorPanelTasks).should('be.visible');
    cy.dataCy(selectorPanelFees).should('not.exist');
    cy.dataCy(selectorPanelInvoices).should('not.exist');
    cy.dataCy(selectorPanelPackages).should('not.exist');
    cy.dataCy(selectorPanelAttendance).should('not.exist');
    cy.dataCy(selectorPanelChallenges).should('not.exist');
    cy.dataCy(selectorPanelResults).should('not.exist');
  });

  it('allows to switch tabs', () => {
    cy.dataCy(selectorButtonTasks).click();
    cy.dataCy(selectorPanelTasks).should('be.visible');
    cy.dataCy(selectorButtonFees).click();
    cy.dataCy(selectorPanelFees).should('be.visible');
    cy.dataCy(selectorButtonInvoices).click();
    cy.dataCy(selectorPanelInvoices).should('be.visible');
    cy.dataCy(selectorButtonPackages).click();
    cy.dataCy(selectorPanelPackages).should('be.visible');
    cy.dataCy(selectorButtonAttendance).click();
    cy.dataCy(selectorPanelAttendance).should('be.visible');
    cy.dataCy(selectorButtonChallenges).click();
    cy.dataCy(selectorPanelChallenges).should('be.visible');
    cy.dataCy(selectorButtonResults).click();
    cy.dataCy(selectorPanelResults).should('be.visible');
  });

  it('syncs tab navigation with URL', () => {
    // initial state
    cy.dataCy(selectorButtonTasks).click();
    cy.url().should('include', routesConf['coordinator_tasks'].path);
    // switch to fees tab
    cy.dataCy(selectorButtonFees).click();
    cy.url().should('not.include', routesConf['coordinator_tasks'].path);
    cy.url().should('include', routesConf['coordinator_fees'].path);
    // switch to invoices tab
    cy.dataCy(selectorButtonInvoices).click();
    cy.url().should('not.include', routesConf['coordinator_fees'].path);
    cy.url().should('include', routesConf['coordinator_invoices'].path);
    // switch to packages tab
    cy.dataCy(selectorButtonPackages).click();
    cy.url().should('not.include', routesConf['coordinator_invoices'].path);
    cy.url().should('include', routesConf['coordinator_packages'].path);
    // switch to attendance tab
    cy.dataCy(selectorButtonAttendance).click();
    cy.url().should('not.include', routesConf['coordinator_packages'].path);
    cy.url().should('include', routesConf['coordinator_attendance'].path);
    // switch to challenges tab
    cy.dataCy(selectorButtonChallenges).click();
    cy.url().should('not.include', routesConf['coordinator_attendance'].path);
    cy.url().should('include', routesConf['coordinator_challenges'].path);
    // switch to results tab
    cy.dataCy(selectorButtonResults).click();
    cy.url().should('not.include', routesConf['coordinator_challenges'].path);
    cy.url().should('include', routesConf['coordinator_results'].path);
    // popstate
    cy.go('back');
    cy.url().should('include', routesConf['coordinator_challenges'].path);
    cy.dataCy(selectorPanelChallenges).should('be.visible');
  });
}

import { routesConf } from '../../../src/router/routes_conf';

// selectors
const selectorPage = 'company-coordinator-page';
const selectorPageTitle = 'company-coordinator-page-title';
const selectorTabs = 'coordinator-tabs';
// const selectorButtonTasks = 'coordinator-tabs-button-tasks';
const selectorButtonFees = 'coordinator-tabs-button-fees';
const selectorButtonInvoices = 'coordinator-tabs-button-invoices';
const selectorButtonPackages = 'coordinator-tabs-button-packages';
const selectorButtonAttendance = 'coordinator-tabs-button-attendance';
const selectorButtonChallenges = 'coordinator-tabs-button-challenges';
const selectorButtonResults = 'coordinator-tabs-button-results';
const selectorTasksList = 'task-list-coordinator';
const selectorTasksListShowPast = 'task-list-show-past';
const selectorTasksItemFuture = 'task-item-future';
const selectorTasksItemPastTitle = 'task-item-past-title';

// variables
// timestamp: Saturday 14. September 2024 1:00:00 (GMT)
const systemTimeTasks = new Date('2024-09-14T01:00:00Z').getTime();

describe('Company Coordinator Page', () => {
  context('general', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['coordinator']['path']);
      cy.viewport('macbook-16');

      // load config an i18n o13bjects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('goes to the first tab URL', () => {
      cy.url().should('include', routesConf['coordinator_tasks'].path);
    });

    it('displays page title', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy(selectorPageTitle)
          .should('be.visible')
          .and('contain', i18n.global.t('coordinator.titleCompanyCoordinator'));
      });
    });

    it('displays coordinator tabs', () => {
      cy.dataCy(selectorTabs).should('be.visible');
    });

    it('allows navigation between tabs', () => {
      // check initial route
      cy.url().should('include', routesConf['coordinator_tasks'].path);
      // test navigation to each tab
      const tabRoutes = [
        {
          button: selectorButtonFees,
          route: routesConf['coordinator_fees'].path,
        },
        {
          button: selectorButtonInvoices,
          route: routesConf['coordinator_invoices'].path,
        },
        {
          button: selectorButtonPackages,
          route: routesConf['coordinator_packages'].path,
        },
        {
          button: selectorButtonAttendance,
          route: routesConf['coordinator_attendance'].path,
        },
        {
          button: selectorButtonChallenges,
          route: routesConf['coordinator_challenges'].path,
        },
        {
          button: selectorButtonResults,
          route: routesConf['coordinator_results'].path,
        },
      ];

      tabRoutes.forEach(({ button, route }) => {
        cy.dataCy(button).click();
        cy.url().should('include', route);
      });
    });

    it('preserves tab state on page refresh', () => {
      // navigate to a specific tab
      cy.dataCy(selectorButtonAttendance).click();
      cy.url().should('include', routesConf['coordinator_attendance'].path);
      // refresh the page
      cy.reload();
      // verify we're still on the same tab
      cy.url().should('include', routesConf['coordinator_attendance'].path);
    });

    it('handles browser navigation', () => {
      // navigate through tabs
      cy.dataCy(selectorButtonFees).click();
      cy.dataCy(selectorButtonInvoices).click();
      cy.dataCy(selectorButtonPackages).click();
      // go back twice
      cy.go('back');
      cy.url().should('include', routesConf['coordinator_invoices'].path);
      cy.go('back');
      cy.url().should('include', routesConf['coordinator_fees'].path);
      // go forward
      cy.go('forward');
      cy.url().should('include', routesConf['coordinator_invoices'].path);
    });
  });

  context('responsive behavior', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['coordinator']['path']);
      cy.viewport('macbook-16');

      // load config an i18n o13bjects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('displays correctly on desktop', () => {
      cy.viewport('macbook-16');
      cy.dataCy(selectorPage).should('be.visible');
      cy.dataCy(selectorTabs).should('be.visible');
    });

    it('displays correctly on mobile', () => {
      cy.viewport('iphone-6');
      cy.dataCy(selectorPage).should('be.visible');
      cy.dataCy(selectorTabs).should('be.visible');
    });
  });

  context('time between tasks', () => {
    beforeEach(() => {
      cy.clock(systemTimeTasks);
      cy.visit('#' + routesConf['coordinator']['path']);
      cy.viewport('macbook-16');

      // tick to load the page UI
      cy.tick(1000);
      // load config an i18n o13bjects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('displays tasks list and allows to show past tasks', () => {
      // tick to load the tasks list component
      cy.tick(1000);
      cy.dataCy(selectorTasksList).should('be.visible');
      // future tasks
      cy.dataCy(selectorTasksItemFuture).should('be.visible');
      // past tasks not visible
      cy.dataCy(selectorTasksItemPastTitle).should('not.exist');
      // button show past tasks visible
      cy.dataCy(selectorTasksListShowPast).should('be.visible');
      // show past tasks
      cy.dataCy(selectorTasksListShowPast).click();
      cy.tick(1000);
      // past tasks visible
      cy.dataCy(selectorTasksItemPastTitle).should('be.visible');
    });
  });
});

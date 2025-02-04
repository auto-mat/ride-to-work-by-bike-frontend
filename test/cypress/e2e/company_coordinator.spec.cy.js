import { routesConf } from '../../../src/router/routes_conf';
import {
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  failOnStatusCode,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

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
const selectorCompanyCoordinatorDisabledText =
  'company-coordinator-disabled-text';

describe('Company Coordinator Page', () => {
  context('general', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['coordinator']['path']);
      cy.viewport('macbook-16');

      // load config and i18n object as alias
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

    it('displays company coordinator disabled text', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          // text
          cy.dataCy(selectorCompanyCoordinatorDisabledText)
            .should('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t('coordinator.textCompanyCoordinatorDisabled'),
              ).then((text) => {
                expect(content).to.equal(text);
              });
            });
          // link
          cy.dataCy(selectorCompanyCoordinatorDisabledText)
            .find('a')
            .should('have.attr', 'href')
            .and('eq', config.urlRideToWorkByBikeOldFrontendDjangoApp);
          // check if the link is accessible
          cy.request({
            url: config.urlRideToWorkByBikeOldFrontendDjangoApp,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
      });
    });

    it.skip('displays coordinator tabs', () => {
      cy.dataCy(selectorTabs).should('be.visible');
    });

    it.skip('allows navigation between tabs', () => {
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

    it.skip('preserves tab state on page refresh', () => {
      // navigate to a specific tab
      cy.dataCy(selectorButtonAttendance).click();
      cy.url().should('include', routesConf['coordinator_attendance'].path);
      // refresh the page
      cy.reload();
      // verify we're still on the same tab
      cy.url().should('include', routesConf['coordinator_attendance'].path);
    });

    it.skip('handles browser navigation', () => {
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

    it.skip('renders TaskListComponent', () => {
      cy.dataCy(selectorTasksList).should('be.visible');
    });
  });

  context('responsive behavior', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['coordinator']['path']);
      cy.viewport('macbook-16');

      // load config and i18n object as alias
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

    it.skip('displays correctly on desktop', () => {
      cy.viewport('macbook-16');
      cy.dataCy(selectorPage).should('be.visible');
      cy.dataCy(selectorTabs).should('be.visible');
    });

    it.skip('displays correctly on mobile', () => {
      cy.viewport('iphone-6');
      cy.dataCy(selectorPage).should('be.visible');
      cy.dataCy(selectorTabs).should('be.visible');
    });
  });
});

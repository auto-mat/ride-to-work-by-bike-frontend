import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Company coordinator user results page', () => {
  context('previewing user results', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // set system time to be in the correct active token window
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
            // setup coordinator test environment
            cy.setupCompanyCoordinatorTest(config, win.i18n);
          });
        });
      });
    });

    it('should display the user results table', () => {
      cy.visit('#' + routesConf['coordinator_results']['children']['fullPath']);
      // table
      cy.dataCy('table-results').should('be.visible');
      // table headers
      cy.fixture('apiGetAdminOrganisationResponse.json').then((response) => {
        const organization = response.results[0];
        // get address from store data
        const uniqueNames = [
          ...new Set(
            organization.subsidiaries.map((subsidiary) => subsidiary.name),
          ),
        ];
        if (uniqueNames.length > 0) {
          cy.dataCy('table-results-subsidiary-header')
            .should('be.visible')
            .and('have.length', uniqueNames.length);
          uniqueNames.forEach((name) => {
            cy.dataCy('table-results-subsidiary-header').contains(name);
          });
        }
        // table row count
        const members = [];
        organization.subsidiaries.forEach((sub) => {
          sub.teams.forEach((team) => {
            team.members_without_paid_entry_fee_by_org_coord.forEach(
              (member) => {
                members.push(member);
              },
            );
            team.members_with_paid_entry_fee_by_org_coord.forEach((member) => {
              members.push(member);
            });
            team.other_members.forEach((member) => {
              members.push(member);
            });
          });
        });
        // verify member rows count
        cy.dataCy('table-results-row')
          .should('be.visible')
          .and('have.length', members.length);
        // verify member buttons count
        cy.dataCy('table-results-button-download-diploma')
          .should('be.visible')
          .and('have.length', members.length);
      });
    });
  });
});

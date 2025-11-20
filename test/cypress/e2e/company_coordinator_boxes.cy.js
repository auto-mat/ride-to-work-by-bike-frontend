import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Company coordinator boxes page', () => {
  context('previewing boxes', () => {
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
            cy.visit(
              '#' + routesConf['coordinator_packages']['children']['fullPath'],
            );
            cy.dataCy('table-boxes-title').should('be.visible');
          });
        });
      });
    });

    it('should display the boxes table', () => {
      // table
      cy.dataCy('table-boxes').should('be.visible');
      // table headers
      cy.fixture('apiGetAdminOrganisationResponse.json').then((response) => {
        const organization = response.results[0];
        // get address from store data
        const uniqueAddresses = [
          ...new Set(
            organization.subsidiaries.map(
              (box) => `${box.street} ${box.street_number}, ${box.city}`,
            ),
          ),
        ];
        if (uniqueAddresses.length > 0) {
          cy.dataCy('table-boxes-address-header')
            .should('be.visible')
            .and('have.length', uniqueAddresses.length);
          uniqueAddresses.forEach((address) => {
            cy.dataCy('table-boxes-address-header').contains(address);
          });
        }
        // table row count
        const boxes = [];
        organization.subsidiaries.forEach((sub) => {
          sub.boxes.forEach((box) => {
            boxes.push(box);
          });
        });
        cy.dataCy('table-boxes-row')
          .should('be.visible')
          .and('have.length', boxes.length);
      });
    });
  });
});

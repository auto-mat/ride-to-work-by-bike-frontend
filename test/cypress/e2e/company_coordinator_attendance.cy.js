import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeChallengeActive } from '../support/commonTests';

const teamName = 'Team 1';

describe('Company coordinator user attendance page', () => {
  context('previewing user attendance', () => {
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
              '#' +
                routesConf['coordinator_attendance']['children']['fullPath'],
            );
            cy.dataCy('header-organization').should('be.visible');
          });
        });
      });
    });

    it('should display the user attendance table', () => {
      // table
      cy.dataCy('table-attendance').should('be.visible');
      // table headers
      cy.fixture('apiGetAdminOrganisationResponse.json').then((response) => {
        const organization = response.results[0];
        // get address from store data
        const uniqueAddresses = [
          ...new Set(
            organization.subsidiaries.map(
              (address) =>
                `${address.street} ${address.street_number}, ${address.city}`,
            ),
          ),
        ];
        if (uniqueAddresses.length > 0) {
          cy.dataCy('table-attendance-subsidiary-header')
            .should('be.visible')
            .and('have.length', uniqueAddresses.length);
          uniqueAddresses.forEach((address) => {
            cy.dataCy('table-attendance-subsidiary-header').contains(address);
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
        cy.dataCy('table-attendance-row')
          .should('be.visible')
          .and('have.length', members.length);
      });
    });

    it('allows to create new team', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetAdminOrganisationResponse.json').then(
            (response) => {
              cy.fixture('apiGetThisCampaign.json').then((campaignResponse) => {
                const subsidiaryId = response.results[0].subsidiaries[0].id;
                const campaignId = campaignResponse.results[0].id;
                // confirm initial GET request
                cy.waitForAdminOrganisationGetApi(
                  'apiGetAdminOrganisationResponse.json',
                );
                cy.get('@getAdminOrganisation.all').should('have.length', 1);
                // intercept coordinator team POST API
                cy.interceptCoordinatorTeamPostApi(config, i18n, subsidiaryId);
                cy.interceptAdminOrganisationGetApi(
                  config,
                  'apiGetAdminOrganisationResponseNewTeam.json',
                );
                // create team
                cy.dataCy('table-attendance-button-add-team').should(
                  'be.visible',
                );
                cy.dataCy('table-attendance-button-add-team').click();
                cy.dataCy('dialog-add-team').should('be.visible');
                cy.dataCy('form-add-team-name').find('input').type(teamName);
                cy.dataCy('form-add-team-name').find('input').type('{enter}');
                cy.dataCy('dialog-add-team').should('not.exist');
                // await POST request and subsequent GET
                cy.waitForCoordinatorTeamPostApi({
                  name: teamName,
                  campaign_id: campaignId,
                  subsidiary_id: subsidiaryId,
                });
                cy.waitForAdminOrganisationGetApi(
                  'apiGetAdminOrganisationResponseNewTeam.json',
                );
                cy.get('@getAdminOrganisation.all').should('have.length', 2);
                cy.dataCy('table-attendance-team-header')
                  .should('exist')
                  .and('be.visible')
                  .and('contain', teamName);
              });
            },
          );
        });
      });
    });
  });
});

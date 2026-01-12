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
          });
        });
      });
    });

    it('should display the user attendance table', () => {
      cy.visit(
        '#' + routesConf['coordinator_attendance']['children']['fullPath'],
      );
      cy.dataCy('header-organization').should('be.visible');
      // table
      cy.dataCy('table-attendance').should('be.visible');
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
          cy.dataCy('table-attendance-subsidiary-header')
            .should('be.visible')
            .and('have.length', uniqueNames.length);
          uniqueNames.forEach((name) => {
            cy.dataCy('table-attendance-subsidiary-header').contains(name);
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
          cy.visit(
            '#' + routesConf['coordinator_attendance']['children']['fullPath'],
          );
          cy.dataCy('header-organization').should('be.visible');
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

    it('allows to delete empty team', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // override organisation GET to show an empty team
          cy.interceptAdminOrganisationGetApi(
            config,
            'apiGetAdminOrganisationResponseNewTeam.json',
          );
          cy.visit(
            '#' + routesConf['coordinator_attendance']['children']['fullPath'],
          );
          cy.dataCy('header-organization').should('be.visible');
          // confirm initial GET request
          cy.waitForAdminOrganisationGetApi(
            'apiGetAdminOrganisationResponseNewTeam.json',
          );
          cy.get('@getAdminOrganisation.all').should('have.length', 1);
          cy.fixture('apiGetAdminOrganisationResponseNewTeam.json').then(
            (response) => {
              // get empty team details
              const subsidiaryId = response.results[0].subsidiaries[0].id;
              const emptyTeam = response.results[0].subsidiaries[0].teams.find(
                (team) =>
                  team.members_with_paid_entry_fee_by_org_coord.length === 0 &&
                  team.members_without_paid_entry_fee_by_org_coord.length ===
                    0 &&
                  team.other_members.length === 0,
              );
              const teamId = emptyTeam.id;
              const teamName = emptyTeam.name;
              // verify empty team header
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .should('be.visible');
              // verify delete button
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .parents('tr')
                .find('[data-cy="table-attendance-button-delete-team"]')
                .should('be.visible');
              // intercept DELETE team API
              cy.interceptCoordinatorTeamDeleteApi(
                config,
                i18n,
                subsidiaryId,
                teamId,
              );
              cy.interceptAdminOrganisationGetApi(
                config,
                'apiGetAdminOrganisationResponse.json',
              );
              // click delete button (first time - will cancel)
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .parents('tr')
                .find('[data-cy="table-attendance-button-delete-team"]')
                .click();
              // verify delete dialog
              cy.dataCy('dialog-delete-team').should('be.visible');
              cy.dataCy('dialog-delete-team').should(
                'contain',
                i18n.global.t('coordinator.deleteTeamConfirmMessage', {
                  teamName,
                }),
              );
              // click dialog cancel button
              cy.dataCy('dialog-button-cancel').click();
              cy.dataCy('dialog-delete-team').should('not.exist');
              // no DELETE sent
              cy.get('@deleteCoordinatorTeam.all').should('have.length', 0);
              // verify team exists
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .should('be.visible');
              // click delete button (second time - will confirm)
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .parents('tr')
                .find('[data-cy="table-attendance-button-delete-team"]')
                .click();
              // confirm delete in dialog
              cy.dataCy('dialog-delete-team').should('be.visible');
              cy.dataCy('dialog-delete-team').should(
                'contain',
                i18n.global.t('coordinator.deleteTeamConfirmMessage', {
                  teamName,
                }),
              );
              cy.dataCy('dialog-button-confirm-delete').click();
              // await delete
              cy.waitForCoordinatorTeamDeleteApi();
              // confirm data refetch
              cy.waitForAdminOrganisationGetApi(
                'apiGetAdminOrganisationResponse.json',
              );
              cy.get('@getAdminOrganisation.all').should('have.length', 2);
              // verify team is deleted
              cy.dataCy('table-attendance-team-header')
                .contains(teamName)
                .should('not.exist');
            },
          );
        });
      });
    });

    it('allows to move member to another team', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetAdminOrganisationResponse.json').then(
            (response) => {
              cy.fixture('apiGetThisCampaign.json').then((campaignResponse) => {
                // setup test variables
                const subsidiaryId = response.results[0].subsidiaries[0].id;
                const campaignId = campaignResponse.results[0].id;
                // member to move (first member in first team)
                const sourceTeam = response.results[0].subsidiaries[0].teams[0];
                const member =
                  sourceTeam.members_without_paid_entry_fee_by_org_coord[0];
                const memberId = member.id;
                const memberName = member.name;
                const memberApprovalStatus = member.approved_for_team;
                // target team (second team)
                const targetTeam = response.results[0].subsidiaries[0].teams[1];
                const targetTeamId = targetTeam.id;
                const targetTeamName = targetTeam.name;

                cy.visit(
                  '#' +
                    routesConf['coordinator_attendance']['children'][
                      'fullPath'
                    ],
                );
                cy.dataCy('header-organization').should('be.visible');
                cy.waitForAdminOrganisationGetApi(
                  'apiGetAdminOrganisationResponse.json',
                );
                cy.get('@getAdminOrganisation.all').should('have.length', 1);
                // Verify member is in source team
                cy.dataCy('table-attendance-team-header')
                  .contains(sourceTeam.name)
                  .should('be.visible');
                cy.dataCy('table-attendance-name')
                  .contains(memberName)
                  .should('be.visible');
                // Intercept APIs
                cy.interceptCoordinatorMoveMemberPutApi(
                  config,
                  i18n,
                  subsidiaryId,
                  sourceTeam.id,
                  memberId,
                  'apiPostCoordinatorMoveMemberResponse.json',
                );
                cy.interceptAdminOrganisationGetApi(
                  config,
                  'apiGetAdminOrganisationResponseMovedMember.json',
                );
                // open context menu
                cy.dataCy('table-attendance-name')
                  .contains(memberName)
                  .parents('tr')
                  .find('[data-cy="table-attendance-actions-button"]')
                  .click();
                // click move action
                cy.dataCy('table-attendance-action-move')
                  .should('be.visible')
                  .click();
                // verify modal dialog
                cy.dataCy('dialog-move-member').should('be.visible');
                cy.dataCy('dialog-move-member').should('contain', memberName);
                cy.dataCy('dialog-move-member').should(
                  'contain',
                  sourceTeam.name,
                );
                // select subsidiary (1 option available)
                cy.selectDropdownMenu('form-select-subsidiary-wrapper', 0, 1);
                // select team (1 option available - current filtered out)
                cy.selectDropdownMenu('form-select-team-wrapper', 0, 1);
                // submit
                cy.dataCy('dialog-button-submit').click();
                // wait for PUT request
                cy.waitForCoordinatorMoveMemberPutApi({
                  team_id: targetTeamId,
                  campaign_id: campaignId,
                  approved_for_team: memberApprovalStatus,
                });
                // wait for updated organisation GET
                cy.waitForAdminOrganisationGetApi(
                  'apiGetAdminOrganisationResponseMovedMember.json',
                );
                cy.get('@getAdminOrganisation.all').should('have.length', 2);
                // verify member is in target team
                cy.dataCy('table-attendance-team-header')
                  .contains(targetTeamName)
                  .should('be.visible');
                cy.dataCy('table-attendance-team-header')
                  .contains(targetTeamName)
                  .parents('tr')
                  .nextUntil('[data-cy="table-attendance-team-header"]')
                  .find('[data-cy="table-attendance-name"]')
                  .contains(memberName)
                  .should('be.visible');
              });
            },
          );
        });
      });
    });

    it('allows to edit team name', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.visit(
            '#' + routesConf['coordinator_attendance']['children']['fullPath'],
          );
          cy.dataCy('header-organization').should('be.visible');
          cy.waitForAdminOrganisationGetApi(
            'apiGetAdminOrganisationResponse.json',
          );
          cy.get('@getAdminOrganisation.all').should('have.length', 1);

          cy.fixture('apiGetAdminOrganisationResponse.json').then(
            (response) => {
              cy.fixture('apiGetThisCampaign.json').then((campaignResponse) => {
                const subsidiaryId = response.results[0].subsidiaries[0].id;
                const team = response.results[0].subsidiaries[0].teams[0];
                const teamId = team.id;
                const teamName = team.name;
                const campaignId = campaignResponse.results[0].id;
                const newTeamName = 'Updated Team Name';

                // verify team header and edit button exist
                cy.dataCy('table-attendance-team-header')
                  .contains(teamName)
                  .should('be.visible');
                cy.dataCy('table-attendance-team-header')
                  .contains(teamName)
                  .parents('tr')
                  .find('[data-cy="table-attendance-button-edit-team"]')
                  .should('be.visible');
                // intercept APIs
                cy.interceptCoordinatorTeamPutApi(
                  config,
                  i18n,
                  subsidiaryId,
                  teamId,
                );
                cy.interceptAdminOrganisationGetApi(
                  config,
                  'apiGetAdminOrganisationResponseEditedTeam.json',
                );
                // click edit button (first time - will cancel)
                cy.dataCy('table-attendance-team-header')
                  .contains(teamName)
                  .parents('tr')
                  .find('[data-cy="table-attendance-button-edit-team"]')
                  .click();
                // verify edit dialog
                cy.dataCy('dialog-edit-team').should('be.visible');
                cy.dataCy('form-edit-team-name')
                  .find('input')
                  .should('have.value', teamName);
                // cancel
                cy.dataCy('dialog-button-cancel').click();
                cy.dataCy('dialog-edit-team').should('not.exist');
                cy.get('@putCoordinatorTeam.all').should('have.length', 0);
                // click edit button (second time - will submit)
                cy.dataCy('table-attendance-team-header')
                  .contains(teamName)
                  .parents('tr')
                  .find('[data-cy="table-attendance-button-edit-team"]')
                  .click();
                cy.dataCy('dialog-edit-team').should('be.visible');
                cy.dataCy('form-edit-team-name').find('input').clear();
                cy.dataCy('form-edit-team-name')
                  .find('input')
                  .type(newTeamName);
                cy.dataCy('form-edit-team-name').find('input').type('{enter}');
                // await PUT and GET
                cy.waitForCoordinatorTeamPutApi({
                  name: newTeamName,
                  campaign_id: campaignId,
                  subsidiary_id: subsidiaryId,
                });
                cy.waitForAdminOrganisationGetApi(
                  'apiGetAdminOrganisationResponseEditedTeam.json',
                );
                cy.get('@getAdminOrganisation.all').should('have.length', 2);
                // verify team name updated
                cy.dataCy('table-attendance-team-header')
                  .contains(newTeamName)
                  .should('be.visible');
                cy.dataCy('table-attendance-team-header')
                  .contains(teamName)
                  .should('not.exist');
              });
            },
          );
        });
      });
    });
  });
});

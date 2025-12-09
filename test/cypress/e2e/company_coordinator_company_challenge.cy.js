import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeRegistrationPhaseActive } from '../support/commonTests';
import testSet from '../fixtures/formCompanyChallenge.json';
import {
  CompetitionType,
  CompetitorType,
} from '../../../src/components/enums/Challenge';

const competitionEdit = {
  name: 'Edited Challenge Name',
  description: 'Updated description for testing',
  url: 'http://example.com/updated',
  date_from: '2024-09-20',
  date_to: '2024-09-21',
  commute_modes: [
    {
      id: 1,
      name_cs: 'Kolo',
      name_en: 'Bicycle',
      slug: 'bicycle',
    },
    {
      id: 5,
      name_cs: 'Hromadná doprava',
      name_en: 'Public transport',
      slug: 'hromadna',
    },
  ],
  commute_modes_ids: [1, 5],
  date_from_display: '20. 09. 2024',
  date_to_display: '21. 09. 2024',
};

describe('Company coordinator company challenge page', () => {
  context('previewing company challenges', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
      // set system time to be in registration phase
      cy.clock(systemTimeRegistrationPhaseActive, ['Date']).then(() => {
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
                routesConf['coordinator_challenges']['children']['fullPath'],
            );
            cy.dataCy('table-company-challenge-title').should('be.visible');
          });
        });
      });
    });

    it('renders company challenges table', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('apiGetCompetitionResponse.json').then(
          (responseCompetition) => {
            // check that initial competition response is loaded
            cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
            cy.get('@getCompetition.all').should('have.length', 1);
            // check title
            cy.dataCy('table-company-challenge-title')
              .should('be.visible')
              .and('contain', i18n.global.t('table.titleCompanyChallenge'));
            // check button
            cy.dataCy('button-create-company-challenge')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t('coordinator.buttonCreateCompanyChallenge'),
              );
            // check table
            cy.dataCy('table-company-challenge').should('be.visible');
            // check table rows
            cy.dataCy('table-company-challenge-row')
              .should('be.visible')
              .and('have.length', responseCompetition.results.length);
          },
        );
      });
    });

    it('opens dialog when create button is clicked', () => {
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('button-create-company-challenge').click();
        cy.dataCy('dialog-company-challenge').should('be.visible');
        cy.dataCy('dialog-header').should(
          'contain',
          i18n.global.t('coordinator.titleCreateCompanyChallenge'),
        );
        cy.dataCy('form-company-challenge').should('be.visible');
        // check action buttons
        cy.dataCy('dialog-button-cancel')
          .should('be.visible')
          .and('contain', i18n.global.t('navigation.discard'));
        cy.dataCy('dialog-button-submit')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('coordinator.buttonDialogCreateCompanyChallenge'),
          );
      });
    });

    it('closes dialog when cancel button is clicked', () => {
      cy.dataCy('button-create-company-challenge').click();
      cy.dataCy('dialog-company-challenge').should('be.visible');
      cy.dataCy('dialog-button-cancel').click();
      cy.dataCy('dialog-company-challenge').should('not.exist');
    });

    testSet.forEach((test) => {
      it(`${test.description}`, () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            // check that initial competition response is loaded
            cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
            cy.get('@getCompetition.all').should('have.length', 1);
            cy.interceptCompetitionPostApi(config, test.apiResponse);
            // click button
            cy.dataCy('button-create-company-challenge')
              .should('be.visible')
              .click();
            // check dialog
            cy.dataCy('dialog-company-challenge').should('be.visible');
            cy.dataCy('dialog-header').should(
              'contain',
              i18n.global.t('coordinator.titleCreateCompanyChallenge'),
            );
            cy.dataCy('form-company-challenge').should('be.visible');
            // fill in form
            if (test.formInputs.challengeType) {
              cy.contains(i18n.global.t(test.formInputs.challengeType)).click({
                force: true,
              });
            }
            if (test.formInputs.challengeParticipants) {
              cy.contains(
                i18n.global.t(test.formInputs.challengeParticipants),
              ).click({ force: true });
            }
            // deselect all transport modes
            cy.dataCy('form-challenge-transport').within(() => {
              cy.get('.q-checkbox').each((checkbox) => {
                cy.wrap(checkbox).find('.q-checkbox__inner').click();
              });
              cy.dataCy('form-acceptable-transport-by_other_vehicle')
                .find('.q-checkbox__inner')
                .click();
            });
            // select only the required transport modes
            cy.dataCy('form-challenge-transport').within(() => {
              test.formInputs.challengeTransportType.forEach((mode) => {
                cy.dataCy(`form-acceptable-transport-${mode}`)
                  .find('.q-checkbox__inner')
                  .click();
              });
            });
            cy.dataCy('form-challenge-title')
              .find('input')
              .type(test.formInputs.challengeTitle);
            if (test.formInputs.challengeDescription) {
              cy.dataCy('form-challenge-description-input').type(
                test.formInputs.challengeDescription,
              );
            }
            if (test.formInputs.challengeInfoUrl) {
              cy.dataCy('form-challenge-url-input').type(
                test.formInputs.challengeInfoUrl,
              );
            }
            cy.dataCy('form-date-start-input').type(
              test.formInputs.challengeStart,
            );
            cy.dataCy('form-date-stop-input').type(
              test.formInputs.challengeStop,
            );
            // submit
            cy.dataCy('dialog-button-submit').click();
            // check intercept
            cy.waitForCompetitionPostApi(test.apiRequest, test.apiResponse);
            cy.get('@postCompetition.all').should('have.length', 1);
            // re-fetch competition
            cy.get('@getCompetition.all').should('have.length', 2);
          });
        });
      });
    });

    it('does not allow to enter start and stop dates outside the challenge phase', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('apiGetThisCampaign.json').then((response) => {
          // check that initial competition response is loaded
          cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
          cy.get('@getCompetition.all').should('have.length', 1);
          // test creating a company challenge
          cy.dataCy('button-create-company-challenge').click();
          cy.dataCy('dialog-company-challenge').should('be.visible');
          cy.dataCy('dialog-header').should(
            'contain',
            i18n.global.t('coordinator.titleCreateCompanyChallenge'),
          );
          cy.dataCy('form-company-challenge').should('be.visible');
          // fill in dates outside the challenge phase (apiGetThisCampaign.json)
          cy.dataCy('form-date-start-input').type('15. 09. 2024');
          cy.dataCy('form-date-stop-input').type('01. 10. 2024');
          // submit
          cy.dataCy('dialog-button-submit').click();
          const competitionPhase = response.results[0].phase_set.find(
            (phase) => phase.phase_type === 'competition',
          );
          cy.dataCy('form-challenge-start').within(() => {
            // check error messages
            cy.contains(
              i18n.global.t('form.messageFieldDateOutOfRange', {
                minDate: i18n.global.d(
                  new Date(competitionPhase.date_from),
                  'numeric',
                ),
                maxDate: i18n.global.d(
                  new Date(competitionPhase.date_to),
                  'numeric',
                ),
              }),
            ).should('be.visible');
          });
          cy.dataCy('form-challenge-stop').within(() => {
            // check error messages
            cy.contains(
              i18n.global.t('form.messageFieldDateOutOfRange', {
                minDate: i18n.global.d(
                  new Date(competitionPhase.date_from),
                  'numeric',
                ),
                maxDate: i18n.global.d(
                  new Date(competitionPhase.date_to),
                  'numeric',
                ),
              }),
            ).should('be.visible');
          });
          // fix one date
          cy.dataCy('form-date-start-input').clear();
          cy.dataCy('form-date-start-input').type('16. 09. 2024');
          cy.dataCy('form-challenge-start').within(() => {
            // check error messages
            cy.contains(
              i18n.global.t('form.messageFieldDateOutOfRange', {
                minDate: i18n.global.d(
                  new Date(competitionPhase.date_from),
                  'numeric',
                ),
                maxDate: i18n.global.d(
                  new Date(competitionPhase.date_to),
                  'numeric',
                ),
              }),
            ).should('not.exist');
          });
          // fix the other date
          cy.dataCy('form-date-stop-input').clear();
          cy.dataCy('form-date-stop-input').type('29. 09. 2024');
          cy.dataCy('form-challenge-stop').within(() => {
            // check error messages
            cy.contains(
              i18n.global.t('form.messageFieldDateOutOfRange', {
                minDate: i18n.global.d(
                  new Date(competitionPhase.date_from),
                  'numeric',
                ),
                maxDate: i18n.global.d(
                  new Date(competitionPhase.date_to),
                  'numeric',
                ),
              }),
            ).should('not.exist');
          });
        });
      });
    });
  });

  context('editing company challenges', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
      // set system time to be in registration phase
      cy.clock(systemTimeRegistrationPhaseActive, ['Date']).then(() => {
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
                routesConf['coordinator_challenges']['children']['fullPath'],
            );
            cy.dataCy('table-company-challenge-title').should('be.visible');
          });
        });
      });
    });

    it('renders edit button that opens edit dialog when clicked', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('apiGetCompetitionResponse.json').then(
          (responseCompetition) => {
            // check that initial competition response is loaded
            cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
            cy.get('@getCompetition.all').should('have.length', 1);
            // check edit buttons exist for each row
            cy.dataCy('table-company-challenge-row')
              .should('have.length', responseCompetition.results.length)
              .each(() => {
                cy.dataCy('button-edit-company-challenge').should('be.visible');
              });
            // click edit button
            cy.dataCy('table-company-challenge-row')
              .first()
              .within(() => {
                cy.dataCy('button-edit-company-challenge').click();
              });
            // dialog with title
            cy.dataCy('dialog-company-challenge').should('be.visible');
            cy.dataCy('dialog-header').should(
              'contain',
              i18n.global.t('coordinator.titleEditCompanyChallenge'),
            );
            // check submit button text
            cy.dataCy('dialog-button-submit').should(
              'contain',
              i18n.global.t('coordinator.buttonDialogEditCompanyChallenge'),
            );
          },
        );
      });
    });

    it('pre-fills form fields with competition data when editing', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('apiGetCompetitionResponse.json').then(
          (responseCompetition) => {
            // check that initial competition response is loaded
            cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
            cy.get('@getCompetition.all').should('have.length', 1);
            // first competition from sorted list
            const sortedCompetitions = [...responseCompetition.results].sort(
              (a, b) => a.name.localeCompare(b.name),
            );
            const firstCompetition = sortedCompetitions[0];
            // click edit button
            cy.dataCy('table-company-challenge-row')
              .first()
              .within(() => {
                cy.dataCy('button-edit-company-challenge').click();
              });
            cy.dataCy('dialog-company-challenge').should('be.visible');
            // check title field
            cy.dataCy('form-challenge-title')
              .find('input')
              .should('have.value', firstCompetition.name);
            // check url field
            if (firstCompetition.url) {
              cy.dataCy('form-challenge-url-input').should(
                'have.value',
                firstCompetition.url,
              );
            }
            // check dates are not empty
            cy.dataCy('form-date-start-input').should('not.have.value', '');
            cy.dataCy('form-date-stop-input').should('not.have.value', '');
            // check selected transport types
            firstCompetition.commute_modes.forEach((mode) => {
              cy.dataCy(`form-acceptable-transport-${mode.slug}`)
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--truthy');
            });
            // check selected challenge type
            if (firstCompetition.challenge_type === CompetitionType.length) {
              cy.contains(
                i18n.global.t('form.labelChallengeTypePerformance'),
              ).should('exist');
            }
            if (firstCompetition.challenge_type === CompetitionType.frequency) {
              cy.contains(
                i18n.global.t('form.labelChallengeTypeRegularity'),
              ).should('exist');
            }
            // check selected competitor type
            if (firstCompetition.competitor_type === CompetitorType.team) {
              cy.contains(i18n.global.t('form.labelParticipantsTeams')).should(
                'exist',
              );
            }
            if (
              firstCompetition.competitor_type === CompetitorType.singleUser
            ) {
              cy.contains(
                i18n.global.t('form.labelParticipantsIndividuals'),
              ).should('exist');
            }
            if (
              firstCompetition.competitor_type === CompetitorType.subsidiary
            ) {
              cy.contains(
                i18n.global.t('form.labelParticipantsSubsidiaries'),
              ).should('exist');
            }
          },
        );
      });
    });

    it('allows editing all fields including dates and transport types', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetCompetitionResponse.json').then(
          (responseCompetition) => {
            // check that initial competition response is loaded
            cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
            cy.get('@getCompetition.all').should('have.length', 1);
            // first competition from sorted list
            const sortedCompetitions = [...responseCompetition.results].sort(
              (a, b) => a.name.localeCompare(b.name),
            );
            const firstCompetition = sortedCompetitions[0];
            const editedCompetition = {
              ...firstCompetition,
              name: competitionEdit.name,
              description: competitionEdit.description,
              url: competitionEdit.url,
              date_from: competitionEdit.date_from,
              date_to: competitionEdit.date_to,
              commute_modes: competitionEdit.commute_modes,
            };
            // setup PUT intercept
            cy.interceptCompetitionPutApi(
              config,
              firstCompetition.id,
              editedCompetition,
            );
            // click edit button
            cy.dataCy('table-company-challenge-row')
              .first()
              .within(() => {
                cy.dataCy('button-edit-company-challenge').click();
              });
            // check dialog opens
            cy.dataCy('dialog-company-challenge').should('be.visible');
            // modify title
            cy.dataCy('form-challenge-title').find('input').clear();
            cy.dataCy('form-challenge-title')
              .find('input')
              .type(competitionEdit.name);
            // modify description
            cy.dataCy('form-challenge-description-input').clear();
            cy.dataCy('form-challenge-description-input').type(
              competitionEdit.description,
            );
            // modify URL
            cy.dataCy('form-challenge-url-input').clear();
            cy.dataCy('form-challenge-url-input').type(competitionEdit.url);
            // modify dates
            cy.dataCy('form-date-start-input').clear();
            cy.dataCy('form-date-start-input').type(
              competitionEdit.date_from_display,
            );
            cy.dataCy('form-date-stop-input').clear();
            cy.dataCy('form-date-stop-input').type(
              competitionEdit.date_to_display,
            );
            // add another transport mode
            cy.dataCy('form-acceptable-transport-hromadna')
              .find('.q-checkbox__inner')
              .click();
            // submit
            cy.dataCy('dialog-button-submit').click();
            // verify PUT request payload and response
            cy.waitForCompetitionPutApi(
              {
                name: competitionEdit.name,
                description: competitionEdit.description,
                competition_type: firstCompetition.competition_type,
                competitor_type: firstCompetition.competitor_type,
                commute_modes: competitionEdit.commute_modes_ids,
                date_from: competitionEdit.date_from,
                date_to: competitionEdit.date_to,
                url: competitionEdit.url,
              },
              editedCompetition,
            );
            // verify re-fetch after update
            cy.get('@getCompetition.all').should('have.length', 2);
            // verify dialog closed
            cy.dataCy('dialog-company-challenge').should('not.exist');
          },
        );
      });
    });

    it('cancels edit and closes dialog without saving changes', () => {
      cy.fixture('apiGetCompetitionResponse.json').then(() => {
        // check that initial competition response is loaded
        cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
        cy.get('@getCompetition.all').should('have.length', 1);
        // click edit button
        cy.dataCy('table-company-challenge-row')
          .first()
          .within(() => {
            cy.dataCy('button-edit-company-challenge').click();
          });
        // check dialog opens
        cy.dataCy('dialog-company-challenge').should('be.visible');
        // make some changes
        cy.dataCy('form-challenge-title').find('input').clear();
        cy.dataCy('form-challenge-title')
          .find('input')
          .type('This should not be saved');
        // click cancel
        cy.dataCy('dialog-button-cancel').click();
        // verify dialog closed
        cy.dataCy('dialog-company-challenge').should('not.exist');
        // verify no PUT request was made (only the initial GET)
        cy.get('@getCompetition.all').should('have.length', 1);
      });
    });

    it('switches back to create mode when opening create dialog after edit', () => {
      cy.get('@i18n').then((i18n) => {
        cy.fixture('apiGetCompetitionResponse.json').then(() => {
          // check that initial competition response is loaded
          cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
          cy.get('@getCompetition.all').should('have.length', 1);
          // first open edit dialog
          cy.dataCy('table-company-challenge-row')
            .first()
            .within(() => {
              cy.dataCy('button-edit-company-challenge').click();
            });
          cy.dataCy('dialog-company-challenge').should('be.visible');
          cy.dataCy('dialog-header').should(
            'contain',
            i18n.global.t('coordinator.titleEditCompanyChallenge'),
          );
          // close dialog
          cy.dataCy('dialog-button-cancel').click();
          cy.dataCy('dialog-company-challenge').should('not.exist');
          // open create dialog
          cy.dataCy('button-create-company-challenge').click();
          // verify it's in create mode
          cy.dataCy('dialog-company-challenge').should('be.visible');
          cy.dataCy('dialog-header').should(
            'contain',
            i18n.global.t('coordinator.titleCreateCompanyChallenge'),
          );
          cy.dataCy('dialog-button-submit').should(
            'contain',
            i18n.global.t('coordinator.buttonDialogCreateCompanyChallenge'),
          );
          // verify form is empty (title should be empty)
          cy.dataCy('form-challenge-title')
            .find('input')
            .should('have.value', '');
        });
      });
    });
  });
});

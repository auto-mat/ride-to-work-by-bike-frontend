import { routesConf } from '../../../src/router/routes_conf';
import { systemTimeRegistrationPhaseActive } from '../support/commonTests';
import testSet from '../fixtures/formCompanyChallenge.json';

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
        cy.dataCy('dialog-create-company-challenge').should('be.visible');
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
      cy.dataCy('dialog-create-company-challenge').should('be.visible');
      cy.dataCy('dialog-button-cancel').click();
      cy.dataCy('dialog-create-company-challenge').should('not.exist');
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
            cy.dataCy('dialog-create-company-challenge').should('be.visible');
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
          cy.dataCy('dialog-create-company-challenge').should('be.visible');
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
});

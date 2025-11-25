import { routesConf } from '../../../src/router/routes_conf';
import {
  systemTimeRegistrationPhaseActive,
  systemTimeRegistrationPhaseInactive,
} from '../support/commonTests';

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
  });

  context('registration phase is inactive', () => {
    beforeEach(() => {
      cy.viewport(1920, 2500);
      // set system time to be outside registration phase
      cy.clock(systemTimeRegistrationPhaseInactive, ['Date']).then(() => {
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

    it('does not allow to open dialog when registration phase is inactive', () => {
      // check that initial competition response is loaded
      cy.waitForCompetitionGetApi('apiGetCompetitionResponse');
      cy.get('@getCompetition.all').should('have.length', 1);
      // button should be disabled
      cy.dataCy('button-create-company-challenge')
        .should('be.visible')
        .and('have.attr', 'disabled');
    });
  });
});

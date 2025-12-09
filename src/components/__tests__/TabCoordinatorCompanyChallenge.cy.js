import { createPinia, setActivePinia } from 'pinia';
import TabCoordinatorCompanyChallenge from 'components/coordinator/TabCoordinatorCompanyChallenge.vue';
import { i18n } from '../../boot/i18n';
import { useChallengeStore } from '../../stores/challenge';
import { systemTimeRegistrationPhaseActive } from '../../../test/cypress/support/commonTests';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// variables
const iconSize = 18;

describe('<TabCoordinatorCompanyChallenge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['titleCompanyChallenge'], 'table', i18n);
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
    cy.testLanguageStringsInContext(
      [
        'buttonCreateCompanyChallenge',
        'buttonDialogCreateCompanyChallenge',
        'titleCreateCompanyChallenge',
      ],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptCommuteModeGetApi(rideToWorkByBikeConfig, i18n);
      cy.clock(systemTimeRegistrationPhaseActive, ['Date']).then(() => {
        cy.mount(TabCoordinatorCompanyChallenge, {
          props: {},
        });
        cy.viewport(1920, 2000);
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptCommuteModeGetApi(rideToWorkByBikeConfig, i18n);
      cy.clock(systemTimeRegistrationPhaseActive, ['Date']).then(() => {
        cy.mount(TabCoordinatorCompanyChallenge, {
          props: {},
        });
        cy.viewport(375, 2000);
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('apiGetThisCampaign.json').then((response) => {
      cy.wrap(useChallengeStore()).then((store) => {
        store.setPhaseSet(response.results[0].phase_set);
      });
    });
    cy.dataCy('tab-coordinator-company-challenge').should('exist');
    // table title
    cy.dataCy('table-company-challenge-title')
      .should('be.visible')
      .and('contain', i18n.global.t('table.titleCompanyChallenge'));
    // button create company challenge
    cy.dataCy('button-create-company-challenge')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('coordinator.buttonCreateCompanyChallenge'),
      );
    // button icon size
    cy.dataCy('button-create-company-challenge')
      .find('i')
      .invoke('height')
      .should('equal', iconSize);
    cy.dataCy('button-create-company-challenge')
      .find('i')
      .invoke('width')
      .should('equal', iconSize);
    // title-button alignment
    cy.testElementsSideBySide(
      'table-company-challenge-title',
      'button-create-company-challenge',
    );
    // table company challenge
    cy.dataCy('table-company-challenge').should('be.visible');
  });

  it('opens dialog when button create company challenge is clicked', () => {
    cy.fixture('apiGetThisCampaign.json').then((response) => {
      cy.wrap(useChallengeStore()).then((store) => {
        store.setPhaseSet(response.results[0].phase_set);
      });
    });
    cy.dataCy('button-create-company-challenge').click();
    cy.dataCy('dialog-company-challenge')
      .should('be.visible')
      .within(() => {
        // dialog header
        cy.dataCy('dialog-header')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('coordinator.titleCreateCompanyChallenge'),
          );
        // dialog form
        cy.dataCy('form-company-challenge').should('be.visible');
        // dialog action buttons
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
}

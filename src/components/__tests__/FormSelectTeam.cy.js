import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import FormSelectTeam from 'components/form/FormSelectTeam.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

const subsidiaryIdDefault = 1972;

// selectors
const selectorFormSelectTeam = 'form-select-team';
const selectorFormSelectTableTeam = 'form-select-table-team';
const selectorFormSelectTeamInfo = 'form-select-team-info';
const selectorTableOptionGroup = 'form-select-table-option';

describe('<FormSelectTeam>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textTeamInfo', 'textTeamInfoJanuary'],
      'register.challenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptTeamsGetApi(
        rideToWorkByBikeConfig,
        i18n,
        subsidiaryIdDefault,
      );
      cy.interceptTeamPostApi(
        rideToWorkByBikeConfig,
        i18n,
        subsidiaryIdDefault,
      );
      cy.mount(FormSelectTeam, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptTeamsGetApi(
        rideToWorkByBikeConfig,
        i18n,
        subsidiaryIdDefault,
      );
      cy.interceptTeamPostApi(
        rideToWorkByBikeConfig,
        i18n,
        subsidiaryIdDefault,
      );
      cy.mount(FormSelectTeam, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('does not show text when maxTeamMembers is falsy', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 0);
    cy.dataCy(selectorFormSelectTeamInfo)
      .should('exist')
      .invoke('text')
      .should('be.empty');
  });

  it('displays dynamic team info text based on maxTeamMembers with count 3', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 3);
    cy.dataCy(selectorFormSelectTeamInfo)
      .should('be.visible')
      .invoke('text')
      .should('include', '3');
  });

  it('displays dynamic team info text based on maxTeamMembers with count 10', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 10);
    cy.dataCy(selectorFormSelectTeamInfo)
      .should('be.visible')
      .invoke('text')
      .should('include', '10');
  });

  it('renders component', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 5);
    // component
    cy.dataCy(selectorFormSelectTeam).should('be.visible');
    // info text (dynamic based on maxTeamMembers)
    cy.dataCy(selectorFormSelectTeamInfo).should('be.visible');
    // select table
    cy.dataCy(selectorFormSelectTableTeam).should('be.visible');
  });

  it('loads teams', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 5);
    cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
      cy.fixture('apiGetTeamsResponseNext').then((teamsResponseNext) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setSubsidiaryId(subsidiaryIdDefault);
          const subsidiaryId = computed(() => store.getSubsidiaryId);
          cy.wrap(subsidiaryId)
            .its('value')
            .should('equal', subsidiaryIdDefault);
          cy.waitForTeamsGetApi();
          cy.dataCy('spinner-progress-bar').should('not.exist');
          cy.dataCy(selectorTableOptionGroup)
            .should('be.visible')
            .find('.q-radio__inner')
            .should(
              'have.length',
              teamsResponse.results.length + teamsResponseNext.results.length,
            );
        });
      });
    });
  });

  it('allows to create a new team', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 5);
    cy.fixture('apiPostTeamRequest').then((teamRequest) => {
      cy.fixture('apiPostTeamResponse').then(() => {
        // set subsidiary id in store
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setSubsidiaryId(subsidiaryIdDefault);
          // wait for initial load
          cy.waitForTeamsGetApi();
          cy.dataCy('spinner-progress-bar').should('not.exist');
          // create new team
          cy.dataCy('button-add-option').click();
          cy.dataCy('form-add-team-name').find('input').type(teamRequest.name);
          // submit form
          cy.dataCy('dialog-button-submit').click();
          // wait for team creation
          cy.waitForTeamPostApi();
          // verify dialog closed
          cy.dataCy('dialog-add-option').should('not.exist');
          // get teams fixture data to compare with updated list
          cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
            cy.fixture('apiGetTeamsResponseNext').then((teamsResponseNext) => {
              // verify new team appears in the list
              cy.dataCy('form-select-table-team')
                .find('.q-radio__label')
                .should(
                  'have.length',
                  teamsResponse.results.length +
                    teamsResponseNext.results.length +
                    1,
                )
                .and('contain', teamRequest.name);
              // new team is selected
              cy.dataCy('form-select-table-team')
                .find('.q-radio__inner.q-radio__inner--truthy')
                .siblings('.q-radio__label')
                .should('contain', teamRequest.name);
            });
          });
        });
      });
    });
  });
}

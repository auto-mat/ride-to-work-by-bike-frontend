import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import FormSelectTeam from 'components/form/FormSelectTeam.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
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
      ['textTeamInfo'],
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
      cy.mount(FormSelectTeam, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormSelectTeam).should('be.visible');
    // info text
    cy.dataCy(selectorFormSelectTeamInfo)
      .should('be.visible')
      .should('have.text', i18n.global.t('register.challenge.textTeamInfo'));
    // select table
    cy.dataCy(selectorFormSelectTableTeam).should('be.visible');
  });

  it('loads teams', () => {
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
}

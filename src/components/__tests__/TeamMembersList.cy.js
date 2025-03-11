import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import TeamMembersList from 'components/profile/TeamMembersList.vue';
import { i18n } from '../../boot/i18n';
import { useRegisterChallengeStore } from 'stores/registerChallenge';
import { TeamMemberStatus } from 'components/enums/TeamMember';

// colors
const { getPaletteColor } = colors;
const positive = getPaletteColor('positive');
const negative = getPaletteColor('negative');
const warning = getPaletteColor('warning');

describe('<TeamMembersList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['approved', 'denied', 'titleMembers', 'undecided'],
      'teamMembersList',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TeamMembersList, {
        props: {},
      });
      cy.viewport('macbook-16');
      // initialize store with myTeam array
      cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          // set myTeam in store
          const myTeam = computed(() => registerChallengeStore.getMyTeam);
          registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
          cy.wrap(myTeam)
            .its('value')
            .should('deep.equal', responseMyTeam.results[0]);
        });
      });
    });

    coreTests();

    it('renders name and status side by side', () => {
      cy.testElementsSideBySide('team-member-name', 'team-member-status-chip');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TeamMembersList, {
        props: {},
      });
      cy.viewport('iphone-6');

      cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          // set myTeam in store
          const myTeam = computed(() => registerChallengeStore.getMyTeam);
          registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
          cy.wrap(myTeam)
            .its('value')
            .should('deep.equal', responseMyTeam.results[0]);
        });
      });
    });

    coreTests();

    it('renders name and status stacked', () => {
      cy.testElementsStacked('team-member-name', 'team-member-status-chip');
    });
  });
});

function coreTests() {
  it('renders root element', () => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then(() => {
      cy.dataCy('team-members-list').should('be.visible');
    });
  });

  it('renders title with correct text', () => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then(() => {
      cy.dataCy('team-members-list-title')
        .should('be.visible')
        .and('contain', i18n.global.t('teamMembersList.titleMembers'));
    });
  });

  it('renders correct number of team member items', () => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.dataCy('team-member-item').should(
        'have.length',
        responseMyTeam.results[0].members.length,
      );
    });
  });

  it('renders correct content for each team member item', () => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.dataCy('team-member-item').each((item, index) => {
        cy.dataCy('team-members-list').click();
        // name
        cy.wrap(item).should(
          'contain',
          responseMyTeam.results[0].members[index].name,
        );
        // email
        cy.wrap(item).should(
          'contain',
          responseMyTeam.results[0].members[index].email,
        );
        // gender
        cy.wrap(item).should(
          'contain',
          responseMyTeam.results[0].members[index].sex,
        );
        // approval status
        if (
          responseMyTeam.results[0].members[index].approved_for_team ===
          TeamMemberStatus.approved
        ) {
          cy.wrap(item).within(() => {
            cy.dataCy('team-member-status-chip')
              .should('be.visible')
              .should('have.backgroundColor', positive)
              .and('contain', i18n.global.t('teamMembersList.approved'));
          });
        } else if (
          responseMyTeam.results[0].members[index].approved_for_team ===
          TeamMemberStatus.denied
        ) {
          cy.wrap(item).within(() => {
            cy.dataCy('team-member-status-chip')
              .should('be.visible')
              .should('have.backgroundColor', negative)
              .and('contain', i18n.global.t('teamMembersList.denied'));
          });
        } else if (
          responseMyTeam.results[0].members[index].approved_for_team ===
          TeamMemberStatus.undecided
        ) {
          cy.wrap(item).within(() => {
            cy.dataCy('team-member-status-chip')
              .should('be.visible')
              .should('have.backgroundColor', warning)
              .and('contain', i18n.global.t('teamMembersList.undecided'));
          });
        }
      });
    });
  });
}

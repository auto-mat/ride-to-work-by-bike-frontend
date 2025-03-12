import DialogInviteFriends from '../global/DialogInviteFriends.vue';
import { i18n } from '../../boot/i18n';
import { createPinia, setActivePinia } from 'pinia';
import { computed } from 'vue';
import { useInviteFriendsStore } from '../../stores/inviteFriends';
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { defLocale } from '../../i18n/def_locale';

describe('<DialogInviteFriends>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['inviteFriends'], 'drawerMenu', i18n);
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.mount(DialogInviteFriends, {
      props: {},
    });
    // Set initial store state
    cy.fixture('apiGetThisCampaign.json').then((thisCampaignResponse) => {
      cy.wrap(useChallengeStore()).then((challengeStore) => {
        const maxTeamMembers = computed(() => challengeStore.getMaxTeamMembers);
        challengeStore.setMaxTeamMembers(
          thisCampaignResponse.results[0].max_team_members,
        );
        // test max team members number in store
        cy.wrap(maxTeamMembers)
          .its('value')
          .should('be.equal', thisCampaignResponse.results[0].max_team_members);
      });
    });
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        // set myTeam in store
        const myTeam = computed(() => registerChallengeStore.getMyTeam);
        registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
        cy.wrap(myTeam)
          .its('value')
          .should('deep.equal', responseMyTeam.results[0]);
        // set language in store
        const language = computed(() => registerChallengeStore.getLanguage);
        registerChallengeStore.setLanguage(defLocale);
        cy.wrap(language).its('value').should('equal', defLocale);
      });
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
    });
    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport(320, 1024);
    });
    coreTests();
  });
});

function coreTests() {
  it('shows dialog and form when store isDialogOpen is true', () => {
    // test initial state
    cy.wrap(useInviteFriendsStore()).then((inviteFriendsStore) => {
      // get computed value for dialog state
      const isDialogOpen = computed(() => inviteFriendsStore.getIsDialogOpen);
      // check store value
      cy.wrap(isDialogOpen).its('value').should('be.false');
      cy.dataCy('dialog-invite-friends').should('not.exist');
    });
    // open dialog
    cy.wrap(useInviteFriendsStore()).then((inviteFriendsStore) => {
      cy.wrap(inviteFriendsStore.openDialog());
      // get computed value for dialog state
      const isDialogOpen = computed(() => inviteFriendsStore.getIsDialogOpen);
      // check store value
      cy.wrap(isDialogOpen).its('value').should('be.true');
      // verify dialog and form visibility
      cy.dataCy('dialog-invite-friends').should('be.visible');
      cy.dataCy('form-invite-friends').should('be.visible');
      // verify dialog title
      cy.dataCy('dialog-invite-friends').within(() => {
        cy.contains(i18n.global.t('drawerMenu.inviteFriends')).should(
          'be.visible',
        );
      });
    });
  });
}

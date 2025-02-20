import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import BannerTeamMemberApprove from 'components/global/BannerTeamMemberApprove.vue';
import { i18n } from '../../boot/i18n';
import { useChallengeStore } from 'stores/challenge';
import { useRegisterChallengeStore } from 'stores/registerChallenge';

describe('<BannerTeamMemberApprove>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponse.json').then((responseMyTeam) => {
        cy.wrap(useChallengeStore()).then((challengeStore) => {
          cy.fixture('apiGetThisCampaign.json').then((thisCampaignResponse) => {
            const maxTeamMembers = computed(
              () => challengeStore.getMaxTeamMembers,
            );
            challengeStore.setMaxTeamMembers(
              thisCampaignResponse.results[0].max_team_members,
            );
            // test max team members number in store
            cy.wrap(maxTeamMembers)
              .its('value')
              .should(
                'be.equal',
                thisCampaignResponse.results[0].max_team_members,
              );
          });
        });
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          // set myTeam in store
          const myTeam = computed(() => registerChallengeStore.getMyTeam);
          registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
          cy.wrap(myTeam)
            .its('value')
            .should('deep.equal', responseMyTeam.results[0]);
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponse.json').then((responseMyTeam) => {
        cy.wrap(useChallengeStore()).then((challengeStore) => {
          cy.fixture('apiGetThisCampaign.json').then((thisCampaignResponse) => {
            const maxTeamMembers = computed(
              () => challengeStore.getMaxTeamMembers,
            );
            challengeStore.setMaxTeamMembers(
              thisCampaignResponse.results[0].max_team_members,
            );
            // test max team members number in store
            cy.wrap(maxTeamMembers)
              .its('value')
              .should(
                'be.equal',
                thisCampaignResponse.results[0].max_team_members,
              );
          });
        });
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          // set myTeam in store
          const myTeam = computed(() => registerChallengeStore.getMyTeam);
          registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
          cy.wrap(myTeam)
            .its('value')
            .should('deep.equal', responseMyTeam.results[0]);
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('apiGetMyTeamResponse.json').then((responseMyTeam) => {
      // component
      cy.dataCy('banner-team-member-approve').should('be.visible');
      // approve members button
      cy.dataCy('banner-team-member-approve-button')
        .should('be.visible')
        .click();
      // dialog
      cy.dataCy('dialog-approve-members').should('be.visible');
      // members to approve
      cy.dataCy('dialog-approve-members-member')
        .should('be.visible')
        .and('have.length', responseMyTeam.results[0].unapproved_member_count);
    });
  });
}

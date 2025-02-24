import { colors } from 'quasar';
import { computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import BannerTeamMemberApprove from 'components/global/BannerTeamMemberApprove.vue';
import { i18n } from '../../boot/i18n';
import { useChallengeStore } from 'stores/challenge';
import { useRegisterChallengeStore } from 'stores/registerChallenge';

// colors
const { changeAlpha, getPaletteColor } = colors;
const positive = getPaletteColor('positive');
const negative = getPaletteColor('negative');
const black = getPaletteColor('black');
const colorTransparent = changeAlpha(black, 0);

describe('<BannerTeamMemberApprove>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['save', 'discard'], 'navigation', i18n);
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'putMyTeam',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'buttonApproveMembers',
        'buttonDialogApprove',
        'buttonDialogDeny',
        'dialogReason',
        'dialogTitle',
        'messageOtherMembersDenied',
        'textMembersToApprove',
        'textWaitingForApproval',
      ],
      'bannerTeamMemberApprove',
      i18n,
    );
  });

  context('desktop - approved member with many members to approve', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
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

  context('desktop - approved member with no members to approve', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponseOneMember.json').then(
        (responseMyTeam) => {
          cy.wrap(useChallengeStore()).then((challengeStore) => {
            cy.fixture('apiGetThisCampaign.json').then(
              (thisCampaignResponse) => {
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
              },
            );
          });
          cy.wrap(useRegisterChallengeStore()).then(
            (registerChallengeStore) => {
              // set myTeam in store
              const myTeam = computed(() => registerChallengeStore.getMyTeam);
              registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
              cy.wrap(myTeam)
                .its('value')
                .should('deep.equal', responseMyTeam.results[0]);
            },
          );
        },
      );
      cy.viewport('macbook-16');
    });

    it('does not show the banner', () => {
      cy.dataCy('banner-team-member-approve').should('not.exist');
    });
  });

  // handle case where team is full and there are still pending members
  context(
    'desktop - approved member with full team and pending members',
    () => {
      beforeEach(() => {
        setActivePinia(createPinia());
        cy.mount(BannerTeamMemberApprove, {
          props: {},
        });
        cy.fixture('apiGetMyTeamResponseFullTeam.json').then(
          (responseMyTeam) => {
            cy.wrap(useChallengeStore()).then((challengeStore) => {
              cy.fixture('apiGetThisCampaign.json').then(
                (thisCampaignResponse) => {
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
                },
              );
            });
            cy.wrap(useRegisterChallengeStore()).then(
              (registerChallengeStore) => {
                // set myTeam in store
                const myTeam = computed(() => registerChallengeStore.getMyTeam);
                registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
                cy.wrap(myTeam)
                  .its('value')
                  .should('deep.equal', responseMyTeam.results[0]);
              },
            );
          },
        );
        cy.viewport('macbook-16');
      });

      it('shows the banner but only allows to deny members', () => {
        cy.fixture('apiGetMyTeamResponseFullTeam.json').then(
          (responseMyTeam) => {
            const unapprovedMembers = responseMyTeam.results[0].members.filter(
              (member) => member.approved_for_team === 'undecided',
            );
            cy.dataCy('banner-team-member-approve').should('be.visible');
            // open dialog
            cy.dataCy('banner-team-member-approve-button')
              .should('be.visible')
              .click();
            // dialog
            cy.dataCy('dialog-approve-members').should('be.visible');
            // show message about other members being denied
            cy.contains(
              i18n.global.t(
                'bannerTeamMemberApprove.messageOtherMembersDenied',
              ),
            ).should('be.visible');
            // members to approve
            cy.dataCy('dialog-approve-members-member').should(
              'have.length',
              responseMyTeam.results[0].unapproved_member_count,
            );
            cy.dataCy('dialog-approve-members-member').each((member, index) => {
              cy.wrap(member).within(() => {
                // name
                cy.dataCy('dialog-approve-members-member-name').should(
                  'contain',
                  unapprovedMembers[index].name,
                );
                // deny button
                cy.dataCy('dialog-approve-members-button-deny').should(
                  'be.visible',
                );
                // deny button is selected
                cy.dataCy('dialog-approve-members-button-deny').should(
                  'have.backgroundColor',
                  negative,
                );
                // approve button is disabled
                cy.dataCy('dialog-approve-members-button-approve').should(
                  'be.disabled',
                );
              });
            });
          },
        );
      });
    },
  );

  context('desktop - undecided member', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponseUndecided.json').then(
        (responseMyTeam) => {
          cy.wrap(useChallengeStore()).then((challengeStore) => {
            cy.fixture('apiGetThisCampaign.json').then(
              (thisCampaignResponse) => {
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
              },
            );
          });
          cy.wrap(useRegisterChallengeStore()).then(
            (registerChallengeStore) => {
              // set myTeam in store
              const myTeam = computed(() => registerChallengeStore.getMyTeam);
              registerChallengeStore.setMyTeam(responseMyTeam.results[0]);
              cy.wrap(myTeam)
                .its('value')
                .should('deep.equal', responseMyTeam.results[0]);
            },
          );
        },
      );
    });

    it('shows the banner with text for undecided member', () => {
      cy.dataCy('banner-team-member-approve').should('be.visible');
      // title
      cy.dataCy('banner-team-member-approve-title').should(
        'contain',
        i18n.global.t('bannerTeamMemberApprove.textWaitingForApproval'),
      );
      // button
      cy.dataCy('banner-team-member-approve-button').should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(BannerTeamMemberApprove, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
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
      // tall viewport allows selecting all members without scrolling in dialog
      cy.viewport(320, 1500);
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('apiGetMyTeamResponseApproved.json').then((responseMyTeam) => {
      const unapprovedMembers = responseMyTeam.results[0].members.filter(
        (member) => member.approved_for_team === 'undecided',
      );
      // component
      cy.dataCy('banner-team-member-approve').should('be.visible');
      // approve members button
      cy.dataCy('banner-team-member-approve-button')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('bannerTeamMemberApprove.buttonApproveMembers'),
        )
        .click();
      // dialog
      cy.dataCy('dialog-approve-members').should('be.visible');
      // dialog title
      cy.dataCy('dialog-header')
        .should('be.visible')
        .and('contain', i18n.global.t('bannerTeamMemberApprove.dialogTitle'));
      // members to approve
      cy.dataCy('dialog-approve-members-member')
        .should('be.visible')
        .and('have.length', responseMyTeam.results[0].unapproved_member_count)
        .each((member, index) => {
          cy.wrap(member).within(() => {
            // member name
            cy.dataCy('dialog-approve-members-member-name')
              .should('be.visible')
              .and('contain', unapprovedMembers[index].name);
            // approve member button
            cy.dataCy('dialog-approve-members-button-approve')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t('bannerTeamMemberApprove.buttonDialogApprove'),
              );
            // deny member button
            cy.dataCy('dialog-approve-members-button-deny')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t('bannerTeamMemberApprove.buttonDialogDeny'),
              );
          });
        });
      // scroll to bottom for mobile tests
      cy.dataCy('dialog-body').scrollTo('bottom', {
        ensureScrollable: false,
      });
      // cancel dialog button
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('contain', i18n.global.t('navigation.discard'));
      // save dialog button
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('contain', i18n.global.t('navigation.save'));
    });
  });

  it('shows a green button when member is approved and a red button when member is denied', () => {
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // first member
    cy.dataCy('dialog-approve-members-member')
      .first()
      .within(() => {
        // approve member button
        cy.dataCy('dialog-approve-members-button-approve')
          .should('be.visible')
          .click();
        cy.dataCy('dialog-approve-members-button-approve').should(
          'have.backgroundColor',
          positive,
        );
      });
    // second member
    cy.dataCy('dialog-approve-members-member')
      .eq(1)
      .within(() => {
        // deny member button
        cy.dataCy('dialog-approve-members-button-deny')
          .should('be.visible')
          .click();
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
        // deny reason
        cy.dataCy('dialog-approve-members-member-reason')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('bannerTeamMemberApprove.dialogReason'),
          );
      });
  });

  it('auto-rejects remaining members when max approvals number is reached', () => {
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // approve first 4 members
    cy.dataCy('dialog-approve-members-member').each((member, index) => {
      if (index < 4) {
        cy.wrap(member).within(() => {
          cy.dataCy('dialog-approve-members-button-approve')
            .should('be.visible')
            .click();
          // approve button selected
          cy.dataCy('dialog-approve-members-button-approve').should(
            'have.backgroundColor',
            positive,
          );
        });
      }
    });
    // shows message about other members being denied
    cy.contains(
      i18n.global.t('bannerTeamMemberApprove.messageOtherMembersDenied'),
    ).should('be.visible');
    // check 5th member
    cy.dataCy('dialog-approve-members-member')
      .eq(4)
      .within(() => {
        // deny button is selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
        // approve button is disabled
        cy.dataCy('dialog-approve-members-button-approve').should(
          'be.disabled',
        );
      });
    // deny 4th member
    cy.dataCy('dialog-approve-members-member')
      .eq(3)
      .within(() => {
        cy.dataCy('dialog-approve-members-button-deny')
          .should('be.visible')
          .click();
        // deny button is selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
      });
    // check 5th member
    cy.dataCy('dialog-approve-members-member')
      .eq(4)
      .within(() => {
        // deny button is selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
        // approve button is not disabled
        cy.dataCy('dialog-approve-members-button-approve').should(
          'not.be.disabled',
        );
      });
    // approve 5th member
    cy.dataCy('dialog-approve-members-member')
      .eq(4)
      .within(() => {
        cy.dataCy('dialog-approve-members-button-approve')
          .should('be.visible')
          .click();
        // approve button is selected
        cy.dataCy('dialog-approve-members-button-approve').should(
          'have.backgroundColor',
          positive,
        );
      });
    // check 4th member
    cy.dataCy('dialog-approve-members-member')
      .eq(3)
      .within(() => {
        // deny button is selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
        // approve button is disabled
        cy.dataCy('dialog-approve-members-button-approve').should(
          'be.disabled',
        );
      });
  });

  it('allows to reject any amount of members', () => {
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // deny all members
    cy.dataCy('dialog-approve-members-member').each((member) => {
      cy.wrap(member).within(() => {
        // deny button
        cy.dataCy('dialog-approve-members-button-deny')
          .should('be.visible')
          .click();
        // deny button selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
      });
    });
  });

  it('clears selection after the dialog is closed', () => {
    // open modal
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog
    cy.dataCy('dialog-approve-members').should('be.visible');
    // deny all members
    cy.dataCy('dialog-approve-members-member').each((member) => {
      cy.wrap(member).within(() => {
        // deny button
        cy.dataCy('dialog-approve-members-button-deny')
          .should('be.visible')
          .click();
        // deny button selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          negative,
        );
      });
    });
    // scroll to bottom for mobile tests
    cy.dataCy('dialog-body').scrollTo('bottom', {
      ensureScrollable: false,
    });
    // close dialog
    cy.dataCy('dialog-button-cancel').should('be.visible').click();
    // dialog is closed
    cy.dataCy('dialog-approve-members').should('not.exist');
    // approve members button is visible
    cy.dataCy('banner-team-member-approve-button').should('be.visible').click();
    // dialog is open
    cy.dataCy('dialog-approve-members').should('be.visible');
    // no members are selected
    cy.dataCy('dialog-approve-members-member').each((member) => {
      cy.wrap(member).within(() => {
        // deny button is not selected
        cy.dataCy('dialog-approve-members-button-deny').should(
          'have.backgroundColor',
          colorTransparent,
        );
      });
    });
  });
}

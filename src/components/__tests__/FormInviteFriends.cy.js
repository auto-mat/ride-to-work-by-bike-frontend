import { colors } from 'quasar';
import { computed } from 'vue';
import FormInviteFriends from 'components/form/FormInviteFriends.vue';
import { i18n } from '../../boot/i18n';
import { createPinia, setActivePinia } from 'pinia';
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { defLocale } from '../../i18n/def_locale';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

describe('<FormInviteFriends>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonInviteFriends',
        'buttonAddEmailField',
        'labelInviteEmailAddresses',
        'labelLanguage',
        'textMessage',
        'titleMessage',
      ],
      'onboarding',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['messageFieldRequired', 'messageEmailInvalid', 'labelEmail'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(['cs', 'en', 'sk'], 'language', i18n);
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    cy.mount(FormInviteFriends, {
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

    it('renders columns side-by-side', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-1'), 50);
      cy.testElementPercentageWidth(cy.dataCy('column-2'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders columns stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-1'), 100);
      cy.testElementPercentageWidth(cy.dataCy('column-2'), 100);
    });
  });

  context('team with no team slots available', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormInviteFriends, {
        props: {},
      });
      cy.fixture('apiGetMyTeamResponseFullTeam.json').then((responseMyTeam) => {
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

      cy.viewport('macbook-16');
    });

    it('validates email fields and allows adding/removing fields', () => {
      cy.dataCy('message-team-full').should('be.visible');
    });
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy('form-invite-friends').should('be.visible');
      cy.dataCy('invite-description')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.css', 'margin-bottom', '24px')
        .and('have.color', grey10);
      cy.dataCy('invite-email-addresses')
        .should('be.visible')
        .and('have.css', 'margin-top', '16px')
        .and('have.css', 'margin-bottom', '16px')
        .find('label')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('invite-email-addresses-input').should('be.visible');
      cy.dataCy('invite-language')
        .should('be.visible')
        .and('have.css', 'margin-top', '24px')
        .and('have.css', 'margin-bottom', '24px')
        .find('label[for="select-language"]')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('title-message')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black)
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('text-message')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', black)
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.textMessage')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
    });

    it('allows to change the message language', () => {
      cy.testMessageLanguageSelect(i18n);
    });

    it('validates email fields and allows adding/removing fields', () => {
      // initially shows one email field
      cy.dataCy('invite-email-addresses-input').should('have.length', 1);
      // can add more fields up to remaining slots (4 in this case)
      cy.dataCy('add-email-field').click();
      cy.dataCy('invite-email-addresses-input').should('have.length', 2);
      cy.dataCy('add-email-field').click();
      cy.dataCy('invite-email-addresses-input').should('have.length', 3);
      cy.dataCy('add-email-field').click();
      cy.dataCy('invite-email-addresses-input').should('have.length', 4);
      cy.dataCy('add-email-field').should('not.exist');
      // can remove fields
      cy.dataCy('remove-email-field').first().click();
      cy.dataCy('invite-email-addresses-input').should('have.length', 3);
      cy.dataCy('add-email-field').should('exist');
      // validates email format
      cy.dataCy('invite-email-addresses-input')
        .first()
        .find('input')
        .type('invalid-email');
      cy.dataCy('form-invite-submit').click();
      cy.get('.q-field__messages').should(
        'contain',
        i18n.global.t('form.messageEmailInvalid'),
      );
      // validates required field
      cy.dataCy('invite-email-addresses-input').first().find('input').clear();
      cy.dataCy('form-invite-submit').click();
      cy.get('.q-field__messages').should(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelEmail'),
        }),
      );
    });
  }
});

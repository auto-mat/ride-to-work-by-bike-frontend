import { createPinia, setActivePinia } from 'pinia';
import CoordinatorRegistrationLink from 'components/coordinator/CoordinatorRegistrationLink.vue';
import { i18n } from '../../boot/i18n';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

describe('<CoordinatorRegistrationLink>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textBannerRegistrationIncomplete', 'buttonGoToRegistration'],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.viewport('macbook-16');
      cy.mount(CoordinatorRegistrationLink, {
        props: {},
      });
      cy.setupRegisterChallengeIsUserOrganizationAdmin(
        useRegisterChallengeStore,
        true,
      );
    });

    it('does not render when user is not organization admin', () => {
      cy.dataCy('coordinator-registration-link').should('be.visible');
      cy.setupRegisterChallengeIsUserOrganizationAdmin(
        useRegisterChallengeStore,
        false,
      );
      cy.dataCy('coordinator-registration-link').should('not.exist');
    });

    it('does not render when registration is complete', () => {
      cy.dataCy('coordinator-registration-link').should('be.visible');
      cy.setupRegisterChallengeCompleteRegistration(useRegisterChallengeStore);
      cy.dataCy('coordinator-registration-link').should('not.exist');
    });

    it('renders banner when admin and registration incomplete', () => {
      cy.dataCy('coordinator-registration-link').should('be.visible');
      cy.dataCy('coordinator-registration-link-text')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('coordinator.textBannerRegistrationIncomplete'),
        );
      cy.dataCy('coordinator-registration-link-button')
        .should('be.visible')
        .and('contain', i18n.global.t('coordinator.buttonGoToRegistration'));
    });
  });
});

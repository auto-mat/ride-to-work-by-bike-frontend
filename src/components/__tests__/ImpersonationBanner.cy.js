import { createPinia, setActivePinia } from 'pinia';
import ImpersonationBanner from '../global/ImpersonationBanner.vue';
import { i18n } from '../../boot/i18n';
import { useLoginStore } from '../../stores/login';

const impersonatedUserEmail = 'impersonated-user@example.com';
const impersonationState = {
  isActive: true,
  originalAdmin: null,
  impersonatedUser: { user: { pk: 123, email: impersonatedUserEmail } },
};

describe('<ImpersonationBanner>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['viewingAsUser', 'exitButton'],
      'impersonation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(ImpersonationBanner, { props: {} });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows the exit button with icon and label', () => {
      const loginStore = useLoginStore();
      loginStore.setImpersonation(impersonationState);
      cy.dataCy('impersonation-exit-button').should(
        'contain',
        i18n.global.t('impersonation.exitButton'),
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(ImpersonationBanner, { props: {} });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('shows the exit button with icon only, no label', () => {
      const loginStore = useLoginStore();
      loginStore.setImpersonation(impersonationState);
      cy.dataCy('impersonation-exit-button').should(
        'not.contain',
        i18n.global.t('impersonation.exitButton'),
      );
    });
  });
});

function coreTests() {
  it('renders nothing when not impersonating', () => {
    cy.dataCy('impersonation-banner').should('not.exist');
  });

  it('shows the banner with the impersonated user email when active', () => {
    const loginStore = useLoginStore();
    loginStore.setImpersonation(impersonationState);
    cy.dataCy('impersonation-banner').should('be.visible');
    cy.dataCy('impersonation-banner').should(
      'contain',
      i18n.global.t('impersonation.viewingAsUser', {
        email: impersonatedUserEmail,
      }),
    );
  });

  it('hides the banner again once impersonation is cleared', () => {
    const loginStore = useLoginStore();
    loginStore.setImpersonation(impersonationState);
    cy.dataCy('impersonation-banner').should('be.visible');
    // cy.then runs the function sequentially
    cy.then(() => {
      loginStore.clearImpersonation();
    });
    cy.dataCy('impersonation-banner').should('not.exist');
  });

  it('calls exitImpersonation when the exit button is clicked', () => {
    const loginStore = useLoginStore();
    loginStore.setImpersonation(impersonationState);
    cy.stub(loginStore, 'exitImpersonation').as('exitImpersonation');
    cy.dataCy('impersonation-exit-button').click();
    cy.get('@exitImpersonation').should('have.been.called');
  });
}

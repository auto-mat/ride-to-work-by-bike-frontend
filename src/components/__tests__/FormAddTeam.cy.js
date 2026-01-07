import { createPinia, setActivePinia } from 'pinia';
import FormAddTeam from 'components/form/FormAddTeam.vue';
import { i18n } from '../../boot/i18n';
import { useChallengeStore } from 'src/stores/challenge';

describe('<FormAddTeam>', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const updateSpy = cy.spy().as('updateSpy');
    cy.mount(FormAddTeam, {
      props: {
        formValues: { name: '' },
        'onUpdate:formValues': updateSpy,
      },
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelTeamName', 'labelTeam', 'textTeam'],
      'form.team',
      i18n,
    );
  });

  it('renders component', () => {
    cy.dataCy('form-add-team-name').should('be.visible');
  });

  it('does not show text when maxTeamMembers is falsy', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 0);
    cy.dataCy('form-add-team-text')
      .should('exist')
      .invoke('text')
      .should('be.empty');
  });

  it('does not show text on maxTeamMembers == 1', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 1);
    cy.dataCy('form-add-team-text')
      .should('exist')
      .invoke('text')
      .should('be.empty');
  });

  it('displays dynamic team text based on maxTeamMembers with count 3', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 3);
    cy.dataCy('form-add-team-text').invoke('html').should('include', '3');
  });

  it('displays dynamic team text based on maxTeamMembers with count 10', () => {
    cy.setupChallengeMaxTeamMembers(useChallengeStore, 10);
    cy.dataCy('form-add-team-text').invoke('html').should('include', '10');
  });

  it('emits update when team name changes', () => {
    cy.dataCy('form-add-team-name').find('input').type('Test Team Name');
    cy.get('@updateSpy').should('have.been.called');
  });
});

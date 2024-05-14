import ResultsChallengeOngoing from 'components/results/ResultsChallengeOngoing.vue';
import { i18n } from '../../boot/i18n';

describe('<ResultsChallengeOngoing>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonPastChallenges',
        'titleBadges',
        'titleCurrentResults',
        'titleOngoingChallenges',
        'titlePastChallenges',
        'titleRecentChallenges',
        'titleUpcomingChallenges',
      ],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ResultsChallengeOngoing, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ResultsChallengeOngoing, {
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
    cy.dataCy('results-challenge-ongoing').should('be.visible');
    // current results title
    cy.dataCy('current-results-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleCurrentResults'));
    // current results list
    cy.dataCy('current-results-list').should('be.visible');
    // ongoing challenges title
    cy.dataCy('ongoing-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleOngoingChallenges'));
    // TODO: ongoing challenges list
    // cy.dataCy('ongoing-challenges-list')
    //   .should('be.visible');
    // badges title
    cy.dataCy('badges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleBadges'));
    // badges list
    cy.dataCy('badges-list').should('be.visible');
    // title challenges upcoming
    cy.dataCy('upcoming-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleUpcomingChallenges'));
    // list challenges upcoming
    cy.dataCy('upcoming-challenges').should('be.visible');
    // title challenges recent
    cy.dataCy('recent-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleRecentChallenges'));
    // list challenges recent
    cy.dataCy('recent-challenges').should('be.visible');
    // title past challenges
    cy.dataCy('past-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titlePastChallenges'));
    // button past challenges
    cy.dataCy('past-challenges-button')
      .should('be.visible')
      .and('contain', i18n.global.t('results.buttonPastChallenges'));
  });
}

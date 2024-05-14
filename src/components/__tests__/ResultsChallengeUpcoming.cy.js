import ResultsChallengeUpcoming from 'components/results/ResultsChallengeUpcoming.vue';
import { i18n } from '../../boot/i18n';

describe('<ResultsChallengeUpcoming>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonPastChallenges',
        'titleBadges',
        'titlePastChallenges',
        'titleUpcomingChallenges',
      ],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ResultsChallengeUpcoming, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ResultsChallengeUpcoming, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('results-challenge-upcoming').should('be.visible');
    // title challenges
    cy.dataCy('upcoming-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleUpcomingChallenges'));
    // list challenges
    cy.dataCy('upcoming-challenges').should('be.visible');
    // title badges
    cy.dataCy('badges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('results.titleBadges'));
    // list badges
    cy.dataCy('list-badges').should('be.visible');
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

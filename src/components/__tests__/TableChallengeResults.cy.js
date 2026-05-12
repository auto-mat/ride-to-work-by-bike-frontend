import TableChallengeResults from 'components/results/TableChallengeResults.vue';
import { i18n } from '../../boot/i18n';
import { CompetitionType } from '../enums/Challenge';

describe('<TableChallengeResults>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['emptyStateChallengeResults', 'labelColumnName'],
      'results',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders participant names from rows', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results').should('be.visible');
      cy.dataCy('table-challenge-results-name').should(
        'have.length',
        response.results.length,
      );
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-name')
          .eq(index)
          .should('contain', result.name);
      });
    });
  });

  it('shows empty state when rows array is empty', () => {
    cy.mount(TableChallengeResults, {
      props: {
        rows: [],
        competitionType: CompetitionType.frequency,
      },
    });
    cy.dataCy('table-challenge-results-empty')
      .should('be.visible')
      .and('contain', i18n.global.t('results.emptyStateChallengeResults'));
    cy.dataCy('table-challenge-results-name').should('not.exist');
  });
}

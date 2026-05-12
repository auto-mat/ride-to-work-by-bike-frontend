import TableChallengeResults from 'components/results/TableChallengeResults.vue';
import { i18n } from '../../boot/i18n';
import { CompetitionType } from '../enums/Challenge';

describe('<TableChallengeResults>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'emptyStateChallengeResults',
        'labelColumnName',
        'labelColumnPlace',
        'labelColumnResult',
        'labelColumnFrequency',
        'labelColumnDistance',
      ],
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
  it('renders the correct number of rows', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-row').should(
        'have.length',
        response.results.length,
      );
    });
  });

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

  it('renders place column with API rank (not row index)', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-place')
          .eq(index)
          .should('contain', result.place + '.');
      });
    });
  });

  it('renders result column formatted to 2 decimal places', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-result')
          .eq(index)
          .should('contain', result.result.toFixed(2));
      });
    });
  });

  it('renders frequency column values', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-frequency')
          .eq(index)
          .should('contain', result.frequency);
      });
    });
  });

  it('renders distance column values', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-distance')
          .eq(index)
          .should('contain', result.distance);
      });
    });
  });

  it('renders co2 column values from emissions.co2', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      response.results.forEach((result, index) => {
        cy.dataCy('table-challenge-results-co2')
          .eq(index)
          .should('contain', result.emissions.co2);
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

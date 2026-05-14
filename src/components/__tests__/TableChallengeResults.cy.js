import TableChallengeResults from 'components/results/TableChallengeResults.vue';
import { i18n } from '../../boot/i18n';
import { CompetitionType } from '../enums/Challenge';

const competitionResultDecimalNumber = 'competitionResultDecimalNumber';

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
          .should(
            'contain',
            i18n.global.n(result.result, competitionResultDecimalNumber),
          );
      });
    });
  });

  it('renders frequency column formatted to 2 decimal places', () => {
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
          .should(
            'contain',
            i18n.global.n(result.frequency, competitionResultDecimalNumber),
          );
      });
    });
  });

  it('renders distance column formatted to 2 decimal places', () => {
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
          .should(
            'contain',
            i18n.global.n(result.distance, competitionResultDecimalNumber),
          );
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
          .should(
            'contain',
            i18n.global.n(result.emissions.co2, competitionResultDecimalNumber),
          );
      });
    });
  });

  it('shows "gold" trophy icon for rank 1', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-place')
        .eq(0)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('exist')
        .and('be.visible')
        .find('.q-icon')
        .should('have.class', 'text-amber-4');
    });
  });

  it('shows "silver" trophy icon for rank 2', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-place')
        .eq(1)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('exist')
        .and('be.visible')
        .find('.q-icon')
        .should('have.class', 'text-blue-grey-2');
    });
  });

  it('shows "bronze" trophy icon for rank 3', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-place')
        .eq(2)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('exist')
        .and('be.visible')
        .find('.q-icon')
        .should('have.class', 'text-brown-3');
    });
  });

  it('shows no avatar or icon for rank > 3', () => {
    cy.fixture('apiGetCompetitionResultsResponse').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-place')
        .eq(3)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('not.exist');
    });
  });

  it('shows the same icon when users are tied', () => {
    cy.fixture('apiGetCompetitionResultsResponseTied').then((response) => {
      cy.mount(TableChallengeResults, {
        props: {
          rows: response.results,
          competitionType: CompetitionType.frequency,
        },
      });
      cy.dataCy('table-challenge-results-place')
        .eq(0)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('exist')
        .find('.q-icon')
        .should('have.class', 'text-amber-4');
      cy.dataCy('table-challenge-results-place')
        .eq(1)
        .find('[data-cy="table-challenge-results-place-icon"]')
        .should('exist')
        .find('.q-icon')
        .should('have.class', 'text-amber-4');
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

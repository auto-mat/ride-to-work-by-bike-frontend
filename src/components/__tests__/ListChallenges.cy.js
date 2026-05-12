import { createPinia, setActivePinia } from 'pinia';
import ListChallenges from 'components/global/ListChallenges.vue';
import { i18n } from '../../boot/i18n';
import { useAdminCompetitionStore } from '../../stores/adminCompetition';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

describe('<ListChallenges>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonShowResults'],
      'index.cardListChallenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.viewport('macbook-16');
      cy.mount(ListChallenges, {
        props: {},
      });
    });
    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.viewport('iphone-6');
      cy.mount(ListChallenges, {
        props: {},
      });
    });
    coreTests();
  });
});

function coreTests() {
  it('renders empty state with no competitions', () => {
    cy.setupAdminCompetitionStoreWithCompetitions(
      useAdminCompetitionStore,
      'apiGetCompetitionResponseEmpty',
    );
    // title
    cy.dataCy('list-challenges-title').should('be.visible');
    // empty state message
    cy.dataCy('list-challenges-empty-state')
      .should('be.visible')
      .and('contain', i18n.global.t('index.cardListChallenge.emptyState'));
    // no list container
    cy.dataCy('list-challenges-list').should('not.exist');
  });

  it('renders populated state with correct styling', () => {
    cy.setupAdminCompetitionStoreWithCompetitions(
      useAdminCompetitionStore,
      'apiGetCompetitionResponsePopulated',
    );
    cy.dataCy('list-challenges-title')
      .should('be.visible')
      .and('contain', i18n.global.t('index.cardListChallenge.title'));
    cy.dataCy('list-challenges-list').should('be.visible');
    // card count
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      cy.dataCy('list-challenges-card').should(
        'have.length',
        response.results.length,
      );
    });
  });

  it('renders populated state with correct content', () => {
    cy.setupAdminCompetitionStoreWithCompetitions(
      useAdminCompetitionStore,
      'apiGetCompetitionResponsePopulated',
    );
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      // all competitions rendered
      cy.dataCy('list-challenges-card').should(
        'have.length',
        response.results.length,
      );
      response.results.forEach((competition, index) => {
        cy.dataCy('list-challenges-card')
          .eq(index)
          .within(() => {
            cy.dataCy('list-challenges-name').should(
              'contain',
              competition.name,
            );
            if (competition.description) {
              cy.dataCy('list-challenges-description').should(
                'contain',
                competition.description,
              );
            } else {
              cy.dataCy('list-challenges-description').should('not.exist');
            }
            cy.dataCy('list-challenges-dates')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.d(new Date(competition.date_from), 'numeric'),
              )
              .and(
                'contain',
                i18n.global.d(new Date(competition.date_to), 'numeric'),
              );
          });
      });
      // transport icons per competition
      response.results.forEach((competition, index) => {
        cy.dataCy('list-challenges-card')
          .eq(index)
          .within(() => {
            competition.commute_modes.forEach((mode) => {
              cy.dataCy(`list-challenges-transport-icon-${mode.slug}`).should(
                'be.visible',
              );
            });
          });
      });
    });
  });

  it('renders show results button on each card', () => {
    cy.setupAdminCompetitionStoreWithCompetitions(
      useAdminCompetitionStore,
      'apiGetCompetitionResponsePopulated',
    );
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      cy.dataCy('list-challenges-button-show-results').should(
        'have.length',
        response.results.length,
      );
      cy.dataCy('list-challenges-button-show-results')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('index.cardListChallenge.buttonShowResults'),
        );
    });
  });

  it('opens results dialog with correct competition name', () => {
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      const firstCompetition = response.results[0];
      cy.interceptCompetitionResultsGetApi(
        rideToWorkByBikeConfig,
        firstCompetition.slug,
        'apiGetCompetitionResultsResponse',
      );
      cy.setupAdminCompetitionStoreWithCompetitions(
        useAdminCompetitionStore,
        'apiGetCompetitionResponsePopulated',
      );
      cy.dataCy('list-challenges-button-show-results').first().click();
      cy.dataCy('dialog-challenge-results').should('be.visible');
      cy.dataCy('dialog-challenge-results-title').should(
        'contain',
        firstCompetition.name,
      );
    });
  });

  it('renders participant names in results dialog', () => {
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      const firstCompetition = response.results[0];
      cy.interceptCompetitionResultsGetApi(
        rideToWorkByBikeConfig,
        firstCompetition.slug,
        'apiGetCompetitionResultsResponse',
      );
      cy.setupAdminCompetitionStoreWithCompetitions(
        useAdminCompetitionStore,
        'apiGetCompetitionResponsePopulated',
      );
      cy.dataCy('list-challenges-button-show-results').first().click();
      cy.waitForCompetitionResultsGetApi('apiGetCompetitionResultsResponse');
      cy.fixture('apiGetCompetitionResultsResponse').then((results) => {
        cy.dataCy('table-challenge-results-name').should(
          'have.length',
          results.results.length,
        );
        results.results.forEach((result, index) => {
          cy.dataCy('table-challenge-results-name')
            .eq(index)
            .should('contain', result.name);
        });
      });
    });
  });

  it('shows empty state in dialog when API returns no results', () => {
    cy.fixture('apiGetCompetitionResponsePopulated').then((response) => {
      const firstCompetition = response.results[0];
      cy.interceptCompetitionResultsGetApi(
        rideToWorkByBikeConfig,
        firstCompetition.slug,
        'apiGetCompetitionResultsResponseEmpty',
      );
      cy.setupAdminCompetitionStoreWithCompetitions(
        useAdminCompetitionStore,
        'apiGetCompetitionResponsePopulated',
      );
      cy.dataCy('list-challenges-button-show-results').first().click();
      cy.waitForCompetitionResultsGetApi(
        'apiGetCompetitionResultsResponseEmpty',
      );
      cy.dataCy('table-challenge-results-empty')
        .should('be.visible')
        .and('contain', i18n.global.t('results.emptyStateChallengeResults'));
    });
  });
}

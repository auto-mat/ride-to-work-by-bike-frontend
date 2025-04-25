import { createPinia, setActivePinia } from 'pinia';
import ResultsTabs from 'src/components/results/ResultsTabs.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { ResultsReportType } from 'src/components/enums/Results';

describe('<ResultsTabs>', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    cy.viewport('macbook-16');
    cy.mount(ResultsTabs, {
      props: {},
    });
    cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
      resultsResponses.forEach((resultsResponse) => {
        cy.interceptGetResultsApi(
          rideToWorkByBikeConfig,
          i18n,
          resultsResponse.key,
          resultsResponse.response,
        );
      });
    });
    cy.fixture('apiGetResultsByChallengeResponses').then(
      (resultsByChallengeResponses) => {
        resultsByChallengeResponses.forEach((resultsByChallengeResponse) => {
          cy.interceptGetResultsByChallengeApi(
            rideToWorkByBikeConfig,
            i18n,
            resultsByChallengeResponse.key,
            resultsByChallengeResponse.response,
          );
        });
      },
    );
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'may',
        'organizationsReview',
        'performanceCity',
        'performanceOrganization',
        'regularity',
        'septemberJanuary',
      ],
      'results.reportType',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'messageFailedToLoadResultsUrls',
        'messageFailedToLoadResultsUrlsWithMessage',
        'messageNoReport',
      ],
      'results',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getResults',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getResultsByChallenge',
      i18n,
    );
  });

  it('should load report URLs by challenge', () => {
    cy.fixture('apiGetResultsByChallengeResponses').then(
      (resultsByChallengeResponses) => {
        resultsByChallengeResponses.forEach((resultsByChallengeResponse) => {
          cy.waitForGetResultsByChallengeApi(
            resultsByChallengeResponse.response,
          );
          cy.dataCy(`results-tab-${resultsByChallengeResponse.key}`).should(
            'be.visible',
          );
        });
      },
    );
  });

  context('results page when user is organization admin', () => {
    beforeEach(() => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        registerChallengeStore.setIsUserOrganizationAdmin(true);
      });
    });

    it('should load report URLs relevant to organization admin', () => {
      cy.fixture('apiGetResultsByChallengeResponses').then(
        (resultsByChallengeResponses) => {
          resultsByChallengeResponses.forEach((resultsByChallengeResponse) => {
            cy.waitForGetResultsByChallengeApi(
              resultsByChallengeResponse.response,
            );
            cy.dataCy(`results-tab-${resultsByChallengeResponse.key}`).should(
              'be.visible',
            );
          });
        },
      );
      cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
        resultsResponses.forEach((resultsResponse) => {
          if (
            [
              ResultsReportType.regularity,
              ResultsReportType.performanceOrganization,
              ResultsReportType.organizationsReview,
            ].includes(resultsResponse.key)
          ) {
            cy.waitForGetResultsApi(resultsResponse.response);
            cy.dataCy(`results-tab-${resultsResponse.key}`).should(
              'be.visible',
            );
          }
        });
      });
    });
  });

  context('results page when user is staff', () => {
    beforeEach(() => {
      cy.fixture(
        'apiGetRegisterChallengeIndividualPaidCompleteStaff.json',
      ).then((registerChallengeResponse) => {
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          registerChallengeStore.setRegisterChallengeFromApi(
            registerChallengeResponse.results[0],
          );
        });
      });
    });

    it('should load report URLs relevant to staff', () => {
      cy.fixture('apiGetResultsByChallengeResponses').then(
        (resultsByChallengeResponses) => {
          resultsByChallengeResponses.forEach((resultsByChallengeResponse) => {
            cy.waitForGetResultsByChallengeApi(
              resultsByChallengeResponse.response,
            );
            cy.dataCy(`results-tab-${resultsByChallengeResponse.key}`).should(
              'be.visible',
            );
          });
        },
      );
      cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
        resultsResponses.forEach((resultsResponse) => {
          if (
            [
              ResultsReportType.regularity,
              ResultsReportType.performanceCity,
              ResultsReportType.organizationsReview,
            ].includes(resultsResponse.key)
          ) {
            cy.waitForGetResultsApi(resultsResponse.response);
            cy.dataCy(`results-tab-${resultsResponse.key}`).should(
              'be.visible',
            );
          }
        });
      });
    });
  });

  context('results page when user is organization admin and staff', () => {
    beforeEach(() => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        registerChallengeStore.setIsUserOrganizationAdmin(true);
      });
      cy.fixture(
        'apiGetRegisterChallengeIndividualPaidCompleteStaff.json',
      ).then((registerChallengeResponse) => {
        cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
          registerChallengeStore.setRegisterChallengeFromApi(
            registerChallengeResponse.results[0],
          );
        });
      });
    });

    it('should load report URLs relevant to organization admin and staff + allows to switch tabs', () => {
      cy.fixture('apiGetResultsByChallengeResponses').then(
        (resultsByChallengeResponses) => {
          resultsByChallengeResponses.forEach((resultsByChallengeResponse) => {
            cy.waitForGetResultsByChallengeApi(
              resultsByChallengeResponse.response,
            );
            cy.dataCy(`results-tab-${resultsByChallengeResponse.key}`)
              .should('be.visible')
              .click({ force: true });
            cy.dataCy(
              `results-tab-panel-${resultsByChallengeResponse.key}`,
            ).should('be.visible');
          });
        },
      );
      cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
        resultsResponses.forEach((resultsResponse) => {
          cy.waitForGetResultsApi(resultsResponse.response);
          cy.dataCy(`results-tab-${resultsResponse.key}`)
            .should('be.visible')
            .click({ force: true });
          cy.dataCy(`results-tab-panel-${resultsResponse.key}`)
            .should('be.visible')
            .within(() => {
              cy.dataCy('results-link-open-in-new-tab')
                .should('be.visible')
                .and('have.class', 'text-primary')
                .and('have.attr', 'target', '_blank')
                .and(
                  'have.attr',
                  'href',
                  resultsResponse.response.data_report_url,
                )
                .and(
                  'contain',
                  i18n.global.t('results.linkOpenResultsInNewTab'),
                );
            });
        });
      });
    });
  });
});

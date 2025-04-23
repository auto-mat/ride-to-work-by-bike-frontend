import ResultsPage from 'src/pages/ResultsPage.vue';
import { i18n } from '../../boot/i18n';

describe('<ResultsPage>', () => {
  beforeEach(() => {
    cy.mount(ResultsPage, {
      props: {},
    });
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
});

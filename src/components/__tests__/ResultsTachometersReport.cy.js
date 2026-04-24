import ResultsTachometersReport from 'components/results/ResultsTachometersReport.vue';
import { i18n } from '../../boot/i18n';
import { ResultsReportType } from 'src/components/enums/Results';

describe('<ResultsTachometersReport>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['linkOpenResultsInNewTab'],
      'results',
      i18n,
    );
  });

  it('shows section with link and iframe when src is provided', () => {
    cy.fixture('apiGetResultsResponses').then((resultsResponses) => {
      const tachometersResponse = resultsResponses.find(
        (resultsResponse) =>
          resultsResponse.key === ResultsReportType.tachometers,
      );
      cy.mount(ResultsTachometersReport, {
        props: { src: tachometersResponse.response.data_report_url },
      });
      cy.dataCy('results-tachometers-section').should('be.visible');
      cy.dataCy('results-tachometers-link-open-in-new-tab')
        .should('be.visible')
        .and('have.class', 'text-primary')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'href', tachometersResponse.response.data_report_url)
        .and('contain', i18n.global.t('results.linkOpenResultsInNewTab'));
      cy.dataCy('results-tachometers-iframe').should(
        'have.attr',
        'src',
        tachometersResponse.response.data_report_url,
      );
    });
  });

  it('hides section when src is not provided', () => {
    cy.mount(ResultsTachometersReport, {
      props: { src: '' },
    });
    cy.dataCy('results-tachometers-section').should('not.exist');
  });
});

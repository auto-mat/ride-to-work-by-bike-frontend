import ResultsTachometersReport from 'components/results/ResultsTachometersReport.vue';
import { i18n } from '../../boot/i18n';

const testSrc =
  'https://metabase.dopracenakole.net/public/question/tachometers-placeholder';

describe('<ResultsTachometersReport>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['linkOpenResultsInNewTab'],
      'results',
      i18n,
    );
  });

  it('shows section with link and iframe when src is provided', () => {
    cy.mount(ResultsTachometersReport, {
      props: { src: testSrc },
    });
    cy.dataCy('results-tachometers-section').should('be.visible');
    cy.dataCy('results-tachometers-link-open-in-new-tab')
      .should('be.visible')
      .and('have.class', 'text-primary')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'href', testSrc)
      .and('contain', i18n.global.t('results.linkOpenResultsInNewTab'));
    cy.dataCy('results-tachometers-iframe').should('have.attr', 'src', testSrc);
  });

  it('hides section when src is not provided', () => {
    cy.mount(ResultsTachometersReport, {
      props: { src: '' },
    });
    cy.dataCy('results-tachometers-section').should('not.exist');
  });
});

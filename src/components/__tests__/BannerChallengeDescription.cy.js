import BannerChallengeDescription from 'components/results/BannerChallengeDescription.vue';
import { i18n } from '../../boot/i18n';

describe('<BannerChallengeDescription>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['period', 'transportType'],
      'bannerChallengeDescription',
      i18n,
    );
    cy.testLanguageStringsInContext(['from', 'to'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerChallengeDescription, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerChallengeDescription, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('banner-challenge-description').should('be.visible');
    cy.dataCy('challenge-period').should('be.visible');
    cy.dataCy('challenge-transport').should('be.visible');
    cy.dataCy('challenge-description').should('be.visible');
    cy.dataCy('challenge-link').should('be.visible');
  });
}

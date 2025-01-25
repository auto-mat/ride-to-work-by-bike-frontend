import AutomatLogo from 'components/global/AutomatLogo.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// selectors
const selectorAutomatLogoButton = 'automat-logo-button';
const selectorAutomatLogoImage = 'automat-logo-image';

// variables
const logoHeight = 28;

describe('<AutomatLogo>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(AutomatLogo);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(AutomatLogo);
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorAutomatLogoButton).should('be.visible');
    cy.dataCy(selectorAutomatLogoImage).should('be.visible');
  });

  it('has correct link to AutoMat website', () => {
    cy.dataCy(selectorAutomatLogoButton)
      .should('have.attr', 'href')
      .and('include', rideToWorkByBikeConfig.urlAutoMat);
    // target="_blank"
    cy.dataCy(selectorAutomatLogoButton)
      .should('have.attr', 'target')
      .and('equal', '_blank');
  });

  it('has target="_blank" attribute', () => {
    cy.dataCy(selectorAutomatLogoButton)
      .should('have.attr', 'target')
      .and('equal', '_blank');
  });

  it('renders logo with correct attributes', () => {
    cy.dataCy(selectorAutomatLogoImage)
      .find('img')
      .should('have.attr', 'src')
      .and('include', 'logo-automat.svg');

    cy.dataCy(selectorAutomatLogoImage)
      .find('img')
      .should('have.attr', 'alt')
      .and('equal', i18n.global.t('index.logoAutomatAltText'));
  });

  it('has correct styling', () => {
    cy.dataCy(selectorAutomatLogoButton).and(
      'have.css',
      'text-transform',
      'none',
    );

    cy.dataCy(selectorAutomatLogoImage)
      .invoke('height')
      .should('equal', logoHeight);
  });
}

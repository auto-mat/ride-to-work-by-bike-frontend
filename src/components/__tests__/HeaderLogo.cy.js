import HeaderLogo from 'components/global/HeaderLogo.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// selectors
const selectorHeaderLogoButton = 'header-logo-button';
const selectorHeaderLogoImage = 'header-logo-image';

// variables
const logoHeight = 40;

describe('<HeaderLogo>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['logoAltText'], 'index', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(HeaderLogo);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(HeaderLogo);
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorHeaderLogoButton).should('be.visible');
    cy.dataCy(selectorHeaderLogoImage).should('be.visible');
  });

  it('has correct link to home page', () => {
    cy.dataCy(selectorHeaderLogoButton)
      .should('have.attr', 'href')
      .and('include', rideToWorkByBikeConfig.urlRTWBBLogo);
  });

  it('renders logo with correct attributes', () => {
    cy.dataCy(selectorHeaderLogoImage)
      .find('img')
      .should('have.attr', 'src')
      .and('include', 'logo-white.svg');

    cy.dataCy(selectorHeaderLogoImage)
      .find('img')
      .should('have.attr', 'alt')
      .and('equal', i18n.global.t('index.logoAltText'));
  });

  it('has correct styling', () => {
    cy.dataCy(selectorHeaderLogoButton).and(
      'have.css',
      'text-transform',
      'none',
    );

    cy.dataCy(selectorHeaderLogoImage)
      .invoke('height')
      .should('equal', logoHeight);
  });
}

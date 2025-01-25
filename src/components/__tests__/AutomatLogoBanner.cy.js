import { colors } from 'quasar';
import AutomatLogoBanner from 'components/global/AutomatLogoBanner.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { rgbaColorObjectToString } from '../../utils';

const { borderRadiusCard, colorWhiteBorderOpacity } = rideToWorkByBikeConfig;
const { getPaletteColor, changeAlpha, hexToRgb } = colors;
const white = getPaletteColor('white');
const border = `1px solid ${rgbaColorObjectToString(hexToRgb(changeAlpha(white, colorWhiteBorderOpacity)))}`;

describe('<AutomatLogoBanner>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['textAutomatOrganizer'], 'index', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(AutomatLogoBanner, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(AutomatLogoBanner, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('automat-logo-banner')
      .should('be.visible')
      .and('have.css', 'border', border)
      .and('have.css', 'border-radius', borderRadiusCard);
    // logo
    cy.dataCy('automat-logo-banner-logo').should('be.visible');
    // text
    cy.dataCy('automat-logo-banner-text')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', white);
  });

  it('renders logo and text side by side', () => {
    cy.testElementsSideBySide(
      'automat-logo-banner-logo',
      'automat-logo-banner-text',
    );
  });
}

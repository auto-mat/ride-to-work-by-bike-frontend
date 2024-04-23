import { colors } from 'quasar';
import RoutesApps from 'components/routes/RoutesApps.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

const urlAppStore = rideToWorkByBikeConfig.urlAppStore;
const urlGooglePlay = rideToWorkByBikeConfig.urlGooglePlay;

describe('<RoutesApps>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'hintAutomaticLogging',
        'hintManualLogging',
        'titleAutomaticLogging',
        'titleManualLogging',
      ],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RoutesApps, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RoutesApps, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('route-app').should('be.visible');
    // title automatic
    cy.dataCy('route-app-title-automatic')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.titleAutomaticLogging'));
    // hint automatic
    cy.dataCy('route-app-hint-automatic')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.hintAutomaticLogging'));
    cy.dataCy('banner-routes-app')
      .should('be.visible')
      .should('have.length', 3);
    // title manual
    cy.dataCy('route-app-title-manual')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.titleManualLogging'));
    // hint manual
    cy.dataCy('route-app-hint-manual')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.hintManualLogging'));
    // buttons container
    cy.dataCy('routes-apps-buttons')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'flex-wrap', 'wrap')
      .and('have.css', 'gap', '16px');
    // buttton google play
    cy.dataCy('routes-apps-google-play')
      .should('be.visible')
      .invoke('height')
      .should('be.equal', 40);
    cy.dataCy('routes-apps-google-play')
      .find('img')
      .should('be.visible')
      .then(($img) => {
        cy.testImageHeight($img);
      });
    cy.dataCy('routes-apps-google-play')
      .should('have.attr', 'href', urlGooglePlay)
      .and('have.attr', 'target', '_blank');
    // buttons app store
    cy.dataCy('routes-apps-app-store')
      .should('be.visible')
      .invoke('height')
      .should('be.equal', 40);
    cy.dataCy('routes-apps-app-store')
      .find('img')
      .should('be.visible')
      .then(($img) => {
        cy.testImageHeight($img);
      });
    cy.dataCy('routes-apps-app-store')
      .should('have.attr', 'href', urlAppStore)
      .and('have.attr', 'target', '_blank');
  });
}

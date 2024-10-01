import RoutesApps from 'components/routes/RoutesApps.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

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
    cy.dataCy('routes-apps').should('be.visible');
    // title automatic
    cy.dataCy('routes-apps-title-auto')
      .find('[data-cy="section-heading-title"]')
      .should('be.visible')
      .and('contain.text', i18n.global.t('routes.titleAutomaticLogging'));
    // hint automatic
    cy.dataCy('routes-apps-title-auto')
      .find('[data-cy="section-heading-perex"]')
      .should('be.visible')
      .and('contain.text', i18n.global.t('routes.hintAutomaticLogging'));
    cy.dataCy('banner-routes-app')
      .should('be.visible')
      .should('have.length', 3);
    // title manual
    cy.dataCy('routes-apps-title-manual')
      .find('[data-cy="section-heading-title"]')
      .should('be.visible')
      .and('contain.text', i18n.global.t('routes.titleManualLogging'));
    // hint manual
    cy.dataCy('routes-apps-title-manual')
      .find('[data-cy="section-heading-perex"]')
      .should('be.visible')
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

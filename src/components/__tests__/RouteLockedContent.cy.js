import RouteLockedContent from 'components/routes/RouteLockedContent.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

describe('<RouteLockedContent>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['hintLockedSection', 'hintWatchVideo'],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RouteLockedContent, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RouteLockedContent, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-locked-content').should('be.visible');
    cy.dataCy('route-locked-hint-section')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '500')
      .and('contain', i18n.global.t('routes.hintLockedSection'));
    cy.dataCy('route-locked-hint-video')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('contain', i18n.global.t('routes.hintWatchVideo'));
    cy.dataCy('route-locked-video').should('be.visible');
    cy.dataCy('route-locked-video')
      .find('iframe')
      .should('have.attr', 'src', rideToWorkByBikeConfig.urlVideoLoggingRoutes);
  });
}

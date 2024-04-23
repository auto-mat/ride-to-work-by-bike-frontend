import { colors } from 'quasar';
import RoutesApps from 'components/routes/RoutesApps.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

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
    cy.dataCy('route-app').should('be.visible');
    cy.dataCy('route-app-title-automatic')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.titleAutomaticLogging'));
    cy.dataCy('route-app-hint-automatic')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.hintAutomaticLogging'));
    cy.dataCy('route-app-title-manual')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.titleManualLogging'));
    cy.dataCy('route-app-hint-manual')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.hintManualLogging'));
  });
}

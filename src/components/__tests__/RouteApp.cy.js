import { colors } from 'quasar';
import RouteApp from 'components/routes/RouteApp.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<RouteApp>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['hintTabApp', 'titleTabApp'],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RouteApp, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RouteApp, {
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
    cy.dataCy('route-app-title')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('have.css', 'font-weight', '500')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.titleTabApp'));
    cy.dataCy('route-app-hint')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black)
      .and('contain.text', i18n.global.t('routes.hintTabApp'));
  });
}

import { colors } from 'quasar';

import RouteList from 'components/routes/RouteList.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<RouteList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteList, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('route-list').should('be.visible');
      // day date
      cy.dataCy('route-list-day-date')
        .should('be.visible')
        .should('have.css', 'font-size', '20px')
        .should('have.css', 'font-weight', '500')
        .should('have.color', grey10);
      // items
      cy.dataCy('route-list-item').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteList, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('iphone-6');
    });
  });
});
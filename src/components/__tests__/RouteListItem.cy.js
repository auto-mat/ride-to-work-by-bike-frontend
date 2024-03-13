import RouteListItem from 'components/routes/RouteListItem.vue';
import { i18n } from '../../boot/i18n';

describe('<RouteListItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelDistance',
        'labelDirectionHome',
        'labelDirectionWork',
        'labelTransportType',
      ],
      'routes',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((route) => {
        cy.mount(RouteListItem, {
          props: {
            route,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders component', () => {
      cy.dataCy('route-list-item').should('be.visible');

      cy.dataCy('column-direction').should('be.visible');
      cy.dataCy('label-direction').should('be.visible');

      cy.dataCy('column-transport').should('be.visible');
      cy.dataCy('label-transport').should('be.visible');
      cy.dataCy('select-transport').should('be.visible');

      cy.dataCy('column-distance').should('be.visible');
      cy.dataCy('label-distance').should('be.visible');
      cy.dataCy('select-action').should('be.visible');
      cy.dataCy('input-distance').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((route) => {
        cy.mount(RouteListItem, {
          props: {
            route,
          },
        });
        cy.viewport('iphone-6');
      });
    });
  });
});

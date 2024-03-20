import RouteListDisplay from 'components/routes/RouteListDisplay.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';
import { useRoutes } from 'src/composables/useRoutes';

const { getRouteIcon } = useRoutes();

describe('<RouteListDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListDisplay, {
          props: {
            routes,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListDisplay, {
          props: {
            routes,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-list-display').should('be.visible');
    cy.dataCy('route-list-item').should('be.visible');
  });

  testRouteListDayDate();

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // for each route check if icon is correct
      cy.dataCy('route-list-item').each(($element, index) => {
        cy.wrap($element)
          .find('[data-cy="icon-transport"]')
          .should('contain', getRouteIcon(routeList[index].transport));
        cy.wrap($element)
          .find('[data-cy="description-transport"]')
          .should(
            'contain',
            i18n.global.t(`routes.transport.${routeList[index].transport}`),
          );
      });
    });
  });
}

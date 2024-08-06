import { colors } from 'quasar';
import RouteListDisplay from 'components/routes/RouteListDisplay.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';
import { useRoutes } from '../../../src/composables/useRoutes';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const { getTransportLabel } = useRoutes();

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

    it('renders items in two columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 50);
    });
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

    it('renders items in one columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('route-list-item-wrapper'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-list-display').should('be.visible');
    // day title
    cy.dataCy('route-list-day-date')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
    // items
    cy.dataCy('route-list-item').should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate();

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // for each route check if icon is correct
      cy.dataCy('route-list-item').each(($element, index) => {
        if (routeList[index].direction === 'toWork') {
          cy.wrap($element)
            .find('[data-cy="label-direction"]')
            .should('contain', i18n.global.t('routes.labelDirectionToWork'));
        }
        if (routeList[index].direction === 'fromWork') {
          cy.wrap($element)
            .find('[data-cy="label-direction"]')
            .should('contain', i18n.global.t('routes.labelDirectionFromWork'));
        }
        cy.wrap($element)
          .find('[data-cy="description-transport"]')
          .should('contain', getTransportLabel(routeList[index].transport));
      });
    });
  });
}

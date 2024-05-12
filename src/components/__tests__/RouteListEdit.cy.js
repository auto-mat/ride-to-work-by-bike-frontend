import RouteListEdit from 'components/routes/RouteListEdit.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';
import { useRoutes } from 'src/composables/useRoutes';

const { getRouteIcon } = useRoutes();

describe('<RouteListEdit>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'routes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeList').then((routes) => {
        cy.mount(RouteListEdit, {
          props: {
            routes,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy('route-list-edit').should('be.visible');
    // items visible
    cy.dataCy('route-list-item').should('be.visible');
    // direction labels visible
    cy.dataCy('column-direction').should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate();

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // for each route check if icon is correct
      cy.dataCy('route-list-item').each(($element, index) => {
        cy.wrap($element)
          .find('[data-cy="button-toggle-transport"]')
          .find('button[aria-pressed="true"]')
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

  it('renders save button with edit count', () => {
    cy.dataCy('button-save')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      );
    // introduce a change
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .find('button')
      .last()
      .click();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // revert change
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .find('button')
      .first()
      .click();
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
    // introduce two changes
    // change first route
    cy.dataCy('route-list-item')
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .find('button')
      .last()
      .click();
    // change last route
    cy.dataCy('route-list-item')
      .last()
      .find('[data-cy="button-toggle-transport"]')
      .find('button')
      .first()
      .click();
    // count changes
    cy.dataCy('button-save').should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
    );
  });
}

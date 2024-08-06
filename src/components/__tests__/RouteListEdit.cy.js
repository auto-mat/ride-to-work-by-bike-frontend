import RouteListEdit from 'components/routes/RouteListEdit.vue';
import { i18n } from '../../boot/i18n';
import { testRouteListDayDate } from '../../../test/cypress/support/commonTests';

// selectors
const selectorButtonSave = 'button-save';
const selectorRouteListEdit = 'route-list-edit';
const selectorRouteListItem = 'route-list-item';
const selectorRouteListItemWrapper = 'route-list-item-wrapper';
const selectorSectionDirection = 'section-direction';

// variables
const routeListItemWrapperWidthDesktop = 50;
const routeListItemWrapperWidthMobile = 100;

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

    it('renders items in two columns', () => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorRouteListItemWrapper),
        routeListItemWrapperWidthDesktop,
      );
    });
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

    it('renders items in one columns', () => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorRouteListItemWrapper),
        routeListItemWrapperWidthMobile,
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component visible
    cy.dataCy(selectorRouteListEdit).should('be.visible');
    // items visible
    cy.dataCy(selectorRouteListItem).should('be.visible');
    // direction labels visible
    cy.dataCy(selectorSectionDirection).should('be.visible');
  });

  // day date (title) styles
  testRouteListDayDate();

  it('renders route list transport methods', () => {
    cy.fixture('routeList').then((routeList) => {
      // for each route check if icon is correct
      cy.dataCy(selectorRouteListItem).each(($element, index) => {
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
      });
    });
  });

  it('renders save button with edit count', () => {
    cy.dataCy(selectorButtonSave)
      .should('be.visible')
      .and('have.css', 'font-size', '16px')
      .and('have.css', 'font-weight', '700')
      .and(
        'contain',
        i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
      );
    // introduce a change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // revert change
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
    // introduce two changes
    // change first route
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    // change last route
    cy.dataCy(selectorRouteListItem)
      .last()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    // count changes
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 2, { count: 2 }),
    );
    // revert changes
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="button-toggle-transport"]')
      .first()
      .click();
    cy.dataCy(selectorRouteListItem)
      .last()
      .find('[data-cy="button-toggle-transport"]')
      .last()
      .click();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );

    // test inputting distance value
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .clear();
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .type(1);
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .blur();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // reset
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .clear();
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .type(10);
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="input-distance"]')
      .blur();
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );

    // test changing input type
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="select-action"]')
      .select(i18n.global.t('routes.actionTraceMap'));
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 1, { count: 1 }),
    );
    // reset
    cy.dataCy(selectorRouteListItem)
      .first()
      .find('[data-cy="select-action"]')
      .select(i18n.global.t('routes.actionInputDistance'));
    cy.dataCy(selectorButtonSave).should(
      'contain',
      i18n.global.tc('routes.buttonSaveChangesCount', 0, { count: 0 }),
    );
  });
}

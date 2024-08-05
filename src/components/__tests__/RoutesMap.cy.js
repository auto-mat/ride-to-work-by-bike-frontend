import RoutesMap from 'components/routes/RoutesMap.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorRoutesMap = 'routes-map';
const selectorRoutesMapMap = 'routes-map-map';
const selectorToolbarTop = 'toolbar-top';
const selectorToolbarBottom = 'toolbar-bottom';
const selectorAddRouteButton = 'add-route-button';
const selectorSaveRouteButton = 'save-route-button';
const selectorRoutesList = 'routes-list';
const selectorRoutesListHeader = 'routes-list-header';
const selectorUndoButton = 'undo-button';
const selectorDeleteRouteButton = 'delete-route-button';
const selectorRouteItemLength = 'route-item-length';
const selectorRouteItemNameStart = 'route-item-name-start';
const selectorRouteItemNameFinish = 'route-item-name-finish';
const selectorRouteListItem = 'route-list-item';

describe('<RoutesMap>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelTransportType',
        'textNoRoutes',
        'titleYourRoutes',
        'tooltipDrawing',
        'tooltipDrawDisabled',
        'tooltipRouteLength',
      ],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['bike', 'car', 'none', 'walk', 'bus', 'unknown'],
      'routes.transport',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['fromWork', 'routes', 'toWork'],
      'global',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['geolocationError', 'geolocationNotSupported', 'noRouteSelected'],
      'notify',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('routeListSelected').then((routes) => {
        cy.mount(RoutesMap, {
          props: {
            selectedRoutes: routes,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorRoutesMap).should('be.visible');
    cy.dataCy(selectorRoutesMapMap).should('be.visible');
    cy.dataCy(selectorToolbarTop).should('be.visible');
    cy.dataCy(selectorToolbarBottom).should('be.visible');
    cy.dataCy(selectorRoutesList).should('be.visible');
    cy.dataCy(selectorRoutesListHeader)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.titleYourRoutes'));

    /**
     * TEST DRAW
     * Scenario: After selecting 1 items in calendar, user moves to map.
     * Then user draws a route.
     * Route is saved into the sidebar.
     */
    testEditDeleteEnabled();
    toggleDrawTool();
    testUndoSaveDisabled();
    drawFeature();
    testUndoSaveEnabled();
    saveRoute();
    testEditDeleteDisabled();
    // load parameters from route 0
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemLength}"]`)
      .should('be.visible')
      .then((element) => {
        const length = element.text().replace(/\D/g, '');
        cy.wrap(parseInt(length)).as('routeLength');
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.wrap(element.text()).as('startName');
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.wrap(element.text()).as('finishName');
      });

    /**
     * TEST DELETE
     * Scenario: User clicks on a saved route in sidebar.
     * Redraws the route.
     * Deletes vertices from the route to make it shorter.
     * Saves the route.
     */
    // edit route
    cy.dataCy(`${selectorRouteListItem}-0`).click();
    testEditDeleteEnabled();
    // after clicking a route item, draw and delete is is enabled
    cy.dataCy(selectorAddRouteButton).should('not.be.disabled');
    cy.dataCy(selectorDeleteRouteButton).should('not.be.disabled');
    toggleDrawTool();
    testUndoSaveDisabled();
    drawFeature();
    testUndoSaveEnabled();
    toggleDeleteTool();
    deleteFeaturePoints();
    saveRoute();
    testEditDeleteDisabled();
    // has shorter route, since it is a straight line
    cy.get('@routeLength').then((routeLength) => {
      cy.get(
        `[data-cy="${selectorRouteListItem}-0"] [data-cy="${selectorRouteItemLength}"]`,
      )
        .should('be.visible')
        .and('not.contain', routeLength)
        .then((element) => {
          cy.wrap(element.text()).then((text) => {
            const length = text.replace(/\D/g, '');
            cy.wrap(parseInt(length)).should('be.lessThan', routeLength);
            cy.wrap(parseInt(length)).as('shorterRouteLength');
          });
        });
    });
    // new route matches old routes' start and finish name
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@startName').then((startName) => {
          cy.wrap(element.text()).should('equal', startName);
        });
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@finishName').then((finishName) => {
          cy.wrap(element.text()).should('equal', finishName);
        });
      });

    /**
     * TEST UNDO
     * Scenario: User clicks on a saved route in sidebar.
     * Redraws the route.
     * Deletes vertices from the route to make it shorter.
     * Uses undo to revert to the original route.
     * Saves the route.
     */
    cy.dataCy(`${selectorRouteListItem}-0`).click();
    testEditDeleteEnabled();
    toggleDrawTool();
    testUndoSaveDisabled();
    drawFeature();
    testUndoSaveEnabled();
    toggleDeleteTool();
    deleteFeaturePoints();
    testUndoSaveEnabled();
    undo();
    undo();
    undo();
    saveRoute();
    testEditDeleteDisabled();
    matchRouteSnapshot();
    cy.get('@routeLength').then((routeLength) => {
      cy.get(
        `[data-cy="${selectorRouteListItem}-0"] [data-cy="${selectorRouteItemLength}"]`,
      )
        .should('be.visible')
        .and('contain', routeLength);
    });
    // new route matches old routes' start and finish name
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameStart}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@startName').then((startName) => {
          cy.wrap(element.text()).should('equal', startName);
        });
      });
    cy.dataCy(`${selectorRouteListItem}-0`)
      .find(`[data-cy="${selectorRouteItemNameFinish}"]`)
      .should('be.visible')
      .then((element) => {
        cy.get('@finishName').then((finishName) => {
          cy.wrap(element.text()).should('equal', finishName);
        });
      });

    /**
     * TEST RESET ROUTE
     * Scenario: User clicks on a saved route in sidebar.
     * Redraws the route.
     * Turns off draw tool.
     * Route resets to the original route.
     */
    cy.dataCy(`${selectorRouteListItem}-0`).click();
    testEditDeleteEnabled();
    matchRouteSnapshot();
    toggleDrawTool();
    // draw random route
    cy.dataCy(selectorRoutesMapMap).click(50, 50);
    cy.dataCy(selectorRoutesMapMap).click(100, 100);
    toggleDrawTool();
    // identical snapshot
    matchRouteSnapshot();
    testEditDeleteEnabled();
    toggleDeleteTool();
    deleteFeaturePoints();
    toggleDeleteTool();
    // identical snapshot
    matchRouteSnapshot();
    testEditDeleteEnabled();
  });
}

function toggleDeleteTool() {
  cy.dataCy(selectorDeleteRouteButton).click();
}

function toggleDrawTool() {
  cy.dataCy(selectorAddRouteButton).click();
}

function drawFeature() {
  cy.dataCy(selectorRoutesMap).invoke('attr', 'style', 'border-radius: 0px');
  cy.dataCy(selectorRoutesMapMap).then((element) => {
    const width = Math.floor(element.width());
    const height = Math.floor(element.height());
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    cy.dataCy(selectorRoutesMapMap).click(0, 0);
    cy.dataCy(selectorRoutesMapMap).click(halfWidth, 0);
    cy.dataCy(selectorRoutesMapMap).click(halfWidth, halfHeight);
    cy.dataCy(selectorRoutesMapMap).click(width - 1, halfHeight);
    cy.dataCy(selectorRoutesMapMap).dblclick(width - 1, height - 1);
  });
}

function deleteFeaturePoints() {
  cy.dataCy(selectorRoutesMapMap).then((element) => {
    const width = Math.floor(element.width());
    const height = Math.floor(element.height());
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    cy.dataCy(selectorRoutesMapMap).click(halfWidth, 0);
    cy.dataCy(selectorRoutesMapMap).click(halfWidth, halfHeight);
    cy.dataCy(selectorRoutesMapMap).click(width - 1, halfHeight);
  });
}

function saveRoute() {
  cy.dataCy(selectorSaveRouteButton).click();
}

function undo() {
  cy.dataCy(selectorUndoButton).click();
}

function testEditDeleteDisabled() {
  cy.dataCy(selectorAddRouteButton).should('be.disabled');
  cy.dataCy(selectorDeleteRouteButton).should('be.disabled');
}

function testEditDeleteEnabled() {
  cy.dataCy(selectorAddRouteButton).should('not.be.disabled');
  cy.dataCy(selectorDeleteRouteButton).should('not.be.disabled');
}

function testUndoSaveDisabled() {
  // disabled undo + save
  cy.dataCy(selectorUndoButton).should('be.disabled');
  cy.dataCy(selectorSaveRouteButton).should('be.disabled');
}

function testUndoSaveEnabled() {
  // disabled undo + save
  cy.dataCy(selectorUndoButton).should('not.be.disabled');
  cy.dataCy(selectorSaveRouteButton).should('not.be.disabled');
}

function matchRouteSnapshot() {
  cy.dataCy(selectorRoutesMapMap).matchImageSnapshot(
    `${Cypress.currentTest.titlePath}-map`,
    {
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
      timeout: 4000,
      customDiffConfig: { threshold: 0.2 },
      retries: 2,
    },
  );
}

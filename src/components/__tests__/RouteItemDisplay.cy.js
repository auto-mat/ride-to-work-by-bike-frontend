import { colors } from 'quasar';

import RouteItemDisplay from 'components/routes/RouteItemDisplay.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

describe('<RouteItemDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelDirectionFromWork', 'labelDirectionToWork'],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['bike', 'car', 'walk', 'bus', 'none'],
      'routes.transport',
      i18n,
    );
  });

  context('to work - with distance (desktop)', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemDisplay, {
          props: {
            route: routes.toWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders label and icon "to work"', () => {
      cy.dataCy('label-direction')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.labelDirectionToWork'));
      cy.dataCy('label-direction-icon')
        .should('be.visible')
        .and('contain', 'arrow_forward');
    });

    it('renders distance', () => {
      cy.fixture('routeListItem').then((routes) => {
        cy.dataCy('label-distance')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain', routes.toWork.distance)
          .and('contain', i18n.global.t('global.km'));
      });
    });

    it('renders columns side by side', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('column-direction'),
        (2 / 12) * 100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('column-distance'),
        (10 / 12) * 100,
      );
    });
  });

  context('from work (desktop)', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemDisplay, {
          props: {
            route: routes.fromWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders label and icon "from work"', () => {
      cy.dataCy('label-direction')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.labelDirectionFromWork'));
      cy.dataCy('label-direction-icon')
        .should('be.visible')
        .and('contain', 'arrow_back');
    });

    it('does not render distance', () => {
      cy.dataCy('label-distance').should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteItemDisplay, {
          props: {
            route: routes.toWork,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();

    it('renders columns stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-direction'), 100);
      cy.testElementPercentageWidth(cy.dataCy('column-distance'), 100);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('route-item-display').should('be.visible');
    cy.dataCy('label-direction')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 18);
    cy.dataCy('label-direction-icon')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 18);
    cy.dataCy('icon-transport')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 24);
    cy.dataCy('icon-transport')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 24);
    cy.dataCy('description-transport')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', black);
  });
}

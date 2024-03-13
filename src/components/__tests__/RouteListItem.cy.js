import { colors } from 'quasar';

import RouteListItem from 'components/routes/RouteListItem.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<RouteListItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelDistance',
        'labelDirectionFromWork',
        'labelDirectionToWork',
        'labelTransportType',
      ],
      'routes',
      i18n,
    );
  });

  context('route to work', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteListItem, {
          props: {
            route: routes.toWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders component', () => {
      cy.dataCy('route-list-item').should('be.visible');
      // column direction
      cy.dataCy('column-direction').should('be.visible');
      cy.dataCy('label-direction')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('routes.labelDirectionToWork'));
      cy.dataCy('label-direction-icon').should('be.visible');
      cy.dataCy('label-direction-icon').invoke('width').should('be.equal', 18);
      cy.dataCy('label-direction-icon').invoke('height').should('be.equal', 18);
      cy.dataCy('label-direction-icon').should('contain', 'arrow_forward');
      // column transport
      cy.dataCy('column-transport').should('be.visible');
      cy.dataCy('label-transport')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('select-transport').should('be.visible');
      // column distance
      cy.dataCy('column-distance').should('be.visible');
      cy.dataCy('label-distance')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('select-action').should('be.visible');
      cy.dataCy('input-distance').should('be.visible');
    });
  });

  context('route from work', () => {
    beforeEach(() => {
      cy.fixture('routeListItem').then((routes) => {
        cy.mount(RouteListItem, {
          props: {
            route: routes.fromWork,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders label direction', () => {
      cy.dataCy('route-list-item').should('be.visible');
      // column direction
      cy.dataCy('column-direction').should('be.visible');
      cy.dataCy('label-direction').should(
        'contain',
        i18n.global.t('routes.labelDirectionFromWork'),
      );
      cy.dataCy('label-direction-icon').should('be.visible');
      cy.dataCy('label-direction-icon').should('contain', 'arrow_back');
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

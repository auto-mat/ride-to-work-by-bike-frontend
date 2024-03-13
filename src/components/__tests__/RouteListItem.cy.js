import { colors } from 'quasar';

import RouteListItem from 'components/routes/RouteListItem.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
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
      // button toggle
      cy.dataCy('button-toggle-transport')
        .should('be.visible')
        .find('button')
        .should('have.length', 5);
      cy.dataCy('button-toggle-transport')
        .should('be.visible')
        .find('button')
        .find('i')
        .invoke('width')
        .should('be.gt', 1);
      cy.dataCy('button-toggle-transport')
        .should('be.visible')
        .find('button')
        .find('i')
        .invoke('height')
        .should('be.gt', 1);
      // description transport
      cy.dataCy('description-transport')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', black)
        .and('contain', i18n.global.t('routes.transportByBike'));
      // column distance
      cy.dataCy('column-distance').should('be.visible');
      cy.dataCy('label-distance')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('select-action').should('be.visible');
      cy.dataCy('input-distance').should('be.visible');
      cy.dataCy('units-distance')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', black)
        .and('contain', i18n.global.t('global.km'));
    });

    it('allows to change transport type', () => {
      // description transport
      cy.dataCy('description-transport').should(
        'contain',
        i18n.global.t('routes.transportByBike'),
      );
      // change transport type
      cy.dataCy('button-toggle-transport').find('button').eq(1).click();
      // transport on foot
      cy.dataCy('description-transport').should(
        'contain',
        i18n.global.t('routes.transportOnFoot'),
      );
      // change transport type
      cy.dataCy('button-toggle-transport').find('button').eq(2).click();
      // transport by public transport
      cy.dataCy('description-transport').should(
        'contain',
        i18n.global.t('routes.transportPublicTransport'),
      );
      // change transport type
      cy.dataCy('button-toggle-transport').find('button').eq(3).click();
      // transport by car
      cy.dataCy('description-transport').should(
        'contain',
        i18n.global.t('routes.transportByCar'),
      );
      // change transport type
      cy.dataCy('button-toggle-transport').find('button').eq(4).click();
      // transport none
      cy.dataCy('description-transport').should(
        'contain',
        i18n.global.t('routes.transportNone'),
      );
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

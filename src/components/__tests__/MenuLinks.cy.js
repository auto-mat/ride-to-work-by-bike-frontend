import { colors } from 'quasar';

import MenuLinks from '../global/MenuLinks.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const blueGrey1 = getPaletteColor('blue-grey-1');

describe('<MenuLinks>', () => {
  const iconSize18 = 18;
  context('social', () => {
    const title = 'Find us on social media';

    beforeEach(() => {
      cy.mount(MenuLinks, {
        props: {
          title,
          variant: 'social',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title with correct styling', () => {
      cy.dataCy('title-menu-links')
        .should('be.visible')
        .and('contain', title)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700');
    });

    it('renders buttons in a grid', () => {
      cy.dataCy('menu-links-list')
        .should('be.visible')
        .and('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap')
        .and('have.css', 'column-gap', '24px');
    });

    it('renders social buttons with correct styling (social variant)', () => {
      cy.dataCy('button-menu-links')
        .should('have.length', 4)
        .and('contain', i18n.global.t('index.menuLinks.instagram'))
        // .and('have.attr', 'href', 'https://www.instagram.com/spolekautomat')
        .and('contain', i18n.global.t('index.menuLinks.facebook'))
        // .and('have.attr', 'href', 'https://www.facebook.com/spolekautomat')
        .and('contain', i18n.global.t('index.menuLinks.twitter'))
        // .and('have.attr', 'href', 'https://twitter.com/spolekautomat')
        .and('contain', i18n.global.t('index.menuLinks.youtube'))
        // .and('have.attr', 'href', 'https://www.youtube.com/@spolekautomat')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
        });
    });

    it('renders icon for each link', () => {
      cy.dataCy('menu-links-icon').each((element, index) => {
        cy.testIcon({
          element: element,
          name: `menu-links-social-${index}`,
          size: iconSize18,
          click: false,
        });
      });
    });
  });

  context('useful', () => {
    const title = 'Useful links';
    beforeEach(() => {
      cy.mount(MenuLinks, {
        props: {
          title,
          variant: 'useful',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders link buttons with correct styling (useful links variant)', () => {
      cy.dataCy('button-menu-links')
        .should('have.length', 4)
        .and('contain', 'Auto-Mat.cz')
        .and('contain', 'Podpořte nás')
        .and('contain', 'Kód projektu')
        .and('contain', 'Mobilní aplikace')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
        });
    });

    it('renders icon for each link', () => {
      cy.dataCy('menu-links-icon').each((element, index) => {
        cy.testIcon({
          element: element,
          name: `menu-links-useful-${index}`,
          size: iconSize18,
          click: false,
        });
      });
    });
  });
});

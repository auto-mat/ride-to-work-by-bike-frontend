import { colors } from 'quasar';

import MenuLinks from '../MenuLinks.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const blueGrey1 = getPaletteColor('blue-grey-1');

describe('<MenuLinks>', () => {
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
        .should('contain', title)
        .should('have.css', 'font-size', '24px')
        .should('have.css', 'font-weight', '700');
    });

    it('renders buttons in a grid', () => {
      cy.dataCy('menu-links-list')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'column-gap', '24px');
    });

    it('renders social buttons with correct styling (social variant)', () => {
      cy.dataCy('button-menu-links')
        .should('have.length', 4)
        .should('contain', i18n.global.t('index.menuLinks.instagram'))
        // .should('have.attr', 'href', 'https://www.instagram.com/spolekautomat')
        .should('contain', i18n.global.t('index.menuLinks.facebook'))
        // .should('have.attr', 'href', 'https://www.facebook.com/spolekautomat')
        .should('contain', i18n.global.t('index.menuLinks.twitter'))
        // .should('have.attr', 'href', 'https://twitter.com/spolekautomat')
        .should('contain', i18n.global.t('index.menuLinks.youtube'))
        // .should('have.attr', 'href', 'https://www.youtube.com/@spolekautomat')
        .should('have.backgroundColor', blueGrey1)
        .should('have.css', 'border-radius', '28px')
        .should('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', '#000');
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
        .should('contain', 'Auto-Mat.cz')
        .should('contain', 'Podpořte nás')
        .should('contain', 'Kód projektu')
        .should('contain', 'Mobilní aplikace')
        .should('have.backgroundColor', blueGrey1)
        .should('have.css', 'border-radius', '28px')
        .should('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', '#000');
        });
    });
  });

  // TODO: Check for icons
});

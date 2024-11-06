import { colors } from 'quasar';
import MenuLinks from '../global/MenuLinks.vue';
import { useSocialLinks } from '../../composables/useSocialLinks';
import { useUsefulLinks } from '../../composables/useUsefulLinks';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const blueGrey1 = getPaletteColor('blue-grey-1');

// composables
const { socialLinks } = useSocialLinks();
const { usefulLinks } = useUsefulLinks();

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
        .should('have.length', socialLinks.length)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.attr', 'href', socialLinks[index].url)
            .and('have.attr', 'title', socialLinks[index].title);
        });
      cy.dataCy('button-menu-links')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
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
        .should('have.length', usefulLinks.length)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.attr', 'href', usefulLinks[index].url)
            .and('contain', usefulLinks[index].title);
        });
      cy.dataCy('button-menu-links')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
        });
    });
  });

  // TODO: Check for icons
});

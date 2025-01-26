import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';
import { menuBottom, menuTop } from '../../mocks/layout';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey4 = getPaletteColor('grey-4');

// selectors
const selectorDrawerMenuItem = 'drawer-menu-item';
const selectorDrawerMenuItemIcon = 'drawer-menu-item-icon';

// variables
const iconSize = 18;
const fontSize = '16px';

describe('DrawerMenu', () => {
  context('menu top', () => {
    beforeEach(() => {
      cy.mount(DrawerMenu, {
        props: {
          items: menuTop,
        },
      });
      cy.wrap(menuTop).as('menu');
    });

    it('has translation for all strings', () => {
      cy.testLanguageStringsInContext(
        menuTop.map((item) => item.title),
        'drawerMenu',
        i18n,
      );
    });

    coreTests();
  });

  context('menu bottom', () => {
    beforeEach(() => {
      cy.mount(DrawerMenu, {
        props: {
          items: menuBottom,
        },
      });
      cy.wrap(menuBottom).as('menu');
    });

    coreTests();
  });

  function coreTests() {
    it('should render the list with the correct number of items', () => {
      cy.window().then(() => {
        cy.get('@menu').then((menu) => {
          cy.dataCy(selectorDrawerMenuItem).should('have.length', menu.length);
        });
      });
    });

    it('renders items with correct styling', () => {
      cy.window().then(() => {
        cy.get('@menu').then((menu) => {
          // skip test if menu is empty
          if (menu.length === 0) {
            return;
          }
          cy.dataCy(selectorDrawerMenuItem).each(($item, index) => {
            // test if current route
            if ($item.hasClass('menu-active-item')) {
              // active item
              cy.wrap($item)
                .should('have.color', white)
                .and('have.css', 'font-size', fontSize)
                .and('have.css', 'font-weight', '700')
                .and(
                  'contain',
                  i18n.global.t(`drawerMenu.${menu[index].title}`),
                )
                .within(() => {
                  cy.dataCy(selectorDrawerMenuItemIcon).should(
                    'have.color',
                    white,
                  );
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('width')
                    .should('be.eq', iconSize);
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('height')
                    .should('be.eq', iconSize);
                });
            } else {
              // inactive item
              cy.wrap($item)
                .should('have.color', white)
                .and('have.css', 'font-size', fontSize)
                .and('have.css', 'font-weight', '400')
                .and(
                  'contain',
                  i18n.global.t(`drawerMenu.${menu[index].title}`),
                )
                .within(() => {
                  cy.dataCy(selectorDrawerMenuItemIcon).should(
                    'have.color',
                    grey4,
                  );
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('width')
                    .should('be.eq', iconSize);
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('height')
                    .should('be.eq', iconSize);
                });
            }
          });
        });
      });
    });
  }
});

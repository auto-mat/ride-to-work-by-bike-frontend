import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';
import { getMenuBottom, menuTop } from '../../mocks/layout';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { defaultLocale } from 'src/i18n/def_locale';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

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
      const urlDonate = getApiBaseUrlWithLang(
        null,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
      const menuBottom = getMenuBottom(urlDonate);
      cy.mount(DrawerMenu, {
        props: {
          items: menuBottom,
        },
      });
      cy.wrap(menuBottom).as('menu');
    });

    coreTests();

    it('renders donate item with correct href - default lang', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.donate'))
        .should(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlDonate,
            defaultLocale,
            i18n,
          ),
        )
        .should('have.attr', 'target', '_blank')
        .invoke('attr', 'href')
        .then((href) => {
          cy.request({
            url: href,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
    });
  });

  context('menu bottom - change lang to en lang', () => {
    beforeEach(() => {
      const enLangCode = 'en';
      i18n.global.locale = enLangCode;

      const urlDonate = getApiBaseUrlWithLang(
        null,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
      const menuBottom = getMenuBottom(urlDonate);
      cy.mount(DrawerMenu, {
        props: {
          items: menuBottom,
        },
      });
      cy.wrap(menuBottom).as('menu');
    });
    it('renders donate item with correct href - en lang (localized URL link)', () => {
      const enLangCode = 'en';

      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.donate'))
        .should(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlDonate,
            defaultLocale,
            i18n,
          ),
        )
        .should('have.attr', 'target', '_blank')
        .invoke('attr', 'href')
        .then((href) => {
          if (i18n.lang === enLangCode) href.includes(enLangCode);
          cy.request({
            url: href,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
    });
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
